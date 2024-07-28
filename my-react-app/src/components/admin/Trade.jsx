import React from 'react';
import TradingViewWidget from '../tradingview/TradingViewWidget';
import styled from 'styled-components';
const Trade = () => {

  return (
    <TradingSection>
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