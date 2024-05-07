import React, {

  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react"


const defaultProperties = {
  modalsOpen: {},
  openModalId: () => { },
  closeModalId: () => { },
}

const defaultCtx = {
  ...defaultProperties,
}

export const ModalContext = React.createContext(defaultCtx)

export function ModalProvider({ children }) {
  const [context, setContext] = useState(defaultCtx)

  const openModalId = useCallback((modalId) => {
    setContext((oldContext) => {
      const newContext = {
        ...oldContext,
        modalsOpen: {
          ...oldContext.modalsOpen,
        },
      }
      newContext.modalsOpen[modalId] = true
      return newContext
    })
  }, [])
  const closeModalId = useCallback((modalId) => {
    setContext((oldContext) => {
      const newContext = {
        ...oldContext,
        modalsOpen: {
          ...oldContext.modalsOpen,
        },
      }
      delete newContext.modalsOpen[modalId]
      return newContext
    })
  }, [])

  // memoize to prevent rerendering JIC
  const memoizedContext = useMemo(() => {
    return {
      ...context,
      openModalId,
      closeModalId,
    }
  }, [closeModalId, context, openModalId])

  useEffect(() => {
    const hasModalOpens = Object.keys(context.modalsOpen).length > 0
    if (hasModalOpens) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [context.modalsOpen])
  return (
    <ModalContext.Provider value={memoizedContext}>
      {children}
    </ModalContext.Provider>
  )
}
