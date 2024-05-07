import React, { useRef, useState, useEffect } from "react";
import cs from "classnames";
import style from "./HoverTitle.module.scss";

export function HoverTitle({ message, className, children }) {
  const hoverMessageRef = useRef(null);
  const anchorRef = useRef(null);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    function calcScreenOverflow() {
      if (!hoverMessageRef.current || !anchorRef.current) return;
      const { left, width: anchorWidth } = anchorRef.current.getBoundingClientRect();
      const { width, x } = hoverMessageRef.current.getBoundingClientRect();
      const centeredTooltipPosition = left + anchorWidth / 2;
      const padding = 8;
      if (centeredTooltipPosition + width / 2 > window.outerWidth) {
        setOffsetX(
          padding +
            width / 2 -
            (window.outerWidth - centeredTooltipPosition)
        );
      } else if (centeredTooltipPosition - width / 2 < 0) {
        setOffsetX(-(padding + width / 2 - centeredTooltipPosition));
      } else {
        setOffsetX(0);
      }
    }
    calcScreenOverflow();
    window.addEventListener("resize", calcScreenOverflow);
    return () => {
      window.removeEventListener("resize", calcScreenOverflow);
    };
  }, [hoverMessageRef, anchorRef, setOffsetX]);

  return (
    <div
      ref={anchorRef}
      className={cs(style.wrapper, className, {
        [style.hover_enabled]: !!message,
      })}
    >
      {children}
      {message && (
        <div
          ref={hoverMessageRef}
          className={cs(style.hover_message)}
          style={{ transform: `translate(calc(-50% - ${offsetX}px),0px)` }}
        >
          {message}
        </div>
      )}
    </div>
  );
}


