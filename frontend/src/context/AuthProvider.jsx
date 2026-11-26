import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import * as api from '../services/api';
import { UNAUTHORIZED_EVENT } from '../services/api';


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(api.getToken()));

  useEffect(() => {
    if (!api.getToken()) return;   
    api.getMe()
      .then(setUser)                 
      .catch(() => api.logout())    
      .finally(() => setChecking(false));
  }, []);

  // Si el backend responde 401 (token caducado), cerramos la sesión:
  // ProtectedRoute redirige solo a /login al quedar user = null.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  async function login(email, password) {
    await api.login(email, password);
    setUser(await api.getMe());
  }

    async function register(userData) {
    await api.register(userData);
    setUser(await api.getMe());
  }

  function logout() {
    api.logout();
    setUser(null);
  }

    return (
    <AuthContext.Provider value={{ user, checking, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}