import style from "./Spacing.module.scss"
import cs from "classnames"



export function Spacing({ size, sm }) {
  return (
    <hr
      className={cs(style.spacing, style[`spacing-${size}`], {
        [style[`sm-spacing-${sm}`]]: !!sm,
      })}
    />
  )
}
