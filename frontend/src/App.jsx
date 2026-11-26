import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Login from './pages/Login';
import Asignaturas from './pages/Asignaturas';
import Resenas from './pages/Resenas';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Registro from './pages/Registro';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/asignaturas" element={<ProtectedRoute><Asignaturas /></ProtectedRoute>} />
          <Route path="/resenas/:id" element={<ProtectedRoute><Resenas /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}