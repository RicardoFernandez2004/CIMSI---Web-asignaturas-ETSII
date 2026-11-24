import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDegrees, getSubjects } from '../services/api';

export default function Asignaturas() {
  const [subjects, setSubjects] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [degreeId, setDegreeId] = useState('');
  const [year, setYear] = useState('');

    useEffect(() => {
    getDegrees()
      .then(setDegrees)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    let active = true;
    getSubjects({ degree_id: degreeId, academic_year: year })
      .then((data) => {
        if (active) setSubjects(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [degreeId, year]);

  const degreeName = (degreeId) => degrees.find((d) => d.id === degreeId)?.name ?? '—';

    function clearFilters() {
    setDegreeId('');
    setYear('');
  }

  if (loading) return <p style={{ padding: '40px' }}>Cargando asignaturas…</p>;
  if (error) return <p style={{ padding: '40px', color: 'crimson' }}>No se pudieron cargar las asignaturas: {error}</p>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Catálogo de Asignaturas</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Grado
          <select value={degreeId} onChange={(e) => setDegreeId(e.target.value)} style={{ padding: '8px' }}>
            <option value="">Todos los grados</option>
            {degrees.map((degree) => (
              <option key={degree.id} value={degree.id}>{degree.name}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Curso
          <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: '8px' }}>
            <option value="">Todos los cursos</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}º</option>
            ))}
          </select>
        </label>

        {(degreeId || year) && (
          <button onClick={clearFilters} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            Quitar filtros
          </button>
        )}
      </div>

      <p style={{ color: '#555' }}>{subjects.length} {subjects.length === 1 ? 'asignatura' : 'asignaturas'}</p>
      {subjects.length === 0 && <p>No hay asignaturas con estos filtros.</p>}
      <div style={{ display: 'grid', gap: '15px' }}>
        {subjects.map((subject) => (
          <div key={subject.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{subject.name}</h3>
            <p style={{ margin: '0 0 5px 0' }}><strong>Grado:</strong> {degreeName(subject.degree_id)}</p>
            <p style={{ margin: '0 0 15px 0' }}>
              <strong>Curso:</strong> {subject.academic_year}º · <strong>Cuatrimestre:</strong> {subject.semester}º · <strong>ECTS:</strong> {subject.ects}
            </p>
            <Link to={`/resenas/${subject.id}`} style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>
              Ver Reseñas
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}