import style from "./Tabs.module.scss"
import cs from "classnames"
import React, {
 
  useEffect,
  useRef,
} from "react"
import Link, { LinkProps } from "next/link"
import { onKeydownAccessibleButton } from "../../utils/accessibility"

const DefaultTabWrapper = ({
  children,
  ...props
}) => (
  <div {...props}>{children}</div>
)

export const LinkTabWrapper = ({
  children,
  onClick,
  ...props
}) => (
  <Link {...props}>
    <a className={props.className} onClick={onClick}>
      {children}
    </a>
  </Link>
)


export function Tab({
  definition,
  layout,
  active,
  wrapperComponent,
  onClick,
}) {
  const Wrapper = wrapperComponent || DefaultTabWrapper
  return (
    <Wrapper
      className={cs(style.tab, style[`tab-${layout}`], {
        [style.active]: active,
        ["tab-active"]: active,
        [style.disable_click]: !onClick,
      })}
      onClick={onClick}
      {...definition.props}
      role="button"
      tabIndex={0}
      onKeyDown={onClick ? onKeydownAccessibleButton(onClick) : undefined}
    >
      {definition.name}
    </Wrapper>
  )
}


export const checkIsTabKeyActive = (def, activeIdx) =>
  def.key === activeIdx

/**
 * The Tabs module takes a list of Tab Definitions, an active tab index N, and only renders the
 * N-th component in its children list. Component is uncontrolled to allow for Controller
 * components to usee it higher in the hierarchy
 */
export function Tabs({
  className,
  tabDefinitions,
  tabsLayout = "full-width",
  activeIdx,
  checkIsTabActive,
  tabsClassName,
  onClickTab,
  contentClassName,
  tabWrapperComponent,
  children,
}) {
  const refContainer = useRef(null)
  useEffect(() => {
    const elContainer = refContainer.current
    if (elContainer) {
      const elNav = elContainer.querySelector("nav")
      const elActive =
        elContainer.querySelector(".tab-active")
      if (
        elNav &&
        elActive &&
        elActive.offsetLeft + elActive.clientWidth > elContainer.clientWidth
      ) {
        const paddingLeft = window
          ? parseFloat(
              window
                .getComputedStyle(elNav, null)
                .getPropertyValue("padding-left")
            )
          : 0
        elContainer.scrollLeft =
          elActive.offsetLeft - elContainer.offsetLeft - paddingLeft
      }
    }
  }, [])
  return (
    <div
      ref={refContainer}
      className={cs(style.container, style[`layout-${tabsLayout}`], className)}
    >
      <nav className={cs(tabsClassName)}>
        {tabDefinitions.map((def, idx) => {
          const isActive = checkIsTabActive
            ? checkIsTabActive(def, activeIdx, idx)
            : idx === activeIdx
          const onClick = onClickTab ? () => onClickTab?.(idx, def) : undefined
          return (
            <Tab
              key={idx}
              active={isActive}
              definition={def}
              layout={tabsLayout}
              wrapperComponent={tabWrapperComponent}
              onClick={onClick}
            />
          )
        })}
      </nav>
    </div>
  )
}
