import style from "./Cover.module.scss"
import cs from "classnames"


export function Cover({ index, opacity = 0.3, onClick }) {
  return (
    <div
      style={{ zIndex: index, opacity }}
      onClick={onClick}
      className={cs(style.cover)}
    />
  )
}
