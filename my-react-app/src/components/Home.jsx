import React from 'react';
import { Link } from 'react-router-dom';
import NewsFeed from '../components/summary-components/NewsFeed';
import UserGreeting from '../components/summary-components/UserGreeting';
import '..//..//src/Home.css'; // Import the CSS file
import { useSelector } from 'react-redux';
import TradingViewHotlist from './tradingview/TradingViewHotlist';
import TradingViewIndices from './tradingview/TradingViewIndices';

const Home = () => {

  return (
    <div className="home-container">
      <UserGreeting />
      <div style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
      <div style={{width:'60%'}} className="section tradingview-container">
        <h2 id='h2_test'>Trading View</h2>
        <div className="tradingview-widgets">
          <TradingViewHotlist />
          <TradingViewIndices />
        </div>
      </div>
      <div style={{width:'30%'}} className="section">
        <h2>Latest Financial News</h2>
        <NewsFeed />
      </div>
      </div>
    </div>
  );
};

export default Home;
