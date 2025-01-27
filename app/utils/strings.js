/**
 * Truncates a string [str] in the middle so that the total length of the both sides is
 * equal to [length] / 2. [join] is added between the sides
 * If string.length <= [length], returns string
 */
export function truncateMiddle(str, length, join = "...") {
  if (str.length <= length) return str;
  const sl = (length * 0.5) | 0;
  return str.slice(0, sl) + join + str.slice(-sl);
}

/**
 * Truncates a string at the end if its length is > maxLength
 * @param str a string from which a may need to be truncated
 * @param maxLength the maximum length the string can have
 * @param append optional string section to add at the end of the truncated string
 * @returns either the whole string if length < maxLength or a truncated section if not
 */
export function truncateEnd(str, maxLength, append = "...") {
  if (str.length > maxLength) {
    str = str.slice(0, maxLength) + append;
  }
  return str;
}

export function tagsFromString(str) {
  return str
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Is a string a tezos address ?
 */

export function countWords(str) {
  return str.match(/\w+/g)?.length || 0;
}

export function stringBytesSize(str) {
  return new Blob([str]).size;
}

export function plural(nb) {
  return nb === 1 ? "" : "s";
}
