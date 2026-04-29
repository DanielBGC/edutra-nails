import { useState, useEffect } from 'react';
import { getAvailableSlots } from '../api/appointments';

export const useAvailableSlots = (date, serviceIds) => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasServices = Array.isArray(serviceIds) ? serviceIds.length > 0 : !!serviceIds;

  useEffect(() => {
    if (!date || !hasServices) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableSlots(date, serviceIds);
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
  }, [date, JSON.stringify(serviceIds)]);

  return { slots, isLoading, error };
};
