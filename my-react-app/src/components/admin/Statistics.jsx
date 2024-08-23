import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url,setHeaders } from '../../features/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const Statistics = () => {
  const [stats, setStats] = useState([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${url}/admin/stats`,setHeaders()); // קבלת נתוני סטטיסטיקה מהשרת
        const formattedData = formatData(response.data);
        setStats(formattedData);
      } catch (err) {
        console.error('Error fetching statistics:', err);
      }
    };

    fetchStats();
  }, []);

  const formatData = (data) => {
    const { userStats, commentStats } = data;
    const combinedData = [];

    // איחוד הנתונים לפי תאריכים
    userStats.forEach((userStat) => {
      const commentStat = commentStats.find((stat) => stat._id === userStat._id) || { count: 0 };
      combinedData.push({
        date: userStat._id,
        newUsers: userStat.count,
        newComments: commentStat.count
      });
    });

    return combinedData;
  };

  return (
    <Container>
      <h2>User Activity Statistics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="newUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="newComments" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Statistics;

// Styled components
const Container = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;
