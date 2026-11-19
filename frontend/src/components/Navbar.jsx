import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px 40px', background: '#0056b3', color: 'white', fontFamily: 'sans-serif' }}>
      <strong>CIMSI</strong>
      <Link to="/asignaturas" style={{ color: 'white' }}>Asignaturas</Link>
      <span style={{ marginLeft: 'auto' }}>
        {user.name} {user.surname} ({user.role})
      </span>
      <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
        Cerrar sesión
      </button>
    </nav>
  );
}