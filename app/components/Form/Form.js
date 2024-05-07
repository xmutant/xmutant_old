import style from "./Form.module.scss"
import cs from "classnames"
/**
 * A generic component to encapsulate form fields
 */
export const Form = ({ children, ...props }) => {
  return (
    <form {...props} className={cs(style.form, props.className)}>
      {children}
    </form>
  )
}
