import { Link } from 'react-router-dom';
import { asignaturas } from '../data/mockData';

export default function Asignaturas() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Catálogo de Asignaturas</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {asignaturas.map(asig => (
          <div key={asig.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{asig.nombre}</h3>
            <p style={{ margin: '0 0 5px 0' }}><strong>Grado:</strong> {asig.grado}</p>
            <p style={{ margin: '0 0 15px 0' }}><strong>Profesor:</strong> {asig.profesor}</p>
            <Link to={`/resenas/${asig.id}`} style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>
              Ver Reseñas
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}