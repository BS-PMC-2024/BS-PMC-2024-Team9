import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfolio, fetchTransactions, addMoney, withdrawMoney ,updateUserPreferences} from '../../features/profileSlice';
import styled from 'styled-components';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setHeaders, url } from '../../features/api';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const { portfolio, transactions, error, loading } = useSelector((state) => state.profile);
  const [showOpenTransactions, setShowOpenTransactions] = useState(false);
  const [showClosedTransactions, setShowClosedTransactions] = useState(false);
  const [amount, setAmount] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({ ticker: '', price: '' });
  const [selectedLanguage, setSelectedLanguage] = useState( localStorage.getItem('selectedLanguage') || 'en'); // הוסף את זה
  const [selectedTimezone, setSelectedTimezone] = useState('UTC'); // הוסף את זה
  const { t, i18n } = useTranslation();

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTransactions());
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${url}/alerts`, setHeaders());
        setAlerts(response.data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchAlerts();
  }, [dispatch]);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('selectedLanguage' , selectedLanguage);
  } , [selectedLanguage , i18n]);

  const handleAddMoney = async () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      toast.error(t('Amount must be greater than zero.'));
      return;
    }
    dispatch(addMoney(parsedAmount));
    toast.success(t('The money has been deposited successfully.'));
    setAmount('');
  };

  const handleWithdrawMoney = async () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      toast.error(t('Amount must be greater than zero.'));
      return;
    }
    dispatch(withdrawMoney(parsedAmount));
    toast.success(t('The money was withdrawn successfully.'));
    setAmount('');
  };

  const handleAmount = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setAmount(e.target.value);
    }
  };

  const handleNewAlertChange = (e) => {
    const { name, value } = e.target;
    setNewAlert({ ...newAlert, [name]: value });
  };

  const handleAddAlert = async () => {
    // Validate that the price is a positive number
    const parsedPrice = parseFloat(newAlert.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error(t('Price must be a positive number.'));
      return;
    }

    try {
      const response = await axios.post(`${url}/alerts`, newAlert, setHeaders());
      setAlerts([...alerts, response.data]);
      toast.success(t('Alert added successfully.'));
      setNewAlert({ ticker: '', price: '' });
    } catch (err) {
      console.error("Error adding alert:", err);
      toast.error(t(err.response ? err.response.data.error : 'Error adding alert'));
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`${url}/alerts/${alertId}`, setHeaders());
      setAlerts(alerts.filter(alert => alert._id !== alertId));
      toast.success(t('Alert deleted successfully.'));
    } catch (err) {
      console.error("Error deleting alert:", err);
      toast.error(err.response ? err.response.data.error : 'Error deleting alert');
    }
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setPreferences({ ...preferences, [name]: value });
  };

  const handleSavePreferences = () => {
    const userId = user._id; // וודא שה-`user` קיים ויש לו `_id`
    const preferences = {
      language: selectedLanguage,
      timezone: selectedTimezone,
    };
  
    dispatch(updateUserPreferences({ userId, preferences }));
  };
  

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <ErrorMessage>{t('error')}: {error}</ErrorMessage>; 
  }

  // Separate open and closed transactions
  const openTransactions = transactions.filter(transaction => !transaction.closed);
  const closedTransactions = transactions.filter(transaction => transaction.closed);

  return (
    <Container>
      <WelcomeMessage>{t('welcome')}, {user.name}</WelcomeMessage>
      <PortfolioContainer>
        <SectionTitle>{t("Your Portfolio")}</SectionTitle>
        {portfolio ? (
          <div>
            <CashBalance>{t("Cash Balance:")} ${portfolio.cash_balance.toFixed(2)}</CashBalance>
            <SectionTitle>{t("Stocks")}</SectionTitle>
            <StockList>
              {portfolio.stocks.map((stock, index) => (
                <StockItem key={index}>
                  {stock.ticker} - {stock.shares} shares at ${stock.average_price.toFixed(2)}/share
                </StockItem>
              ))}
            </StockList>
            <AddWithdrawSection>
              <TextField
                label="Amount"
                value={amount}
                onChange={handleAmount}
                type="number"
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleAddMoney} fullWidth>
                {t('Add Money')}
              </Button>
              <Button variant="contained" color="secondary" onClick={handleWithdrawMoney} fullWidth>
               {t("Withdraw Money")}
              </Button>
            </AddWithdrawSection>
            <SectionTitle>{t("Price Alerts")}</SectionTitle>
            <AlertList>
              {alerts.map((alert, index) => (
                <AlertItem key={index}>
                  {alert.ticker} - ${alert.price.toFixed(2)}
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteAlert(alert._id)}>
                    {t("Delete")}
                  </Button>
                </AlertItem>
              ))}
            </AlertList>
            <AddAlertSection>
              <TextField
                label="Ticker"
                name="ticker"
                value={newAlert.ticker}
                onChange={handleNewAlertChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Price"
                name="price"
                value={newAlert.price}
                onChange={handleNewAlertChange}
                type="number"
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleAddAlert} fullWidth>
                {t("Add Alert")}
              </Button>
            </AddAlertSection>
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}
      </PortfolioContainer>
      
      <TransactionsContainer>
        <SectionTitle>
          {t("Open Transactions")}
          <ToggleButton onClick={() => setShowOpenTransactions(!showOpenTransactions)}>
            {showOpenTransactions ? 'Hide' : 'Show'}
          </ToggleButton>
        </SectionTitle>
        {showOpenTransactions && (
          openTransactions.length > 0 ? (
            <TransactionList>
              {openTransactions.map((transaction, index) => (
                <TransactionItem key={index}>
                  {transaction.date} - Bought {transaction.shares} shares of {transaction.ticker} at ${transaction.price.toFixed(2)} each
                </TransactionItem>
              ))}
            </TransactionList>
          ) : (
            <p>{t("No open transactions")}.</p>
          )
        )}
      </TransactionsContainer>
      <TransactionsContainer>
        <SectionTitle>
          {t("Closed Transactions")}
          <ToggleButton onClick={() => setShowClosedTransactions(!showClosedTransactions)}>
            {showClosedTransactions ? 'Hide' : 'Show'}
          </ToggleButton>
        </SectionTitle>
        {showClosedTransactions && (
          closedTransactions.length > 0 ? (
            <TransactionList>
              {closedTransactions.map((transaction, index) => (
                <TransactionItem key={index}>
                  {transaction.date} - {transaction.type === 'Sell' ? 'Sold' : 'Bought'} {transaction.shares} shares of {transaction.ticker} at ${transaction.price.toFixed(2)} each. Profit/Loss: ${transaction.profitOrLoss.toFixed(2)}
                </TransactionItem>
              ))}
            </TransactionList>
          ) : (
            <p>{t("No closed transactions")}.</p>
          )
        )}
      </TransactionsContainer>
      <PreferencesContainer>
        <SectionTitle>{t('user_preferences')}</SectionTitle> {/* הוסף את זה */}
        <PreferencesForm>
          <label>
            {t('language')}:
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="he">עברית</option>
            </select>
          </label>
          <label>
            {t('timezone')}:
            <select value={selectedTimezone} onChange={(e) => setSelectedTimezone(e.target.value)}>
              <option value="UTC">UTC</option>
              <option value="GMT">GMT</option>
            </select>
          </label>
          <Button variant="contained" color="primary" onClick={handleSavePreferences}>
            {t('save_preferences')} 
          </Button>
        </PreferencesForm>
      </PreferencesContainer>
    </Container>
  );
};

export default UserProfile;

const Container = styled.div`
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
`;

const WelcomeMessage = styled.h1`
  color: #333;
  text-align: center;
`;

const PortfolioContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  color: #555;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CashBalance = styled.p`
  font-size: 1.2rem;
  color: #27ae60;
  margin-bottom: 1rem;
`;

const StockList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const StockItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
  }
`;

const AddWithdrawSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TransactionsContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const TransactionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
  }
`;

const ToggleButton = styled.button`
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
  text-align: center;
`;

const AddAlertSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AlertList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AlertItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
  }
`;

const PreferencesContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const PreferencesForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
