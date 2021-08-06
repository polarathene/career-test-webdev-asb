import { useState, createContext, useContext } from 'react'
import { ZodError, ZodSchema } from 'zod'

export const ErrorContext = createContext<any>(undefined)
export const useErrorContext = () => useContext(ErrorContext)

function useErrorStatus<T>() {
  const [errors, setErrors] = useState<ZodError<T> | undefined>();
  const hasError = (id: keyof T & string) => errors?.issues.some(err => err.path.includes(id))
  const getError = (id: keyof T & string) => errors?.issues.filter(err => err.path.includes(id))[0]

  return {
    setErrors,
    fieldMethods: {hasError, getError}
  }
}

function useForm<T>(schema: ZodSchema<T, any, any>) {
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

type onSubmit<T> = (
  _onValid: (data: T) => void,
  _onInvalid: (error: ZodError<T>) => void
) => (e: React.FormEvent<HTMLFormElement>) => void

export { useForm }