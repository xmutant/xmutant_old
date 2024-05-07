import style from "./Features.module.scss"
import cs from "classnames"
import { Feature } from "./Feature"
import { getGenerativeTokenUrl } from "../../utils/generative-token"
import { useMemo } from "react"



export function Features({
  features,
  projectUrl,
  layout = "responsive",
}) {
  return features && features.length > 0 ? (
    <div className={cs(style.features, style[layout])}>
      {features.map((feature, idx) => (
        <Feature key={idx} feature={feature} projectUrl={projectUrl} />
      ))}
    </div>
  ) : (
    <em className={cs(style.no_features)}>
      The token does not implement features (features are not mandatory,
      it&apos;s up to you to decide if you want your Tokens to have features)
    </em>
  )
}
