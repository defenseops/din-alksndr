import { useCallback, useEffect, useState } from 'react';
import { AuthCtx } from './adminAuthCtx';

const API_URL = import.meta.env.VITE_API_URL || '';

export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ checked: false, username: null });

  const refresh = useCallback(() => {
    return fetch(`${API_URL}/api/admin/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ username }) => setState({ checked: true, username }))
      .catch(() => setState({ checked: true, username: null }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Ошибка входа.');
    setState({ checked: true, username: body.username });
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_URL}/api/admin/logout`, { method: 'POST', credentials: 'include' });
    setState({ checked: true, username: null });
  }, []);

  return (
    <AuthCtx.Provider value={{ ...state, login, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}
