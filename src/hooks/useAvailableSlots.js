import { useState, useEffect } from 'react';
import { getAvailableSlots } from '../api/appointments';

export const useAvailableSlots = (date, serviceId) => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date || !serviceId) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableSlots(date, serviceId);
        setSlots(data);
        setError(null);
      } catch (err) {
        setSlots([]);
        setError(err.message || 'Erro ao carregar horários disponíveis.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [date, serviceId]);

  return { slots, isLoading, error };
};
