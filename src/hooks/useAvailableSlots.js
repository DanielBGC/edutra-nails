import { useState, useEffect } from 'react';
import { getAvailableSlots } from '../api/appointments';

export const useAvailableSlots = (date, serviceIds) => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasServices = Array.isArray(serviceIds) ? serviceIds.length > 0 : !!serviceIds;
  const serviceIdsKey = JSON.stringify(serviceIds);

  useEffect(() => {
    if (!date || !hasServices) {
      setSlots((prev) => (prev.length ? [] : prev));
      return;
    }

    const fetchSlots = async () => {
      const normalizedServiceIds = JSON.parse(serviceIdsKey);
      try {
        setIsLoading(true);
        const data = await getAvailableSlots(date, normalizedServiceIds);
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
  }, [date, hasServices, serviceIdsKey]);

  return { slots, isLoading, error };
};
