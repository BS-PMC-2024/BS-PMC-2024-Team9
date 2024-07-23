// tests/Login.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../src/components/Login';
import { loginUser } from '../src/features/authSlice';

const mockStore = configureStore([]);
jest.mock('../src/features/authSlice', () => ({
  loginUser: jest.fn()
}));

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        _id: null,
        loginStatus: 'idle',
        loginError: null
      }
    });
  });

  it('renders Login component', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('dispatches loginUser action on form submit', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password' 
    });
  });
});