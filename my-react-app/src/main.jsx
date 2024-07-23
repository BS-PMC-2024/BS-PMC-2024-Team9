import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import App from './App';
import { loadUser } from './features/authSlice';
import axios from 'axios';

store.dispatch(loadUser());
// הגדרת ברירת המחדל עבור axios כדי לשלוח credentials
axios.defaults.withCredentials = true;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
