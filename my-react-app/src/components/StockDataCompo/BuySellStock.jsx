import React from 'react';
import styled from 'styled-components';

const BuySellStock = ({ shares, handleSharesInputChange, handleBuyStock, handleSellStock}) => {
  return (
    <BuySellContainer>
      <h3>Buy/Sell Stock</h3>
      <div>
        <SharesInput
          type="number"
          value={shares}
          onChange={handleSharesInputChange}
          placeholder="Number of Shares"
        />
        <BuyButton onClick={handleBuyStock}>Buy</BuyButton>
        <SellButton onClick={handleSellStock}>Sell</SellButton>
      </div>
    </BuySellContainer>
  );
};

export default BuySellStock;

const BuySellContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SharesInput = styled.input`
  width: 40%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const BuyButton = styled.button`
  width: 20%;
  padding: 0.75rem;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 1rem;

  &:hover {
    background: #229954;
  }
`;

const SellButton = styled.button`
  width: 20%;
  padding: 0.75rem;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;
