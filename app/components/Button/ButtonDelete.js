import style from "./ButtonDelete.module.scss";

import { ReactNode } from "react";

function ButtonDelete({ onClick, disabled, className, children }) {
  return (
    <button
      type="button"
      className={`${style.btn_delete} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children && children + " "
      }
      <i aria-hidden className="fa-solid fa-circle-xmark" />
    </button >
  );
}

export { ButtonDelete };
