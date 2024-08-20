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
import InfoIcon from '@material-ui/icons/Info';
import { useTranslation } from 'react-i18next';


const Home = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <UserGreeting />
      <Content>
        <SectionLarge>
          <SectionHeader>
            <AssessmentIcon style={{ fontSize: 56, marginRight: '0.5rem', color: '#4caf50' }} />
            <h2>{t('Your Transaction History')}</h2>
          </SectionHeader>
          <TransactionChart />
        </SectionLarge>

        <SectionSmall>
          <SectionHeader>
            <AnnouncementIcon style={{ fontSize: 36, marginRight: '0.1rem', color: '#ff9800' }} />
            <h2>{t('Latest Financial News')}</h2>
          </SectionHeader>
          <NewsFeed />
        </SectionSmall>

        <SectionSmall>
          <SectionHeader>
            <InfoIcon style={{ fontSize: 36, marginRight: '0.1rem', color: '#ff9800' }} />
            <h2>{t('Tips for Beginners')}</h2>
          </SectionHeader>
          <TipsContent>
            <Tip>
              <strong>{t('Understanding the Basics')}:</strong>{t(' Before you start trading, it is important to learn and understand the basics of the market and the various terms related to investments, such as stocks, bonds, options, ETFs, etc. Read books, attend courses and follow the economic news')}.
            </Tip>
            <Tip>
              <strong>{t('Strategic Planning')}:</strong>{t("Develop a structured trading plan that includes your investment goals, the level of risk you are willing to take, and your entry and exit strategies. Be consistent in your methods and learn from your mistakes")}.
            </Tip>
            <Tip>
              <strong>{t('Risk Management')}:</strong>{t('always determine the amount of capital you are willing to lose in each transaction and use tools such as stop loss to minimize damages. Never invest money you cant afford to lose')}.
            </Tip>
            <Tip>
              <strong>{t('Diversification')}:</strong>{t('Dont invest all your money in one asset or market. Spread your investments across multiple asset classes and different economic sectors to minimize risk and increase profit potential')}.
            </Tip>
            <Tip>
              <strong>{t('Persistence and Continuous Learning')}:</strong>{t('the market is constantly changing and requires the investor to continue learning and updating. Consider using demo accounts to practice before investing real money, read financial news, and follow market behaviors to better understand trading dynamics')}.
            </Tip>
          </TipsContent>
        </SectionSmall>

        <SectionFullWidth>
          <SectionHeader>
            <TrendingUpIcon style={{ fontSize: 56, marginRight: '0.5rem', color: '#1976d2' }} />
            <h2>{t('Trading View')}</h2>
          </SectionHeader>
          <TradingViewWidgets>
            <TradingViewHotlist />
            <TradingViewIndices />
          </TradingViewWidgets>
        </SectionFullWidth>
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
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem; /* צמצום ה-gap בין החלוניות */
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SectionLarge = styled.div`
  background: white;
  padding: 2rem; /* אפשר להתאים את ה-padding בהתאם לצורך */
  border-radius: 42px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0; /* ביטול המרווח התחתון */
`;

const SectionSmall = styled.div`
  background: white;
  padding: 2rem; /* אפשר להתאים את ה-padding בהתאם לצורך */
  border-radius: 42px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0; /* ביטול המרווח התחתון */
`;

const SectionFullWidth = styled.div`
  grid-column: span 2;
  background: white;
  padding: 2rem; /* אפשר להתאים את ה-padding בהתאם לצורך */
  border-radius: 42px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem; /* צמצום המרווח העליון */
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem; /* ניתן לצמצם את המרווח כאן אם יש צורך */
  h2 {
    color: #333;
    font-size: 28px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
`;

const TipsContent = styled.div`
  font-size: 20px;
  line-height: 1.6;
  color: #555;
`;

const Tip = styled.p`
  margin-bottom: 1rem;
`;

const TradingViewWidgets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

