// tests/ChartTypeSelection.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartWithFavorite from '../components/StockDataCompo/ChartWithFavorite';

test('should render chart with default type', () => {
  render(<ChartWithFavorite data={[]} ticker="AAPL" />);
  expect(screen.getByText(/Candlestick Chart/i)).toBeInTheDocument();
});

test('should allow user to select chart type', () => {
  render(<ChartWithFavorite data={[]} ticker="AAPL" />);
  fireEvent.change(screen.getByLabelText(/Chart Type/i), { target: { value: 'line' } });
  expect(screen.getByText(/Line Chart/i)).toBeInTheDocument();
});
