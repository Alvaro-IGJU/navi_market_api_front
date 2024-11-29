import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Importa AuthContext
import api from '../api'; // Tu configuración de Axios

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email_or_username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const { setIsAuthenticated, setUser } = useContext(AuthContext); // Extrae del contexto
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        const response = await api.post('/users/login/', formData);

        // Guarda el token en localStorage
        const { tokens, user } = response.data; // Asegúrate de que el backend devuelva los datos correctos
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);

        // Actualiza el estado de autenticación y el usuario en el contexto
        setIsAuthenticated(true);
        setUser(user);

        setMessage('Inicio de sesión exitoso');
        navigate('/dashboard'); // Redirige al dashboard
      } else {
        await api.post('/users/register/', formData);
        setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error: ' + (error.response?.data?.detail || 'Algo salió mal.'));
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email_or_username"
            value={formData.email_or_username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

export default AuthPage;
