import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDegrees, getSubjects } from '../services/api';

export default function Asignaturas() {
  // Estado de la pantalla: los datos, si está cargando y si hubo un error
  const [subjects, setSubjects] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Al abrir la pantalla, pedimos asignaturas y grados a la API (a la vez)
  useEffect(() => {
    Promise.all([getSubjects(), getDegrees()])
      .then(([subjectsData, degreesData]) => {
        setSubjects(subjectsData);
        setDegrees(degreesData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // La asignatura solo trae degree_id: buscamos el nombre del grado
  const degreeName = (degreeId) => degrees.find((d) => d.id === degreeId)?.name ?? '—';

  if (loading) return <p style={{ padding: '40px' }}>Cargando asignaturas…</p>;
  if (error) return <p style={{ padding: '40px', color: 'crimson' }}>No se pudieron cargar las asignaturas: {error}</p>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Catálogo de Asignaturas</h2>
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
