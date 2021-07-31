import styles from './styles.module.scss'
import Input from './components/input'
import schema, { CreditCard } from './schema'
import { ZodError } from 'zod'
import { useState } from 'react'

export const Form = () => {
  const {errors, handleSubmit} = useForm<CreditCard>()

  return (
    <form className={styles.form} onSubmit={handleSubmit(onValid, onInvalid)}>
      <div className={styles.cc_number}>
        <Input id="cc_number" label="Card Number" />
      </div>

      <fieldset className={styles.cc_exp}>
        <legend>Expiry Date (MM / YY):</legend>
        <Input id="cc_exp_month" maxLength={2} />
        <span>/</span>
        <Input id="cc_exp_year" maxLength={2} />
      </fieldset>

      <div className={styles.cc_csc}>
        <Input id="cc_csc" maxLength={4} label="Security Code" />
      </div>

      <button className={styles.submit} type="submit">Submit</button>

      { errors ? <ErrorList errors={errors} /> : null }
    </form>
  )
}

const ErrorList: React.FC<ErrorListProps> = ({errors}) => (
  <div className={styles.errors}>
    <h2>Error</h2>
    <p><em>Unable to submit details due to the following:</em></p>
    <ul>
      <ErrorItem id="cc_number"    label="Card Number"   errors={errors} />
      <ErrorItem id="cc_exp_month" label="Expiry Month"  errors={errors} />
      <ErrorItem id="cc_exp_year"  label="Expiry Year"   errors={errors} />
      <ErrorItem id="cc_csc"       label="Security Code" errors={errors} />
    </ul>
  </div>
)

const ErrorItem: React.FC<ErrorItemProps> = ({errors, id, label}) => {
  const error = errors?.issues.filter(err => err.path.includes(id))

  return error && error.length > 0 ? (
    <li>
      <span>{label}</span>
      {error.map(err =>
      <span>{err.message}</span>
      )}
    </li>
  ) : null
}

type ErrorListProps = {
  errors?: ZodError<CreditCard>
}

type ErrorItemProps = {
  id: keyof CreditCard
  label: string
  errors?: ZodError<CreditCard>
}

/* === form onSubmit === */

// I could not make TS happy for _onValid with generic type `T` due to TS2345
// Used `T | any` until I have a better grasp of TS.
type onSubmit<T> = (
  _onValid: (data: T | any) => void,
  _onInvalid: (error: ZodError) => void
) => (e: React.FormEvent<HTMLFormElement>) => void

// Again had some TS typing issues with `useState()`. The error object doesn't exist initially,
// also accepting `undefined` seems to fix it, unclear if that's advised?
function useForm<T>() {
  const [errors, setErrors] = useState<ZodError | undefined>();

  const handleSubmit: onSubmit<T> = (_onValid, _onInvalid) => (e) => {
    e.preventDefault()

    // Converts form data into object key/value pairs, but only if name attribute exists on the input
    const result = schema.safeParse(
      Object.fromEntries(new FormData(e.currentTarget))
    )

    if (!result.success) {
      setErrors(result.error)
      _onInvalid(result.error)
    } else {
      setErrors(undefined)
      _onValid(result.data)
    }
  }

  return { errors, handleSubmit }
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

export default Form
