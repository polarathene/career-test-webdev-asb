import { ZodError } from 'zod'
import type { CreditCard } from '../schema'

/*
- Extra wrapping div is to accomodate browsers like Firefox which do not announce the initial
content when appended to the DOM.
- Toggling display property instead of visibility has no difference on Firefox,
but Chrome will not announce content properly with visibility toggle,
especially if inline styled elements are present.
*/
export const List: React.FC<ErrorListProps> = ({ className, hasErrors, children }) => (
  <div className={className} role="alert" aria-live="assertive">
    <div style={{ display: hasErrors ? "block" : "none" }}>
      <h2 id="aria_errorlist" aria-label="Error,">Error</h2>
      <p id="aria_errormsg">
        <em>Unable to submit details due to the following:</em>
      </p>
      <ul>
        {children}
      </ul>
    </div>
  </div>
)

export const Item: React.FC<ErrorItemProps> = ({ errors, id, label }) => {
  const error = errors?.issues.filter(err => err.path.includes(id))

  return error && error.length > 0 ? (
    <li aria-atomic="true">
      <span id={`err_${id}_label`} aria-describedby={`aria_errorlist`}>{label}</span>
      {error?.map(err =>
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