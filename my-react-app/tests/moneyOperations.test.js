import { store } from '../src/store'; 
import { buyStock, sellStock } from '../src/features/profileSlice';
import axios from 'axios';

jest.mock('axios');

describe('Money operations', () => {
  it('should add money to the account', async () => {
    const initialCash = store.getState().profile.portfolio.cash_balance;
    const depositAmount = 100;

    axios.post.mockResolvedValueOnce({
      data: { cash_balance: initialCash + depositAmount },
    });

    await store.dispatch(addMoney(depositAmount));
    const state = store.getState();
    expect(state.profile.portfolio.cash_balance).toBe(initialCash + depositAmount);
  });

  it('should withdraw money from the account', async () => {
    const initialCash = store.getState().profile.portfolio.cash_balance;
    const withdrawAmount = 50;

    axios.post.mockResolvedValueOnce({
      data: { cash_balance: initialCash - withdrawAmount },
    });

    await store.dispatch(withdrawMoney(withdrawAmount));
    const state = store.getState();
    expect(state.profile.portfolio.cash_balance).toBe(initialCash - withdrawAmount);
  });
});
