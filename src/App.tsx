import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cc_number">Card Number:</label>
          <input
            id="cc_number"
            type="number"
            required
          />
        </div>

        <fieldset>
          <legend>Expiry Date:</legend>
          <input
            id="cc_expiry_month"
            type="number"
            min="1"
            max="12"
            placeholder="MM"
            required
          />
          <span>/</span>
          <input
            id="cc_expiry_year"
            type="number"
            min="21"
            max="99"
            placeholder="YY"
            required
          />
        </fieldset>

        <div>
          <label htmlFor="cc_code">CVC:</label>
          <input
            id="cc_code"
            type="number"
            placeholder="123"
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

const currentMonth = new Date().getUTCMonth() + 1
const currentYear  = new Date().getUTCFullYear() - 2000

// Just outputs the values to console, unless the expiry date is invalid.
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const form  = e.currentTarget
  const month = parseInt(form.cc_expiry_month.value)
  const year  = parseInt(form.cc_expiry_year.value)

  if (year >= currentYear && month > currentMonth) {
    console.log({
      card_number:   parseInt(form.cc_number.value),
      security_code: parseInt(form.cc_code.value),
      expires:       `${month} / ${year}`
    })
  } else {
    console.log("Expiry date is invalid! :(")
  }
}

export default App
