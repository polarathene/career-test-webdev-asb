import styles from './styles.module.scss'
import { Error, Inputs, Submit } from './components'
import schema, { CreditCard } from './schema'
import { useForm, ErrorContext } from './submitLogic'
import { ZodError } from 'zod'

export const Form = () => {
  const {
    handleSubmit,
    formState: { isValid, isSubmitted },
    errorMethods,
  } = useForm<CreditCard>(schema)

  const hasErrors = isSubmitted && !isValid

  return (
    <ErrorContext.Provider value={errorMethods}>
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onValid, onInvalid)}>
        <Inputs.CardNumber />
        <Inputs.ExpiryDate
          month={<Inputs.ExpMonth />}
          year ={<Inputs.ExpYear  />}
        />
        <Inputs.SecurityCode />
        <Submit className={styles.submit} hasErrors={hasErrors} />
      </form>

      <Error.List className={styles.errors} hasErrors={hasErrors}>
        <Error.Item id="cc_number"    label="Card Number"   />
        <Error.Item id="cc_exp_month" label="Expiry Month"  />
        <Error.Item id="cc_exp_year"  label="Expiry Year"   />
        <Error.Item id="cc_csc"       label="Security Code" />
      </Error.List>
    </div>
    </ErrorContext.Provider>
  )
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
