import {z} from 'zod';

// Date could alternatively be sourced via an env var, or trust what is reported by client..
const currentMonth = new Date().getUTCMonth() + 1
const currentYear  = new Date().getUTCFullYear() - 2000


// Custom Validations:
const inRange    = (x: number, y: number) => (n: number) => (n >= x && n <= y)
const inRangeStr = (x: number, y: number) => (s: string) => inRange(x, y)(s.length)
const r_isDigits = /^[0-9]+$/


// Custom Errors:
const errorRangeMonth = { message: "Month must be a number between 1 and 12" }
const errorRangeCSC   = { message: "Value should be 3 digits; 4 if American Express" }
const errorNaN        = { message: "Value should be a number"}
const errorDigits     = { message: "Expected only numbers" }


// Custom Types:
const zDigitString = z.string().regex(r_isDigits, errorDigits)
/*
This schema type handles field level validation, a post validation on
the object is performed with `superRefine()`; but unless inlining the method
to take advantage of infererence we must derive a temporary type.. The whole
point of zod is to provide the type instead of repeating the definition.
Unfortunately, the joys of typing encourage inlining as much for inference
or adding friction and noise through what is effectively redundant typing?
*/
export const _zCreditCard = z.object({
  cc_number: zDigitString,
  cc_exp_month: z.number().int().refine(inRange(1, 12), errorRangeMonth),
  cc_exp_year: z.number().int().min(currentYear),
  cc_csc: zDigitString.refine(inRangeStr(3, 4), errorRangeCSC),
// }).superRefine(isNotExpired)
})


/* Extracting out a method in TS seems to add friction due to lack of inference of
inlining the method. There's also a few ways to satisfy the type checker, but unclear
which is preferred.

To inline arg types or not to inline arg types, that is the question:
https://github.com/colinhacks/zod/issues/540
*/

// Would this be acceptable practice in this case?:
// const isNotExpired: any = ({cc_exp_month: m, cc_exp_year: y}, ctx) => {

// Alternatively, we could redeclare the type in TS, or infer the type up until this point
/*
type T_isNotExpired = (
  zobj: z.infer<typeof _ZCreditCard>,
  ctx: z.RefinementCtx
) => void
const isNotExpired: T_isNotExpired = ({cc_exp_month: m, cc_exp_year: y}, ctx) => {
*/

const isNotExpired = (
  {cc_exp_month: m, cc_exp_year: y}: z.infer<typeof _zCreditCard>,
  ctx: z.RefinementCtx
) => {
  if (y >= currentYear && m <= currentMonth) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Expiry date cannot be in the past`,
      path: ['cc_exp_month'],
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
      return errorNaN
    }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)


export const zCreditCard = _zCreditCard.superRefine(isNotExpired)
export type CreditCard = z.infer<typeof zCreditCard>
export default zCreditCard