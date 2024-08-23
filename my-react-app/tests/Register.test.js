// tests/Register.test.js
/*import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Register from '../src/components/Register';
import { registerUser } from '../src/features/authSlice';

const mockStore = configureStore([]);
jest.mock('../src/features/authSlice', () => ({
  registerUser: jest.fn()
}));

describe('Register Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        _id: null,
        registerStatus: 'idle',
        registerError: null
      }
    });
  });

  it('renders Register component', () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );

    expect(screen.getByPlaceholderText('name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Initial Balance')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('dispatches registerUser action on form submit', () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Initial Balance'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Register'));

    expect(registerUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      initial_balance: '1000'

    });
  });
});*/