import styles from './styles.module.scss'
import { Error, Inputs, Submit } from './components'
import { CreditCard } from './schema'
import { useForm, onValid, onInvalid, ErrorContext } from './submitLogic'

export const Form = () => {
  const {
    handleSubmit,
    formState: { isValid, isSubmitted },
    errorMethods,
  } = useForm<CreditCard>()

  const hasErrors = isSubmitted && !isValid

  return (
    <ErrorContext.Provider value={errorMethods}>
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onValid, onInvalid)}>
        <Inputs.CardNumber />
        <Inputs.ExpiryDate month={<Inputs.ExpMonth />} year={<Inputs.ExpYear />} />
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

export default Form
