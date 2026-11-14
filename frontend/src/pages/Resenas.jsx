import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubjects, getReviews, getUsersBulk } from '../services/api';

export default function Resenas() {
  const { id } = useParams(); // UUID de la asignatura, sacado de la URL /resenas/:id

  const [subject, setSubject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [authors, setAuthors] = useState({}); // { student_id: "Nombre Apellidos" }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [subjectsData, reviewsData] = await Promise.all([getSubjects(), getReviews({ subject_id: id })]);
        setSubject(subjectsData.find((s) => s.id === id) ?? null);
        setReviews(reviewsData);

        // Las reseñas solo traen student_id: pedimos los nombres a Auth en una sola llamada.
        // Las anónimas tienen student_id = null, así que las filtramos.
        const ids = [...new Set(reviewsData.map((r) => r.student_id).filter(Boolean))];
        if (ids.length > 0) {
          const users = await getUsersBulk(ids);
          setAuthors(Object.fromEntries(users.map((u) => [u.id, `${u.name} ${u.surname}`])));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Nota media de la asignatura (el backend no la devuelve, la calculamos aquí)
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.general_rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return <p style={{ padding: '40px' }}>Cargando reseñas…</p>;
  if (error) return <p style={{ padding: '40px', color: 'crimson' }}>No se pudieron cargar las reseñas: {error}</p>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <Link to="/asignaturas" style={{ color: 'gray', textDecoration: 'none' }}>⬅ Volver a Asignaturas</Link>

      <h2>Reseñas de {subject?.name ?? 'asignatura desconocida'}</h2>
      {average && <p><strong>Valoración media:</strong> ★ {average}/5 ({reviews.length} reseñas)</p>}
      {reviews.length === 0 && <p>Todavía no hay reseñas para esta asignatura.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #0056b3' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>{r.is_anonymous ? 'Anónimo' : (authors[r.student_id] ?? 'Estudiante')}</strong>{' '}
              <span style={{ color: '#ffb400' }}>★ {r.general_rating}/5</span>
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#555' }}>
              Dificultad: {r.difficulty_rating}/5 · Docencia: {r.teaching_rating}/5 · Nota obtenida: {r.student_grade}
            </p>
            <p style={{ margin: 0 }}>"{r.comments}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
