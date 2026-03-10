/**
 * RequireAuth component tests.
 * Verifies unauthenticated users are blocked.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock for unauthenticated state
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    token: null,
    loading: false,
  }),
}));

import RequireAuth from '../../components/RequireAuth';

describe('RequireAuth', () => {
  it('redirects to /login when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<RequireAuth><div>Dashboard</div></RequireAuth>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login, not render dashboard
    expect(screen.queryByText('Dashboard')).toBeNull();
    expect(screen.getByText('Login Page')).toBeDefined();
  });
});
