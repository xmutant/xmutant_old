import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  useCallback,
  useState,
} from "react";

import classes from "./Controller.module.scss";
import cx from "classnames";
import { BaseInput } from "../BaseInput";
import cs from "classnames";

/*
 * Providing a name starting or ending with `search` prevents
 * 1Password extension to appear in the input fields
 * https://1password.community/discussion/comment/606453/#Comment_606453
 */
export function BaseParamsInput(props) {
  const { id } = props;
  return (
    <BaseInput name={`${id}-params-search`} autoComplete="off" {...props} />
  );
}

export function Controller(props) {
  const [labelEllipsis, setLabelEllipsis] = useState(true);
  const {
    id,
    label,
    layout = "default",
    className,
    inputContainerProps,
    isCodeDriven,
  } = props;
  const handleToggleEllipsis = useCallback(
    () => setLabelEllipsis((old) => !old),
    []
  );
  return (
    <div className={cx(classes.controller, classes[layout], className)}>
      {id && (
        <label
          className={cs({
            [classes.ellipsis]: labelEllipsis,
          })}
          htmlFor={id}
          onClick={handleToggleEllipsis}
          title={
            isCodeDriven
              ? "This parameter is solely code-driven. Controller is just shown for debugging purposes."
              : label
          }
        >
          {label || id}
        </label>
      )}
      <div className={classes.inputContainer} {...inputContainerProps}>
        {props.children}
      </div>
    </div>
  );
}

export function HTMLInputController(props) {
  const {
    label,
    id,
    onChange,
    value,
    type,
    className,
    inputProps = {},
    layout = "default",
    isCodeDriven,
  } = props;
  return (
    <Controller id={id} label={label} layout={layout} isCodeDriven>
      <BaseParamsInput
        className={className}
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        disabled={isCodeDriven}
        {...inputProps}
      />
    </Controller>
  );
}

export function HTMLInputControllerWithTextInput(props) {
  const {
    label,
    id,
    onChange,
    value,
    type,
    className,
    inputProps = {},
    layout = "default",
    textInputProps,
    isCodeDriven,
  } = props;
  return (
    <Controller
      id={id}
      label={label}
      layout={layout}
      isCodeDriven={isCodeDriven}
    >
      <BaseParamsInput
        className={className}
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        autoComplete="off"
        disabled={isCodeDriven}
        {...inputProps}
      />
      <BaseParamsInput
        type="text"
        id={`text-${id}`}
        onChange={onChange}
        value={value}
        autoComplete="off"
        disabled={isCodeDriven}
        {...textInputProps}
      />
    </Controller>
  );
}
