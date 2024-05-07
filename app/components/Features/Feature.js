import style from "./Features.module.scss"
import cs from "classnames"
import { displayPercentage } from "../../utils/units"
import Link from "next/link"
import { defaultQueryParamSerialize } from "../../hooks/useQueryParam"
import { Button } from "../Button"

function displayFeatureValue(value) {
  const type = typeof value
  switch (type) {
  case "boolean":
    return value ? "true" : "false"
  case "number":
    return value.toString()
  case "string":
  default:
    return value
  }
}

function getFeatureFilterUrl(projectUrl, feature) {
  // Determine the type of feature value
  let valueType;
  if (typeof feature.value === "boolean") {
    valueType = "boolean";
  } else if (typeof feature.value === "number") {
    valueType = "number";
  } else {
    valueType = "string";
  }

  // Serialize the feature with type information
  const serializedFeature = defaultQueryParamSerialize([
    {
      name: feature.name,
      values: [feature.value],
      type: valueType,
    },
  ]);

  // Construct the URL with the serialized feature
  return `${projectUrl}?features=${serializedFeature}`;
}

const FeatureDetail = ({ feature }) => (
  <article
    className={cs(style.feature, {
      [style.has_rarity]: !!feature.rarity,
    })}
  >
    <div className={cs(style.details)}>
      <strong>{feature.name}</strong>
      <span>{displayFeatureValue(feature.value)}</span>
    </div>
    {feature.rarity && (
      <div className={cs(style.rarity)}>
        {displayPercentage(feature.rarity)}%
      </div>
    )}
  </article>
)

export function Feature({ feature, projectUrl }) {
  if (!projectUrl) return <FeatureDetail feature={feature} />

  return (
    <Link href={getFeatureFilterUrl(projectUrl, feature)}>
      <Button
        className={cs(style.feature_link)}
        isLink
        color="transparent"
        size="full"
      >
        <FeatureDetail feature={feature} />
      </Button>
    </Link>
  )
}
