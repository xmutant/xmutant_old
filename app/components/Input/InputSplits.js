import style from "./InputSplits.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"

// import { InputSearchUser } from "./InputSearchUser"
import {  useMemo, useState } from "react"
// import { isTezosAddress } from "../../utils/strings"
import { Button } from "../Button"
// import { UserFromAddress } from "../User/UserFromAddress"
// import { UserBadge } from "../User/UserBadge"
import { InputText } from "./InputText"
import {
  transformSplitsEqual,
  TSplitsTransformer,
} from "../../utils/transformers/splits"
import { ButtonDelete } from "../Button/ButtonDelete"
import { displayPercentage } from "../../utils/units"
import { cloneDeep } from "@apollo/client/utilities"

/**
 * A component to define a list of splits (basically a list of (address, nat))
 * They are mostly used to define the primary/secondary splits for Generative
 * Tokens but it can also be used to define the collaboration contract shares.
 */
export function InputSplits({
  className,
  value,
  onChange,
  unremoveableAddresses = [],
  sharesTransformer = transformSplitsEqual,
  textShares = "Shares",
  defaultShares = 0,
  showPercentages = true,
  errors,
  children,
  readOnly,
}) {
  // the pkh of the input
  const [pkh, setPkh] = useState("")

  // compute the sum of the shares
  const sum = useMemo(() => {
    const S = value.reduce((a, b) => a + parseInt(b.pct), 0)
    return isNaN(S) ? false : S
  }, [value])

  // updates the split and forces the shares to match, if defined
  const update = (splits) => {
    onChange?.(
      splits.map((split, idx) => ({
        address: split.address,
        pct: sharesTransformer(splits, idx),
      }))
    )
  }

  const addAddress = (address) => {
    update([
      ...value,
      {
        address: address,
        pct: defaultShares,
      },
    ])
  }

  const addAddresses = (addresses) => {
    update([
      ...value,
      ...addresses.map((address) => ({
        address,
        pct: defaultShares,
      })),
    ])
  }

  const addSplits = (splits) => {
    const nsplits = cloneDeep(value)
    for (const split of splits) {
      const F = nsplits.find((s) => s.address === split.address)
      if (F) {
        F.pct += split.pct
      } else {
        nsplits.push(split)
      }
    }
    onChange?.(nsplits)
  }

  const add = (address) => {
    address = address ?? pkh
    if (!value.find((split) => split.address === address)) {
      addAddress(address)
    }
    setPkh("")
  }

  const remove = (address) => {
    update(value.filter((split) => split.address !== address))
  }

  const updateShare = (address, share) => {
    const nsplits = [...value]
    const target = nsplits.find((split) => split.address === address)
    if (target) {
      target.pct = share
      onChange?.(nsplits)
    }
  }

  // given the index of split, outputs the error related to the share if any
  const getShareError = (idx) => {
    if (!errors || typeof errors === "string") return undefined
    const err = errors[idx]
    if (!err) return undefined
    return err.pct || undefined
  }

  return (
    <>
      <table className={cs(style.splits, className)}>
        <thead>
          <tr>
            <td>User</td>
            <td className={cs(style.share_cell)}>
              {value.length > 0 ? textShares : ""}
            </td>
            {showPercentages && <td>Equivalent in %</td>}
            {!readOnly && <td width={107}></td>}
          </tr>
        </thead>
        <tbody>
          {value.map((split, idx) => {
            const shareError = getShareError(idx)
            return (
              <tr key={split.address}>
                <td className={cs(style.user_cell)}>
                  {/* <UserFromAddress address={split.address}>
                    {({ user }) => (
                      <UserBadge
                        size="small"
                        user={user}
                        hasLink={false}
                        displayAddress
                      />
                    )}
                  </UserFromAddress> */}
                </td>
                <td
                  className={cs(style.share_cell, {
                    [style.error]: !!shareError,
                  })}
                >
                  <InputText
                    value={split.pct}
                    onChange={(evt) =>
                      updateShare(split.address, evt.target.value )
                    }
                    type="text"
                    min={1}
                    max={1000}
                    step={1}
                    error={!!shareError}
                  />
                  {shareError && (
                    <span className={cs(text.error)}>{shareError}</span>
                  )}
                </td>
                {showPercentages && (
                  <td className={cs(style.percentage)}>
                    {sum === false
                      ? "/"
                      : displayPercentage(
                          parseInt(split.pct ) / sum,
                          false
                        ) + "%"}
                  </td>
                )}
                {!readOnly && (
                  <td width={107}>
                    {!unremoveableAddresses.includes(split.address) && (
                      <ButtonDelete onClick={() => remove(split.address)} />
                    )}
                  </td>
                )}
              </tr>
            )
          })}

          {!readOnly && (
            <tr>
              <td className={cs(style.input_cell)} colSpan={4}>
                <div className={cs(style.add_container)}>
                  {/* <InputSearchUser
                    value={pkh}
                    onChange={(value, autofill) => {
                      if (autofill) {
                        add(value)
                      } else {
                        setPkh(value)
                      }
                    }}
                    className={style.address_input}
                    classNameResults={style.search_results}
                  /> */}
                  <Button
                    size="regular"
                    type="button"
                    color="transparent"
                    iconComp={
                      <i aria-hidden className="fa-solid fa-circle-plus" />
                    }
                    onClick={() => add()}
                  >
                    add
                  </Button>
                </div>
              </td>
            </tr>
          )}

          {children && (
            <tr>
              <td colSpan={4}>
                {children({
                  addAddress,
                  addAddresses,
                  addSplits,
                })}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
