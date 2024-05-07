import { useMemo, ReactElement, createElement } from "react";

import { BooleanController } from "./Boolean";
import { ColorController } from "./Color";
import { NumberController } from "./Number";
import { BigIntController } from "./BigInt";
import { SelectController } from "./Select";
import { StringController } from "./String";
// import { validateParameterDefinition } from "../validation";

import { ControllerInvalid } from "./Invalid";
import { BytesController } from "./Bytes";

export const controllerDefinitions = {
  number: {
    type: "number",
    controller: NumberController,
    handler: (e) => Number(e.target.value),
  },
  bigint: {
    type: "bigint",
    controller: BigIntController,
    handler: (e) => BigInt(e.target.value),
  },
  string: {
    type: "string",
    controller: StringController,
    handler: (e) => e.target.value,
  },
  bytes: {
    type: "bytes",
    controller: BytesController,
    handler: (e) => e.target.value,
  },
  boolean: {
    type: "boolean",
    controller: BooleanController,
    handler: (e) => e.target.checked,
  },
  color: {
    type: "color",
    controller: ColorController,
    handler: (v) => v.replace("#", ""),
  },
  select: {
    type: "select",
    controller: SelectController,
    handler: (e) => e.target.value,
  },
};

export function ParameterController(props) {
  const { definition, value, onChange, parsed, forceEnabled } = props;

  const parsedDefinition = useMemo(() => parsed, [definition, parsed]);
  const { controller: Controller, handler } = useMemo(
    () => controllerDefinitions[definition.type],
    [definition.type]
  );

  const handleChangeParam = (e) => {
    const value = handler(e);
    onChange(value);
  };

  if (parsedDefinition && !parsedDefinition.success)
    return (
      <ControllerInvalid
        definition={definition}
        error={parsedDefinition.error}
      />
    );

  const options = definition.options;

  const isCodeDriven = definition.update === "code-driven" && !forceEnabled;

  return createElement(Controller, {
    id: definition.id,
    label: definition.name,
    value: value,
    onChange: handleChangeParam,
    options,
    isCodeDriven,
  });
}
