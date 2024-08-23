import React from 'react';
import TradingViewWidget from '../tradingview/TradingViewWidget';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Trade = () => {
  const {t } = useTranslation();
  return (
    <TradingSection>
      <Description>
        {t('Here you can analyze stocks and perform all kinds of performance and technical analysis.Use the tools available to examine trends, identify patterns, and make informed decisions based on up-to-date data')}.
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
