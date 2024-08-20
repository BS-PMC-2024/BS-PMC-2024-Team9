// components/AnalystRecommendations.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalystRecommendations } from '../../features/stockSlice';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const AnalystRecommendations = () => {
  const [ticker, setTicker] = useState('');
  const dispatch = useDispatch();
  const recommendations = useSelector((state) => state.stock.analystRecommendations);
  const error = useSelector((state) => state.stock.error);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchAnalystRecommendations({ ticker }))
      .unwrap()
      .then(() => {
        toast.success(`Recommendations fetched for ${ticker}`);
      })
      .catch((err) => {
        toast.error(`Error: ${err}`);
      });
  };

  return (
    <Container>
      <h2>Analyst Recommendations</h2>
      <form onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder="Enter ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <RecommendationsContainer>
        {recommendations.map((rec, index) => (
          <Recommendation key={index}>
            <p><strong>buy:</strong> {rec.buy}</p>
            <p><strong>hold:</strong> {rec.hold}</p>
            <p><strong>period:</strong> {rec.period}</p>
            <p><strong>sell:</strong> {rec.sell}</p>
            <p><strong>strongBuy:</strong> {rec.strongBuy}</p>
            <p><strong>strongSell:</strong> {rec.strongSell}</p>
            <p><strong>symbol:</strong> {rec.symbol}</p>
          </Recommendation>
        ))}
      </RecommendationsContainer>
    </Container>
  );
};

export default AnalystRecommendations;

const Container = styled.div`
  padding: 4rem;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #2980b9;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

const RecommendationsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`;

const Recommendation = styled.div`
  background: #fff;
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 5px;
  width: calc(33.33% - 1rem);
  box-sizing: border-box;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
`;