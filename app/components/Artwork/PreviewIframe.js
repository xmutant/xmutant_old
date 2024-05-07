import {
    forwardRef,
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    useMemo,
    useContext,
    useCallback,
  } from "react"
  import style from "./Artwork.module.scss"
  import cs from "classnames"
  import { LoaderBlock } from "../Layout/LoaderBlock"
//   import { Error } from "../Error/Error"
//   import { GenTokLabel } from "../../types/entities/GenerativeToken"
  import { getGenTokWarning } from "../../utils/generative-token"
  import { SettingsContext } from "../../context/Theme"
  import { WarningLayer } from "../Warning/WarningLayer"

  
  export const ArtworkIframe = forwardRef(
    ({ tokenLabels, url, textWaiting, onLoaded, hasLoading = true }, ref) => {
      const settings = useContext(SettingsContext)
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState(false)
      const isLoaded = useRef(false)
      const iframeRef = useRef(null)
  
      useEffect(() => {
        setLoading(!isLoaded.current)
        setError(false)
      }, [])
  
      const reloadIframe = useCallback(() => {
        if (url && iframeRef?.current?.contentWindow) {
          setLoading(true)
          setError(false)
          iframeRef.current.contentWindow.location.replace(url)
        }
      }, [url])
  
      useEffect(() => {
        // when the url changes, we set reload to true
        setLoading(true)
        if (url && iframeRef?.current?.contentWindow) {
          // keep iframe history hidden
          iframeRef.current.contentWindow.location.replace(url)
        }
      }, [url, iframeRef])
  
      // set iframe state to loaded and set ref to loaded to prevent loader init to loading
      const setIframeLoaded = () => {
        isLoaded.current = true
        setLoading(false)
      }
  
      const getHtmlIframe = useCallback(()=> {
        return iframeRef.current
      }, [])
  
      useImperativeHandle(
        ref,
        () => ({
          reloadIframe,
          getHtmlIframe,
        }),
        [reloadIframe, getHtmlIframe]
      )
  
      const warning = useMemo(() => {
        if (!tokenLabels || tokenLabels.length === 0) return false
        return getGenTokWarning(tokenLabels, settings, "run")
      }, [settings, tokenLabels])
      return (
        <div className={cs(style["iframe-container"])}>
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts allow-same-origin allow-modals"
            className={cs(style.iframe)}
            onLoad={() => {
              onLoaded?.()
              setIframeLoaded()
            }}
            onError={() => setError(true)}
            allow="accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;"
          />
          {loading && hasLoading && !error && (
            <LoaderBlock height="100%" color="white" className={cs(style.loader)}>
              {textWaiting}
            </LoaderBlock>
          )}
          {error && (
            <span className={cs(style.error)}>Could not load the project</span>
          )}
          {warning && (
            <WarningLayer warning={warning} className={style.warning} />
          )}
        </div>
      )
    }
  )
  ArtworkIframe.displayName = "ArtworkIframe"
  