import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const SESSION_STORAGE_KEYS = {
  user: '@naildesigner:user',
  token: '@naildesigner:token',
};

export function setSessionState({ user = null, token = null } = {}) {
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEYS.user, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEYS.user);
  }

  if (token) {
    localStorage.setItem(SESSION_STORAGE_KEYS.token, token);
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEYS.token);
  }
}

export function clearSessionState() {
  localStorage.removeItem(SESSION_STORAGE_KEYS.user);
  localStorage.removeItem(SESSION_STORAGE_KEYS.token);
}

export function renderWithRouter(
  ui,
  { route = '/', session = null, memoryRouterProps = {}, ...renderOptions } = {},
) {
  if (session) {
    setSessionState(session);
  }

  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[route]} {...memoryRouterProps}>
      {children}
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
