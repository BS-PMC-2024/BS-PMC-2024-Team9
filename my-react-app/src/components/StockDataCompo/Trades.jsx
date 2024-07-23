import React from 'react';
import styled from 'styled-components';

const Trades = ({ trades, successRate }) => {
  return (
    <TradesContainer>
      <h2>Trades</h2>
      <ul>
        {trades.map((trade, index) => (
          <li key={index}>
            <span>{trade.Datetime} - {trade.Type} at</span>
            <span> {trade.Price.toFixed(2)} </span>
          </li>
        ))}
      </ul>
      <p>Success Rate: {successRate.toFixed(2)}%</p> {/* Ensuring two decimal places */}
    </TradesContainer>
  );
};

export default Trades;

const TradesContainer = styled.div`
  margin-top: 2rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
