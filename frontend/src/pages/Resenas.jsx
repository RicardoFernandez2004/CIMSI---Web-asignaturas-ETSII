import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubjects, getReviews, getUsersBulk, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Resenas() {
  const { id } = useParams();
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [subject, setSubject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del nuevo formulario
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);       // ya ha publicado (o ya había valorado)
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    general_rating: 5,
    difficulty_rating: 3,
    teaching_rating: 5,
    student_grade: 5,
    comments: '',
    is_anonymous: false
  });

  useEffect(() => {
    async function loadData() {
      setSubmitted(false);
      setSuccessMessage(null);
      try {
        const [subjectsData, reviewsData] = await Promise.all([getSubjects(), getReviews({ subject_id: id })]);
        setSubject(subjectsData.find((s) => s.id === id) ?? null);
        setReviews(reviewsData);

        // Los nombres de los autores son un extra: si esta consulta falla,
        // las reseñas se muestran igualmente (con "Estudiante").
        try {
          const ids = [...new Set(reviewsData.map((r) => r.student_id).filter(Boolean))];
          if (ids.length > 0) {
            const users = await getUsersBulk(ids);
            setAuthors(Object.fromEntries(users.map((u) => [u.id, `${u.name} ${u.surname}`])));
          }
        } catch {
          setAuthors({});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSending(true);

    try {
      // 1. Enviamos los datos a la API de tu compañero
      const newReview = await createReview({
        ...formData,
        subject_id: id,
        general_rating: Number(formData.general_rating),
        difficulty_rating: Number(formData.difficulty_rating),
        teaching_rating: Number(formData.teaching_rating),
        student_grade: Number(formData.student_grade),
      });

      // 2. Si es exitoso, lo añadimos a la lista y ocultamos el formulario
      setReviews((prev) => [...prev, newReview]);
      if (newReview.student_id) {
        setAuthors((prev) => ({ ...prev, [newReview.student_id]: `${user.name} ${user.surname}` }));
      }
      setSubmitted(true);
      setSuccessMessage('¡Reseña publicada con éxito! Gracias por tu valoración.');
    } catch (err) {
      if (err.status === 409) {
        // El backend dice que ya valoraste esta asignatura: no tiene sentido mostrar el formulario
        setSubmitted(true);
        setSuccessMessage('Ya has valorado esta asignatura.');
      } else {
        setSubmitError(err.message || 'Error al publicar la reseña');
      }
    } finally {
      setSending(false);
    }
  };

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.general_rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return <div className="container"><p>Cargando reseñas…</p></div>;
  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

  return (
    <div className="container">
      <Link to="/asignaturas" className="btn-volver">⬅ Volver a Asignaturas</Link>

      <div className="header-asignatura">
        <h2>Valoraciones: {subject?.name ?? 'Asignatura desconocida'}</h2>
        {average && <div className="nota-media">★ {average}/5 <span>({reviews.length} reseñas)</span></div>}
      </div>

      {/* AVISO tras publicar */}
      {successMessage && <p className="exito">{successMessage}</p>}

      {/* FORMULARIO DE NUEVA RESEÑA (solo estudiantes que aún no han publicado) */}
      {isStudent && !submitted && (
      <form onSubmit={handleSubmit} className="formulario-resena">
        <h3>Añadir tu valoración</h3>
        
        <div className="grid-puntuaciones">
          <div>
            <label>Valoración General (1-5)</label>
            <input type="number" name="general_rating" min="1" max="5" value={formData.general_rating} onChange={handleChange} required />
          </div>
          <div>
            <label>Dificultad (1-5)</label>
            <input type="number" name="difficulty_rating" min="1" max="5" value={formData.difficulty_rating} onChange={handleChange} required />
          </div>
          <div>
            <label>Calidad Docente (1-5)</label>
            <input type="number" name="teaching_rating" min="1" max="5" value={formData.teaching_rating} onChange={handleChange} required />
          </div>
          <div>
            <label>Nota Obtenida (1-10)</label>
            <input type="number" name="student_grade" min="1" max="10" step="1" value={formData.student_grade} onChange={handleChange} required />
          </div>
        </div>

        <label style={{ marginTop: '15px', display: 'block' }}>Comentarios adicionales</label>
        <textarea 
          name="comments" 
          rows="4" 
          placeholder="Describe la metodología, carga de trabajo, exámenes..." 
          value={formData.comments} 
          onChange={handleChange} 
          required 
        />

        <div className="checkbox-anonimo">
          <input type="checkbox" id="anonimo" name="is_anonymous" checked={formData.is_anonymous} onChange={handleChange} />
          <label htmlFor="anonimo">Publicar de forma anónima</label>
        </div>

        {submitError && <p className="error">{submitError}</p>}

        <button type="submit" className="btn-enviar" disabled={sending}>
          {sending ? 'Publicando...' : 'Publicar Reseña'}
        </button>
      </form>
      )}

      {/* LISTADO DE RESEÑAS */}
      <h3 style={{ marginTop: '40px' }}>Opiniones de estudiantes</h3>
      {reviews.length === 0 && <p>Todavía no hay reseñas para esta asignatura.</p>}
      <div className="lista-resenas">
        {reviews.map((r) => (
          <div key={r.id} className="tarjeta-resena">
            <div className="tarjeta-header">
              <strong>{r.is_anonymous ? 'Estudiante Anónimo' : (authors[r.student_id] ?? 'Estudiante')}</strong>
              <span className="estrellas">★ {r.general_rating}/5</span>
            </div>
            <div className="tarjeta-metricas">
              <span>Dificultad: <strong>{r.difficulty_rating}</strong>/5</span>
              <span>Docencia: <strong>{r.teaching_rating}</strong>/5</span>
              <span>Nota: <strong>{r.student_grade}</strong></span>
            </div>
            <p className="tarjeta-comentario">"{r.comments}"</p>
            <span className="tarjeta-fecha">Publicado el {new Date(r.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}