import styles from '../styles.module.scss'

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

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label?: string
  hasError?: boolean
}

export default Input