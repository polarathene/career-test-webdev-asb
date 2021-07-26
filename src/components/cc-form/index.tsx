import React from 'react';
import styles from './styles.module.scss';

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

      <button className={styles.submitButton} type="submit">Submit</button>
    </form>
  );
}

const Input: React.FC<InputProps> = ({ id, label, ...props }) => (
  <>
    {label && (<label htmlFor={id}>{label}:</label>)}
    <input
      id={id}
      type="text"
      inputMode="tel"
      autoComplete={id.replace(/_/g, "-")}
      required
      {...props}
    />
  </>
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label?: string
}

const currentMonth = new Date().getUTCMonth() + 1
const currentYear  = new Date().getUTCFullYear() - 2000

// Just outputs the values to console, unless the expiry date is invalid.
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const form  = e.currentTarget
  const month = parseInt(form.cc_expiry_month.value)
  const year  = parseInt(form.cc_expiry_year.value)

  if (year >= currentYear && month > currentMonth) {
    console.log({
      card_number:   parseInt(form.cc_number.value),
      security_code: parseInt(form.cc_code.value),
      expires:       `${month} / ${year}`
    })
  } else {
    console.log("Expiry date is invalid! :(")
  }
}

export default Form;
