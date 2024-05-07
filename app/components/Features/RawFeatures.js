import { useState, useEffect } from "react"

import { processRawTokenFeatures } from "../../utils/convert"
import { Features } from "./Features"


/**
 * This Component acts as a wrapper arround the Features Renderer, it receives RawFeatures as input and process those
 */
export function RawFeatures({ rawFeatures }) {
  // features & errors related to feature processing
  const [features, setFeatures] = useState(null)
  const [featuresError, setFeaturesError] =
    useState(null)

  useEffect(() => {
    setFeaturesError(null)
    if (rawFeatures) {
      try {
        // @ts-ignore
        const processed = processRawTokenFeatures(rawFeatures)
        setFeatures(processed)
      } catch (err) {
        if (err.type) {
          setFeaturesError(err)
        }
      }
    } else {
      setFeatures(null)
    }
  }, [rawFeatures])

  return featuresError ? (
    
    <span>Error when processing the Token features:</span>
  ) : (
    <Features features={features} layout="cols_2" />
  )
}
