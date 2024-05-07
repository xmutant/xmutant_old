import style from "./Pricing.module.scss";
import text from "../../styles/Text.module.css";
import cs from "classnames";
import { InputDatetime } from "../../components/Input/InputDatetime";
import { InputTextUnit } from "./InputTextUnit";
import { useContext } from "react";
import { Field } from "../Form/Field";
import { Checkbox } from "./Checkbox";
import { Spacing } from "../Layout/Spacing";
import { addHours, startOfHour } from "date-fns";
import { FormikErrors } from "formik";
// import { UserContext } from "../UserProvider";
// import { TextWarning } from "../../components/Text/TextWarning";
import { isEntityVerified } from "../../utils/user";

const dateFast = [
  {
    label: "end of next hour",
    generate: () => addHours(startOfHour(new Date()), 2),
  },
  {
    label: "+1h",
    generate: (date) => (date ? addHours(date, 1) : addHours(new Date(), 1)),
  },
  {
    label: "-1h",
    generate: (date) => (date ? addHours(date, -1) : addHours(new Date(), -1)),
  },
];

export const InputPricingFixed = ({
  value,
  onChange,
  onBlur,
  errors,
  lockWarning = false,
  collaboration,
}) => {
  const { user } = "";

  const update = (key, nval) => {
    onChange({
      ...value,
      [key]: nval,
    });
  };

  return (
    <>
      <Field error={errors?.price}>
        <label htmlFor="price">Price</label>
        <InputTextUnit
          unit="BTT"
          type="text"
          name="price"
          value={value?.price ?? ""}
          onChange={(evt) => update("price", evt.target.value)}
          // onBlur={onBlur}
          error={!!errors?.price}
        />
      </Field>

      <Spacing size="x-large" />

      {/* <em className={cs(text.info)}>
        You can configure an opening time, minting will only be available after
        the specified time.
      </em> */}
      <Spacing size="8px" />

      {/* <Field className={cs(style.checkbox)}>
        <Checkbox
          name="scheduled"
          value={value.opensAt != null}
          onChange={() => {
            if (value.opensAt == null) {
              update("opensAt", addHours(startOfHour(new Date()), 3));
            } else {
              update("opensAt", null);
            }
          }}
        >
          Scheduled opening
        </Checkbox>
      </Field> */}

      {value.opensAt != null && (
        <Field error={errors?.opensAt}>
          <label>
            Opening time
            <small>In your local timezone</small>
          </label>
          <InputDatetime
            value={value.opensAt}
            onChange={(val) => update("opensAt", val)}
            fastBtns={dateFast}
            error={!!errors?.opensAt}
          />
          {!isEntityVerified(collaboration || user) && (
            <>
              <Spacing size="2x-small" />
              <span>
                Because
                {collaboration
                  ? " not all the members of the collaboration are "
                  : " you are not "}
                verified, your project will be locked for 3 hours.
                <br />
                You may want to schedule an opening time in more than 3 hours.
              </span>
            </>
          )}
        </Field>
      )}
    </>
  );
};
