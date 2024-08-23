/*import { store } from '../src/store';
import { addAlert, deleteAlert } from '../features/alertsSlice';
import axios from 'axios';

jest.mock('axios');

describe('Price alerts', () => {
  it('should add a price alert', async () => {
    const newAlert = { ticker: 'AAPL', price: 150 };

    axios.post.mockResolvedValueOnce({
      data: newAlert,
    });

    await store.dispatch(addAlert(newAlert));
    const state = store.getState();
    expect(state.alerts).toContainEqual(newAlert);
  });

  it('should delete a price alert', async () => {
    const alertId = '12345';

    axios.delete.mockResolvedValueOnce({
      data: { id: alertId },
    });

    await store.dispatch(deleteAlert(alertId));
    const state = store.getState();
    expect(state.alerts).not.toContainEqual(expect.objectContaining({ id: alertId }));
  });
});
*/
