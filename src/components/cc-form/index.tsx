import styles from './styles.module.scss'
import { Error, Input, Submit } from './components'
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
    <form className={styles.form} onSubmit={handleSubmit(onValid, onInvalid)}>
      <div className={styles.cc_number}>
        <Input
          id="cc_number"
          label="Card Number"
          hasError={hasError("cc_number")}
        />
      </div>

      <fieldset className={styles.cc_exp}>
        <legend>Expiry Date (MM / YY):</legend>
        <Input
          id="cc_exp_month"
          maxLength={2}
          aria-label="Month, Format: 2 digits."
          hasError={hasError("cc_exp_month")}
        />
        <span>/</span>
        <Input
          id="cc_exp_year"
          maxLength={2}
          aria-label="Year, Format: 2 digits."
          hasError={hasError("cc_exp_year")}
        />
      </fieldset>

      <div className={styles.cc_csc}>
        <Input
          id="cc_csc"
          maxLength={4}
          label="Security Code"
          hasError={hasError("cc_csc")}
        />
      </div>

      <Submit className={styles.submit} hasErrors={hasErrors} />

      <Error.List className={styles.errors} hasErrors={hasErrors}>
        <Error.Item id="cc_number"    label="Card Number"   errors={errors} />
        <Error.Item id="cc_exp_month" label="Expiry Month"  errors={errors} />
        <Error.Item id="cc_exp_year"  label="Expiry Year"   errors={errors} />
        <Error.Item id="cc_csc"       label="Security Code" errors={errors} />
      </Error.List>
    </form>
  )
}

export default Form
