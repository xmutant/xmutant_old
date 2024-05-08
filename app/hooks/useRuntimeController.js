import { merge, cloneDeep, debounce } from "lodash";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  RefObject,
} from "react";
import { generateXmHash } from "../utils/hash";

import {
  IRuntimeContext,
  TExecutionContext,
  hashRuntimeHardState,
  hashRuntimeState,
  useRuntime,
} from "./useRuntime";

import {
  buildParamsObject,
  serializeParams,
  serializeParamsOrNull,
  fxParamsAsQueryParams,
} from "../components/FxParams/utils";

// import { useRouter, useSearchParams } from "next/router"
import { useMessageListener } from "./useMessageListener";
import { ipfsUrlWithHashAndParams } from "../utils/ipfs";
/**
 * The Runtime Controller provides a low-level API to interact with an iframe
 * and control its runtime with granularity.
 * It is responsible for handling the state of the runtime as well as the state
 * being manipulated ensuring a proper sync of the <iframe> with the params
 * when needed, depending on the viewing settings and the param settings.
 */

function handleOldSnippetEvents(e, useRuntime) {
  if (e.data) {
    if (e.data.id === "fxhash_getHash") {
      if (e.data.data) {
        runtime.state.update({ hash: e.data.data });
      } else {
      }
    }
    if (e.data.id === "fxhash_getFeatures") {
      if (e.data.data) {
        runtime.definition.update({ features: e.data.data });
      } else {
        runtime.definition.update({ features: null });
      }
    }
    if (e.data.id === "fxhash_getParams") {
      if (e.data.data) {
        const { definitions, values } = e.data.data;
        if (definitions) {
          runtime.update({
            state: {
              params: values,
            },
            definition: {
              params: definitions,
            },
          });
        }
      } else {
        runtime.update({
          state: {
            params: {},
          },
          definition: {
            params: null,
          },
        });
      }
    }
  }
}

const iframeHandler = (iframeRef) => {
  let lastUrl = "";

  return {
    getUrl(state, urlParams) {
      const searchParams = urlParams?.toString();
      return (
        ipfsUrlWithHashAndParams(state.cid, {
          xmhash: state.hash || "",
          xmiteration: state.iteration || 1,
          xmminter: state.minter || "",
          xmparams: state.inputBytes,
          xmcontext: state.context,
          xmParamsAsQueryParams: fxParamsAsQueryParams(state.snippetVersion),
        }) + (searchParams ? `?${searchParams}` : "")
      );
    },
    useSync(runtimeUrl, controlsUrl) {
      // every time the runtime URL changes, refresh the iframe
      useEffect(() => {
        const iframe = iframeRef.current?.getHtmlIframe();
        if (iframe && lastUrl !== runtimeUrl) {
          iframe.contentWindow?.location.replace(runtimeUrl);
          lastUrl = runtimeUrl;
        }
      }, [runtimeUrl]);
    },
  };
};

const defaultRuntimeOptions = {
  autoRefresh: false,
  contextConnector: iframeHandler,
};

export const useRuntimeController = (ref, project, opts) => {
  // const router = useRouter()

  // options
  const options = { ...defaultRuntimeOptions, ...opts };

  // the runtime state -> controls the state connected to the iframe
  const runtime = useRuntime({
    state: {
      hash: project.hash || generateXmHash(),
      minter: project.minter || "",
      iteration: project.iteration || 1,
      context: project.context,
    },
    definition: {
      version: project.snippetVersion,
    },
  });

  useEffect(() => {
    if (!project.minter) return;
    if (runtime.state.minter !== project.minter)
      runtime.state.update({
        minter: project.minter || "",
      });
  }, [project.minter, runtime.state.minter]);

  // the control state -> used to control the iframe
  const [controls, setControls] = useState({
    params: {
      definition: null,
      values: {},
    },
  });

  // a connector is usedd to interact with the iframe - can be usefull for edge
  // cases such as with the sandbox
  const connector = useMemo(
    () => options.contextConnector(ref),
    [options.contextConnector, ref]
  );

  // add a listener for receiving infos from the iframe
  useEffect(() => {
    const listener = (e) => {
      if (e.data.id === "fxhash_getInfo") {
        const {
          version,
          params: { definitions, values },
          minter,
          features,
          hash,
        } = e.data.data;
        runtime.update({
          state: { hash, minter, params: values },
          definition: { params: definitions, features, version },
        });
      }
      // handle deprecated events from old snippet
      handleOldSnippetEvents(e, runtime);
    };
    window.addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener, false);
    };
  }, []);

  // trigger the dispatch of events to get project details
  useEffect(() => {
    const iframe = ref.current?.getHtmlIframe();
    if (iframe) {
      const onload = () => {
        iframe.contentWindow?.postMessage("fxhash_getInfo", "*");
        // handle deprecated events from old snippet
        iframe.contentWindow?.postMessage("fxhash_getFeatures", "*");
        iframe.contentWindow?.postMessage("fxhash_getParams", "*");
        iframe.contentWindow?.postMessage("fxhash_getHash", "*");
      };
      iframe.addEventListener("load", onload, true);
      return () => iframe.removeEventListener("load", onload, true);
    }
  }, [ref]);

  // whenever a change in the params definition is observed, the params control
  // object is refreshed and rebuilt: ensure consistancy
  useEffect(() => {
    setControls({
      ...controls,
      params: {
        definition: runtime.definition.params,
        values: runtime.definition.params
          ? buildParamsObject(runtime.definition.params, runtime.state.params)
          : {},
      },
    });
  }, [runtime.details.definitionHash.params]);

  // const updateQueryParams = ({ xmhash, fxparams }) =>
  //   router.replace(
  //     {
  //       query: {
  //         ...router.query,
  //         xmhash,
  //       },
  //       hash: `0x${fxparams}`,
  //     },
  //     undefined,
  //     { shallow: true }
  //   )

  // whenever the runtime state changes, update the query params
  // useEffect(() => {
  //   updateQueryParams({
  //     xmhash: runtime.state.hash,
  //     fxparams: runtime.details.params.inputBytes || project.inputBytes || "",
  //   })
  // }, [runtime.state.hash, runtime.details.params.inputBytes])

  const dispatchEvent = (id, data) => {
    if (!ref.current) return;
    ref.current.getHtmlIframe()?.contentWindow?.postMessage({ id, data }, "*");
  };

  // state update debounce - uses a ref to ensure debounce is proper
  const stateUpdateRef = useRef(runtime.state.update);
  stateUpdateRef.current = runtime.state.update;
  const updtParamsDeb = useCallback(
    debounce((params) => stateUpdateRef.current?.(params), 200),
    []
  );

  const softUpdateParams = (params) => {
    updtParamsDeb({ params });
    dispatchEvent("fxhash_params:update", { params });
  };

  // generic update, used to manipulated the control state, eventually soft
  // refresh the "sync" parameters
  // forceRefresh will circumvent any sync param rule and force a refresh of the
  // runtime state
  const updateParams = (update, forceRefresh = false) => {
    // find the params which have changed and are "synced"
    const changed = Object.keys(update)
      .filter((id) => controls.params.values[id] !== update[id])
      .map((id) => controls.params.definition?.find((d) => d.id === id));
    // params that are "synced"
    const synced = changed.filter((def) => def.update === "sync");
    // if at least a change, soft refresh
    if (Object.keys(synced).length > 0) {
      softUpdateParams(
        Object.fromEntries(synced.map((def) => [def.id, update[def.id]]))
      );
    }
    if (!forceRefresh) {
      // if auto-refresh is defined, we update params on the runtime (will only)
      // reload the hard params
      if (options.autoRefresh) {
        updtParamsDeb({
          params: update,
        });
      }
    } else {
      runtime.state.update({ params: update });
    }
    // in any case, refresh the control state
    setControls(
      merge(cloneDeep(controls), {
        params: {
          values: update,
        },
      })
    );
  };

  // derive active URL that should be loaded in the iframe
  const url = useMemo(() => {
    return connector.getUrl(
      {
        cid: project.cid,
        hash: runtime.state.hash,
        minter: runtime.state.minter,
        iteration: runtime.state.iteration,
        inputBytes: runtime.details.params.inputBytes || project.inputBytes,
        context: runtime.state.context,
        snippetVersion: runtime.definition.version || "",
      },
      options?.urlParams
    );
  }, [project.cid, runtime.details.stateHash.hard, options.urlParams]);

  useMessageListener("fxhash_emit:params:update", (e) => {
    const { params } = e.data.data;
    updateParams(params);
    updtParamsDeb({ params });
  });

  const controlDetails = useMemo(
    () => ({
      params: {
        inputBytes: serializeParamsOrNull(
          controls.params.values,
          controls.params.definition || []
        ),
      },
      stateHash: {
        soft: hashRuntimeState({
          hash: runtime.state.hash,
          iteration: runtime.state.iteration,
          minter: runtime.state.minter,
          params: controls.params.values,
          context: runtime.state.context,
        }),
        hard: hashRuntimeHardState(
          {
            hash: runtime.state.hash,
            iteration: runtime.state.iteration,
            minter: runtime.state.minter,
            params: controls.params.values,
            context: runtime.state.context,
          },
          controls.params.definition
        ),
      },
    }),
    [controls, runtime]
  );

  const controlsUrl = useMemo(() => {
    return connector.getUrl(
      {
        cid: project.cid,
        hash: runtime.state.hash,
        iteration: runtime.state.iteration,
        minter: runtime.state.minter,
        inputBytes: controlDetails.params.inputBytes || project.inputBytes,
        context: runtime.state.context,
        snippetVersion: runtime.definition.version || "",
      },
      options?.urlParams
    );
  }, [project.cid, runtime.details.stateHash.soft, controls.params]);

  // every time the URL changes, refresh the iframe
  connector.useSync(url, controlsUrl);

  const refresh = useCallback(() => {
    ref.current?.getHtmlIframe()?.contentWindow?.location.replace(controlsUrl);
  }, [controlsUrl]);

  const hardSync = () => {
    runtime.update({
      state: {
        params: controls.params.values,
      },
    });
    refresh();
  };

  return {
    runtime,
    controls: {
      state: controls,
      details: controlDetails,
      updateParams,
      dispatchEvent,
      hardSync,
      refresh,
    },
    details: {
      activeUrl: url,
      controlsUrl,
      runtimeSynced:
        runtime.details.stateHash.hard === controlDetails.stateHash.hard,
    },
  };
};
