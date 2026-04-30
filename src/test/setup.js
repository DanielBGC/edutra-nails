import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

export const SESSION_STORAGE_KEYS = {
  user: '@naildesigner:user',
  token: '@naildesigner:token',
};

export function clearSessionState() {
  localStorage.removeItem(SESSION_STORAGE_KEYS.user);
  localStorage.removeItem(SESSION_STORAGE_KEYS.token);
}

afterEach(() => {
  cleanup();
  clearSessionState();
});
