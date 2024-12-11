import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email_or_username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const { loginUser } = useContext(AuthContext);
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
        const { tokens } = response.data;
        await loginUser(tokens);
        setMessage('Inicio de sesión exitoso');
        navigate('/dashboard');
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
