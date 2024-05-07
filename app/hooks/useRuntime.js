import { useMemo, useState } from "react";
import sha1 from "sha1";
import { merge, cloneDeep } from "lodash";
import { jsonStringifyBigint, serializeParamsOrNull, sumBytesParams } from "../components/FxParams/utils";

export function hashRuntimeState(state) {
  return sha1(jsonStringifyBigint(state));
}

export function hashRuntimeHardState(state, definition) {
  const staticParams = {};
  for (const id in state.params) {
    const def = definition?.find((def) => def.id === id);
    if (!def || !def.update || def.update === "page-reload") {
      staticParams[id] = state.params[id];
    }
  }
  return hashRuntimeState({
    ...state,
    params: staticParams,
  });
}

export function useRuntime(initial) {
  const [whole, setWhole] = useState({
    state: {
      hash: "",
      minter: "",
      iteration: 1,
      params: {},
      ...(initial?.state || {}),
    },
    definition: {
      params: null,
      version: null,
      features: null,
      ...(initial?.definition || {}),
    },
  });

  const { state, definition } = whole;

  const updateState = (state) => {
    setWhole((existingState) => merge(cloneDeep(existingState), { state }));
  };

  const updateDefinition = (definition) => {
    setWhole((existingState) => merge(cloneDeep(existingState), { definition }));
  };

  const update = (data) => {
    setWhole((existingState) => merge(cloneDeep(existingState), data));
  };

  const definitionEnhanced = useMemo(() => ({
    ...definition,
    params: definition.params?.map((p) => ({
      ...p,
      ...(definition.version && { version: definition.version }),
    })) || null,
  }), [definition]);

  return {
    state: {
      ...state,
      update: updateState,
    },
    definition: {
      ...definitionEnhanced,
      update: updateDefinition,
    },
    update: update,
    details: useMemo(() => ({
      params: {
        inputBytes: serializeParamsOrNull(state.params, definitionEnhanced.params || []),
        bytesSize: sumBytesParams(definitionEnhanced.params || []),
      },
      stateHash: {
        soft: hashRuntimeState(state),
        hard: hashRuntimeHardState(state, definitionEnhanced.params),
      },
      definitionHash: {
        params: sha1(jsonStringifyBigint(definitionEnhanced.params)),
      },
    }), [state, definitionEnhanced.params]),
  };
}
