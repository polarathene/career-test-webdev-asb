import {z} from 'zod';

// Date could alternatively be sourced via an env var, or trust what is reported by client..
const currentMonth = new Date().getUTCMonth() + 1
const currentYear  = new Date().getUTCFullYear() - 2000


// Custom Validations:
const inRange    = (x: number, y: number) => (n: number) => (n >= x && n <= y)
const inRangeStr = (x: number, y: number) => (s: string) => inRange(x, y)(s.length)
const r_isDigits = /^[0-9]+$/


// Custom Errors:
const errorRangeMonth = "Must be a number between 1 and 12"
const errorMinYear    = "Value should not be in the past"
const errorRangeCSC   = "Value should be 3 digits; 4 if American Express"
const errorNaN        = "Value should be a number"
const errorDigits     = "Expected only numbers"


// Custom Types:
const zDigitString = z.string().regex(r_isDigits, errorDigits)
const zStringNumber = zDigitString.transform(s => parseInt(s))

// Zod maintainer mentioned this type alias to provide a more generic type signature
// A future release should export it :)
type SuperRefinement<T> = (
  val: T,
  ctx: z.RefinementCtx
) => void

// A `min()` implementation for zDigitString to use as if it were a `z.number()`
type zMin<T> = (min: T, message?: string) => SuperRefinement<T>
const min: zMin<number> = (min, message) => (val, ctx) => {
  if (val < min) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      type: "number",
      minimum: min,
      inclusive: false,
      message,
    })
  }
}


/*
This schema type handles field level validation, a post validation on
the object is performed with `superRefine()` afterwards. It could be considered
as compound validation as once field level validation passes, we can validate across
values.
*/
export const _zCreditCard = z.object({
  cc_number: zDigitString,
  cc_exp_month: zStringNumber.refine(inRange(1, 12), errorRangeMonth),
  cc_exp_year: zStringNumber.superRefine(min(currentYear, errorMinYear)),
  cc_csc: zDigitString.refine(inRangeStr(3, 4), errorRangeCSC),
})

// Presently this schema has differing input and output types due to zStringNumber type above
type zInput  = z.input<typeof _zCreditCard>
type zOutput = z.output<typeof _zCreditCard>
type zIO = zInput | zOutput

const isNotExpired: SuperRefinement<zOutput> = ({cc_exp_month: m, cc_exp_year: y}, ctx) => {
  if (y === currentYear && m <= currentMonth) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cc_exp_month'],
      message: `Expiry date cannot be in the past`,
    })
  }
}


/*
Overriding the default `NaN` validation error for the `number` type.
Could improve further by using context for affected field, in this case is only for
Month or Year inputs if it'd be worthwhile giving a more contextually specific message?
*/
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "number") {
      return { message: errorNaN }
    }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)


export const zCreditCard = _zCreditCard.superRefine(isNotExpired)
export type CreditCard = z.infer<typeof zCreditCard>
export default zCreditCard