import style from "./Resolution.module.scss";
import cs from "classnames";

import { InputText } from "./InputText";
import { clamp } from "@/app/utils/math";

const integerConstraint = (x) => Math.round(x);

export function InputResolution({
  value,
  min,
  max,
  onChange,
  constraint = integerConstraint,
  className,
}) {
  const update = (v, component) => {
    onChange({
      ...value,
      [component]: v,
    });
  };

  const applyConstraint = (component) => {
    onChange({
      ...value,
      [component]: constraint(clamp(value[component], min, max)),
    });
  };

  return (
    <div className={cs(style.container, className)}>
      <InputText
        type="number"
        value={value.x}
        onChange={(evt) => update(parseFloat(evt.target.value), "x")}
        onBlur={() => applyConstraint("x")}
      />
      <span>*</span>
      <InputText
        type="number"
        value={value.y}
        onChange={(evt) => update(parseFloat(evt.target.value), "y")}
        onBlur={() => applyConstraint("y")}
      />
    </div>
  );
}
