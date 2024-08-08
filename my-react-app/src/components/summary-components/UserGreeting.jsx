import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfolio } from '../../features/profileSlice';
import styled from 'styled-components';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PersonIcon from '@material-ui/icons/Person';
import CircularProgress from '@material-ui/core/CircularProgress';
//import WelcomeImage from '../../assets/hai.jpg' // תחליף בנתיב לתמונה שלך

const UserGreeting = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const user = useSelector((state) => state.auth);
  const { portfolio, error, loading } = useSelector((state) => state.profile);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <Container>
      <GreetingCard>
        {user ? (
          <>
            <PersonIcon style={{ fontSize: 80, color: '#3f51b5' }} />
            <h1>Welcome back, {user.name}!</h1>
          </>
        ) : (
          <>
            <PersonIcon style={{ fontSize: 80, color: '#3f51b5' }} />
            <h1>Welcome to Our Investment Platform!</h1>
          </>
        )}
        <WalletSection>
          <AccountBalanceWalletIcon style={{ fontSize: 60, color: '#4caf50' }} />
          <div>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <div severity="error">Error loading portfolio: {error}</div>
            ) : portfolio ? (
              <BalanceText>Your cash balance is: {formatCurrency(portfolio.cash_balance)}</BalanceText>
            ) : (
              <div severity="warning">Portfolio not found.</div>
            )}
          </div>
        </WalletSection>
      </GreetingCard>
    </Container>
  );
};

export default UserGreeting;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 15vh;
  background: #f5f5f5;
  position: relative;
  top: 100px;
  right: 800px;
`;

const GreetingCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 1;
  h1 {
    margin: 1rem 0;
    color: #333;
  }
  p {
    color: #666;
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const BalanceText = styled.p`
  font-size: 1.2rem;
  color: #4caf50;
`;

const BackgroundImage = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60%;
  height: auto;
  opacity: 0.2;
`;
