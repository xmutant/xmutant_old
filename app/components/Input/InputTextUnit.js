import style from "./Input.module.scss"
import cs from "classnames"
import { InputText, Props as InputProps } from "./InputText"
import { ReactNode } from "react"



export function InputTextUnit({
  unit,
  classNameContainer,
  sizeX = "regular",
  positionUnit = "outside",
  ...props
}) {
  return (
    <div
      className={cs(
        style.textunit,
        style[`size-${sizeX}`],
        classNameContainer,
        {
          [style.inside]: positionUnit === "inside-left",
        }
      )}
    >
      <InputText {...props} />
      <span>{unit}</span>
    </div>
  )
}
