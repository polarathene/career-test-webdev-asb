import styles from '../styles.module.scss'

export const Input: React.FC<InputProps> = ({ id, label, ...props }) => (
  <>
    {label && (<label htmlFor={id}>{label}:</label>)}
    <input
      className={styles.input}
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

export default Input