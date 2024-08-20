import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { url, setHeaders } from "../../features/api"; // Adjusted import path
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const TransactionChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const compare = (a, b) => {
    if (a._id < b._id) {
      return 1;
    }
    if (a._id > b._id) {
      return -1;
    }
    return 0;
  };

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/portfolio/transactions`, setHeaders());
        res.data.sort(compare);
        
        const transformedData = res.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString(), // Format date for x-axis
          profitOrLoss: item.profitOrLoss, // Assuming the field name is 'profitOrLoss'
        }));
        
        setTransactions(transformedData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <Loader>Loading Chart...</Loader>
      ) : (
        <StyledChart>
          <h3>{t("Transaction Profits/Losses")}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={transactions}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="profitOrLoss"
                stroke="#1207e2"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </StyledChart>
      )}
    </>
  );
};

export default TransactionChart;

const StyledChart = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 2rem;
  padding: 1rem;
  border: 2px solid rgba(10, 30, 210, 0.2);
  border-radius: 3px;
  h3 {
    margin-bottom: 1rem;
  }
`;

const Loader = styled.p`
  margin-top: 2rem;
`;
