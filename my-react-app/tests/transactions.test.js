/*import { store } from '../src/store'; 
import { buyStock, sellStock } from '../src/features/stockSlice';
import axios from 'axios';

jest.mock('axios');

describe('Stock transactions', () => {
  it('should buy a stock', async () => {
    const transaction = { ticker: 'AAPL', shares: 10, price: 150 };

    axios.post.mockResolvedValueOnce({
      data: {
        portfolio: {
          stocks: [{ ticker: 'AAPL', shares: 10, average_price: 150 }],
        },
      },
    });

    await store.dispatch(buyStock(transaction));
    const state = store.getState();
    expect(state.profile.portfolio.stocks).toContainEqual(expect.objectContaining(transaction));
  });

  it('should sell a stock', async () => {
    const transaction = { ticker: 'AAPL', shares: 5, price: 160 };

    axios.post.mockResolvedValueOnce({
      data: {
        portfolio: {
          stocks: [{ ticker: 'AAPL', shares: 5, average_price: 150 }],
          cash_balance: 800,
        },
      },
    });

    await store.dispatch(sellStock(transaction));
    const state = store.getState();
    expect(state.profile.portfolio.stocks).toContainEqual(
      expect.objectContaining({ ticker: 'AAPL', shares: 5 })
    );
  });
});
*/