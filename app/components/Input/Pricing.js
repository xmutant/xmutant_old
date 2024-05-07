import cs from "classnames";
import React, { Fragment, useMemo } from "react";
import { Field } from "../Form/Field";
import { Fieldset } from "../../components/Form/Fieldset";
import { InputRadioBtnIcon } from "./InputRadioBtnIcon";
// import { RadioOption } from "./InputRadioButtons";
// import { GenTokPricing } from "../../types/entities/GenerativeToken";
// import { Collaboration } from "../../types/entities/User";
// import { GenTokPricingForm } from "../../types/Mint";
// import { InputPricingDutchAuction } from "./PricingDutchAuction";
import { InputPricingFixed } from "./PricingFixed";

const PricingOptions = [
  {
    value: "FIXED",
    label: "Fixed price",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-equals" />,
    },
  },
  {
    value: "DUTCH_AUCTION",
    label: "Dutch auction (coming soon)",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-arrow-down-right" />,
    },
  },
];

function InputPricing({
  value,
  onChange,
  errors,
  lockWarning,
  collaboration,
  noFieldset = false,
}) {
  const update = (key, nvalue) => {
    onChange({
      ...value,
      [key]: nvalue,
    });
  };

  const WithFieldset = useMemo(
    () => (noFieldset ? Fragment : Fieldset),
    [noFieldset]
  );

  return (
    <WithFieldset>
      <Field>
        <label>
          Pricing method
          <small>
            You will be able to update the pricing method after publication
          </small>
        </label>
        <InputRadioBtnIcon
          value={value.pricingMethod}
          onChange={(val) => update("pricingMethod", "FIXED")}
          options={PricingOptions}
        />
      </Field>

      {value.pricingMethod === "FIXED" && (
        <InputPricingFixed
          value={value.pricingFixed}
          onChange={(v) => update("pricingFixed", v)}
          errors={errors?.pricingFixed}
          lockWarning={lockWarning}
          collaboration={collaboration}
        />
      )}

      {/* {value.pricingMethod === "DUTCH_AUCTION" && (
        <InputPricingDutchAuction
          value={value.pricingDutchAuction}
          onChange={(v) => update("pricingDutchAuction", v)}
          errors={errors?.pricingDutchAuction}
          lockWarning={lockWarning}
          collaboration={collaboration}
        />
      )} */}
    </WithFieldset>
  );
}

export default InputPricing;
