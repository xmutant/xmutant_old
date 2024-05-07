import { useMemo } from "react";
import css from "./Bytes.module.scss";
import { Controller } from "./Controller";

export function BytesController(props) {
  const { options } = props;

  const hex = useMemo(() => {
    let out = "";
    for (const v of props.value) {
      out += v.toString(16).padStart(2, "0");
    }
    return out;
  }, [props.value]);

  return (
    <Controller
      id={props.id}
      label={props.label}
      layout={props.layout}
      isCodeDriven={props.isCodeDriven}
    >
      <div className={css.root}>
        <div className={css.wrapper}>{hex}</div>
      </div>
    </Controller>
  );
}
