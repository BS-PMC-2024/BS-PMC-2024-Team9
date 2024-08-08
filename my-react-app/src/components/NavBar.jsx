import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // נניח שהקובץ הזה יכיל את העיצובים
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from "../features/authSlice";
import { toast } from 'react-toastify';
import TradingViewCrypto from './tradingview/TradingViewCrypto';
import { IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//nav bar
const NavBar = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(userLogout());
    toast.warning("Logged out!", { position: "bottom-left" });
    navigate("/");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
        <li className="navbar-item"><Link to="/stockdata" className="navbar-link">Stock Data</Link></li>
        <li className="navbar-item"><Link to="/analystrecommendations" className="navbar-link">Analyst</Link></li>
        <li className="navbar-item"><Link to="/trade" className="navbar-link">Trading View</Link></li>

        {/* תנאי להצגת הקישורים החדשים רק למשתמשים רגילים ולא למנהלנים */}
        {user._id && !user.isAdmin && (
          <>
            <li className="navbar-item"><Link to="/userprofile" className="navbar-link">User Profile</Link></li>
          </>
        )}
        {user._id && user.isAdmin && (
             <li className="navbar-item"><Link to="/adminpanel" className="navbar-link">Admin Panel</Link></li>
        )}
        {!user._id && (
          <>
            <li className="navbar-item"><Link to="/register" className="navbar-link">Register</Link></li>
            <li className="navbar-item"><Link to="/login" className="navbar-link">Login</Link></li>
          </>
        )}
      </ul>
      <div className="navbar-right">
        {user._id && (
          <div className="user-info">
            <span className="user-greeting">Hello, {user.name}!</span>
            <IconButton onClick={handleLogout} aria-label="logout">
              <ExitToAppIcon style={{ color: '#f50057' ,position:'absolute' ,left:1930 , top:-22,fontSize:35}} />
            </IconButton>
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
