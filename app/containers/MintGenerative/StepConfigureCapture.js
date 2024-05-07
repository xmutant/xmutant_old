import style from "./StepConfigureCapture.module.scss";
import Link from "next/link";
import styleC from "./StepCheckFiles.module.scss";
import cs from "classnames";
// import { StepComponent } from "../../types/Steps";
// import { Spacing } from "../../components/Layout/Spacing";
import { ArtworkPreview } from "../../components/Artwork/Preview";
import { Button } from "../../components/Button";
import { useState, useEffect, useMemo } from "react";
import useFetch, { CachePolicies } from "use-http";

// import { Error } from "../../components/Error/Error";
// import { getPreviewError, getTestPreviewError } from "../../utils/errors";
import { ipfsUrlWithHashAndParams } from "../../utils/ipfs";
// import { fxParamsAsQueryParams } from "components/FxParams/utils";
import { InputCaptureSettings } from "../../components/Input/CaptureSettings";
import { validateCaptureSettings } from "../../utils/validation";
import { fxParamsAsQueryParams } from "../../components/FxParams/utils";
import { Spacing } from "../../components/Layout/Spacing";
import axios from "axios";

export const StepConfigureCapture = ({ onNext, state }) => {
  const [testImage, settestImage] = useState("");
  const [settings, setSettings] = useState(
    state.captureSettings ?? {
      mode: null,
      triggerMode: null,
      delay: 2000,
      resX: 800,
      resY: 800,
      gpu: false,
    }
  );

  useEffect(() => {
    console.log(settings);
  }, [settings]);
  const { data, loading, error, post } = useFetch(
    `${process.env.NEXT_PUBLIC_API_EXTRACT}/render-and-save`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
      responseType: "json",
    }
  );

  // extract the presigned URL from the response, if there's one
  // const testImage = useMemo(
  //   () => (data && !error ? data.capture : null),
  //   [data, error]
  // );

  const {
    data: previewData,
    loading: previewLoading,
    error: previewError,
    post: previewPost,
  } = useFetch(`${process.env.NEXT_PUBLIC_API_FILE_ROOT}/preview`, {
    cachePolicy: CachePolicies.NO_CACHE,
  });
  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeDataPreview = !previewError && !previewLoading && previewData;
  console.log(state);
  const captureTest = async () => {
    console.log({
      cid: ipfsUrlWithHashAndParams(
        state.cidUrlParams,
        {
          xmhash: state.previewHash,
          xmiteration: state.previewIteration,
          xmminter: state.previewMinter,
          xmparams: state.previewInputBytes,
          xmParamsAsQueryParams: fxParamsAsQueryParams(state.snippetVersion),
        },
        (cid) => cid
      ),
      mode: settings.mode,
      triggerMode: settings.triggerMode,
      canvasSelector: settings.canvasSelector,
      resX: settings.resX,
      resY: settings.resY,
      delay: settings.delay,
      gpu: settings.gpu,
      withFeatures: false,
      priority: "high",
    });
    let urlCid = ipfsUrlWithHashAndParams(
      state.cidUrlParams,
      {
        xmhash: state.previewHash,
        xmiteration: state.previewIteration,
        xmminter: state.previewMinter,
        xmparams: state.previewInputBytes,
        xmParamsAsQueryParams: fxParamsAsQueryParams(state.snippetVersion),
      },
      (cid) => cid
    );
    if (urlCid) {
      const postData = {
        cid: urlCid,
        mode: settings.mode,
        triggerMode: settings.triggerMode,
        canvasSelector: settings.canvasSelector,
        resX: settings.resX,
        resY: settings.resY,
        delay: settings.delay,
        gpu: settings.gpu,
        withFeatures: false,
        priority: "high",
      };

      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_EXTRACT}/render-and-save`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("API Response:", response.data);
          settestImage(true);
          // Handle API response here
        })
        .catch((error) => {
          console.error("Error:", error.message);
          // Handle errors here
        });
    }
  };

  const sendCapture = () => {
    if (true) {
      previewPost({
        mode: settings.mode,
        triggerMode: settings.triggerMode,
        resX: settings.resX,
        resY: settings.resY,
        delay: settings.delay,
        gpu: settings.gpu,
        canvasSelector: settings.canvasSelector,
        cidParams: state.cidUrlParams,
        previewHash: state.previewHash,
        previewIteration: state.previewIteration,
        previewMinter: state.previewMinter,
        previewInputBytes: state.previewInputBytes,
        authHash: state.authHash1,
        snippetVersion: state.snippetVersion,
      });
    }
  };

  useEffect(() => {
    if (safeDataPreview) {
      console.log(safeDataPreview);
      // onNext({
      //   captureSettings: {
      //     mode: safeDataPreview.mode,
      //     triggerMode: safeDataPreview.triggerMode,
      //     resX: safeDataPreview.resX,
      //     resY: safeDataPreview.resY,
      //     delay: safeDataPreview.delay,
      //     canvasSelector: safeDataPreview.canvasSelector,
      //     gpu: safeDataPreview.gpu,
      //   },
      //   cidPreview: safeDataPreview.cidPreview,
      //   cidThumbnail: safeDataPreview.cidThumbnail,
      //   authHash2: "",
      // });

      onNext({
        captureSettings: {
          mode: settings.mode,
          triggerMode: settings.triggerMode,
          canvasSelector: settings.canvasSelector,
          resX: settings.resX,
          resY: settings.resY,
          delay: settings.delay,
          gpu: settings.gpu,
        },
        cidPreview: safeDataPreview.cidPreview,
        cidThumbnail: safeDataPreview.cidThumbnail,
        authHash2: "",
      });
    }
  }, [safeDataPreview]);

  //
  const testPreviewError = error ? (data ? data.error : "UNKNOWN") : null;

  return (
    <>
      <p>
        When collectors will{" "}
        <strong>mint a token from your Generative Token</strong>, fxhash will
        generate a preview image to go with their Token. <br />
        You need to configure how this preview will be taken by fxhash capture
        module.
        <br />
        Read more about the different{" "}
      </p>

      <Spacing size="5x-large" sm="none" />

      <div className={cs(styleC.container)}>
        <div className={cs(style.inputs)}>
          <InputCaptureSettings settings={settings} onChange={setSettings} />

          <Spacing size="3x-large" sm="x-large" />

          {testPreviewError && (
            <span>
              {testPreviewError}
              {/* {getTestPreviewError(testPreviewError || TestPreviewError.UNKNOWN)} */}
            </span>
          )}

          <Button
            onClick={captureTest}
            state={loading ? "loading" : "default"}
            color="black"
            size="regular"
            style={{
              alignSelf: "center",
            }}
            disabled={!validateCaptureSettings(settings)}
            className={style.button}
          >
            test capture
          </Button>
        </div>

        <div className={cs(styleC.artwork)}>
          <div className={cs(styleC["preview-cont"])}>
            <div className={cs(styleC["preview-wrapper"])}>
              <ArtworkPreview
                url={
                  testImage
                    ? "https://xmutant-api.lampros.tech/screenshot.png"
                    : ""
                }
                alt="Preview capture"
              />
            </div>
          </div>
        </div>
      </div>

      <Spacing size="6x-large" sm="x-large" />

      <div className={cs(style.bottom)}>
        {previewError && <span>{previewError}</span>}

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          size="large"
          state={previewLoading ? "loading" : "default"}
          onClick={sendCapture}
          disabled={!validateCaptureSettings(settings)}
          className={style.button}
        >
          next step
        </Button>
      </div>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </>
  );
};
