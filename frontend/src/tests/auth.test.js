import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AuthLogin from '../components/AuthLogin'; // Adjust the path as necessary
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';

jest.mock('js-cookie');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('config', () => ({ BACKEND_LOCALHOST: 'http://localhost:3000' }));

const renderComponent = () => {
  return render(
    <Router>
      <AuthLogin />
    </Router>
  );
};

describe('AuthLogin Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('displays error message on invalid credentials', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('sets cookies and redirects on successful login', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    fetch.mockResponseOnce(JSON.stringify({ accessToken: 'token123', userId: 'user123' }), { status: 200 });
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith('access_token', 'token123');
      expect(Cookies.set).toHaveBeenCalledWith('user_id', 'user123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('toggles password visibility', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
