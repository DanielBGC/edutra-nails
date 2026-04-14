import { apiClient } from './client';

export const login = async ({ email, password }) => {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async ({ name, email, password, phone }) => {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
};
