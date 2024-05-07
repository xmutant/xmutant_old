import React, { HTMLAttributes, PropsWithChildren } from "react"



export const ButtonOrLink = React.forwardRef(({ isLink, ...props }, ref) => {
  return isLink ? <a ref={ref} {...props} /> : <button ref={ref} {...props} />
})
ButtonOrLink.displayName = "ButtonOrLink"
