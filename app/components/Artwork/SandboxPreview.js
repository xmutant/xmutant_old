import React, {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import style from "./Artwork.module.scss";
import classNames from "classnames";
import useAsyncEffect from "use-async-effect";

const SandboxPreview = forwardRef(
  ({ id, setId, record, onLoaded, textWaiting }, ref) => {
    const iframeRef = useRef(null);
    const workerReg = useRef(null);

    useEffect(() => {
      if ("serviceWorker" in navigator) {
        const headers = { "Service-Worker-Allowed": "/" };
        navigator.serviceWorker
          .register("/something/worker.js", { scope: "/something/" })
          .then((reg) => {
            workerReg.current = reg;
          })
          .catch((err) => console.log(err));
      }
    }, []);

    useAsyncEffect(async () => {
      if (record && workerReg.current && workerReg.current.active) {
        const worker = workerReg.current;
        const id = (Math.random() * 1000000).toFixed(0);

        worker.active.postMessage({
          type: "REGISTER_REFERRER",
          data: {
            id: id,
            referrer: {
              base: `${location.origin}/something/preview.html`,
              root: `${location.origin}/something/`,
            },
          },
        });

        worker.active.postMessage({
          type: "REGISTER_URLS",
          data: {
            id,
            record,
          },
        });

        setId(id);
      }
    }, [record]);

    const reloadIframe = () => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    };

    const getHtmlIframe = () => {
      return iframeRef.current;
    };

    useImperativeHandle(ref, () => ({
      reloadIframe,
      getHtmlIframe,
    }));

    return (
      <div className={classNames(style["iframe-container"])}>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin allow-modals"
          className={classNames(style.iframe)}
          onLoad={onLoaded}
          allow="accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;"
        />
        {/* {loading &&(
      <LoaderBlock height="100%">{textWaiting}</LoaderBlock>
    )} */}
      </div>
    );
  }
);

SandboxPreview.displayName = "SandboxPreview";

export default SandboxPreview;
