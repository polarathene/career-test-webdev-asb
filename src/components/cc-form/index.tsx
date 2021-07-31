import styles from './styles.module.scss'
import Input from './components/input'
import schema, {CreditCard} from './schema'
import { ZodError } from 'zod'

export const Form = () => {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
    </form>
  )
}

/* === form onSubmit === */

// Just outputs the values to console, unless the expiry date is invalid.
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  // Converts form data into object key/value pairs, but only if name attribute exists on the input
  const result = schema.safeParse(
    Object.fromEntries(new FormData(e.currentTarget))
  )

  if (!result.success) {
    onInvalid(result.error)
  } else {
    onValid(result.data)
  }
}

function onInvalid(error: ZodError<CreditCard>) {
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
