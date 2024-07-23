import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: '1rem',
  },
  section: {
    marginTop: '2rem',
    padding: '1rem',
  },
});

const DetailsOfStock = () => {
  const classes = useStyles();
  const { ticker } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/stock-detail/${ticker}`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchData();
  }, [ticker]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const { stock_data, balance_sheet, financials, cashflow } = data;

  return (
    <Container className={classes.container}>
      <Typography variant="h4">{ticker} Stock Detail</Typography>

      <Paper className={classes.section}>
        <Typography variant="h6">Stock Data</Typography>
        <ul>
          {stock_data.map((entry, index) => (
            <li key={index}>
              {Object.entries(entry).map(([key, value]) => (
                <div key={key}>
                  {key}: {value}
                </div>
              ))}
            </li>
          ))}
        </ul>
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6">Balance Sheet</Typography>
        {balance_sheet ? (
          <ul>
            {balance_sheet.map((entry, index) => (
              <li key={index}>
                {Object.entries(entry).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No balance sheet available</Typography>
        )}
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6">Financials</Typography>
        {financials ? (
          <ul>
            {financials.map((entry, index) => (
              <li key={index}>
                {Object.entries(entry).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No financials available</Typography>
        )}
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6">Cashflow</Typography>
        {cashflow ? (
          <ul>
            {cashflow.map((entry, index) => (
              <li key={index}>
                {Object.entries(entry).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No cashflow available</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default DetailsOfStock;
