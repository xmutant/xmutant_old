import Link from "next/link";
import { Button } from "../Button";
import { useMemo } from "react";
import { getGenerativeTokenUrl, isExplorationDisabled } from "../../utils/generative-token";
import HoverTitle from "../Utils/HoverTitle";

function ButtonExploreParams({ token, exploreParamsQuery }) {
  const disabled = isExplorationDisabled(token);

  const paramsUrl = useMemo(() => {
    if (exploreParamsQuery)
      return `${getGenerativeTokenUrl(token)}/explore-params?${exploreParamsQuery}`;
    return `${getGenerativeTokenUrl(token)}/explore-params`;
  }, [token, exploreParamsQuery]);

  const hoverMessage = useMemo(() =>
    disabled
      ? "Artist disabled the exploration of params after minting phase"
      : null,
  []);

  return (
    <HoverTitle message={hoverMessage}>
      <Link href={paramsUrl} passHref>
        <Button
          disabled={disabled}
          isLink
          type="button"
          size="small"
          color="transparent"
          iconComp={<i aria-hidden className="fa-sharp fa-regular fa-slider" />}
          iconSide="right"
        >
          params
        </Button>
      </Link>
    </HoverTitle>
  );
}

export { ButtonExploreParams };
