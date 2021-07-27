import React from 'react';
import styles from './styles.module.scss';

export const Form = () => {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.cc_number}>
        <label htmlFor="cc_number">Card Number:</label>
        <input
          id="cc_number"
          type="text"
          inputMode="tel"
          required
        />
      </div>

      <fieldset className={styles.cc_exp}>
        <legend>Expiry Date (MM / YY):</legend>
        <input
          id="cc_expiry_month"
          type="text"
          inputMode="tel"
          maxLength={2}
          required
        />
        <span>/</span>
        <input
          id="cc_expiry_year"
          type="text"
          inputMode="tel"
          maxLength={2}
          required
        />
      </fieldset>

      <div className={styles.cc_csc}>
        <label htmlFor="cc_csc">Security Code:</label>
        <input
          id="cc_csc"
          type="text"
          inputMode="tel"
          maxLength={4}
          required
        />
      </div>

      <button className={styles.submitButton} type="submit">Submit</button>
    </form>
  );
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
