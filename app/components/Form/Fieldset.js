import style from "./Form.module.scss"
import cs from "classnames"



export function Fieldset({
  className,
  error,
  errorPos = "top-right",
  children,
}) {
  return (
    <fieldset
      className={cs(style.fieldset, className, {
        [style.field_error]: !!error,
      })}
    >
      {error && (
        <div className={cs(style.error, style[`error-${errorPos}`])}>
          {error}
        </div>
      )}
      {children}
    </fieldset>
  )
}
