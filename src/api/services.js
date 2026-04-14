import { apiClient } from './client';

export const getServices = async () => {
  return apiClient('/services', {
    method: 'GET',
  });
};
