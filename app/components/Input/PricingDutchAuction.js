import text from "../../styles/Text.module.css";
import layout from "../../styles/Layout.module.scss";
import cs from "classnames";
import { InputDatetime } from "../../components/Input/InputDatetime";
import { InputTextUnit } from "./InputTextUnit";
import { Field } from "../Form/Field";
import { ButtonDelete } from "../Button/ButtonDelete";
import { Button } from "../Button";
import { FormikErrors } from "formik";
import { addHours, startOfHour } from "date-fns";
import { Spacing } from "../Layout/Spacing";
import { TextWarning } from "../../components/Text/TextWarning";
import { useContext } from "react";
import { UserContext } from "../UserProvider";

const dutchAucDateFast = [
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

function InputPricingDutchAuction({
  value,
  onChange,
  onBlur,
  errors,
  lockWarning = false,
  collaboration,
}) {
  const { user } = useContext(UserContext);

  const update = (key, nval) => {
    onChange({
      ...value,
      [key]: nval,
    });
  };

  return (
    <>
      <Field
        error={typeof errors?.levels === "string" ? errors.levels : undefined}
      >
        <label htmlFor="price">
          Price steps
          <small>In descending order</small>
        </label>

        <div className={cs(style.levels)}>
          <Button
            size="small"
            type="button"
            color="transparent"
            iconComp={<i aria-hidden className="fa-solid fa-circle-plus" />}
            onClick={() => {
              const levels = value.levels;
              let V = 50;
              if (levels?.length >= 1) {
                V = Math.floor(parseFloat(levels[0]) * 2);
              }
              update("levels", levels ? [V, ...levels] : [V]);
            }}
          >
            add
          </Button>

          {value.levels?.map((price, idx) => (
            <div key={idx} className={cs(layout.flex_row)}>
              <InputTextUnit
                unit="tez"
                type="text"
                name="price"
                value={price}
                onChange={(evt) => {
                  const nlevels = [...value.levels];
                  nlevels[idx] = evt.target.value;
                  update("levels", nlevels);
                }}
                // onBlur={onBlur}
                error={
                  !(typeof errors?.levels === "string") &&
                  !!errors?.levels?.[idx]
                }
              />
              <ButtonDelete
                onClick={() => {
                  if (value.levels.length > 2) {
                    const nlevels = [...value.levels];
                    nlevels.splice(idx, 1);
                    update("levels", nlevels);
                  }
                }}
                disabled={value.levels.length <= 2}
              />
              {errors?.levels &&
                !(typeof errors.levels === "string") &&
                errors.levels[idx] && (
                  <span className={cs(style.error)}>
                    {errors.levels[idx]}
                  </span>
                )}
            </div>
          ))}

          <Button
            size="small"
            type="button"
            color="transparent"
            iconComp={<i aria-hidden className="fa-solid fa-circle-plus" />}
            onClick={() => {
              const levels = value.levels;
              let V = 50;
              if (levels?.length >= 1) {
                V =
                  Math.floor(parseFloat(levels[levels.length - 1]) * 50) / 100;
              }
              update("levels", levels ? [...levels, V] : [V]);
            }}
          >
            add
          </Button>
        </div>
      </Field>

      <Field error={errors?.opensAt}>
        <label>
          Opening time
          <small>In your local timezone</small>
        </label>
        <InputDatetime
          value={value.opensAt}
          onChange={(val) => update("opensAt", val)}
          error={!!errors?.opensAt}
          fastBtns={dutchAucDateFast}
        />
        {!isEntityVerified(collaboration || user) && (
          <>
            <Spacing size="2x-small" />
            <TextWarning>
              Because
              {collaboration
                ? " not all the members of the collaboration are "
                : " you are not "}
              verified, your project will be locked for 3 hours.
              <br />
              You may want to schedule an opening time in more than 3 hours.
            </TextWarning>
          </>
        )}
      </Field>

      <Field error={errors?.decrementDuration}>
        <label htmlFor="price">Time between steps</label>
        <InputTextUnit
          unit="minutes"
          type="text"
          name="price"
          value={value?.decrementDuration ?? ""}
          onChange={(evt) => update("decrementDuration", evt.target.value)}
          // onBlur={onBlur}
          error={!!errors?.decrementDuration}
        />
      </Field>
    </>
  );
}

export default InputPricingDutchAuction;
