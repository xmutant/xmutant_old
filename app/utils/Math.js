// Clamps a value x in the range [min, max]
export const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

export const lerp = (a, b, t) => (b - a) * t + a;

export function getMutezDecimalsNb(x) {
  const mu = Math.floor(Math.abs(x));
  const st = (mu / 1000000).toString();
  const split = st.split(".");
  return split.length > 1 ? (split.pop()?.length || 0) : 0;
}

export function floorToDecimalNb(nb, decimals) {
  const coeff = Math.pow(10, decimals);
  return Math.floor(nb * coeff) / coeff;
}

export function getDecimalsNumber(x) {
  return x.toString().split(".").pop()?.length || 0;
}

export function isPositive(value) {
  return typeof value !== "undefined"
    ? value >= parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE || "0")
    : true;
}

export function getNumberWithOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const getDailyHarbergerTax = (price) => {
  return price * 0.0014;
};
export function getMintTicketHarbergerTax(price, days) {
  return getDailyHarbergerTax(price) * days;
}
export function getDaysCoveredByHarbergerTax(totalTaxPaid, price) {
  return totalTaxPaid / getDailyHarbergerTax(price);
}
export const getTaxPaidUntil = (taxationLocked, taxationStart, price) => {
  const numberOfDaysCovered = getDaysCoveredByHarbergerTax(
    taxationLocked,
    price
  );
  return new Date(
    taxationStart.getTime() + numberOfDaysCovered * 24 * 60 * 60 * 1000
  );
};
