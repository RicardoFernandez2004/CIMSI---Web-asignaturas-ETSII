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
    <div className="container container-estrecho">
      <h2 className="titulo-centrado">CIMSI</h2>
      <p className="subtitulo">Valoración de asignaturas de la ETSII</p>

      <form onSubmit={handleSubmit}>
        <label className="campo">
          Correo Universitario
          <input
            type="email"
            id="email"
            placeholder="ejemplo@alum.us.es"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="campo">
          Contraseña
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-enviar" disabled={sending}>
          {sending ? 'Entrando…' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="enlace-pie">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>

      {import.meta.env.VITE_USE_MOCKS === 'true' && (
        <p className="nota-pruebas">
          Usuarios de prueba (contraseña 1234): student1@alum.us.es · admin@us.es
        </p>
      )}
    </div>
  );
}
