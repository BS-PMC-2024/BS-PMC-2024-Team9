import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import StockData from './components/StockData';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/Details/UserProfile';
import { toast, ToastContainer } from 'react-toastify';
import Pusher from 'pusher-js';

import "react-toastify/dist/ReactToastify.css";
import Home from './components/Home';
import StockDetail from './components/Details/StockDetail';
import AnalystRecommendations from './components/Details/AnalystRecommendations ';
import Trade from './components/admin/Trade';
import AnalysisList from './components/Analysis/AnalysisList';
import AddAnalysis from './components/Analysis/AddAnalysis';
import AdminPanel from './components/admin/AdminPanel';

function App() {

  useEffect(() => {
    const pusher = new Pusher('cb67c8ebd0ea59ee4a5e', {
      cluster: 'eu',
      useTLS: true
    });

    const channel = pusher.subscribe('price_alerts');
    channel.bind('price_alert', function (data) {
      console.log(`Received price alert: ${data.ticker} at ${data.price}`);
      toast.info(`Price alert: ${data.ticker} has reached ${data.price}`);
    });

    return () => {
      pusher.unsubscribe('price_alerts');
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ToastContainer/>
        <NavBar />
      </header>
      <main>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/stockdata" element={<StockData />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile/>}/>
          <Route path="/stock-detail/:ticker" element={<StockDetail/>}/>
          <Route path="/analystrecommendations" element={<AnalystRecommendations/>}/>
          <Route path="/trade" element={< Trade/>}/>
          <Route path="/" element={<AnalysisList/>}/>
          <Route path="/addanalysis" element={<AddAnalysis/>}/>
          <Route path="/adminpanel" element={<AdminPanel/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
