import React from 'react';
import Plot from 'react-plotly.js';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import { Star } from '@material-ui/icons';
// calculat moving average
const calculateMovingAverage = (data, window) => {
  let movingAverages = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      movingAverages.push(null);
    } else {
      const windowSlice = data.slice(i - window + 1, i + 1);
      const sum = windowSlice.reduce((acc, curr) => acc + curr.Close, 0);
      movingAverages.push(sum / window);
    }
  }
  return movingAverages;
};

// Check the date
const getDateOrDatetime = (item, interval) => {
  const intradayIntervals = ['1m', '2m' ,'5m','30m', '15m', '60m','1d'];
  const dateValue = intradayIntervals.includes(interval) ? item.Datetime : item.Date;
  return dateValue;
};

const ChartWithFavorite = ({ data, ticker, handleAddToFavorites, movingAverages, interval }) => {
  return (
    <ChartContainer>
      <IconButton aria-label="favorite" onClick={handleAddToFavorites}>
        <Star />
      </IconButton>
      {data && data.length > 0 ? (
        <Plot
          data={[
            {
              x: data.map(item => getDateOrDatetime(item, interval)),
              open: data.map(item => item.Open),
              high: data.map(item => item.High),
              low: data.map(item => item.Low),
              close: data.map(item => item.Close),
              type: 'candlestick',
              name: 'Candlestick Chart',
              increasing: { line: { color: 'green' } },
              decreasing: { line: { color: 'red' } },
            },
            ...(movingAverages && movingAverages.length > 0 ? movingAverages.map(window => ({
              x: data.map(item => getDateOrDatetime(item, interval)),
              y: calculateMovingAverage(data, window),
              type: 'scatter',
              mode: 'lines',
              name: `MA ${window}`,
            })) : [])
          ]}
          layout={{
            title: `${ticker} Stock Price`,
            xaxis: {
              title: 'Date',
              rangebreaks: [
                { pattern: 'day of week', bounds: ["sat", "mon"] },
                { pattern: 'hour', bounds: [16, 9] }
              ]
            },
            yaxis: { title: 'Price' },
            autosize: true,
            margin: { l: 50, r: 50, t: 50, b: 50 },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '600px' }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </ChartContainer>
  );
};

export default ChartWithFavorite;

const ChartContainer = styled.div`
  
  display: flex;
  flex-direction: column;
  width: 60%;
  grid-column: 2;
  align-items: center;
  font-size: 18px;
  position: absolute;
  left: 400px;
  top: 185px;

`;
