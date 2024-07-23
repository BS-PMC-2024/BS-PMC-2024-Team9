import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { ButtonGroup, Button, IconButton, makeStyles, TextField } from '@material-ui/core';
import { Star } from '@material-ui/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DetailsOfSrock from './DetailsOfSrock';

const useStyles = makeStyles({
  container: {
    padding: '1rem',
  },
  chartContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  chart: {
    marginTop: '1rem',
    width: '45%',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maInput: {
    marginLeft: '1rem',
  },
  stockInput: {
    marginLeft: '1rem',
  },
  buttonGroupContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const calculateRSI = (data, period = 14) => {
  let gains = [];
  let losses = [];
  for (let i = 1; i < data.length; i++) {
    const difference = data[i].Close - data[i - 1].Close;
    if (difference >= 0) {
      gains.push(difference);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(-difference);
    }
  }
  const averageGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const averageLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rs = averageGain / averageLoss;
  const rsi = [100 - 100 / (1 + rs)];

  for (let i = period; i < gains.length; i++) {
    const gain = gains[i];
    const loss = losses[i];
    const newAverageGain = (averageGain * (period - 1) + gain) / period;
    const newAverageLoss = (averageLoss * (period - 1) + loss) / period;
    const newRS = newAverageGain / newAverageLoss;
    rsi.push(100 - 100 / (1 + newRS));
  }
  return rsi;
};

const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  const shortEMA = calculateEMA(data, shortPeriod);
  const longEMA = calculateEMA(data, longPeriod);
  const macd = shortEMA.map((value, index) => value - longEMA[index]);
  const signal = calculateEMA(macd.slice(longPeriod - 1), signalPeriod);
  const histogram = macd.slice(longPeriod - 1).map((value, index) => value - signal[index]);
  return { macd: macd.slice(longPeriod - 1), signal, histogram };
};

const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  const ema = [data.slice(0, period).reduce((a, b) => a + b.Close, 0) / period];
  for (let i = period; i < data.length; i++) {
    ema.push(data[i].Close * k + ema[i - period] * (1 - k));
  }
  return ema;
};

const calculateBollingerBands = (data, period = 20, multiplier = 2) => {
  const sma = calculateSMA(data, period);
  const stddev = data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const mean = sma[i];
    const variance = slice.reduce((acc, cur) => acc + Math.pow(cur.Close - mean, 2), 0) / period;
    return Math.sqrt(variance);
  });
  const upperBand = sma.map((value, index) => value + multiplier * stddev[index]);
  const lowerBand = sma.map((value, index) => value - multiplier * stddev[index]);
  return { sma, upperBand, lowerBand };
};

const calculateSMA = (data, period) => {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, cur) => acc + cur.Close, 0);
    return sum / period;
  });
};

const StockDetail = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [interval, setInterval] = useState('1d');
  const [period, setPeriod] = useState('1y');
  const { ticker } = useParams();
  const [additionalStocks, setAdditionalStocks] = useState([]);
  const [additionalStockData, setAdditionalStockData] = useState([]);
  const [chartType, setChartType] = useState('candlestick');
  const [error, setError] = useState(null);
  const [maPeriods, setMaPeriods] = useState([]);
  const [maValues, setMaValues] = useState({});
  const [lines, setLines] = useState([]);
  const [stockParams, setStockParams] = useState({});
  const navigate = useNavigate();

  const fetchStockData = async (ticker, period, interval) => {
    try {
      const response = await axios.get('http://localhost:8000/api/stock-data/', {
        params: { ticker, period, interval }
      });
      setData(response.data.stockdata);
      setVolumeData(response.data.stockdata.map(item => ({ x: item.index, y: item.Volume })));
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError(err.response ? err.response.data.error : 'Error fetching data');
    }
  };

  const fetchAdditionalStockData = async () => {
    try {
      const responses = await Promise.all(
        additionalStocks.map(stock => {
          const params = stockParams[stock] || { period: '1y', interval: '1d' };
          return axios.get('http://localhost:8000/api/stock-data/', {
            params: { ticker: stock, period: params.period, interval: params.interval }
          });
        })
      );
      setAdditionalStockData(responses.map(response => response.data.stockdata));
    } catch (err) {
      console.error("Error fetching additional stock data:", err);
      toast.error("Error fetching additional stock data");
    }
  };

  useEffect(() => {
    fetchStockData(ticker, period, interval);
  }, [ticker, period, interval]);

  useEffect(() => {
    if (additionalStocks.length > 0) {
      fetchAdditionalStockData();
    }
  }, [additionalStocks, stockParams]);

  useEffect(() => {
    if (data.length > 0 && maPeriods.length > 0) {
      calculateMovingAverages();
    }
  }, [data, maPeriods]);

  const calculateMovingAverages = () => {
    const maValues = {};
    maPeriods.forEach(period => {
      maValues[period] = data.map((d, i) => {
        if (i < period - 1) return null;
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, cur) => acc + cur.Close, 0);
        return sum / period;
      });
    });
    setMaValues(maValues);
  };

  const handleMaPeriodChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setMaPeriods(value);
  };

  const handleAddStock = (stock) => {
    setAdditionalStocks([...additionalStocks, stock.toUpperCase()]);
    setStockParams({
      ...stockParams,
      [stock.toUpperCase()]: { period: '1y', interval: '1d' }
    });
  };

  const getDateOrDatetime = (item, interval) => {
    const intradayIntervals = ['1m', '5m', '15m', '1h'];
    return intradayIntervals.includes(interval) ? item.Datetime : item.Date;
  };

  const handleAddLine = (start, end) => {
    setLines([...lines, { start, end }]);
  };

  const handlePeriodChange = (ticker, period) => {
    if (ticker === 'main') {
      setPeriod(period);
    } else {
      setStockParams({
        ...stockParams,
        [ticker]: { ...stockParams[ticker], period }
      });
    }
  };

  const handleIntervalChange = (ticker, interval) => {
    if (ticker === 'main') {
      setInterval(interval);
    } else {
      setStockParams({
        ...stockParams,
        [ticker]: { ...stockParams[ticker], interval }
      });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <div className={classes.buttonGroupContainer}>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={() => handlePeriodChange('main', '1d')}>1D</Button>
            <Button onClick={() => handlePeriodChange('main', '5d')}>5D</Button>
            <Button onClick={() => handlePeriodChange('main', '1mo')}>1M</Button>
            <Button onClick={() => handlePeriodChange('main', '6mo')}>6M</Button>
            <Button onClick={() => handlePeriodChange('main', '1y')}>1Y</Button>
            <Button onClick={() => handlePeriodChange('main', 'max')}>MAX</Button>
          </ButtonGroup>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={() => handleIntervalChange('main', '1m')}>1M</Button>
            <Button onClick={() => handleIntervalChange('main', '5m')}>5M</Button>
            <Button onClick={() => handleIntervalChange('main', '15m')}>15M</Button>
            <Button onClick={() => handleIntervalChange('main', '1h')}>1H</Button>
            <Button onClick={() => handleIntervalChange('main', '1d')}>1D</Button>
            <Button onClick={() => handleIntervalChange('main', '1wk')}>1W</Button>
          </ButtonGroup>
        </div>
        <Button onClick={() => setChartType(chartType === 'candlestick' ? 'line' : 'candlestick')}>
          Toggle Chart Type
        </Button>
        <TextField
          label="Moving Averages"
          placeholder="e.g., 10,20,50"
          variant="outlined"
          size="small"
          className={classes.maInput}
          onChange={handleMaPeriodChange}
        />
        <TextField
          label="Add Stock"
          placeholder="e.g., MSFT"
          variant="outlined"
          size="small"
          className={classes.stockInput}
          onBlur={(e) => handleAddStock(e.target.value)}
        />
      </div>
      <div className={classes.chartContainer}>
        <div className={classes.chart}>
          <div className={classes.buttonGroupContainer}>
            
          </div>
          <Plot
            data={[
              {
                x: data.map(item => getDateOrDatetime(item, interval)),
                open: chartType === 'candlestick' ? data.map(item => item.Open) : undefined,
                high: chartType === 'candlestick' ? data.map(item => item.High) : undefined,
                low: chartType === 'candlestick' ? data.map(item => item.Low) : undefined,
                close: data.map(item => item.Close),
                y: chartType === 'line' ? data.map(item => item.Close) : undefined,
                type: chartType,
                name: 'Stock Price',
                increasing: { line: { color: 'green' } },
                decreasing: { line: { color: 'red' } },
              },
              ...Object.keys(maValues).map(period => ({
                x: data.map(item => getDateOrDatetime(item, interval)),
                y: maValues[period],
                type: 'scatter',
                mode: 'lines',
                name: `MA ${period}`,
              })),
              ...lines.map((line, index) => ({
                x: [line.start.x, line.end.x],
                y: [line.start.y, line.end.y],
                type: 'scatter',
                mode: 'lines',
                name: `Line ${index + 1}`,
                line: { color: 'red', width: 2 },
              }))
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
            style={{ width: '100%', height: '400px' }}
          />
          <Plot
            data={[
              {
                x: volumeData.map(item => getDateOrDatetime(item, interval)),
                y: volumeData.map(item => item.y),
                type: 'bar',
                name: 'Volume',
                marker: { color: 'rgba(100, 150, 250, 0.5)' },
              }
            ]}
            layout={{
              title: 'Volume',
              xaxis: {
                title: 'Date',
                rangebreaks: [
                  { pattern: 'day of week', bounds: ["sat", "mon"] },
                  { pattern: 'hour', bounds: [16, 9] }
                ]
              },
              yaxis: { title: 'Volume' },
              autosize: true,
              margin: { l: 50, r: 50, t: 50, b: 50 },
              height: 200,
            }}
            useResizeHandler={true}
            style={{ width: '100%' }}
          />
          <Plot
            data={[
              {
                x: data.map(item => getDateOrDatetime(item, interval)),
                y: calculateRSI(data),
                type: 'scatter',
                mode: 'lines',
                name: 'RSI',
                line: { color: 'blue' },
              },
              {
                x: data.map(item => getDateOrDatetime(item, interval)),
                y: calculateMACD(data).macd,
                type: 'scatter',
                mode: 'lines',
                name: 'MACD',
                line: { color: 'purple' },
              },
              {
                x: data.map(item => getDateOrDatetime(item, interval)),
                y: calculateMACD(data).signal,
                type: 'scatter',
                mode: 'lines',
                name: 'Signal Line',
                line: { color: 'orange' },
              },
              ...calculateBollingerBands(data).upperBand.map((band, index) => ({
                x: data.map(item => getDateOrDatetime(item, interval)),
                y: band,
                type: 'scatter',
                mode: 'lines',
                name: `Upper Bollinger Band ${index}`,
                line: { color: 'grey' },
              })),
              ...calculateBollingerBands(data).lowerBand.map((band, index) => ({
                x: data.map(item => getDateOrDatetime(item, interval)),
                y: band,
                type: 'scatter',
                mode: 'lines',
                name: `Lower Bollinger Band ${index}`,
                line: { color: 'grey' },
              }))
            ]}
            layout={{
              title: 'Technical Indicators',
              xaxis: {
                title: 'Date',
                rangebreaks: [
                  { pattern: 'day of week', bounds: ["sat", "mon"] },
                  { pattern: 'hour', bounds: [16, 9] }
                ]
              },
              yaxis: { title: 'Value' },
              autosize: true,
              margin: { l: 50, r: 50, t: 50, b: 50 },
              height: 400,
            }}
            useResizeHandler={true}
            style={{ width: '100%' }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        {additionalStockData.map((stockData, index) => (
          <div key={index} className={classes.chart}>
            <div className={classes.buttonGroupContainer}>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button onClick={() => handlePeriodChange(additionalStocks[index], '1d')}>1D</Button>
                <Button onClick={() => handlePeriodChange(additionalStocks[index], '5d')}>5D</Button>
                <Button onClick={() => handlePeriodChange(additionalStocks[index], '1mo')}>1M</Button>
                <Button onClick={() => handlePeriodChange(additionalStocks[index], '6mo')}>6M</Button>
                <Button onClick={() => handlePeriodChange(additionalStocks[index], '1y')}>1Y</Button>
                <Button onClick={() => handlePeriodChange(additionalStocks[index], 'max')}>MAX</Button>
              </ButtonGroup>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button onClick={() => handleIntervalChange(additionalStocks[index], '1m')}>1M</Button>
                <Button onClick={() => handleIntervalChange(additionalStocks[index], '5m')}>5M</Button>
                <Button onClick={() => handleIntervalChange(additionalStocks[index], '15m')}>15M</Button>
                <Button onClick={() => handleIntervalChange(additionalStocks[index], '1h')}>1H</Button>
                <Button onClick={() => handleIntervalChange(additionalStocks[index], '1d')}>1D</Button>
                <Button onClick={() => handleIntervalChange(additionalStocks[index], '1wk')}>1W</Button>
              </ButtonGroup>
            </div>
            <Plot
              data={[
                {
                  x: stockData.map(item => getDateOrDatetime(item, stockParams[additionalStocks[index]].interval)),
                  open: chartType === 'candlestick' ? stockData.map(item => item.Open) : undefined,
                  high: chartType === 'candlestick' ? stockData.map(item => item.High) : undefined,
                  low: chartType === 'candlestick' ? stockData.map(item => item.Low) : undefined,
                  close: stockData.map(item => item.Close),
                  y: chartType === 'line' ? stockData.map(item => item.Close) : undefined,
                  type: chartType,
                  name: 'Stock Price',
                  increasing: { line: { color: 'green' } },
                  decreasing: { line: { color: 'red' } },
                },
                ...Object.keys(maValues).map(period => ({
                  x: stockData.map(item => getDateOrDatetime(item, stockParams[additionalStocks[index]].interval)),
                  y: maValues[period],
                  type: 'scatter',
                  mode: 'lines',
                  name: `MA ${period}`,
                })),
                ...lines.map((line, index) => ({
                  x: [line.start.x, line.end.x],
                  y: [line.start.y, line.end.y],
                  type: 'scatter',
                  mode: 'lines',
                  name: `Line ${index + 1}`,
                  line: { color: 'red', width: 2 },
                }))
              ]}
              layout={{
                title: `${additionalStocks[index]} Stock Price`,
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
              style={{ width: '100%', height: '400px' }}
            />
            <Plot
              data={[
                {
                  x: stockData.map(item => getDateOrDatetime(item, stockParams[additionalStocks[index]].interval)),
                  y: stockData.map(item => item.Volume),
                  type: 'bar',
                  name: 'Volume',
                  marker: { color: 'rgba(100, 150, 250, 0.5)' },
                }
              ]}
              layout={{
                title: 'Volume',
                xaxis: {
                  title: 'Date',
                  rangebreaks: [
                    { pattern: 'day of week', bounds: ["sat", "mon"] },
                    { pattern: 'hour', bounds: [16, 9] }
                  ]
                },
                yaxis: { title: 'Volume' },
                autosize: true,
                margin: { l: 50, r: 50, t: 50, b: 50 },
                height: 200,
              }}
              useResizeHandler={true}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>
      <DetailsOfSrock />
    </div>
  );
};

export default StockDetail;
