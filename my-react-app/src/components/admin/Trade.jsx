import axios from 'axios';
import React, { useState } from 'react';
import { url } from '../../features/api';

const Trade = () => {
  const [historicalData, setHistoricalData] = useState([]);

  const fetchHistoricalData = async (ticker, period, interval) => {
    try {
      const response = await axios.get(`${url}/historicaldata/${ticker}`, {
        params: { period, interval },
        withCredentials: true,
      });
      setHistoricalData(response.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const ticker = 'AAPL';
    const period = '2D';
    const interval = '1day';
    fetchHistoricalData(ticker, period, interval);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <button type="submit">Fetch Historical Data</button>
      </form>
      <pre>{JSON.stringify(historicalData, null, 2)}</pre>
    </div>
  );
};

export default Trade;
