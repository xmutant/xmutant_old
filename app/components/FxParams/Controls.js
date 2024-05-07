import { createRef, useEffect, useMemo, useState } from "react";

import { ParameterController } from "./Controller/Param";
import { LockButton } from "./LockButton/LockButton";
import classes from "./Controls.module.scss";
import { validateParameterDefinition } from "./validation";

function ControllerBlade(props) {
  const {
    value,
    definition,
    onChange,
    onClickLockButton,
    lockedParamIds,
    forceEnabled,
  } = props;
  const parsed = useMemo(
    () => validateParameterDefinition(definition),
    [definition]
  );
  const isValid = useMemo(() => parsed && parsed.success, [parsed]);
  return (
    <div className={classes.blade}>
      <ParameterController
        definition={definition}
        value={value}
        onChange={onChange}
        forceEnabled={forceEnabled}
      />
      {onClickLockButton && isValid && (
        <LockButton
          className={classes.lockButton}
          title={`toggle lock ${definition.id} param`}
          isLocked={lockedParamIds?.includes(definition.id)}
          onClick={(e) => onClickLockButton(definition.id)}
        />
      )}
    </div>
  );
}

export const Controls = ({
  definition,
  data,
  onClickLockButton,
  lockedParamIds,
  onChangeData,
  forceEnabled,
}) => {
  const p = createRef();

  const handleChangeParam = (id, value) => {
    const newData = { ...data, [id]: value };
    onChangeData(newData);
  };

  return (
    <div className={classes.controls} ref={p}>
      {definition?.map((def) => {
        return (
          <ControllerBlade
            key={def.id}
            definition={def}
            value={data[def.id]}
            onChange={(value) => handleChangeParam(def.id, value)}
            lockedParamIds={lockedParamIds}
            onClickLockButton={onClickLockButton}
            forceEnabled={forceEnabled}
          />
        );
      })}
    </div>
  );
};
