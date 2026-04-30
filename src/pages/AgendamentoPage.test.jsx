import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import AgendamentoPage from './AgendamentoPage';
import { renderWithRouter } from '../test/renderWithRouter';

const { getServicesMock, getAvailableSlotsMock, createAppointmentMock, toastSuccessMock, toastErrorMock } =
  vi.hoisted(() => ({
    getServicesMock: vi.fn(),
    getAvailableSlotsMock: vi.fn(),
    createAppointmentMock: vi.fn(),
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
  }));

vi.mock('../api/services', () => ({
  getServices: getServicesMock,
}));

vi.mock('../api/appointments', () => ({
  getAvailableSlots: getAvailableSlotsMock,
  createAppointment: createAppointmentMock,
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

let originalScrollIntoView;
const RealDate = Date;
const FIXED_NOW = new RealDate('2026-04-15T12:00:00.000Z');

class MockDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) {
      return new RealDate(FIXED_NOW);
    }
    return new RealDate(...args);
  }

  static now() {
    return FIXED_NOW.getTime();
  }
}

describe('AgendamentoPage booking flow', () => {
  beforeAll(() => {
    originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterAll(() => {
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    global.Date = MockDate;

    getServicesMock.mockResolvedValue([
      {
        id: 'svc-1',
        name: 'Blindagem',
        description: 'Reforço para unhas naturais',
        duration_minutes: 90,
        price: 120,
      },
    ]);
    getAvailableSlotsMock.mockResolvedValue(['09:00', '10:30']);
    createAppointmentMock.mockResolvedValue({ id: 'app-1' });
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  it('covers service selection, date validation, slot loading and booking submit', async () => {
    const user = userEvent.setup();
    const session = {
      user: {
        id: 'user-1',
        name: 'Maria Silva',
        phone: '(34) 99999-1234',
        email: 'maria@example.com',
      },
      token: 'jwt-token',
    };

    const { container } = renderWithRouter(<AgendamentoPage />, {
      route: '/agendamento',
      session,
    });

    expect(await screen.findByText('Escolha o Serviço')).toBeInTheDocument();
    const continueToDateButton = screen.getByRole('button', { name: 'Continuar para Data e Hora' });
    expect(continueToDateButton).toBeDisabled();

    await user.click(screen.getByText('Blindagem'));
    expect(continueToDateButton).toBeEnabled();
    await user.click(continueToDateButton);

    expect(await screen.findByText('Data e Horário')).toBeInTheDocument();
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();

    fireEvent.change(dateInput, { target: { value: '2026-04-14' } });
    expect(screen.getByText('Não é possível agendar em datas passadas.')).toBeInTheDocument();
    expect(getAvailableSlotsMock).not.toHaveBeenCalled();

    fireEvent.change(dateInput, { target: { value: '2026-04-20' } });
    await waitFor(() => {
      expect(getAvailableSlotsMock).toHaveBeenCalledWith('2026-04-20', ['svc-1']);
    });

    await user.click(await screen.findByText('09:00'));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(await screen.findByText('Confirmar Agendamento')).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText(
        'Ex: Gostaria de fazer uma nail art específica, minha unha está muito curta, etc...',
      ),
      'Cliente prefere acabamento fosco.',
    );
    await user.click(screen.getByRole('button', { name: 'Finalizar e Agendar' }));

    await waitFor(() => {
      expect(createAppointmentMock).toHaveBeenCalledWith({
        serviceIds: ['svc-1'],
        clientId: 'user-1',
        clientName: 'Maria Silva',
        clientPhone: '(34) 99999-1234',
        date: '2026-04-20',
        time: '09:00',
        notes: 'Cliente prefere acabamento fosco.',
      });
    });

    expect(await screen.findByText('Agendamento Confirmado!')).toBeInTheDocument();
    expect(toastSuccessMock).toHaveBeenCalledWith('Agendamento confirmado!');
  });
});
