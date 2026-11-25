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
    <nav className="navbar">
      <span className="navbar-logo">CIMSI</span>
      <Link to="/asignaturas">Asignaturas</Link>
      {user.role === 'admin' && <Link to="/admin">Admin</Link>}
      <span className="navbar-usuario">
        {user.name} {user.surname}
        <span className="navbar-rol">{user.role}</span>
      </span>
      <button onClick={handleLogout} className="btn-salir">
        Cerrar sesión
      </button>
    </nav>
  );
}