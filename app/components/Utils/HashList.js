import style from "./HashList.module.scss";
import effects from "../../styles/Effects.module.scss";
import cs from "classnames";
import { truncateMiddle } from "../../utils/strings";

export function HashList({
  hashes,
  iterations,
  params,
  className,
  onChange,
  onClickItem,
  activeItem,
  translateInputBytes,
}) {
  const removeItem = (idx) => {
    const cleanedHashes = [...hashes];
    cleanedHashes.splice(idx, 1);

    const cleanedIterations = [...iterations];
    cleanedIterations.splice(idx, 1);

    let cleanedParams;
    if (params) {
      cleanedParams = [...params];
      cleanedParams.splice(idx, 1);
    }
    onChange(cleanedHashes, cleanedIterations, cleanedParams);
  };

  return (
    <div className={cs(style.root, className)}>
      {hashes.map((hash, idx) => (
        <div
          key={idx}
          title="Load hash on the right"
          className={cs(style.hash, effects["drop-shadow-small"], {
            [style.active]: idx === activeItem,
          })}
        >
          <span
            onClick={() =>
              onClickItem?.(idx, hash, iterations?.[idx], params?.[idx])
            }
          >
            {hash}
            {params && (
              <>
                &nbsp;
                {translateInputBytes
                  ? translateInputBytes(params?.[idx]).toString()
                  : truncateMiddle(params?.[idx] || "", 48)}
              </>
            )}
          </span>
          <button
            type="button"
            className={cs(style.close_btn)}
            onClick={() => removeItem(idx)}
          >
            <i aria-hidden className="fas fa-times" />
          </button>
        </div>
      ))}
    </div>
  );
}
