import style from "./LoaderBlock.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { Loader } from "../Utils/Loader"




export function LoaderBlock({
  height,
  className,
  textPos = "top",
  color = "black",
  size = "regular",
  children,
}) {
  return (
    <div
      className={cs(style.container, style[textPos], colors[color], className)}
      style={{ height }}
    >
      {children}
      <Loader color={color} size={size} />
    </div>
  )
}
