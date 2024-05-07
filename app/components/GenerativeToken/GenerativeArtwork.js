import style from "./GenerativeArtwork.module.scss";
import layout from "../../styles/Layout.module.scss";
import cs from "classnames";
// import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SquareContainer } from "../Layout/SquareContainer";
import { ArtworkFrame } from "../Artwork/ArtworkFrame";
import { ArtworkIframe, ArtworkIframeRef } from "../Artwork/PreviewIframe";
import { Spacing } from "../Layout/Spacing";
import { ButtonVariations, Variant } from "../Button/ButtonVariations";
import { Button } from "../Button";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SettingsContext } from "../../context/Theme";
import { ipfsGatewayUrl } from "../../services/Ipfs";
import { Image } from "../Image";
import { useReceiveTokenInfos } from "../../hooks/useReceiveTokenInfos";
import { ButtonExploreParams } from "../Button/ButtonExploreParams";
import sha1 from "sha1";
import { fxParamsAsQueryParams } from "../FxParams/utils";

export function GenerativeArtwork({
  token,
  forceImageDisplay = false,
  openUrl,
  openText = "open",
  hideVariations,
  artifactUrl: artworkArtifactUrl,
  exploreParamsQuery,
}) {
  const settings = useContext(SettingsContext);
  const artworkIframeRef = useRef(null);

  const { paramsDefinition: paramsDefinitionFromIframe, onIframeLoaded } =
    useReceiveTokenInfos(artworkIframeRef);
  const paramsDefinition =
    paramsDefinitionFromIframe || token.metadata.params?.definition;

  const previewVariant = useMemo(
    () => [
      token.metadata.previewHash || null,
      token.metadata.previewInputBytes || null,
      token.metadata.previewIteration || null,
    ],
    [token]
  );

  const [variant, setVariant] = useState(previewVariant);

  const [previewHash, previewInputBytes, previewIteration] = variant;

  const [previewMinter, setPreviewMinter] = useState(
    token.metadata.previewMinter || null
  );

  // forcing image display as a state
  const [displayImage, setDisplayImage] = useState(
    settings.quality === 0 || forceImageDisplay
  );

  // update the state of display image if we record a change in settings
  useEffect(() => {
    setDisplayImage(settings.quality === 0 || forceImageDisplay);
  }, [settings.quality, forceImageDisplay]);

  const reload = () => {
    if (artworkIframeRef.current) {
      artworkIframeRef.current.reloadIframe();
    }
  };

  // the direct URL to the resource to display in the <iframe>
  const artifactUrl = useMemo(() => {
    if (artworkArtifactUrl) return artworkArtifactUrl;
    // if no hash is forced, use the artifact URI directly
    if (!previewHash) {
      return ipfsGatewayUrl(token.metadata.artifactUri);
    } else {
      // there is a forced hash, add it to the generative URL
      let url = `${ipfsGatewayUrl(
        token.metadata.generativeUri
      )}/?xmhash=${previewHash}`;
      if (previewIteration) {
        url += `&xmiteration=${previewIteration}`;
      }
      if (previewMinter) {
        url += `&xmminter=${previewMinter}`;
      }
      if (previewInputBytes) {
        if (fxParamsAsQueryParams(token.metadata.snippetVersion || "3.2.0")) {
          url += `&xmparams=${previewInputBytes}`;
        } else {
          url += `&xmparamsUpdate=${sha1(previewInputBytes)}`;
          url += `#0x${previewInputBytes}`;
        }
      }
      return url;
    }
  }, [
    previewHash,
    previewIteration,
    previewInputBytes,
    artworkArtifactUrl,
    token.metadata.artifactUri,
    token.metadata.generativeUri,
    token.metadata.snippetVersion,
    previewMinter,
  ]);

  return (
    <>
      <SquareContainer>
        <ArtworkFrame tokenLabels={token.labels}>
          {displayImage ? (
            <Image
              image={token.captureMedia}
              ipfsUri={token.displayUri}
              alt={`${token.name} preview`}
              trueResolution
            />
          ) : (
            <ArtworkIframe
              tokenLabels={token.labels}
              ref={artworkIframeRef}
              url={artifactUrl}
              hasLoading={false}
              onLoaded={onIframeLoaded}
            />
          )}
        </ArtworkFrame>
      </SquareContainer>

      <Spacing size="8px" />

      <div className={cs(layout["x-inline"], style.artwork_buttons)}>
        {token.inputBytesSize > 0 && (
          <ButtonExploreParams
            token={token}
            exploreParamsQuery={exploreParamsQuery}
          />
        )}
        {!hideVariations && (
          <ButtonVariations
            token={token}
            variant={variant}
            params={paramsDefinition}
            onChangeVariant={(v) => {
              setDisplayImage(false);
              setVariant(v);
            }}
          />
        )}
        {/* {displayImage ? (
          <Button
            type="button"
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-play" />}
            iconSide="right"
            onClick={() => {
              setVariant(previewVariant);
              setDisplayImage(false);
            }}
          >
            run
          </Button>
        ) : (
          <>
            <Button
              type="button"
              size="small"
              color="transparent"
              iconComp={<i aria-hidden className="fas fa-stop" />}
              iconSide="right"
              onClick={() => {
                setVariant(previewVariant);
                setDisplayImage(true);
              }}
            >
              stop
            </Button>
            <Button
              type="button"
              size="small"
              color="transparent"
              iconComp={<i aria-hidden className="fas fa-redo" />}
              iconSide="right"
              onClick={reload}
            >
              reload
            </Button>
          </>
        )} */}
        <Link href={openUrl || artifactUrl} passHref>
          <Button
            isLink={true}
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-external-link-square" />}
            // @ts-ignore
            target="_blank"
            iconSide="right"
          >
            {openText}
          </Button>
        </Link>
      </div>
    </>
  );
}
