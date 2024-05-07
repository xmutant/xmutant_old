import style from "./Select.module.scss";
import effects from "../../styles/Effects.module.scss";
import cs from "classnames";
import React, { useState, useMemo, useEffect, useRef } from "react";
import InputText from "./InputText";
import useClickOutside from "../../hooks/useClickOutside";

export const Select = ({
  options,
  value,
  onChange,
  placeholder,
  className,
  classNameRoot,
  search = false,
  searchKeys,
  searchDictionnary,
  searchValue,
  ...props
}) => {
  const selectRef = useRef(null);
  const [searchString, setSearchString] = useState("");
  const searcherRef = useRef(null);
  const [searchResults, setSearchResults] = useState(null);
  const searchRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [direction, setDirection] = useState("bottom");

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value) || options[0];
  }, [value]);

  const toggleOpened = () => {
    if (!opened && selectRef.current) {
      const bounds = selectRef.current.getBoundingClientRect();
      setDirection(window.innerHeight - bounds.bottom < 250 ? "top" : "bottom");
    }
    setOpened(!opened);
  };

  const updateValue = (val) => {
    onChange(val);
    setOpened(false);
  };

  useEffect(() => {
    if (opened && searchRef.current) {
      searchRef.current.focus();
    }
  }, [opened]);

  useEffect(() => {
    if (search && searcherRef.current) {
      if (searchString.length > 0) {
        const results = searcherRef.current.search(searchString);
        const found = [];
        for (const result of results) {
          const f = options.find((opt) => opt.value === result[searchValue || "value"]);
          if (f) found.push(f);
        }
        setSearchResults(found);
      } else {
        setSearchResults(null);
      }
    }
  }, [searchString]);

  const displayOptions = searchResults || options;

  useClickOutside(selectRef, () => setOpened(false), !opened);

  return (
    <>
      <div
        className={cs(style.root, style[`opening_${direction}`], classNameRoot)}
        ref={selectRef}
      >
        <button
          className={cs(style.select, className, { [style.opened]: opened })}
          onClick={toggleOpened}
          type="button"
        >
          {placeholder && value === "" ? (
            <>
              <div className={cs(style.placeholder)}>{placeholder}</div>
              <div aria-hidden="true" className={cs(style.sizer)}>
                {placeholder}
              </div>
            </>
          ) : (
            <div className={style.value}>{selectedOption.label}</div>
          )}
          {options.map((opt, idx) => (
            <div key={idx} aria-hidden="true" className={cs(style.sizer)}>
              {opt.label}
            </div>
          ))}
        </button>

        {opened && (
          <div
            className={cs(style.options, effects["drop-shadow-big"], {
              [style.has_search]: search,
            })}
          >
            {search && (
              <InputText
                value={searchString}
                onChange={(evt) => setSearchString(evt.target.value)}
                placeholder="Search..."
                ref={searchRef}
                className={cs(style.search, effects["drop-shadow-big"])}
              />
            )}
            <div className={cs(style.options_wrapper)}>
              <div>
                {displayOptions.map((option, idx) => (
                  <button
                    key={idx}
                    className={cs(style.option)}
                    onClick={() => updateValue(option.value)}
                    disabled={option.disabled}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Select;
