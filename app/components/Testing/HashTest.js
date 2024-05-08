import style from "./HashTest.module.scss";
import cs from "classnames";
import { InputText } from "../Input/InputText";
import { Button } from "../Button";
import { useEffect, useState, useRef } from "react";
import { generateXmHash, isHashValid } from "../../utils/hash";
import { Field } from "../Form/Field";

export function HashTest({
  onHashUpdate,
  onRetry,
  value,
  autoGenerate = true,
}) {
  const [error, setError] = useState();
  const hashInputRef = useRef(null);

  // when it mounts, generates a hash and send it upwards
  useEffect(() => {
    if (autoGenerate) {
      onHashUpdate(generateXmHash());
    }
  }, [autoGenerate, onHashUpdate]);

  const newHash = () => {
    setError(undefined);
    onHashUpdate(generateXmHash());
  };

  const manualHashUpdate = (hash) => {
    if (isHashValid(hash)) {
      setError(undefined);
      onHashUpdate(hash);
    } else {
      setError("You can only paste a valid hash");
    }
  };

  return (
    <div className={cs(style.container)}>
      <Field error={error}>
        <small>Current hash</small>
        <InputText
          ref={hashInputRef}
          value={value || ""}
          onChange={(evt) => manualHashUpdate(evt.target.value)}
          onFocus={() => hashInputRef.current && hashInputRef.current.select()}
          onClick={() => hashInputRef.current && hashInputRef.current.select()}
        />
      </Field>
      <div className={cs(style.buttons)}>
        <Button size="small" color="primary" onClick={newHash} type="button">
          new hash
        </Button>
        <Button size="small" onClick={onRetry} type="button">
          retry with same hash
        </Button>
      </div>
    </div>
  );
}
