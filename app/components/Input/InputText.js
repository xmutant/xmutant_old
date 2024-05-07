import style from "./Input.module.scss"
import cs from "classnames"
import { InputHTMLAttributes, forwardRef, useEffect } from "react"



export const InputText = forwardRef(
  ({ readOnly, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        onChange={(e)=> console.log(e.target.value)}
        {...props}
        className={cs(style.input, style.text, props.className, {
          [style.error]: !!error,
        })}
        readOnly={readOnly}
      />
    )
  }
)
InputText.displayName = "InputText"
