import React, { useState, useCallback } from "react";
import classNames from "classnames";
import style from "./WarningLayer.module.scss";
import { Button } from "../Button";
import { memo } from "react";

export default function WarningLayer({ className, warning }) {
  const [showWarning, setShowWarning] = useState(true);

  const handleClickShowElementBehind = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowWarning(false);
  }, []);

  return showWarning ? (
    <div className={classNames(style.warning, className)}>
      <div className={style.icons}>
        {warning.icons.map((iconClassName) => (
          <i key={iconClassName} aria-hidden className={iconClassName} />
        ))}
      </div>
      <span>{warning.labels.join(", ")} warning:</span>
      {warning.descriptions.length > 1 ? (
        <ul className={style.description}>
          {warning.descriptions.map((description) => (
            <li key={description}>{description}</li>
          ))}
        </ul>
      ) : (
        <div className={style.description}>{warning.descriptions[0]}</div>
      )}
      <Button
        className={style.show_button}
        size="very-small"
        type="button"
        onClick={handleClickShowElementBehind}
      >
        show
      </Button>
    </div>
  ) : null;
}


