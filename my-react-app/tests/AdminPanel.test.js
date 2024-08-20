import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AdminPanel from './AdminPanel';
import { url } from '../../features/api';

// Create a mock store
const mockStore = configureStore([]);

describe('AdminPanel Component', () => {
  let store;
  let mockAxios;

  beforeEach(() => {
    // Initial mock store state
    store = mockStore({
      auth: {
        _id: 'admin123',
        isAdmin: true,
        token: 'fakeToken',
      },
      profile: {
        portfolio: {
          cash_balance: 1000,
        },
      },
    });

    // Create a mock adapter for axios
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('renders the admin panel with users and comments', async () => {
    const users = [
      { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
      { _id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const comments = [
      { _id: 'comment1', user: 'John Doe', date: new Date().toISOString(), comment: 'Great post!' },
      { _id: 'comment2', user: 'Jane Smith', date: new Date().toISOString(), comment: 'Thanks for sharing!' },
    ];

    mockAxios.onGet(`${url}/admin/users`).reply(200, users);
    mockAxios.onGet(`${url}/admin/comments`).reply(200, comments);

    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );

    // Assert that loading indicators are displayed initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the async data to load
    await waitFor(() => {
      users.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      });

      comments.forEach(comment => {
        expect(screen.getByText(comment.comment)).toBeInTheDocument();
      });
    });
  });

  it('deletes a user when the delete button is clicked', async () => {
    const users = [{ _id: 'user1', name: 'John Doe', email: 'john@example.com' }];
    const comments = [];

    mockAxios.onGet(`${url}/admin/users`).reply(200, users);
    mockAxios.onGet(`${url}/admin/comments`).reply(200, comments);
    mockAxios.onDelete(`${url}/admin/users/user1`).reply(200);

    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Wait for the user to be deleted
    await waitFor(() => expect(screen.queryByText('John Doe')).not.toBeInTheDocument());
  });

  it('deletes a comment when the delete button is clicked', async () => {
    const users = [];
    const comments = [{ _id: 'comment1', user: 'John Doe', date: new Date().toISOString(), comment: 'Great post!' }];

    mockAxios.onGet(`${url}/admin/users`).reply(200, users);
    mockAxios.onGet(`${url}/admin/comments`).reply(200, comments);
    mockAxios.onDelete(`${url}/admin/comments/comment1`).reply(200);

    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Great post!')).toBeInTheDocument());

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Wait for the comment to be deleted
    await waitFor(() => expect(screen.queryByText('Great post!')).not.toBeInTheDocument());
  });

  it('handles errors when fetching users and comments', async () => {
    mockAxios.onGet(`${url}/admin/users`).reply(500);
    mockAxios.onGet(`${url}/admin/comments`).reply(500);

    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/error fetching data/i)).toBeInTheDocument());
  });

  it('handles errors when deleting a user', async () => {
    const users = [{ _id: 'user1', name: 'John Doe', email: 'john@example.com' }];
    const comments = [];

    mockAxios.onGet(`${url}/admin/users`).reply(200, users);
    mockAxios.onGet(`${url}/admin/comments`).reply(200, comments);
    mockAxios.onDelete(`${url}/admin/users/user1`).reply(500);

    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => expect(screen.getByText(/error deleting user/i)).toBeInTheDocument());
  });

  it('handles errors when deleting a comment', async () => {
    const users = [];
    const comments = [{ _id: 'comment1', user: 'John Doe', date: new Date().toISOString(), comment: 'Great post!' }];

    mockAxios.onGet(`${url}/admin/users`).reply(200, users);
    mockAxios.onGet(`${url}/admin/comments`).reply(200, comments);
    mockAxios.onDelete(`${url}/admin/comments/comment1`).reply(500);

    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Great post!')).toBeInTheDocument());

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => expect(screen.getByText(/error deleting comment/i)).toBeInTheDocument());
  });
});
