import { apiClient } from './client';

export const getServices = async () => {
  return apiClient('/services', {
    method: 'GET',
  });
};

export const updateService = async (serviceId, serviceData) => {
  return apiClient(`/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData)
  });
};

export const createService = async (serviceData) => {
  return apiClient('/services', {
    method: 'POST',
    body: JSON.stringify(serviceData)
  });
};

export const deleteService = async (serviceId) => {
  return apiClient(`/services/${serviceId}`, {
    method: 'DELETE'
  });
};
