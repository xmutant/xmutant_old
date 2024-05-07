import style from "./GenerativeDisplay.module.scss";
import layout from "../../../styles/Layout.module.scss";
import text from "../../../styles/Text.module.css";
import colors from "../../../styles/Colors.module.css";
import cs from "classnames";
import { Spacing } from "../../../components/Layout/Spacing";
// import ClientOnly from "../../../components/Utils/ClientOnly"
import { EditTokenSnippet } from "../../Token/EditTokenSnippet";
// import { MintProgress } from "../../../components/Artwork/MintProgress"
// import { MintController } from "../../../components/GenerativeToken/MintController"
import Link from "next/link";
// import { getGenerativeTokenMarketplaceUrl } from "../../../utils/generative-token"
// import { Button } from "../../../components/Button"
// import { GenerativeExtraActions } from "../ExtraActions"
import { format } from "date-fns";
import nl2br from "react-nl2br";
import { displayRoyalties } from "../../../utils/units";
import { ipfsGatewayUrl } from "../../../services/Ipfs";
import { GenerativeArtwork } from "../../../components/GenerativeToken/GenerativeArtwork";
// import { ListSplits } from "../../../components/List/ListSplits"
// import { EntityBadge } from "../../../components/User/EntityBadge"
// import { GenerativePricing } from "../../../components/GenerativeToken/GenerativePricing"
// import { Tags } from "../../../components/Tags/Tags"
// import { Labels } from "../../../components/GenerativeToken/Label/Labels"
// import { ListReserves } from "../../../components/List/ListReserves"
import { GenTokArticleMentions } from "./GenTokArticleMentions";
import { Clamp } from "../../../components/Clamp/Clamp";
import { useCallback, useState } from "react";
// import { Icon } from "components/Icons/Icon"
// import { GenerativeRedeemable } from "../../../components/GenerativeToken/GenerativeRedeemable"

/**
 * This is the Core component resposible for the display logic of a Generative
 * Token. It can be tweakde so that certain sections are not displayed in case
 * this module is used in specific parts of the application (such as within a
 * collaboration proposal viewer)
 */

export function GenerativeDisplay({
  token,
  redeemableDetails,
  offlineMode = false,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const handleShowDescription = useCallback(() => setShowDescription(true), []);

  return (
    <>
      <div className={cs(style.artwork_header_mobile, layout.break_words)}>
        {/* <EntityBadge
          user={token.author}
          classNameAvatar={style.author_avatar}
          size="regular"
          toggeable
        /> */}
        <span>{token.author}</span>
        <Spacing size="2x-small" sm="regular" />
        <h3>{token.name}</h3>
        {token.redeemables && token.redeemables.length > 0 && (
          <div className={cs(style.redeemable)}>
            <span>This project can be redeemed</span>
            <Link href={`/generative/${token.id}/redeem`}>
              <a className={cs(text.regular)}>see more</a>
            </Link>
          </div>
        )}
        <Spacing size="x-large" />
      </div>

      <div
        className={cs(
          style.presentation,
          layout.cols2,
          layout["responsive-reverse"]
        )}
      >
        <div className={cs(style.presentation_details)}>
          <div className={cs(style.artwork_header)}>
            {/* <EntityBadge user={token.author} size="big" toggeable /> */}
            <span>{token.author}</span>

            <Spacing size="x-large" />
            <h3>{token.name}</h3>
          </div>
          {token.redeemables && token.redeemables.length > 0 && (
            <div className={cs(style.redeemable, style["redeemable--hide-md"])}>
              <span>This project can be redeemed</span>
              <Link href={`/generative/${token.id}/redeem`}>
                <a className={cs(text.regular)}>see more</a>
              </Link>
            </div>
          )}

          <Spacing size="x-large" sm="none" />

          {!offlineMode && (
            // <ClientOnly>
            //   <UserGuard forceRedirect={false}>
            <EditTokenSnippet token={token} />
            // </UserGuard>
            // </ClientOnly>
          )}

          {/* <div className={cs(style.artwork_details)}>
            <MintProgress token={token} showReserve />
          </div> */}

          <Spacing size="x-large" sm="regular" />

          {/* <MintController token={token} forceDisabled={offlineMode}>
            <Link href={getGenerativeTokenMarketplaceUrl(token)} passHref>
              <Button
                isLink={true}
                size="regular"
                disabled={offlineMode}
                className={style.button}
              >
                open marketplace
              </Button>
            </Link>
          </MintController> */}

          <Spacing size="4x-large" sm="x-large" />

          <div className={cs(style.multilines)}>
            <div className={cs(style.project_infos)}>
              <h3>Project #{token.id}</h3>
              {!offlineMode && (
                <></>
                // <GenerativeExtraActions token={token} />
              )}
            </div>
            <span className={cs(colors.gray, text.small)}>
              Published on{" "}
              {format(new Date(token.createdAt), "MMMM d, yyyy' at 'HH:mm")}
            </span>
            {/* {token.labels && <Labels className={style.labels} token={token} />} */}
          </div>

          <Spacing size="large" sm="regular" />

          <Clamp
            className={cs(style.description, {
              [style.description_opened]: showDescription,
            })}
            onClickCTA={handleShowDescription}
            labelCTA="read more"
          >
            {nl2br(token.metadata?.description)}

            {token.metadata?.mintingInstructions && (
              <>
                <Spacing size="large" sm="regular" />
                <strong>Minting Instructions</strong>
                {nl2br(token.metadata?.mintingInstructions)}
              </>
            )}
          </Clamp>

          <Spacing size="2x-large" sm="3x-large" />

          <div
            className={cs(
              style.multilines,
              layout.break_words,
              style.extra_details
            )}
          >
            {/* <GenerativePricing token={token} /> */}
            {/* {redeemableDetails && (
              <GenerativeRedeemable
                urlRedeemable={`/generative/${token.id}/redeem`}
                // take the first redeemable?
                details={redeemableDetails[0]}
                redeemedPercentage={token.redeemables[0].redeemedPercentage}
              />
            )} */}
            {token.mintTicketSettings && (
              <>
                <strong>Ticket Grace Period</strong>
                <span className={style.mobile_align_right}>
                  {token.mintTicketSettings.gracingPeriod} days
                </span>
              </>
            )}
            {/* <ListSplits name="Primary split" splits={token.splitsPrimary} /> */}
            <strong>Royalties</strong>
            <span className={style.mobile_align_right}>
              {displayRoyalties(token.royalties)}
            </span>
            {/* <ListSplits name="Royalties split" splits={token.splitsSecondary} /> */}
            <strong
              className={cs({
                [style.mobile_grid_two]: token.tags && token.tags.length > 0,
              })}
            >
              Tags
            </strong>
            {/* <span
              className={cs({
                [style.mobile_grid_two]: token.tags && token.tags.length > 0,
                [style.mobile_align_right]: !(
                  token.tags && token.tags.length > 0
                ),
              })}
            >
              {token.tags && token.tags.length > 0 ? (
                <Tags tags={token.tags} />
              ) : (
                <span className={cs(text.info)}>{"/"}</span>
              )}
            </span> */}
            <hr />
            <strong>Metadata</strong>
            <a
              target="_blank"
              referrerPolicy="no-referrer"
              href={ipfsGatewayUrl(token.metadataUri)}
              className={cs(style.metadata, style.mobile_align_right)}
              rel="noreferrer"
            >
              view on IPFS{" "}
              <i className="fas fa-external-link-square" aria-hidden />
            </a>
            {/* <ListReserves reserves={token.reserves} token={token} /> */}
          </div>
        </div>

        <div className={cs(style.presentation_artwork)}>
          <GenerativeArtwork token={token} />
        </div>
      </div>
    </>
  );
}
