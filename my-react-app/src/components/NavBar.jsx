import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // נניח שהקובץ הזה יכיל את העיצובים
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from "../features/authSlice";
import { toast } from 'react-toastify';
import TradingViewCrypto from './tradingview/TradingViewCrypto';

const NavBar = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser(null));
    toast.warning("Logged out!", { position: "bottom-left" });
    navigate("/home");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/home" className="navbar-link">Home</Link></li>
        <li className="navbar-item"><Link to="/stockdata" className="navbar-link">Stock Data</Link></li>
        <li className="navbar-item"><Link to="/analystrecommendations" className="navbar-link">Analyst</Link></li>
        <li className="navbar-item"><Link to="/trade" className="navbar-link">Trade</Link></li>

        {/* תנאי להצגת הקישורים החדשים רק למשתמשים רגילים ולא למנהלנים */}
        {user._id && !user.isAdmin && (
          <>
            <li className="navbar-item"><Link to="/addanalysis" className="navbar-link">Add Analysis</Link></li>
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
        {user._id && (
          <li
            className="navbar-item"
            onClick={handleLogout}
          >
            Logout
          </li>
        )}
      </ul>
      <div className="trade">
        <TradingViewCrypto/>
      </div>
    </nav>
  );
};

export default NavBar;
