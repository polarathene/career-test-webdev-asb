import styles from './styles.module.scss'
import Input from './components/input'
import schema from './schema'

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
  const data: any = Object.fromEntries(new FormData(e.currentTarget))
  // `schema` expects number type for these two fields, convert before parsing.
  data.cc_exp_month = parseInt(data.cc_exp_month)
  data.cc_exp_year = parseInt(data.cc_exp_year)

  const result = schema.safeParse(data)

  if (!result.success) {
    console.error(
      "Submission Failure:\n",
      result.error.issues
    )

    // Lists validation errors (value array) grouped by each form field (key)
    Object.entries(result.error.flatten().fieldErrors).forEach(([k, v]) => {
      console.warn(k, v)
    })
    // These errors relate to post-processing the data object,
    // after initial validation of each individual fields type passes:
    Object.entries(result.error.flatten().formErrors).forEach(([k, v]) => {
      console.warn(k, v)
    })
  } else {
    const {
      cc_number: card_number,
      cc_exp_month: month,
      cc_exp_year: year,
      cc_csc: security_code,
    } = result.data

    console.log(
      "Submission Successful!\n",
      {
        card_number,
        security_code,
        expiry_date: `${month} / ${year}`
      }
    )
  }
}

export default Form
