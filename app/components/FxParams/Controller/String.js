import { HTMLInputController } from "./Controller";

export function StringController(props) {
  const { options } = props;
  const minLength = Number(options?.minLength) || 0;
  const maxLength = Number(options?.maxLength) || 64;

  return (
    <HTMLInputController
      type="text"
      inputProps={{ minLength, maxLength }}
      {...props}
    />
  );
}
