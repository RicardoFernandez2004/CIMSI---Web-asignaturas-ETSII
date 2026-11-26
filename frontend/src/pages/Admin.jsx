import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDegrees, getSubjects, getReviews, createStaff } from '../services/api';

const emptyForm = { name: '', surname: '', email: '', date_of_birth: '', password: '' };

function average(reviews) {
  if (reviews.length === 0) return '—';
  return (reviews.reduce((sum, r) => sum + r.general_rating, 0) / reviews.length).toFixed(1);
}

function calculateStats(degrees, subjects, reviews) {
  const bySubject = subjects
    .map((subject) => {
      const subjectReviews = reviews.filter((r) => r.subject_id === subject.id);
      return { id: subject.id, name: subject.name, count: subjectReviews.length, average: average(subjectReviews) };
    })
    .sort((a, b) => b.count - a.count);

  return {
    degrees: degrees.length,
    subjects: subjects.length,
    reviews: reviews.length,
    anonymous: reviews.filter((r) => r.is_anonymous).length,
    average: average(reviews),
    bySubject,
  };
}

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([getDegrees(), getSubjects({ limit: 1000 }), getReviews({ limit: 1000 })])
      .then(([degrees, subjects, reviews]) => setStats(calculateStats(degrees, subjects, reviews)))
      .catch((err) => setError(err.message));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    if (form.password.length < 8) {
      setFormError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setSending(true);
    try {
      const newAdmin = await createStaff(form);
      setSuccess(`Administrador creado: ${newAdmin.name} ${newAdmin.surname} (${newAdmin.email})`);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  }

  const cardStyle = { background: '#f8f9fa', borderRadius: '8px', padding: '15px', textAlign: 'center' };
  const numberStyle = { fontSize: '1.8em', fontWeight: 'bold', color: '#0056b3' };
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '12px', boxSizing: 'border-box' };

  return (
    <div className="container">
      <h2>Panel de administración</h2>

      <h3>Estadísticas</h3>
      {error && <p className="error">No se pudieron cargar las estadísticas: {error}</p>}
      {!stats && !error && <p>Cargando estadísticas…</p>}

      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
            <div style={cardStyle}><div style={numberStyle}>{stats.reviews}</div>Reseñas</div>
            <div style={cardStyle}><div style={numberStyle}>★ {stats.average}</div>Nota media</div>
            <div style={cardStyle}><div style={numberStyle}>{stats.anonymous}</div>Anónimas</div>
            <div style={cardStyle}><div style={numberStyle}>{stats.subjects}</div>Asignaturas</div>
            <div style={cardStyle}><div style={numberStyle}>{stats.degrees}</div>Grados</div>
          </div>

          <h3 style={{ marginTop: '30px' }}>Reseñas por asignatura</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '8px' }}>Asignatura</th>
                <th style={{ padding: '8px' }}>Reseñas</th>
                <th style={{ padding: '8px' }}>Nota media</th>
              </tr>
            </thead>
            <tbody>
              {stats.bySubject.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}><Link to={`/resenas/${row.id}`}>{row.name}</Link></td>
                  <td style={{ padding: '8px' }}>{row.count}</td>
                  <td style={{ padding: '8px' }}>{row.average === '—' ? '—' : `★ ${row.average}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <form onSubmit={handleSubmit} className="formulario-resena">
        <h3>Crear nuevo administrador</h3>

        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="surname">Apellidos</label>
        <input id="surname" name="surname" value={form.surname} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="date_of_birth">Fecha de nacimiento</label>
        <input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required style={inputStyle} />

        <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} />

        {formError && <p className="error">{formError}</p>}

        <button type="submit" className="btn-enviar" disabled={sending}>
          {sending ? 'Creando…' : 'Crear administrador'}
        </button>

        {success && <p className="exito">{success}</p>}
      </form>
    </div>
  );
}