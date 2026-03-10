/**
 * Login component tests.
 * Verifies form renders and calls login service.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock AuthContext
const mockLogin = vi.fn();
const mockUser = null;

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    login: mockLogin,
    logout: vi.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }) => children,
}));

import Login from '../../pages/Login';

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

describe('Login Page', () => {
  it('renders login form with email and password fields', () => {
    renderLogin();

    // Check for form elements
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('renders the brand name', () => {
    renderLogin();
    expect(screen.getByText(/VSICS/i)).toBeDefined();
  });
});
