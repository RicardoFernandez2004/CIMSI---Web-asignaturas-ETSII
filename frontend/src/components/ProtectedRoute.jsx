import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <p style={{ padding: '40px' }}>Comprobando sesión…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/asignaturas" replace />;
  return children;
}