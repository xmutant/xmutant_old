import * as Yup from "yup"

export const YupOneOrMore = Yup.number()
  .typeError("Valid number plz")
  .required("Required")
  .test(">= 1", "Must be positive", (val) => {
    return val === undefined || val >= 1
  })
