import {
  DependencyList,
  Dispatch,
  EffectCallback,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import useAsyncEffect from "use-async-effect"
import useFetch, { CachePolicies } from "use-http"
// import { MessageCenterContext } from "../context/MessageCenter"
// import { API_BLOCKCHAIN_CONTRACT_STORAGE } from "../services/Blockchain"

import { processTzProfile } from "./user"
// import { getWalletOperationText } from "./wallet"

export function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return useCallback(() => isMounted.current, [])
}

/**
 * useIsMounted() by triggers a state update when it mounts
 */
export function useIsMountedState() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])
  return isMounted
}

export const useClientEffect = (
  effect,
  dependencies
) => {
  if (typeof window !== "undefined") {
    useEffect(effect, dependencies) // eslint-disable-line
  }
}

export const useClientAsyncEffect = (
  effect,
  dependencies
) => {
  if (typeof window !== "undefined") {
    useAsyncEffect(effect, dependencies) // eslint-disable-line
  }
}

export const useInterval = (
  callback,
  intervalMs,
  triggerStart= false
) => {
  const isMounted = useIsMounted()

  useEffect(() => {
    if (triggerStart) callback()

    const interval = setInterval(() => {
      if (isMounted()) callback()
    }, intervalMs)

    return () => {
      clearInterval(interval)
    }
  }, [])
}

/**
 * Designed to interract with generic contract methods residing in the Wallet service.
 */
export function useContractCall(
  contractMethod
){
  const [state, setState] = useState(
    "NONE"
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const counter = useRef(0)
  const isMounted = useIsMounted()
  const messageCenter = useContext(MessageCenterContext)

  const clear = () => {
    setLoading(false)
    setSuccess(false)
    setError(false)
    setTransactionHash(null)
    setState("NONE")
  }

  const call = (data) => {
    setLoading(true)
    setSuccess(false)
    setError(false)
    setTransactionHash(null)
    setState("NONE")

    // assign the ID to this call and increment it to prevent overlaps
    counter.current++
    const id = counter.current
    contractMethod &&
      contractMethod(data, (opState, opData) => {
        if (counter.current === id && isMounted()) {
          setState(opState)
          if (opState === "INJECTED") {
            setSuccess(true)
            setLoading(false)
            if (opData?.hash) {
              setTransactionHash(opData.hash)
            }
          } else if (opState === "ERROR") {
            setLoading(false)
            setError(true)
          }
        }
        // even if not mounted anymore we push the messages to message center
        // if (opState === "INJECTED") {
        //   messageCenter.addMessage({
        //     type: "success",
        //     title: `Operation "${getWalletOperationText(
        //       opData.operationType
        //     )}" successfully applied`,
        //   })
        // } else if (opState === "ERROR") {
        //   messageCenter.addMessage({
        //     type: "error",
        //     title: "Error when calling contract",
        //     content: opData,
        //   })
        // }
      })
  }

  return {
    state,
    transactionHash,
    loading,
    success,
    call,
    clear,
    error,
  }
}


export function useMint(id) {
  // the counter is used to keep track of the calls made, prevent overlap
  const [counter, setCounter] = useState(-1)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const start = () => {
    setCounter(counter + 1)
  }

  const reset = () => {
    setProgress(null)
    setError(null)
    setSuccess(false)
    setLoading(false)
    setData(null)
  }

  // when counter changes, initiate a new call to the server
  useEffect(() => {
    if (counter >= 0) {
      // clear and start the event source
      reset()
      setLoading(true)
      const source = new EventSource(
        `${process.env.NEXT_PUBLIC_API_FILE_ROOT}/mint/${id}`
      )

      const progressHandler = (message) => {
        setProgress(message.data)
      }
      const errorHandler = (message) => {
        setError(message.data)
        setLoading(false)
        source.close()
      }
      const successHandler = (message) => {
        setSuccess(true)
        setData(JSON.parse(message.data))
        setLoading(false)
        source.close()
      }

      // @ts-ignore
      source.addEventListener("progress", progressHandler)
      // @ts-ignore
      source.addEventListener("mint-success", successHandler)
      // @ts-ignore
      source.addEventListener("mint-error", errorHandler)

      return () => {
        // @ts-ignore
        source.removeEventListener("progress", progressHandler)
        // @ts-ignore
        source.removeEventListener("mint-success", successHandler)
        // @ts-ignore
        source.removeEventListener("mint-error", errorHandler)
        source.close()
      }
    }
  }, [counter])

  return {
    progress,
    error,
    success,
    loading,
    data,
    start,
  }
}


/**
 * Hook that connects to a Server-Sent Event implementation once the start() method is
 * called. Listens to "progress", "success" and "error" event types and populate the
 * variables returned according to the state returned by the SSE.
 * @param url target URL of the event source (server implementing Server-Sent Events)
 */
export function useEventSource(
  url,
  dataTransform
) {
  // the counter is used to keep track of the calls made, prevent overlap
  const [counter, setCounter] = useState(-1)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const start = () => {
    setCounter(counter + 1)
  }

  const reset = () => {
    setProgress(null)
    setError(null)
    setSuccess(false)
    setLoading(false)
    setData(null)
  }

  // when counter changes, initiate a new call to the server
  useEffect(() => {
    if (counter >= 0) {
      // clear and start the event source
      reset()
      setLoading(true)
      const source = new EventSource(url)

      const progressHandler = (message) => {
        setProgress(dataTransform(message.data))
      }
      const errorHandler = (message) => {
        setError(message.data)
        setLoading(false)
        source.close()
      }
      const successHandler = (message) => {
        setSuccess(true)
        setData(JSON.parse(message.data))
        setLoading(false)
        source.close()
      }

      // @ts-ignore
      source.addEventListener("progress", progressHandler)
      // @ts-ignore
      source.addEventListener("success", successHandler)
      // @ts-ignore
      source.addEventListener("error", errorHandler)

      return () => {
        // @ts-ignore
        source.removeEventListener("progress", progressHandler)
        // @ts-ignore
        source.removeEventListener("mint-success", successHandler)
        // @ts-ignore
        source.removeEventListener("mint-error", errorHandler)
        source.close()
      }
    }
  }, [counter, url])

  return {
    progress,
    error,
    success,
    loading,
    data,
    start,
  }
}



export function useLazyImage(
  url,
  { onLoad, onError }
) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (loaded) setLoaded(false)
    if (url) {
      const img = new Image()
      img.onload = () => {
        setLoaded(true)
        onLoad?.()
      }
      img.onerror = () => {
        onError?.()
      }
      img.src = url
    }
  }, [url])
  return loaded
}

/**
 * Verify a use via tz profile
 */
export function useTzProfileVerification(address) {
  const {
    data: data,
    post,
    loading,
  } = useFetch("https://indexer.tzprofiles.com/v1/graphql", {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  useEffect(() => {
    post({
      query: `query MyQuery { tzprofiles_by_pk(account: \"${address}\") { valid_claims } }`,
      variables: null,
      operationName: "MyQuery",
    })
  }, [address])

  const tzProfileData = useMemo(
    () =>
      (!!data?.data?.tzprofiles_by_pk?.valid_claims &&
        processTzProfile(data?.data?.tzprofiles_by_pk?.valid_claims)) ||
      null,
    [data]
  )

  return {
    loading,
    tzProfileData,
  }
}

/**
 * Get contract storage
 */
// export function useContractStorage(address) {
//   const { data, loading } = useFetch(
//     API_BLOCKCHAIN_CONTRACT_STORAGE(address),
//     {
//       cachePolicy: CachePolicies.NO_CACHE,
//     },
//     []
//   )

//   return {
//     data,
//     loading,
//   }
// }


/**
 * Creates a request to use animation frame and calls the callback at each tick
 * Responsible for handling dealloc
 */
export function useAnimationFrame(
  callback,
  dependencies
) {
  const started = useRef(0)
  const lastFrameTime = useRef(0)
  const requestRef = useRef()

  const loop = () => {
    requestRef.current = requestAnimationFrame(loop)

    // compute time and delta time
    const now = performance.now()
    const time = now - started.current
    const delta = now - lastFrameTime.current

    // call callback & set last frame time for delta
    callback(time, delta)
    lastFrameTime.current = now
  }

  useEffect(() => {
    // initialize the values
    started.current = lastFrameTime.current = performance.now()
    requestRef.current = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(requestRef.current || 0)
  }, dependencies)
}

/**
 * Returns [true|false] depending on user interracting with the page
 * Whenever the user doesn't interact with the page for X seconds, return true, otherwise
 * returns false
 */
export function useHasInterractedIn(
  milliseconds = 2000,
  defaultValue = true
) {
  const timeoutID = useRef()
  const [inter, setInter] = useState(defaultValue)

  useEffect(() => {
    const listener = () => {
      // set user is active
      timeoutID.current && clearTimeout(timeoutID.current)
      setInter(true)

      // trigger the inavtivity after X
      timeoutID.current = setTimeout(() => {
        setInter(false)
      }, milliseconds)
    }

    window.addEventListener("mousemove", listener)
    return () => window.addEventListener("mousemove", listener)
  }, [])

  return [inter, setInter]
}
