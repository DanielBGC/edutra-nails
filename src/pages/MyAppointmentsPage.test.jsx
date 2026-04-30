import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MyAppointmentsPage from './MyAppointmentsPage';
import { renderWithRouter } from '../test/renderWithRouter';

const { getMyAppointmentsMock, deleteAppointmentMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  getMyAppointmentsMock: vi.fn(),
  deleteAppointmentMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('../api/appointments', () => ({
  getMyAppointments: getMyAppointmentsMock,
  deleteAppointment: deleteAppointmentMock,
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

describe('MyAppointmentsPage', () => {
  const session = {
    user: {
      id: 'user-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
    },
    token: 'jwt-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays my appointments grouped by date with status and service details', async () => {
    getMyAppointmentsMock.mockResolvedValue({
      data: [
        {
          id: 'app-2',
          date: '2026-04-19',
          time: '14:00',
          status: 'pending',
          services: [{ name: 'Pedicure', duration_minutes: 60, price: 90 }],
        },
        {
          id: 'app-1',
          date: '2026-04-18',
          time: '10:00',
          status: 'confirmed',
          notes: 'Evitar glitter.',
          services: [{ name: 'Blindagem', duration_minutes: 90, price: 120 }],
        },
      ],
    });

    renderWithRouter(<MyAppointmentsPage />, {
      route: '/meus-agendamentos',
      session,
    });

    expect(await screen.findByText('Meus Agendamentos')).toBeInTheDocument();
    expect(getMyAppointmentsMock).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('Blindagem')).toBeInTheDocument();
    expect(screen.getByText('Pedicure')).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText(/Evitar glitter\./)).toBeInTheDocument();
  });

  it('cancels an appointment and refreshes the list', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    getMyAppointmentsMock
      .mockResolvedValueOnce({
        data: [
          {
            id: 'app-1',
            date: '2026-04-18',
            time: '10:00',
            status: 'confirmed',
            services: [{ name: 'Blindagem', duration_minutes: 90, price: 120 }],
          },
        ],
      })
      .mockResolvedValueOnce({ data: [] });
    deleteAppointmentMock.mockResolvedValue({});

    renderWithRouter(<MyAppointmentsPage />, {
      route: '/meus-agendamentos',
      session,
    });

    expect(await screen.findByText('10:00')).toBeInTheDocument();
    await user.click(screen.getByTitle('Cancelar Agendamento'));

    await waitFor(() => {
      expect(deleteAppointmentMock).toHaveBeenCalledWith('app-1');
    });
    await waitFor(() => {
      expect(getMyAppointmentsMock).toHaveBeenCalledTimes(2);
    });

    expect(toastSuccessMock).toHaveBeenCalledWith('Agendamento cancelado com sucesso.');
    expect(await screen.findByText('Nenhum agendamento encontrado')).toBeInTheDocument();
    confirmSpy.mockRestore();
  });
});
