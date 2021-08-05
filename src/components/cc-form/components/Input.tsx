import styles from '../styles.module.scss'
import type { CreditCard } from '../schema'
import { useErrorContext } from '../submitLogic'

export const Input: React.FC<InputProps> = ({ id, label, ...props }) => {
  const field = useErrorContext()
  const hasError = field.hasError(id)

  return (
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
}

export const ExpiryDate: React.FC<ExpiryDateProps> = ({ className, month, year }) => (
  <fieldset className={className || styles.cc_exp}>
    <legend>Expiry Date (MM / YY):</legend>
    {month}
    <span>/</span>
    {year}
  </fieldset>
)

export const CardNumber: React.FC<FixedInputProps> = ({ className }) => (
  <div className={className || styles.cc_number}>
    <Input
      id="cc_number"
      label="Card Number"
    />
  </div>
)

export const ExpMonth: React.FC<FixedInputProps> = () => (
  <Input
    id="cc_exp_month"
    aria-label="Month, Format: 2 digits."
    maxLength={2}
  />
)

export const ExpYear: React.FC<FixedInputProps> = () => (
  <Input
    id="cc_exp_year"
    aria-label="Year, Format: 2 digits."
    maxLength={2}
  />
)

export const SecurityCode: React.FC<FixedInputProps> = ({ className }) => (
  <div className={className || styles.cc_csc}>
    <Input
      id="cc_csc"
      label="Security Code"
      maxLength={4}
    />
  </div>
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: keyof CreditCard
  label?: string
}

type ExpiryDateProps = {
  className?: string
  month: React.ReactNode
  year: React.ReactNode
}

type FixedInputProps = {
  className?: string
}

export default Input