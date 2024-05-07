import { FunctionComponent } from "react"
import style from "./Form.module.scss"
import cs from "classnames"
/**
 * A form entry is a generic-purpose component which is responsible for defining generic styles for each entry in a form,
 * as well a giving this entry a className so that it can be manipulated more easily by higher level components.
 */
export const Field = ({
  error,
  errorPos = "top-right",
  className,
  classNameError,
  children,
}) => {
  return (
    <article className={cs(style.field, className)}>
      {children}
      {error && (
        <div
          className={cs(
            style.error,
            style[`error-${errorPos}`],
            classNameError
          )}
        >
          {error}
        </div>
      )}
    </article>
  )
}
