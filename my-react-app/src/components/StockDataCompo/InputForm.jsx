import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchStockData, fetchPredictedPrice } from '../../features/stockSlice';
import styled from 'styled-components';

const InputForm = ({ setShowBuySell }) => {
  const [ticker, setTicker] = useState('');
  const [period, setPeriod] = useState('');
  const [interval, setInterval] = useState('1d');
  const [movingAverages, setMovingAverages] = useState([]);
  const [strategy, setStrategy] = useState('ma_crossover');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const dispatch = useDispatch();

  const handleMAChange = (e) => {
    const value = e.target.value;
    setMovingAverages(value.split(',').map(ma => ma.trim()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchStockData({ ticker, period, interval, movingAverages, strategy, fromDate, toDate }));
    localStorage.setItem("lastTicker", ticker);
    localStorage.setItem("lastPeriod", period);
    localStorage.setItem("lastInterval", interval);
    dispatch(fetchPredictedPrice({ ticker, period, interval }));
    setShowBuySell(true);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div>
        <label>Ticker:</label>
        <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} required />
      </div>
      <div>
        <label>Period (optional):</label>
        <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g., 1d, 5d, 1mo, 6mo, 1y" />
      </div>
      <div>
        <label>Interval:</label>
        <select value={interval} onChange={(e) => setInterval(e.target.value)}>
          <option value="1m">1 Minute</option>
          <option value="2m">2 Minutes</option>
          <option value="5m">5 Minutes</option>
          <option value="15m">15 Minutes</option>
          <option value="30m">30 Minutes</option>
          <option value="60m">1 Hour</option>
          <option value="90m">90 Minutes</option>
          <option value="1d">1 Day</option>
          <option value="5d">5 Days</option>
          <option value="1wk">1 Week</option>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
        </select>
      </div>
      <div>
        <label>From Date:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>
      <div>
        <label>To Date:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>
      <div>
        <label>Moving Averages (comma separated):</label>
        <input type="text" onChange={handleMAChange} placeholder="e.g., 20, 50, 200" />
      </div>
      <div>
        <label>Trading Strategy:</label>
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value="ma_crossover">Moving Average Crossover</option>
          <option value="rsi">RSI</option>
          <option value="mean_reversion">Mean Reversion</option>
        </select>
      </div>
      <button type="submit">Get Data</button>
    </FormContainer>
  );
};

export default InputForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;
