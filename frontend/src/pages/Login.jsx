import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); 
    navigate('/asignaturas'); 
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Acceso a la Plataforma CIMSI</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <label>Correo Universitario</label>
        <input type="email" placeholder="ejemplo@alum.us.es" required style={{ marginBottom: '15px', padding: '8px' }} />
        
        <label>Contraseña</label>
        <input type="password" required style={{ marginBottom: '20px', padding: '8px' }} />
        
        <button type="submit" style={{ padding: '10px', background: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}