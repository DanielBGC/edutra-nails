import { useState } from 'react';
import { createAppointment } from '../api/appointments';
import toast from 'react-hot-toast';

export const useAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitAppointment = async (appointmentData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createAppointment(appointmentData);
      setSuccess(true);
      toast.success('Agendamento confirmado!');
      return true;
    } catch (err) {
      const msg = err.message || 'Falha ao realizar o agendamento.';
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return { submitAppointment, isLoading, error, success, resetState };
};
