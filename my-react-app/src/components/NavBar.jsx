import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // נניח שהקובץ הזה יכיל את העיצובים
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from "../features/authSlice";
import { toast } from 'react-toastify';
import TradingViewCrypto from './tradingview/TradingViewCrypto';
import { IconButton, Select, MenuItem, Badge } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications'; // אייקון התראות
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageIcon from '@material-ui/icons/Language'; // אייקון שפה

const NavBar = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // ניהול ספירת התראות שלא נקראו
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // התחברות ל-Pusher
    const pusher = new Pusher('cb67c8ebd0ea59ee4a5e', {
      cluster: 'eu',
      useTLS: true
    });

    // האזנה לערוץ 'price_alerts' ולאירוע 'price_alert'
    const channel = pusher.subscribe('price_alerts');
    channel.bind('price_alert', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { message: `Alert: ${data.ticker} has reached $${data.price}` }
      ]);
      setUnreadCount((prevCount) => prevCount + 1); // הגדל את ספירת ההתראות שלא נקראו
    });

    // נקה את ההאזנה כאשר הקומפוננטה מתנתקת
    return () => {
      pusher.unsubscribe('price_alerts');
    };
  }, []);

  const handleLogout = () => {
    dispatch(userLogout());
    toast.warning("Logged out!", { position: "bottom-left" });
    navigate("/");
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0); // איפוס ספירת ההתראות שלא נקראו כאשר המשתמש פותח את ההתראות
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/" className="navbar-link">{t('Home')}</Link></li>
        <li className="navbar-item"><Link to="/stockdata" className="navbar-link">{t('Stock Data')}</Link></li>
        <li className="navbar-item"><Link to="/analystrecommendations" className="navbar-link">{t('Analyst')}</Link></li>
        <li className="navbar-item"><Link to="/trade" className="navbar-link">{t('Trading View')}</Link></li>

        {user._id && !user.isAdmin && (
          <li className="navbar-item"><Link to="/userprofile" className="navbar-link">{t('User Profile')}</Link></li>
        )}
        {user._id && user.isAdmin && (
          <li className="navbar-item"><Link to="/adminpanel" className="navbar-link">{t('Admin Panel')}</Link></li>
        )}
        {!user._id && (
          <>
            <li className="navbar-item"><Link to="/register" className="navbar-link">{t('Register')}</Link></li>
            <li className="navbar-item"><Link to="/login" className="navbar-link">{t('Login')}</Link></li>
          </>
        )}
      </ul>
      <div className="navbar-right">
        {user._id && (
          <div className="user-info">
            <span className="user-greeting">{t('Hello')}, {user.name}!</span>
            <IconButton onClick={handleLogout} aria-label="logout">
              <ExitToAppIcon style={{ color: '#aa0000', fontSize: 35 }} />
            </IconButton>

            {/* אייקון התראות */}
            <IconButton aria-label="notifications" onClick={toggleNotifications}>
              <Badge badgeContent={unreadCount} color="secondary">
                <NotificationsIcon style={{ color: '#555', fontSize: 30 }} />
              </Badge>
            </IconButton>

            {/* תפריט התראות */}
            {showNotifications && (
              <NotificationsContainer>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <NotificationItem key={index}>
                      {notification.message}
                    </NotificationItem>
                  ))
                ) : (
                  <NotificationItem>{t('No new notifications')}</NotificationItem>
                )}
              </NotificationsContainer>
            )}

            <StyledSelectContainer>
              <LanguageIcon style={{ color: '#555', marginRight: '8px' }} />
              <StyledSelect
                value={selectedLanguage}
                onChange={handleLanguageChange}
                inputProps={{ 'aria-label': 'Language select' }}
              >
                <MenuItem value="en">
                  <span role="img" aria-label="English">🇺🇸</span> English
                </MenuItem>
                <MenuItem value="he">
                  <span role="img" aria-label="Hebrew">🇮🇱</span> עברית
                </MenuItem>
              </StyledSelect>
            </StyledSelectContainer>
          </div>
        )}
        <div className="trade">
          <TradingViewCrypto />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

const StyledSelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const StyledSelect = styled(Select)`
  .MuiSelect-select {
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif; /* או כל גופן אחר ברמה גבוהה */
    font-size: 16px;
    color: #333;
  }
`;

const NotificationsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 50px;
  width: 300px;
  background: #a61515;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #a91f1f;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #ba0000;
  }
`;
