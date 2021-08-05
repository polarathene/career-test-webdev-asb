import { useState, createContext, useContext } from 'react'
import { ZodError } from 'zod'
import schema, { CreditCard } from './schema'

export const ErrorContext = createContext<any>(undefined)
export const useErrorContext = () => useContext(ErrorContext)

function useErrorStatus<T>() {
  const [errors, setErrors] = useState<ZodError | undefined>();
  const hasError = (id: keyof T & string) => errors?.issues.some(err => err.path.includes(id))
  const getError = (id: keyof T & string) => errors?.issues.filter(err => err.path.includes(id))[0]

  return {
    setErrors,
    fieldMethods: {hasError, getError}
  }
}

// I could not make TS happy for _onValid with generic type `T` due to TS2345
// Used `T | any` until I have a better grasp of TS.
type onSubmit<T> = (
  _onValid: (data: T | any) => void,
  _onInvalid: (error: ZodError) => void
) => (e: React.FormEvent<HTMLFormElement>) => void

// Again had some TS typing issues with `useState()`. The error object doesn't exist initially,
// also accepting `undefined` seems to fix it, unclear if that's advised?
function useForm<T>() {
  const { setErrors, fieldMethods } = useErrorStatus<T>()
  const [isSubmitted, setSubmitStatus] = useState(false)
  const [isValid, setValid] = useState(false)

  const handleSubmit: onSubmit<T> = (_onValid, _onInvalid) => (e) => {
    e.preventDefault()

    setSubmitStatus(true)

    // Converts form data into object key/value pairs, but only if name attribute exists on the input
    const result = schema.safeParse(
      Object.fromEntries(new FormData(e.currentTarget))
    )

    if (!result.success) {
      setErrors(result.error)
      setValid(false)
      _onInvalid(result.error)
    } else {
      setErrors(undefined)
      setValid(true)
      _onValid(result.data)
    }
  }

  return {
    handleSubmit,
    formState: { isValid, isSubmitted },
    errorMethods: fieldMethods,
  }
}

function onInvalid(error: ZodError) {
  console.error(
    "Submission Failure:\n",
    error.issues
  )

  // Lists validation errors (value array) grouped by each form field (key)
  Object.entries(error.flatten().fieldErrors).forEach(([k, v]) => {
    console.warn(k, v)
  })
  // These errors relate to post-processing the data object,
  // after initial validation of each individual fields type passes:
  Object.entries(error.flatten().formErrors).forEach(([k, v]) => {
    console.warn(k, v)
  })
}

function onValid(data: CreditCard) {
  const expiry_date = `${data.cc_exp_month} / ${data.cc_exp_year}`

  // Remap to nicer object keys for viewing in console:
  console.log("Submission Successful!")
  console.log({
    card_number: data.cc_number,
    security_code: data.cc_csc,
    expiry_date,
  })

  // Do stuff... like post to an endpoint
}

export { useForm, onValid, onInvalid }