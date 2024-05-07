import style from "./InputRadioButtons.module.scss";
import cs from "classnames";
import React from "react";

const OptionRendererDefault = ({ option, active }) => {
  return (
    <div className={cs(style.opt_default_renderer_root)}>{option.label}</div>
  );
};

export const InputRadioButtons = ({
  value,
  onChange,
  options,
  layout = "default",
  className,
  btnClassname,
  children = OptionRendererDefault,
}) => {
  return (
    <div className={cs(style.root, className, style[`layout_${layout}`])}>
      {options.map((option) => (
        <button
          key={option.value ?? ("undefined" )}
          type="button"
          className={cs(
            {
              [style.active]: option.value === value,
            },
            style.button,
            btnClassname
          )}
          onClick={() => option.value !== value && onChange(option.value)}
        >
          {children({
            option,
            active: option.value === value,
          })}
        </button>
      ))}
    </div>
  );
};


