import { apiClient } from './client';

export const getAvailableSlots = async (date, serviceId) => {
  return apiClient(`/availability?date=${date}&serviceId=${serviceId}`, {
    method: 'GET',
  });
};

export const createAppointment = async (appointmentData) => {
  return apiClient('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};
