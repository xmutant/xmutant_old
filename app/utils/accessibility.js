export const onKeydownAccessibleButton =
  (callback) => (e) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
      callback(e.target)
    }
  }
