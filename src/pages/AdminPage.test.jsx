import React from 'react';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPage from './AdminPage';
import { renderWithRouter, setSessionState } from '../test/renderWithRouter';

const {
  loginMock,
  checkIsAdminMock,
  getUsersMock,
  getServicesMock,
  updateServiceMock,
  createServiceMock,
  deleteServiceMock,
  getAllAppointmentsMock,
  deleteAppointmentMock,
  blockSlotMock,
  deleteBlockMock,
  toastSuccessMock,
  toastErrorMock,
} = vi.hoisted(() => ({
  loginMock: vi.fn(),
  checkIsAdminMock: vi.fn(),
  getUsersMock: vi.fn(),
  getServicesMock: vi.fn(),
  updateServiceMock: vi.fn(),
  createServiceMock: vi.fn(),
  deleteServiceMock: vi.fn(),
  getAllAppointmentsMock: vi.fn(),
  deleteAppointmentMock: vi.fn(),
  blockSlotMock: vi.fn(),
  deleteBlockMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('../api/auth', () => ({
  login: loginMock,
  checkIsAdmin: checkIsAdminMock,
  getUsers: getUsersMock,
}));

vi.mock('../api/services', () => ({
  getServices: getServicesMock,
  updateService: updateServiceMock,
  createService: createServiceMock,
  deleteService: deleteServiceMock,
}));

vi.mock('../api/appointments', () => ({
  getAllAppointments: getAllAppointmentsMock,
  deleteAppointment: deleteAppointmentMock,
  blockSlot: blockSlotMock,
  deleteBlock: deleteBlockMock,
}));

vi.mock('../components/AppointmentFlow', () => ({
  default: () => <div>AppointmentFlow</div>,
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

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllAppointmentsMock.mockResolvedValue([]);
    getServicesMock.mockResolvedValue([]);
    getUsersMock.mockResolvedValue([]);
  });

  it('shows the login gate when there is no authenticated user', () => {
    renderWithRouter(<AdminPage />, { route: '/admin' });

    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
    expect(screen.getByText('Faça login para acessar o painel administrativo.')).toBeInTheDocument();
    expect(checkIsAdminMock).not.toHaveBeenCalled();
  });

  it('rejects authenticated non-admin users', async () => {
    setSessionState({
      user: {
        id: 'user-1',
        name: 'Maria Silva',
        email: 'maria@example.com',
      },
      token: 'jwt-token',
    });
    checkIsAdminMock.mockResolvedValue({ is_admin: false });

    renderWithRouter(<AdminPage />, { route: '/admin' });

    expect(await screen.findByText('Acesso Negado')).toBeInTheDocument();
    expect(screen.getByText('Sua conta não possui permissões de administrador.')).toBeInTheDocument();
  });

  it('allows authenticated admins into the admin panel', async () => {
    setSessionState({
      user: {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
      },
      token: 'admin-token',
    });
    checkIsAdminMock.mockResolvedValue({ is_admin: true });

    renderWithRouter(<AdminPage />, { route: '/admin' });

    expect(await screen.findByText('Painel Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Gerencie seus agendamentos e serviços.')).toBeInTheDocument();
    expect(checkIsAdminMock).toHaveBeenCalledTimes(1);
    expect(getAllAppointmentsMock).toHaveBeenCalledTimes(1);
  });
});
