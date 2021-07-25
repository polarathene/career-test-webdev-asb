import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <form>
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

export default App
