import { Checkbox } from "../../../components/Input/Checkbox";
import { Select } from "../../../components/Input/Select";
import { Spacing } from "../../../components/Layout/Spacing";
import { HashList } from "../../../components/Utils/HashList";
import { Field } from "../../../components/Form/Field";
import cs from "classnames";
import style from "./StepExtraSettings.module.scss";
import text from "../../../styles/Text.module.css";
import { Button } from "../../../components/Button";
import layout from "../../../styles/Layout.module.scss";

const EXPLORATION_OPTIONS_HASH = [
  {
    label: "Infinite",
    value: "infinite",
  },
  {
    label: "Constrained to a list of hashes (coming soon)",
    value: "infinite",
  },
];

const EXPLORATION_OPTIONS_PARAMS = [
  {
    label: "Infinite",
    value: "infinite",
  },
  {
    label: "Constrained to a list of hashes and params (coming soon)",
    value: "infinite",
  },
];

const TARGET_DESCRIPTIONS = {
  postMint: (
    <>Will only be applied when your Generative Token is fully minted.</>
  ),
  preMint: <>Will be applied if your Generative Token is not fully minted.</>,
};

const TARGET_HEADLINE = {
  postMint: "Post-mint",
  preMint: "Pre-mint",
};

const ADD_BUTTON_LABELS = {
  params: "Add current hash and params (below) to list",
  hash: "Add current hash (below) to list",
};

const EMPTY_LABELS = {
  params: (
    <span>
      <em>No hash and params</em>
      <br />
      <span>You must add a hash and params if using a constrained list</span>
    </span>
  ),
  hash: (
    <span>
      <em>No hash</em>
      <br />
      <span>You must add a hash if using a constrained list</span>
    </span>
  ),
};

const EXPLORATION_OPTIONS = {
  params: EXPLORATION_OPTIONS_PARAMS,
  hash: EXPLORATION_OPTIONS_HASH,
};

export function VariantForm(props) {
  const {
    withParams = false,
    target,
    activeVariant,
    settings,
    onChangeExplorationSettings,
    exploreOption,
    onChangeExploreOption,
    onClickVariant,
    translateInputBytes,
    onAdd,
  } = props;

  const labelTarget = withParams ? "params" : "hash";
  const { hashConstraints, iterationConstraints, paramsConstraints } =
    settings || {};

  return (
    <>
      {withParams && target === "preMint" ? (
        <p className={cs(text.info)}>
          <em>
            Pre-mint exploration cannot be disabled when using fx(params).
          </em>
        </p>
      ) : (
        <>
          <p className={cs(text.info)}>
            <em>{TARGET_DESCRIPTIONS[target]}</em>
          </p>
          <Field className={cs(style.checkbox)}>
            <Checkbox
              name={`${target}-enabled`}
              value={settings?.enabled || false}
              onChange={(_, event) =>
                onChangeExplorationSettings(
                  target,
                  "enabled",
                  !settings?.enabled
                )
              }
            >
              exploration enabled
            </Checkbox>
          </Field>
        </>
      )}

      <div
        className={cs({
          [style.field_disabled]: !settings?.enabled,
        })}
      >
        <Spacing size="regular" />
        <Field>
          <label>Number of variations</label>
          <Select
            options={EXPLORATION_OPTIONS[labelTarget]}
            value={exploreOption}
            onChange={onChangeExploreOption}
          />
        </Field>

        {exploreOption === "constrained" && (
          <Field className={cs(layout.flex_column_left)}>
            <div className={cs(style.field_header)}>
              <label>List of variants ({hashConstraints?.length})</label>
              <Button
                type="button"
                color="black"
                size="small"
                onClick={() => onAdd(target)}
                iconComp={<i aria-hidden className="fas fa-plus-circle" />}
              >
                {ADD_BUTTON_LABELS[labelTarget]}
              </Button>
            </div>
            <div
              className={cs(style.hashlist_wrapper, {
                [style.no_hash]: !(hashConstraints && hashConstraints?.length),
              })}
            >
              {hashConstraints && hashConstraints.length > 0 ? (
                <HashList
                  className={cs(style.hashlist)}
                  hashes={hashConstraints || []}
                  iterations={iterationConstraints || []}
                  params={paramsConstraints}
                  activeItem={activeVariant}
                  onChange={(hashes, iterations, params) => {
                    onChangeExplorationSettings(
                      target,
                      "hashConstraints",
                      hashes
                    );
                    onChangeExplorationSettings(
                      target,
                      "iterationConstraints",
                      iterations
                    );
                    if (params) {
                      onChangeExplorationSettings(
                        target,
                        "paramsConstraints",
                        params
                      );
                    }
                  }}
                  onClickItem={onClickVariant}
                  translateInputBytes={translateInputBytes}
                />
              ) : (
                EMPTY_LABELS[labelTarget]
              )}
            </div>
          </Field>
        )}
      </div>
    </>
  );
}
