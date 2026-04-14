import { useState, useEffect } from 'react';
import { getServices } from '../api/services';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await getServices();
        setServices(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Erro ao carregar serviços.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, isLoading, error };
};
