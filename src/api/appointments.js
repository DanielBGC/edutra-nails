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

export const deleteAppointment = async (appointmentId) => {
  return apiClient(`/appointments/${appointmentId}`, {
    method: 'DELETE'
  });
};

export const blockSlot = async (blockData) => {
  return apiClient('/appointments/block', {
    method: 'POST',
    body: JSON.stringify(blockData),
  });
};

export const deleteBlock = async (blockId) => {
  return apiClient(`/appointments/block/${blockId}`, {
    method: 'DELETE'
  });
};

export const getAllAppointments = async () => {
  return apiClient('/appointments', {
    method: 'GET',
  });
};
