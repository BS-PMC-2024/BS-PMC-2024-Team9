import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { IconButton, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import NewsCarousel from './StockDataCompo/NewsCarousel';
import ChartWithFavorite from './StockDataCompo/ChartWithFavorite';
import PredictedPrice from './StockDataCompo/PredictedPrice';
import BuySellStock from './StockDataCompo/BuySellStock';
import FavoriteStocks from './StockDataCompo/FavoriteStocks';
import Trades from './StockDataCompo/Trades';
import TradingViewWidget from './tradingview/TradingViewWidget';
import Comments from './Details/Comments';
import {
  fetchStockData,
  fetchPredictedPrice,
  fetchPortfolio,
  fetchFavorites,
  addFavorite,
  buyStock,
  sellStock,
  resetOperationStatus,
  removeFavorite,
} from '../features/stockSlice';

const StockData = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const stock = useSelector((state) => state.stock);

  const [ticker, setTicker] = useState('');
  const [period, setPeriod] = useState('');
  const [interval, setInterval] = useState('1d');
  const [movingAverages, setMovingAverages] = useState([]);
  const [strategy, setStrategy] = useState('ma_crossover');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [shares, setShares] = useState('');
  const [showBuySell, setShowBuySell] = useState(false);
  const lastPrice = stock.data[stock.data.length - 1].Close.toFixed(2);

  useEffect(() => {
    if (stock.data && stock.data.length) {
      setTicker(localStorage.getItem("lastTicker") || '');
      setPeriod(localStorage.getItem("lastPeriod") || '');
      setInterval(localStorage.getItem("lastInterval") || '1d');
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchFavorites());

    const pusher = new Pusher('cb67c8ebd0ea59ee4a5e', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('price_alerts');
    channel.bind('price_alert', function (data) {
      console.log(`Received price alert: ${data.ticker} at ${data.price}`);
      toast.info(`Price alert: ${data.ticker} has reached ${data.price}`);
    });

    const newsChannel = pusher.subscribe('news_channel');
    newsChannel.bind('new_article', function (data) {
      console.log(`Received new article: ${data.title}`);
    });

    return () => {
      pusher.unsubscribe('price_alerts');
      pusher.unsubscribe('news_channel');
    };
  }, [dispatch]);

  const handleMAChange = (e) => {
    const value = e.target.value;
    setMovingAverages(value.split(',').map(ma => ma.trim()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const upperCaseTicker = ticker.toUpperCase();
    dispatch(fetchStockData({ ticker: upperCaseTicker, period, interval, movingAverages, strategy, fromDate, toDate }));
    localStorage.setItem("lastTicker", upperCaseTicker);
    localStorage.setItem("lastPeriod", period);
    localStorage.setItem("lastInterval", interval);
    dispatch(fetchPredictedPrice({ ticker: upperCaseTicker, period, interval }));
    localStorage.setItem('stockPredictedPrice', stock.predictedPrice);
    setShowBuySell(true);
    localStorage.setItem("showBuySell", true);
  };

  const handleSharesInputChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setShares(value);
    }
  };

  const handleAddToFavorites = () => {
    const upperCaseTicker = ticker.toUpperCase();
    dispatch(addFavorite(upperCaseTicker));
    toast.success(`The ${upperCaseTicker} added to your favorite`)
  };

  useEffect(() => {
    if (stock.operationStatus === 'fulfilled') {
      toast.success(`Operation successful: ${ticker} at the price of ${lastPrice}`);
      dispatch(resetOperationStatus());
    } else if (stock.operationStatus === 'rejected') {
      toast.error(`Operation failed: ${stock.error}`);
      dispatch(resetOperationStatus());
    }
  }, [stock.operationStatus, stock.error, dispatch]);

  const handleBuyStock = () => {
    if (parseFloat(shares) <= 0) {
      toast.error('Shares must be greater than zero');
      return;
    }
    const lastPrice = stock.data[stock.data.length - 1].Close.toFixed(2);
    dispatch(buyStock({ ticker, shares, price: lastPrice }));
  };

  const handleSellStock = () => {
    if (parseFloat(shares) <= 0) {
      toast.error('Shares must be greater than zero');
      return;
    }
    const lastPrice = stock.data[stock.data.length - 1].Close.toFixed(2);
    dispatch(sellStock({ ticker, shares, price: lastPrice }));
  };

  const handleRemoveFavorite = (ticker) => {
    const upperCaseTicker = ticker.toUpperCase();
    dispatch(removeFavorite(upperCaseTicker))
      .then(() => {
        toast.success('Removed favorite');
      })
      .catch((err) => {
        toast.error(`Error removing favorite: ${err.message}`);
      });
  };

  return (
    <div>
      <InputSection>
        <form className="input-form" onSubmit={handleSubmit}>
          <TextField
            label="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="e.g., 1d, 5d, 1mo, 6mo, 1y"
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Interval</InputLabel>
            <Select value={interval} onChange={(e) => setInterval(e.target.value)}>
              <MenuItem value="1m">1 Minute</MenuItem>
              <MenuItem value="2m">2 Minutes</MenuItem>
              <MenuItem value="5m">5 Minutes</MenuItem>
              <MenuItem value="15m">15 Minutes</MenuItem>
              <MenuItem value="30m">30 Minutes</MenuItem>
              <MenuItem value="60m">1 Hour</MenuItem>
              <MenuItem value="90m">90 Minutes</MenuItem>
              <MenuItem value="1d">1 Day</MenuItem>
              <MenuItem value="5d">5 Days</MenuItem>
              <MenuItem value="1wk">1 Week</MenuItem>
              <MenuItem value="1mo">1 Month</MenuItem>
              <MenuItem value="3mo">3 Months</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Moving Averages"
            onChange={handleMAChange}
            placeholder="e.g., 20, 50, 200"
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Trading Strategy</InputLabel>
            <Select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
              <MenuItem value="ma_crossover">Moving Average Crossover</MenuItem>
              <MenuItem value="rsi">RSI</MenuItem>
              <MenuItem value="mean_reversion">Mean Reversion</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Get Data
          </Button>
        </form>
      </InputSection>
        <ChartWithFavorite data={stock.data} ticker={ticker} handleAddToFavorites={handleAddToFavorites} movingAverages={movingAverages} interval={interval} />
      <PredictedSection>
        <PredictedPrice predictedPrice={stock.predictedPrice} />
      </PredictedSection>
      <SideSection>
        <NewsSection>
          <NewsCarousel news={stock.news} />
        </NewsSection>
        <BuySellSection>
          <BuySellStock showBuySell={showBuySell} shares={shares} handleSharesInputChange={handleSharesInputChange} handleBuyStock={handleBuyStock} handleSellStock={handleSellStock} />
        </BuySellSection>
        <TradesSection>
          <Trades trades={stock.trades} successRate={stock.successRate} />
        </TradesSection>
        <FavoriteSection>
          <FavoriteStocks favorites={stock.favorites} handleRemoveFavorite={handleRemoveFavorite} />
        </FavoriteSection>
        <CommentsSection>
          <Comments ticker = {ticker}/>
        </CommentsSection>
      </SideSection>
    </div>
  );
};
/*
 <TradingSection>
          <TradingViewWidget />
        </TradingSection>
*/
export default StockData;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
  padding: 1rem;
`;

const InputSection = styled.div`
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 155px;
  left: 16px;
  font-size: 18px;
  
`;

/*const GraphSection = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  position: absolute;
  left: 500px;
  top: 150px;
`;
*/
const ChartContainer = styled.div`
  width: 100%;
`;

const BuySellSection = styled.div`
  background: #f9f9f9;
  padding: rem;
  position: absolute;
  top: 300px;
  right: 13.5cm;
  font-size: 18px;

`;


const SideSection = styled.div`
  grid-column: 3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NewsSection = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  position: absolute;
  top: 100px;
  right: 16px;
  font-size: 18px;
`;

const TradesSection = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  position: absolute;
  top: 450px;
  right: 470px;
  font-size: 18px;
  
`;

const PredictedSection = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  position: absolute;
  top: 100px;
  right: 600px;
  font-size: 18px;
`;

const FavoriteSection = styled.div`
    background: #f9f9f9;
    font-size: 20px;
    align-items: center;
    grid-column: 2;
    top: 720px;
    position: absolute;
    left: 20px;

`;

const TradingSection = styled.div`
    grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  position: absolute;
  left: 500px;
  top: 800px;

`;

const CommentsSection = styled.div`
      grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  position: absolute;
  right: 20px;
  top: 600px;
`
