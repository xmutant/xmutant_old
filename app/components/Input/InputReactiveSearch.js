import style from "./InputReactiveSearch.module.scss";
import cs from "classnames";
import React, { useRef, useState } from "react";
import useAsyncEffect from "use-async-effect";
import { InputText } from "./InputText";
import { Cover } from "../Utils/Cover";

function InputReactiveSearch({
  value,
  keyboardSelectedIdx,
  onChange,
  hideInput,
  hideNoResults,
  placeholder,
  searchFn,
  transformSearchResults,
  valueFromResult,
  debounceDuration = 250,
  className,
  classNameResults,
  RenderResults = DefaultResultsRenderer,
  children,
}) {
  const timeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [hideResults, setHideResults] = useState(false);
  const [selectedValue, setSelectedValue] = useState();

  useAsyncEffect(
    async (isMounted) => {
      if (timeout.current != null) {
        window.clearTimeout(timeout.current);
      }
      if (value.length < 3 || value === selectedValue) {
        setResults(null);
        if (value.length < 3) {
          setSelectedValue(undefined);
        }
        return;
      }
      timeout.current = window.setTimeout(async () => {
        if (isMounted()) {
          setLoading(true);
          setSelectedValue(undefined);
        }
        const results = await searchFn(value);
        const items = transformSearchResults(results);
        if (isMounted()) {
          setLoading(false);
          setHideResults(false);
          setResults(items);
        }
      }, debounceDuration);
    },
    [value]
  );

  return (
    <div className={cs(style.root, className)}>
      {!hideInput && (
        <InputText
          value={value}
          onChange={(evt) => onChange(evt.target.value, false)}
          placeholder={placeholder}
          className={style.input_search}
          onFocus={() => hideResults && setHideResults(false)}
        />
      )}
      {!loading && results?.length === 0 && !hideNoResults && (
        <div className={cs(style.no_results)}>
          This search yielded 0 result{" "}
          <i className="fa-solid fa-face-frown-open" aria-hidden />
        </div>
      )}
      <RenderResults
        results={results}
        value={value}
        onChange={onChange}
        hideResults={hideResults}
        onChangeHideResults={setHideResults}
        classNameResults={classNameResults}
        valueFromResult={valueFromResult}
        selectedValue={selectedValue}
        onChangeSelectedValue={setSelectedValue}
        keyboardSelectedIdx={keyboardSelectedIdx}
      >
        {children}
      </RenderResults>
    </div>
  );
}

function DefaultResultsRenderer({
  results,
  value,
  onChange,
  hideResults,
  onChangeHideResults,
  classNameResults,
  valueFromResult,
  selectedValue,
  keyboardSelectedIdx,
  onChangeSelectedValue,
  children,
}) {
  return results && results.length > 0 && !hideResults ? (
    <>
      <div className={cs(style.results_wrapper)}>
        <div className={cs(style.results, classNameResults)}>
          {results.map((result, idx) => (
            <button
              key={result.id}
              type="button"
              className={cs(style.result, {
                [style.result_keyboard_selected]:
                  keyboardSelectedIdx !== undefined &&
                  keyboardSelectedIdx === idx,
              })}
              onClick={() => {
                const nval = valueFromResult(result);
                onChangeSelectedValue(nval);
                onChange(nval, true);
                if (value === nval) {
                  onChangeHideResults(true);
                }
              }}
            >
              {children?.({
                item: result,
              })}
            </button>
          ))}
        </div>
      </div>
      <Cover index={1} opacity={0} onClick={() => onChangeHideResults(true)} />
    </>
  ) : null;
}

export default InputReactiveSearch;
