import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const destination = location.state?.from?.pathname ?? '/asignaturas';

  if (user) return <Navigate to={destination} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.status === 401
        ? 'Correo o contraseña incorrectos'
        : `No se pudo iniciar sesión: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Acceso a la Plataforma CIMSI</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <label htmlFor="email">Correo Universitario</label>
        <input
          id="email"
          type="email"
          placeholder="ejemplo@alum.us.es"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '15px', padding: '8px' }}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '20px', padding: '8px' }}
        />

        {error && <p style={{ color: 'crimson', marginTop: 0 }}>{error}</p>}

        <button type="submit" disabled={sending} style={{ padding: '10px', background: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
          {sending ? 'Entrando…' : 'Iniciar Sesión'}
        </button>
      </form>

      <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>

      <p style={{ marginTop: '30px', fontSize: '0.85em', color: '#666' }}>
        Usuarios de prueba (contraseña 1234): student1@alum.us.es · admin@us.es
      </p>
    </div>
  );
}