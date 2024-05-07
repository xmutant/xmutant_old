import style from "./InputRadioBtnIcon.module.scss";
import cs from "classnames";
import React from "react";
import {InputRadioButtons} from "./InputRadioButtons";

/**
 * A wrapper around the InputRadioButton component to render the
 */

export const InputRadioBtnIcon = (props) => {
  return (
    <InputRadioButtons {...props} layout="group" btnClassname={style.button}>
      {({ option, active }) => (
        <div
          className={cs(style.item, {
            [style.active]: active,
          })}
        >
          {option.optProps.icon}
          {option.label}
        </div>
      )}
    </InputRadioButtons>
  );
};


