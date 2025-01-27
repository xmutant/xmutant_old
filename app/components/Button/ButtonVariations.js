import style from "./ButtonVariations.module.scss";
import cs from "classnames";
// import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Button } from ".";
import { useMemo } from "react";
import { generateXmHash } from "../../utils/hash";
import { uniq, uniqBy } from "lodash";
import { HoverTitle } from "../Utils/HoverTitle";
import { getRandomParamValues, serializeParams } from "../FxParams/utils";
import {
  getActiveExploreSet,
  isTokenFullyMinted,
} from "../../utils/generative-token";
import { getRandomIteration } from "../../utils/iteration";

export function ButtonVariations({ token, onChangeVariant, params, variant }) {
  const fullyMinted = isTokenFullyMinted(token);
  const activeSettings = getActiveExploreSet(token);

  // the hover message is only here if disabled, and depends some conditions
  const hoverMessage = useMemo(() => {
    if (!token.metadata.settings?.exploration) {
      return "This token doesn't have variation settings, therefore exploration of variations is disabled";
    }
    if (!activeSettings?.enabled) {
      if (fullyMinted) {
        return "Artist disabled the exploration of variations after minting phase";
      } else {
        return "Artist disabled the exploration of variation during the minting phase";
      }
    }
    return null;
  }, [
    token.metadata.settings?.exploration,
    activeSettings?.enabled,
    fullyMinted,
  ]);

  const variants = useMemo(() => {
    if (!activeSettings?.hashConstraints) return null;
    let suppliedVariants = activeSettings.hashConstraints.map((hash, idx) => [
      hash,
      activeSettings.paramsConstraints?.[idx] || null,
      activeSettings.iterationConstraints?.[idx] || null,
    ]);
    return uniqBy(
      [
        [
          token.metadata.previewHash || null,
          token.metadata.previewInputBytes || null,
          token.metadata.previewIteration || null,
        ],
        ...suppliedVariants,
      ],
      (v) => `${v[0]}-${v[1]}-${v[2]}`
    );
  }, [activeSettings, token]);

  // the component rendering the icon next to the button
  const icon = useMemo(() => {
    if (activeSettings?.enabled) {
      // if there is an infinite number of variations
      if (!variants) {
        return <i aria-hidden className="fas fa-infinity" />;
      }
      // otherwise there is a finite amount of variations, we need to display the active
      else {
        // find index of the active hash
        let idx = variants?.findIndex(
          (v) =>
            v[0] === variant[0] && v[1] === variant[1] && v[2] === variant[2]
        );
        idx = idx === -1 || idx == null ? 0 : idx;
        return (
          <div className={cs(style.progress)}>
            {idx + 1}/{variants.length}
          </div>
        );
      }
    } else {
      return <i aria-hidden className="fas fa-infinity" />;
    }
  }, [activeSettings, variants, variant]);

  // update the preview hash, either by looping through available hashes, or by
  // generating a random hash
  const handleClickVariantButton = () => {
    // small front security for those removing the disabled property on the buttons
    if (!activeSettings?.enabled) {
      return;
    }
    // if no hash constraints, just give a random hash
    if (!variants) {
      onChangeVariant([
        generateXmHash(),
        params &&
          serializeParams(
            getRandomParamValues(params, { noTransform: true }),
            params
          ),
        getRandomIteration(token.supply),
      ]);
    }
    // if there is a list of hashes, cycle through those
    else {
      // find index of the active hash
      let idx = variants?.findIndex(
        (v) => v[0] === variant[0] && v[1] === variant[1] && v[2] === variant[2]
      );
      idx = idx === -1 || idx == null ? 0 : idx;
      // compute the new index
      idx = (idx + 1) % variants.length;
      onChangeVariant(variants[idx]);
    }
  };

  return (
    <HoverTitle message={hoverMessage}>
      <Button
        type="button"
        size="small"
        color="transparent"
        disabled={!activeSettings?.enabled}
        iconComp={icon}
        iconSide="right"
        onClick={handleClickVariantButton}
      >
        variations
      </Button>
    </HoverTitle>
  );
}
