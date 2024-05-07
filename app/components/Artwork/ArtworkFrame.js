import style from "./ArtworkFrame.module.scss"
import cs from "classnames"
import { PropsWithChildren, useContext, useMemo } from "react"
import { getGenTokWarning } from "../../utils/generative-token"
import { SettingsContext } from "../../context/Theme"
import { WarningLayer } from "../Warning/WarningLayer"


export function ArtworkFrame({
  borderWidth = 10,
  children,
  tokenLabels,
}) {
  const settings = useContext(SettingsContext)
  const warning = useMemo(() => {
    if (!tokenLabels || tokenLabels.length === 0) return false
    return getGenTokWarning(tokenLabels, "", "preview")
  }, [settings, tokenLabels])
  return (
    <div className={cs(style.root)} style={{ borderWidth }}>
      {children}
      {warning && <WarningLayer className={style.warning} warning={warning} />}
    </div>
  )
}
