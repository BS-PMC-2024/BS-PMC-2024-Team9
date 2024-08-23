import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { BarChart, Bar } from 'recharts';
import { url,setHeaders } from '../../features/api';

// admin transactions statistics
const TransactionStatistics = () => {
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const fetchTransactionStats = async () => {
      try {
        const response = await axios.get(`${url}/portfolio/stats/transactions`,setHeaders());
        setTransactionData(response.data);
      } catch (err) {
        console.error('Error fetching transaction statistics:', err);
      }
    };

    fetchTransactionStats();
  }, []);

  if (!transactionData) {
    return <p>Loading...</p>;
  }

  const { totalTransactions, openTransactions } = transactionData;

  const data = [
    { name: 'Total Transactions', count: totalTransactions },
    { name: 'Open Transactions', count: openTransactions },
  ];

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

export default TransactionStatistics;

// Styled components
const GraphContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  margin-top: 2rem;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;
