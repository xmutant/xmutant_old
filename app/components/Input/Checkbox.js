import style from "./Checkbox.module.scss"
import cs from "classnames"



export function Checkbox({
  value,
  name,
  onChange,
  className,
  classNameCheckmark,
  isRadio,
  paddingLeft = true,
  children,
}) {
  return (
    <label
      className={cs(style.container, className, {
        [style.radio]: isRadio,
        [style.no_pad]: !paddingLeft,
      })}
    >
      <input
        type="checkbox"
        name={name}
        checked={value}
        onChange={(event) => onChange(!value, event)}
      />
      <span className={cs(style.checkmark, classNameCheckmark)} />
      {children}
    </label>
  )
}
