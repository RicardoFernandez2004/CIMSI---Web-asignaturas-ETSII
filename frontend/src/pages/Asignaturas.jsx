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

    if (loading) return <div className="container"><p>Cargando asignaturas…</p></div>;
  if (error) return <div className="container"><p className="error">No se pudieron cargar las asignaturas: {error}</p></div>;

  return (
    <div className="container container-ancho">
      <h2>Catálogo de Asignaturas</h2>

      <div className="filtros">
        <label className="campo">
          Grado
          <select value={degreeId} onChange={(e) => setDegreeId(e.target.value)}>
            <option value="">Todos los grados</option>
            {degrees.map((degree) => (
              <option key={degree.id} value={degree.id}>{degree.name}</option>
            ))}
          </select>
        </label>

        <label className="campo">
          Curso
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Todos los cursos</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}º</option>
            ))}
          </select>
        </label>

        {(degreeId || year) && (
          <button onClick={clearFilters} className="btn-secundario">
            Quitar filtros
          </button>
        )}
      </div>

      <p className="contador">{subjects.length} {subjects.length === 1 ? 'asignatura' : 'asignaturas'}</p>
      {subjects.length === 0 && <p>No hay asignaturas con estos filtros.</p>}

      <div className="lista-asignaturas">
        {subjects.map((subject) => (
          <div key={subject.id} className="tarjeta-asignatura">
            <h3>{subject.name}</h3>
            <p>{degreeName(subject.degree_id)}</p>
            <div className="etiquetas">
              <span className="etiqueta">{subject.academic_year}º curso</span>
              <span className="etiqueta">{subject.semester}º cuatrimestre</span>
              <span className="etiqueta">{subject.ects} ECTS</span>
            </div>
            <Link to={`/resenas/${subject.id}`} className="btn-ver">
              Ver reseñas →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}