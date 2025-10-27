// Authentication utilities

const ADMIN_EMAIL = 'Eegabalaji@gmail.com';
const ADMIN_PASSWORD = 'Eegabalaji@07';
const AUTH_KEY = 'ramakrishna_auth';

export const login = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};
