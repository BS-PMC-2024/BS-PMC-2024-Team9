// components/AddAnalysis.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../../features/api';

const AddAnalysis = () => {
  const [ticker, setTicker] = useState('');
  const [indicators, setIndicators] = useState({});
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/analysis/add`, { ticker, indicators, notes });
      alert('Analysis added successfully');
    } catch (err) {
      console.error(err);
      alert('Error adding analysis');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Ticker:</label>
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} required />
      </div>
      <div>
        <label>Indicators (JSON format):</label>
        <input type="text" value={JSON.stringify(indicators)} onChange={(e) => setIndicators(JSON.parse(e.target.value))} />
      </div>
      <div>
        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      </div>
      <button type="submit">Add Analysis</button>
    </form>
  );
};

export default AddAnalysis;
