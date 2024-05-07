import { HTMLInputController } from "./Controller";

export function BooleanController(props) {
  return (
    <HTMLInputController
      type="checkbox"
      layout="box"
      inputProps={{ checked: props.value }}
      {...props}
    />
  );
}
