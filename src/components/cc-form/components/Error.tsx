import { ZodError } from 'zod'
import type { CreditCard } from '../schema'

export const List: React.FC<ErrorListProps> = ({className, children}) => (
  <div className={className}>
    <h2>Error</h2>
    <p><em>Unable to submit details due to the following:</em></p>
    <ul>
      {children}
    </ul>
  </div>
)

export const Item: React.FC<ErrorItemProps> = ({errors, id, label}) => {
  const error = errors?.issues.filter(err => err.path.includes(id))

  return error && error.length > 0 ? (
    <li>
      <span>{label}</span>
      {error.map(err =>
      <span>{err.message}</span>
      )}
    </li>
  ) : null
}

type ErrorListProps = {
  className?: string
}

type ErrorItemProps = {
  id: keyof CreditCard
  label: string
  errors?: ZodError
}

export const Error = {List, Item}