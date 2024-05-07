import { useEffect, useCallback } from "react";
// import { FxParamDefinition, FxParamType, FxParamsData } from "components/FxParams/types";
import { IRuntimeContext, useRuntime } from "./useRuntime";

function handleOldSnippetEvents(e, handlers) {
  if (e.data) {
    if (e.data.id === "fxhash_getHash") {
      if (e.data.data) {
        handlers.setHash(e.data.data);
      }
    }
    if (e.data.id === "fxhash_getFeatures") {
      if (e.data.data) {
        handlers.setFeatures(e.data.data);
      } else {
        handlers.setFeatures(null);
      }
    }
    if (e.data.id === "fxhash_getParams") {
      if (e.data.data) {
        const { definitions, values } = e.data.data;
        if (definitions) {
          const definitionsWithDefaults = definitions.map(
            (d) => ({
              ...d,
              default: values?.[d.id],
            })
          );
          handlers.setParamsDefinition(definitionsWithDefaults);
          handlers.setParams(values);
        }
      } else {
        handlers.setParams(null);
      }
    }
  }
}

export function useReceiveTokenInfos(ref) {
  const runtime = useRuntime();
  const { state, definition } = runtime;

  const setFeatures = (features) => definition.update({ features });

  const setHash = (hash) => state.update({ hash });

  const setIteration = (iteration) => state.update({ iteration });

  const setMinter = (minter) => state.update({ minter });

  const setParams = (params) => state.update({ params });

  const setParamsDefinition = (params) => definition.update({ params });

  useEffect(() => {
    const listener = (e) => {
      if (e.data.id === "fxhash_getInfo") {
        const {
          version,
          params: { definitions, values },
          iteration,
          minter,
          features,
          hash,
        } = e.data.data;
        runtime.update({
          state: {
            hash,
            minter,
            iteration: parseInt(iteration),
            params: values,
          },
          definition: { params: definitions, features, version },
        });
      }
      handleOldSnippetEvents(e, {
        setFeatures,
        setHash,
        setParams,
        setParamsDefinition,
      });
    };
    window.addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener, false);
    };
  }, []);

  const onIframeLoaded = useCallback(() => {
    if (ref.current) {
      const iframe = ref.current.getHtmlIframe();
      if (iframe) {
        iframe.contentWindow?.postMessage("fxhash_getInfo", "*");
        iframe.contentWindow?.postMessage("fxhash_getFeatures", "*");
        iframe.contentWindow?.postMessage("fxhash_getParams", "*");
        iframe.contentWindow?.postMessage("fxhash_getHash", "*");
      }
    }
  }, [ref]);

  const dispatchEvent = (id, data) => {
    if (!ref.current) return;
    ref.current.getHtmlIframe()?.contentWindow?.postMessage({ id, data }, "*");
  };

  const softUpdateParams = (params) => {
    state.update({ params });
    dispatchEvent("fxhash_params:update", { params });
  };

  return {
    onIframeLoaded,
    features: definition.features,
    params: state.params,
    hash: state.hash,
    iteration: state.iteration,
    minter: state.minter,
    paramsDefinition: definition.params,
    setHash,
    setIteration,
    setMinter,
    setParams,
    setFeatures,
    setParamsDefinition,
    runtime,
    dispatchEvent,
    softUpdateParams,
  };
}
