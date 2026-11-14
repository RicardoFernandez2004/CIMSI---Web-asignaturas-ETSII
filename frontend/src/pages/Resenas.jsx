import { useParams, Link } from 'react-router-dom';
import { resenas, asignaturas } from '../data/mockData';

export default function Resenas() {
  const { id } = useParams(); 
  
  const asignatura = asignaturas.find(a => a.id === parseInt(id));
  const resenasAsig = resenas.filter(r => r.asignatura_id === parseInt(id));

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <Link to="/asignaturas" style={{ color: 'gray', textDecoration: 'none' }}>⬅ Volver a Asignaturas</Link>
      
      <h2>Reseñas de {asignatura?.nombre}</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {resenasAsig.map(r => (
          <div key={r.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #0056b3' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>{r.autor}</strong> <span style={{ color: '#ffb400' }}>★ {r.puntuacion}/5</span>
            </p>
            <p style={{ margin: 0 }}>"{r.comentario}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}