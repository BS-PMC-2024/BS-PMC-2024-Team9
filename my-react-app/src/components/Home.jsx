import React from 'react';
import NewsFeed from '../components/summary-components/NewsFeed';
import UserGreeting from '../components/summary-components/UserGreeting';
import TradingViewHotlist from './tradingview/TradingViewHotlist';
import TradingViewIndices from './tradingview/TradingViewIndices';
import TransactionChart from './Details/TransactionChart';
import styled from 'styled-components';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AnnouncementIcon from '@material-ui/icons/Announcement';

const Home = () => {
  return (
    <Container>
      <UserGreeting />
      <Content>
        <Section>
          <SectionHeader>
            <AssessmentIcon style={{ fontSize: 36, marginRight: '0.5rem', color: '#4caf50' }} />
            <h2>Your Transaction History</h2>
          </SectionHeader>
          <TransactionChart />
        </Section>

        <Section>
          <SectionHeader>
            <TrendingUpIcon style={{ fontSize: 36, marginRight: '0.5rem', color: '#1976d2' }} />
            <h2>Trading View</h2>
          </SectionHeader>
          <TradingViewWidgets>
            <TradingViewHotlist />
            <TradingViewIndices />
          </TradingViewWidgets>
        </Section>

        <Section>
          <SectionHeader>
            <AnnouncementIcon style={{ fontSize: 36, marginRight: '0.5rem', color: '#ff9800' }} />
            <h2>Latest Financial News</h2>
          </SectionHeader>
          <NewsFeed />
        </Section>
      </Content>
    </Container>
  );
};

export default Home;

// Styled components
const Container = styled.div`
  padding: 2rem;
  background: #f3f4f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  h2 {
    color: #333;
    font-size: 24px;
  }
`;

const TradingViewWidgets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

