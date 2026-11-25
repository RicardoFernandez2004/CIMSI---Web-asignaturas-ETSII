import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Asignaturas from './pages/Asignaturas';
import Resenas from './pages/Resenas';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/asignaturas" element={<Asignaturas />} />
        <Route path="/resenas/:id" element={<Resenas />} />
      </Routes>
    </BrowserRouter>
  );
}