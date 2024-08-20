import React from 'react';
import TradingViewWidget from '../tradingview/TradingViewWidget';
import styled from 'styled-components';

const Trade = () => {
  return (
    <TradingSection>
      <Description>
        כאן תוכלו לנתח מניות ולבצע כל מיני ביצועים וניתוחים טכניים. השתמשו בכלים הזמינים כדי לבחון מגמות, לזהות דפוסים, ולבצע החלטות מושכלות על בסיס נתונים עדכניים.
      </Description>
      <TradingViewWidget />
    </TradingSection>
  );
};

export default Trade;

const TradingSection = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  position: absolute;
  left: 500px;
  top: 200px;
`;

const Description = styled.p`
  font-size: 25px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  max-width: 600px;
`;
