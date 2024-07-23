import React from 'react';
import styled from 'styled-components';

const PredictedPrice = ({ predictedPrice }) => {
  return (
    <PredictionContainer>
      <h2>Predicted Price</h2>
      <p>{predictedPrice}</p>
    </PredictionContainer>
  );
};

export default PredictedPrice;

const PredictionContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
