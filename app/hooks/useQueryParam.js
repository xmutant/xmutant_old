// import { useRouter } from "next/router";
import { useState } from "react";
import useEffectAfterRender from "./useEffectAfterRender";

const defaultQueryParamParse = (value) => JSON.parse(decodeURIComponent(value));

const defaultQueryParamSerialize = (value) => encodeURIComponent(JSON.stringify(value));

const useQueryParam = (param, defaultValue, parse = defaultQueryParamParse, serialize = defaultQueryParamSerialize) => {
//   const router = useRouter();
//   const { [param]: paramValue } = router.query;
  const [value, setValue] = useState(paramValue ? parse(paramValue) : defaultValue);

  const isParamDefined = (value) => {
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  };

  const setQueryParam = (newValue) => {
    // const { [param]: _, ...rest } = router.query;
    // router.replace(
    //   {
    //     query: {
    //       ...rest,
    //       ...(isParamDefined(newValue) ? { [param]: serialize(newValue) } : {}),
    //     },
    //   },
    //   undefined,
    //   { shallow: true }
    // );
  };

  useEffectAfterRender(() => {
    setQueryParam(value);
  }, [value]);

  return [value, setValue];
};

export default useQueryParam;
