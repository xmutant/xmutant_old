const charSet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

export const generateFxHash = () =>
  "xm" +
  Array(49)
    .fill(0)
    .map((_) => charSet[(Math.random() * charSet.length) | 0])
    .join("");
