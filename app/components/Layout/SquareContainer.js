import style from "./SquareContainer.module.scss"
import cs from "classnames"



export function SquareContainer({
  className,
  children,
}) {
  return (
    <div className={cs(style.root, className)}>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
