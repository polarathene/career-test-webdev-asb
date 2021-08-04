/* 
- `aria-disabled` is only announced by TalkBack on focus of the submit button.
The soft keyboard "done" button announces "Go" as aural feedback, regardless of
this aria attribute. Unable to inform the listener, they need to change focus to the
submit button or navigate the error list.
Note this attribute is only meant to announce a disabled state, even when still functional.
That was intentional, as the `disabled` attribute prevents focus causing a11y confusion.

- `aria-describedby` ensures the correct announcement order to the listener when
focusing on the submit button.
*/
export const Submit: React.FC<SubmitProps> = ({className, hasErrors }) => (
  <button
    className={className}
    type="submit"
    aria-disabled={hasErrors || undefined}
    aria-describedby={hasErrors ? describeErrors : undefined}
  >
    Submit
  </button>
)

type SubmitProps = {
  className: string
  hasErrors: boolean
}

// I'm too tired to handle this properly and meet the deadline..sorry :(
// Used by the submit button receiving focus to describe any errors present.
const describeErrors = "aria_errorlist aria_errormsg " +
  "err_cc_number_label err_cc_number " +
  "err_cc_exp_month_label err_cc_exp_month " +
  "err_cc_exp_year_label err_cc_exp_year " +
  "err_cc_csc_label err_cc_csc"