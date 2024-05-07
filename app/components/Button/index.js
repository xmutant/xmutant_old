import { forwardRef } from "react";
import style from "./Button.module.scss";
import classNames from "classnames";
import { ButtonOrLink } from "./ButtonOrLink";

export const Button = forwardRef(
  (
    {
      iconComp,
      state = "default",
      iconSide = "left",
      size = "medium",
      color = "black",
      isLink = false,
      disabled = false,
      className,
      classNameChildren,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ButtonOrLink
        ref={ref}
        isLink={isLink}
        className={classNames(
          style.button,
          style[`size-${size}`],
          style[`icon-${iconSide || "alone"}`],
          style[`color-${color}`],
          style[`state-${state}`],
          className,
          {
            [style.disabled]: disabled,
          }
        )}
        disabled={disabled}
        {...props}
      >
        <div className={classNames(style.btn_content)}>
          {iconComp}
          {children && (
            <span className={classNames(style.children, classNameChildren)}>
              {children}
            </span>
          )}
        </div>
      </ButtonOrLink>
    );
  }
);
Button.displayName = "Button";
