import styles from './styles.module.scss'
import { Error, Input} from './components'
import { CreditCard } from './schema'
import { useForm, onValid, onInvalid } from './submitLogic'

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

      <Error.List className={styles.errors}>
        <Error.Item id="cc_number"    label="Card Number"   errors={errors} />
        <Error.Item id="cc_exp_month" label="Expiry Month"  errors={errors} />
        <Error.Item id="cc_exp_year"  label="Expiry Year"   errors={errors} />
        <Error.Item id="cc_csc"       label="Security Code" errors={errors} />
      </Error.List>
    </form>
  )
}

export default Form
