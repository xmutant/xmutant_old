export const transformSplitsEqual = (splits, index) => {
  return Math.floor(1000 / splits.length)
}

export const transformSplitsSum1000 = (splits, index) => {
  return (
    Math.floor(1000 / splits.length) + (index < 1000 % splits.length ? 1 : 0)
  )
}

export const transformSplitsAccessList = (
  splits,
  index
) => {
  return splits[index].pct
}
