import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle the submission of the input JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      // Parse JSON input
      const parsedInput = JSON.parse(jsonInput);
      const { data, file_b64 } = parsedInput;

      // Make POST request to backend API
      const res = await axios.post('https://bajaj-backend-vishal.onrender.com/bfhl', {
        data,
        file_b64,
      });

      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON input or server error.');
    }
  };

  // Handle multi-select dropdown changes
  const handleSelectChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedOptions(selected);
  };

  // Function to render the response based on selected filters
  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;
    const filteredResponse = {};

    if (selectedOptions.includes('Numbers')) filteredResponse.numbers = numbers;
    if (selectedOptions.includes('Alphabets')) filteredResponse.alphabets = alphabets;
    if (selectedOptions.includes('Highest Lowercase Alphabet'))
      filteredResponse.highest_lowercase_alphabet = highest_lowercase_alphabet;

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Data Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="50"
          placeholder='Enter JSON: { "data": ["A", "b", "1"] }'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <>
          <label>Select Options to Filter Response:</label>
          <select multiple onChange={handleSelectChange}>
            <option value="Numbers">Numbers</option>
            <option value="Alphabets">Alphabets</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
