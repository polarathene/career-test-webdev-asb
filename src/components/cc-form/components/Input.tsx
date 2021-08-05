import styles from '../styles.module.scss'
import type { CreditCard } from '../schema'

export const Input: React.FC<InputProps> = ({ id, label, hasError, ...props }) => (
  <>
    {label && (<label htmlFor={id}>{label}:</label>)}
    <input
      className={styles.input}
      id={id}
      name={id}
      type="text"
      inputMode="tel"
      autoComplete={id.replace(/_/g, "-")}
      aria-describedby={hasError ? `aria_errorlist err_${id}` : undefined}
      aria-invalid={hasError || undefined}
      required
      {...props}
    />
  </>
)

export const ExpiryDate: React.FC<ExpiryDateProps> = ({ className, month, year }) => (
  <fieldset className={className || styles.cc_exp}>
    <legend>Expiry Date (MM / YY):</legend>
    {month}
    <span>/</span>
    {year}
  </fieldset>
)

export const CardNumber: React.FC<FixedInputProps> = ({ className, hasError }) => (
  <div className={className || styles.cc_number}>
    <Input
      id="cc_number"
      label="Card Number"
      hasError={hasError("cc_number")}
    />
  </div>
)

export const ExpMonth: React.FC<FixedInputProps> = ({ hasError }) => (
  <Input
    id="cc_exp_month"
    aria-label="Month, Format: 2 digits."
    maxLength={2}
    hasError={hasError("cc_exp_month")}
  />
)

export const ExpYear: React.FC<FixedInputProps> = ({ hasError }) => (
  <Input
    id="cc_exp_year"
    aria-label="Year, Format: 2 digits."
    maxLength={2}
    hasError={hasError("cc_exp_year")}
  />
)

export const SecurityCode: React.FC<FixedInputProps> = ({ className, hasError }) => (
  <div className={className || styles.cc_csc}>
    <Input
      id="cc_csc"
      label="Security Code"
      maxLength={4}
      hasError={hasError("cc_csc")}
    />
  </div>
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: keyof CreditCard
  label?: string
  hasError?: boolean
}

type ExpiryDateProps = {
  className?: string
  month: React.ReactNode
  year: React.ReactNode
}

type FixedInputProps = {
  className?: string
  hasError: (id: keyof CreditCard) => boolean | undefined
}

export default Input