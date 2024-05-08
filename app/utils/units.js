import { getMutezDecimalsNb } from "./math";

/**
 * Given a number in mutez, outputs a more readable format such as
 * 1.1K or 200.0K  etc...
 */
export function bigMutezFormatter(num, digits = 1) {
  if (num === 0) return "0";

  // Turn mutez into tez
  num = num * 0.000001;
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
  ];
  const item = lookup
    .slice()
    .reverse()
    .find((item) => {
      return num >= item.value;
    });

  // Increase the number of digits if under 100 tez
  if (num < 100) {
    digits++;
  }

  const div = item ? item.value : 1;

  return (num / div).toFixed(digits) + (item ? item.symbol : "");
}

/**
 * Given a number in mutez, outputs a string with decimals provided, if any
 */
export function displayMutez(mutez, maxDecimals) {
  let decimals = getMutezDecimalsNb(mutez);
  decimals = maxDecimals != null ? Math.min(maxDecimals, decimals) : decimals;
  const tez = mutez / 1000000;
  const dec = tez - Math.floor(tez);
  return (dec * 10 ** decimals) | (0 > 0)
    ? tez.toFixed(decimals)
    : Math.floor(tez);
}

export function displayRoyalties(royalties) {
  return (royalties / 10).toFixed(1) + "%";
}

/**
 * Given a number in the [0; 1] range, displays the percentage in an elegant manner
 */
export function displayPercentage(x, prettifyLow = true) {
  const x100 = x * 100;
  // If x100 < precision, return like it
  if (x100 < 0.0001 && prettifyLow) return "< 0.0001";

  let fixed = x100.toFixed(1);
  // Check if right part is made of 0's only
  let right = fixed.split(".").pop();
  if (right && parseInt(right) === 0) {
    return fixed.split(".")[0];
  } else {
    return fixed;
  }
}

export function prettyPrintBytes(size) {
  const units = ["B", "KB", "MB"];
  let s = size;
  for (const unit of units) {
    if (s < 1000) {
      return s.toFixed(0) + unit;
    }
    s /= 1024;
  }
  return s.toFixed(0) + "GB";
}
