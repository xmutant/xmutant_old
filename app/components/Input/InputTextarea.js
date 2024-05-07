import style from "./Input.module.scss"
import cs from "classnames"



export function InputTextarea({ error, ...props }) {
  return (
    <textarea
      {...props}
      className={cs(style.input, style.texarea, style.text, props.className, {
        [style.error]: !!error,
      })}
    />
  )
}
