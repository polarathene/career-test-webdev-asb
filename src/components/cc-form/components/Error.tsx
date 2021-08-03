import { ZodError } from 'zod'
import type { CreditCard } from '../schema'

export const List: React.FC<ErrorListProps> = ({className, hasErrors, children}) => (
  <div className={className} style={!hasErrors ? {display: "none"} : undefined}>
    <h2 id="aria_errorlist" aria-label="Error,">Error</h2>
    <p id="aria_errormsg">
      <em>Unable to submit details due to the following:</em>
    </p>
    <ul aria-live="polite" aria-relevant="additions text">
      {children}
    </ul>
  </div>
)

export const Item: React.FC<ErrorItemProps> = ({errors, id, label}) => {
  const error = errors?.issues.filter(err => err.path.includes(id))

  return error && error.length > 0 ? (
    <li>
      <span id={`err_${id}_label`}>{label}</span>
      {error.map(err =>
      <span id={`err_${id}`}>{err.message}</span>
      )}
    </li>
  ) : null
}

type ErrorListProps = {
  className?: string
  hasErrors: boolean
}

type ErrorItemProps = {
  id: keyof CreditCard
  label: string
  errors?: ZodError
}

export const Error = {List, Item}