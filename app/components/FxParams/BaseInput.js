import {
  ButtonHTMLAttributes,
  HtmlHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import classes from "./BaseInput.module.scss";
import cx from "classnames";

export function BaseInput(props) {
  const { className, ...rest } = props;
  return <input className={cx(classes.baseInput, className)} {...rest} />;
}

export function BaseSelect(props) {
  const { className, ...rest } = props;
  return <select className={cx(classes.baseSelect, className)} {...rest} />;
}

export function BaseButton(props) {
  const { className, color = "primary", ...rest } = props;
  return (
    <button
      type="button"
      className={cx(classes.baseButton, classes[`color-${color}`], className)}
      {...rest}
    />
  );
}

export function IconButton(props) {
  const { className, ...rest } = props;
  return <BaseButton className={cx(classes.iconButton, className)} {...rest} />;
}
