import style from "./Loader.module.scss"
import cs from "classnames"

export function Loader({
  color = "black",
  size = "regular",
  className,
}) {
  return (
    <div
      className={cs(style.loader, style[`size_${size}`], className)}
      style={{
        backgroundColor:
          color === "currentColor" ? color : `var(--color-${color})`,
      }}
    />
  )
}
