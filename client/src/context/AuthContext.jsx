import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('f4s_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((adminData, token) => {
    localStorage.setItem('f4s_admin', JSON.stringify(adminData));
    localStorage.setItem('f4s_token', token);
    setAdmin(adminData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('f4s_admin');
    localStorage.removeItem('f4s_token');
    setAdmin(null);
  }, []);

  const token = localStorage.getItem('f4s_token');

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
