/*import { store } from '../src/store';
import { addFavorite, removeFavorite } from '../src/features/stockSlice';
import axios from 'axios';

jest.mock('axios');

describe('Favorite stocks', () => {
  it('should add a stock to favorites', async () => {
    const ticker = 'AAPL';

    axios.post.mockResolvedValueOnce({
      data: { favorites: [ticker] },
    });

    await store.dispatch(addFavorite(ticker));
    const state = store.getState();
    expect(state.favorites).toContain(ticker);
  });

  it('should remove a stock from favorites', async () => {
    const ticker = 'AAPL';

    axios.delete.mockResolvedValueOnce({
      data: { favorites: [] },
    });

    await store.dispatch(removeFavorite(ticker));
    const state = store.getState();
    expect(state.favorites).not.toContain(ticker);
  });
});*/
