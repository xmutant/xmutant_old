import style from "./StepCheckFiles.module.scss";
import styleSteps from "./Steps.module.scss";
import cs from "classnames";
import { generativeFromMintForm, generativeMetadataFromMintForm } from "../../utils/generative-token";
// import { UserContext } from "../UserProvider";
import { GenerativeDisplay } from "../Generative/Display/GenerativeDisplay";
import useFetch, { CachePolicies } from "use-http";
// import { useContractOperation } from "../../hooks/useContractOperation";
// import { MintIssuerV3Operation } from "services/contract-operations/MintIssuer";
import { stringToByteString } from "../../utils/convert";
// import { StepComponent } from "../../types/Steps";
import { getIpfsSlash, ipfsUrlWithHash } from "../../utils/ipfs";
import { Spacing } from "../../components/Layout/Spacing";
import { Button } from "../../components/Button";
import { useContext, useEffect, useMemo } from "react";

export const StepPreviewMint = ({ onNext, state }) => {
  // const userCtx = useContext(UserContext);
  // const user = userCtx.user;
console.log(state)
  // Build a metadata object from the state (can be uploaded)
  const metadata = useMemo(() => generativeMetadataFromMintForm(state), [state]);

  // Build a fake generative token object from state & metadata
  const token = useMemo(
    () => generativeFromMintForm(state, metadata, ""),
    [state, metadata]
  );

  // Hook to interact with file API metadata
  const {
    data: metaData,
    loading: metaLoading,
    error: metaError,
    post: metaPost,
  } = useFetch(
    `${process.env.NEXT_PUBLIC_API_FILE_ROOT}/metadata`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  // Hook to interact with the contract
  // const {
  //   state: callState,
  //   loading: contractLoading,
  //   error: contractError,
  //   success,
  //   call,
  // } = useContractOperation(MintIssuerV3Operation);

  // When the contract call is a success, move to next step
  // useEffect(() => {
  //   if (success) {
  //     onNext({
  //       minted: true,
  //     });
  //   }
  // }, [success]);

  // Derived from state, to take account for both side-effects interactions
  const loading = metaLoading;

  const triggerMint = async () => {
    if (loading) return;
    // Upload token metadata and get CID
    const tokenMetadataResponse = await metaPost(metadata);
    const tokenMetadataCid = tokenMetadataResponse.cid;
    // Generate and upload ticket metadata
    const ticketMetadata = {
      name: `[TICKET] ${state.informations.name}`,
      description: `A ticket which can be exchanged for an iteration of "${
        state.informations.name
      }".`,
      symbol: "FX_TICKET",
      decimals: 0,
      artifactUri: getIpfsSlash(state.cidPreview),
      displayUri: getIpfsSlash(state.cidPreview),
      thumbnailUri: getIpfsSlash(state.cidThumbnail),
      isBooleanAmount: true,
    };
    const ticketMetadataResponse = await metaPost(ticketMetadata);
    const ticketMetadataCid = ticketMetadataResponse.cid;

    // Call the contract
    // It will handle either a call to the issuer or to the collaboration
    // contract if target is collaboration
    call({
      data: state,
      metadata: metadata,
      metadataBytes: stringToByteString(getIpfsSlash(tokenMetadataCid)),
      ticketMetadataBytes: stringToByteString(getIpfsSlash(ticketMetadataCid)),
    });
  };

  return (
    <>
      <p>
        Take a final look to check if the project is properly configured.
        <br />
        This preview is generated based on the settings which will be minted.
      </p>

      <Spacing size="6x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />

      <div className={cs(style.container)}>
        <GenerativeDisplay token={token} offlineMode />
      </div>

      <Spacing size="6x-large" sm="none" />
      <Spacing size="3x-large" sm="x-large" />

      <section className={cs(styleSteps.bottom)}>
        {/* <ContractFeedback
          state={callState}
          loading={contractLoading}
          success={success}
          error={contractError}
          successMessage="Success !"
        /> */}

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fa-solid fa-book-sparkles" />}
          iconSide="right"
          size="large"
          state={loading ? "loading" : "default"}
          onClick={triggerMint}
          className={style.button}
        >
          publish project
        </Button>
      </section>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </>
  );
};
