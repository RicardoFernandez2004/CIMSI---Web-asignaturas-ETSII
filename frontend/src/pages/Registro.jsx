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

    return (
    <div className="container container-estrecho">
      <h2 className="titulo-centrado">Crear cuenta</h2>
      <p className="subtitulo">Regístrate para valorar asignaturas</p>

      <form onSubmit={handleSubmit}>
        <label className="campo">
          Nombre
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label className="campo">
          Apellidos
          <input id="surname" name="surname" value={form.surname} onChange={handleChange} required />
        </label>

        <label className="campo">
          Correo Universitario
          <input id="email" name="email" type="email" placeholder="ejemplo@alum.us.es" value={form.email} onChange={handleChange} required />
        </label>

        <label className="campo">
          Fecha de nacimiento
          <input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
        </label>

        <label className="campo">
          Contraseña (mínimo 8 caracteres)
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>

        <label className="campo">
          Repite la contraseña
          <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-enviar" disabled={sending}>
          {sending ? 'Creando cuenta…' : 'Registrarse'}
        </button>
      </form>

      <p className="enlace-pie">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}
