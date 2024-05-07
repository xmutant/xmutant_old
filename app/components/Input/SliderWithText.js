import style from "./Slider.module.scss"
import cs from "classnames"
import { Props as SliderProps, Slider } from "./Slider"



export function SliderWithText({
  unit = "s",
  textTransform = (val) => val.toFixed(1),
  ...props
}) {
  return (
    <div className={cs(style.withtext)}>
      <Slider {...props} />
      <span className={cs(style.text)}>
        {textTransform(props.value)} {unit}
      </span>
    </div>
  )
}
