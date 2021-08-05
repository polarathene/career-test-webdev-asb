import styles from './styles.module.scss'
import { Error, Inputs, Submit } from './components'
import { CreditCard } from './schema'
import { useForm, onValid, onInvalid } from './submitLogic'

export const Form = () => {
  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<CreditCard>()

  const hasError = (id: keyof CreditCard) => errors?.issues.some(err => err.path.includes(id))
  const hasErrors = isSubmitted && !isValid

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onValid, onInvalid)}>
        <Inputs.CardNumber hasError={hasError} />

        <Inputs.ExpiryDate
          month={<Inputs.ExpMonth hasError={hasError} />}
          year ={<Inputs.ExpYear  hasError={hasError} />}
        />

        <Inputs.SecurityCode hasError={hasError} />

        <Submit className={styles.submit} hasErrors={hasErrors} />
      </form>

      <Error.List className={styles.errors} hasErrors={hasErrors}>
        <Error.Item id="cc_number"    label="Card Number"   errors={errors} />
        <Error.Item id="cc_exp_month" label="Expiry Month"  errors={errors} />
        <Error.Item id="cc_exp_year"  label="Expiry Year"   errors={errors} />
        <Error.Item id="cc_csc"       label="Security Code" errors={errors} />
      </Error.List>
    </div>
  )
}

export default Form
