import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';
import { renderWithRouter, SESSION_STORAGE_KEYS } from '../test/renderWithRouter';

const navigateMock = vi.fn();

const { loginMock, registerMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('../api/auth', () => ({
  login: loginMock,
  register: registerMock,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock('framer-motion', () => {
  const MotionComponent = ({ children, ...props }) => <div {...props}>{children}</div>;

  return {
    motion: new Proxy(
      {},
      {
        get: () => MotionComponent,
      },
    ),
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and stores the authenticated session', async () => {
    const user = userEvent.setup();

    loginMock.mockResolvedValue({
      user: {
        id: 'user-1',
        name: 'Maria Silva',
        email: 'maria@example.com',
      },
      token: 'jwt-token',
    });

    renderWithRouter(<LoginPage />, { route: '/login' });

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'maria@example.com');
    await user.type(screen.getByPlaceholderText('**********'), 'super-secret');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'maria@example.com',
        password: 'super-secret',
      });
    });

    expect(localStorage.getItem(SESSION_STORAGE_KEYS.token)).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEYS.user))).toEqual({
      id: 'user-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
    });
    expect(toastSuccessMock).toHaveBeenCalledWith('Bem-vinda de volta!');
    expect(navigateMock).toHaveBeenCalledWith('/agendamento', { replace: true });
  });

  it('registers a new user and stores the session', async () => {
    const user = userEvent.setup();

    registerMock.mockResolvedValue({
      user: {
        id: 'user-2',
        name: 'Ana Souza',
        email: 'ana@example.com',
        phone: '(11) 98765-4321',
      },
      token: 'new-user-token',
    });

    renderWithRouter(<LoginPage />, { route: '/login' });

    await user.click(screen.getByText('Cadastre-se'));
    await user.type(screen.getByPlaceholderText('Ex: Maria Silva'), 'Ana Souza');
    await user.type(screen.getByPlaceholderText('seu@email.com'), 'ana@example.com');
    await user.type(screen.getByPlaceholderText('(XX) 9XXXX-XXXX'), '11987654321');
    await user.type(screen.getByPlaceholderText('**********'), 'super-secret');
    await user.click(screen.getByRole('button', { name: 'Cadastrar e Entrar' }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'Ana Souza',
        email: 'ana@example.com',
        password: 'super-secret',
        phone: '(11) 98765-4321',
      });
    });

    expect(localStorage.getItem(SESSION_STORAGE_KEYS.token)).toBe('new-user-token');
    expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEYS.user))).toEqual({
      id: 'user-2',
      name: 'Ana Souza',
      email: 'ana@example.com',
      phone: '(11) 98765-4321',
    });
    expect(toastSuccessMock).toHaveBeenCalledWith('Cadastro realizado com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/agendamento', { replace: true });
  });
});
