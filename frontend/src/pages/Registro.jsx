import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    date_of_birth: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  if (user) return <Navigate to="/asignaturas" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSending(true);
    try {
      const { confirmPassword: _confirmPassword, ...userData } = form;
      await register(userData);
      navigate('/asignaturas', { replace: true });
    } catch (err) {
      setError(err.status === 400 ? err.message : `No se pudo completar el registro: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  const inputStyle = { marginBottom: '15px', padding: '8px' };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="surname">Apellidos</label>
        <input id="surname" name="surname" value={form.surname} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="email">Correo Universitario</label>
        <input id="email" name="email" type="email" placeholder="ejemplo@alum.us.es" value={form.email} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="date_of_birth">Fecha de nacimiento</label>
        <input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="confirmPassword">Repite la contraseña</label>
        <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required style={{ ...inputStyle, marginBottom: '20px' }} />

        {error && <p style={{ color: 'crimson', marginTop: 0 }}>{error}</p>}

        <button type="submit" disabled={sending} style={{ padding: '10px', background: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
          {sending ? 'Creando cuenta…' : 'Registrarse'}
        </button>
      </form>

      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}