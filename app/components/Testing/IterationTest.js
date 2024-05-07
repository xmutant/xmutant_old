import style from "./IterationTest.module.scss"
import cs from "classnames"
import { InputText } from "../Input/InputText"
import { Button } from "../Button"
import { useEffect, useState, useRef } from "react"
import { Field } from "../Form/Field"



export function IterationTest({
  onIterationUpdate,
  value,
  autoGenerate = true,
}) {
  const [error, setError] = useState()
  const iterationInputRef = useRef(null)

  const isIterationValid = (iteration) => iteration >= 1

  // when it mounts, generates a iteration and send it upwards
  useEffect(() => {
    if (autoGenerate) {
      onIterationUpdate(1)
    }
  }, [autoGenerate, onIterationUpdate])

  const increment = () => {
    setError(undefined)
    onIterationUpdate((value || 1) + 1)
  }

  const decrement = () => {
    setError(undefined)
    onIterationUpdate(Math.max((value || 1) - 1, 1))
  }

  const manualIterationUpdate = (iteration) => {
    if (isIterationValid(iteration)) {
      setError(undefined)
      onIterationUpdate(iteration)
    } else {
      setError("You can only paste a valid iteration")
    }
  }

  return (
    <div className={cs(style.container)}>
      <Field error={error}>
        <small>Current iteration</small>
        <div className={style.iterationInputContainer}>
          <Button size="small" color="black" onClick={decrement} type="button">
            -
          </Button>
          <InputText
            className={cs(style.iterationInput)}
            ref={iterationInputRef}
            type="number"
            value={value || 0}
            onChange={(evt) =>
              manualIterationUpdate(parseInt(evt.target.value))
            }
            onFocus={() =>
              iterationInputRef.current && iterationInputRef.current.select()
            }
            onClick={() =>
              iterationInputRef.current && iterationInputRef.current.select()
            }
          />
          <Button size="small" color="black" onClick={increment} type="button">
            +
          </Button>
        </div>
      </Field>
    </div>
  )
}
