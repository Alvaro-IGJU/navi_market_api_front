import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Configura Axios con tu base URL
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header'; // Importa el Header
import '../adminCreateCompanyUserPage.css'; // Archivo CSS específico

const AdminCreateCompanyUserPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedPassword('');

    try {
      const response = await api.post(
        '/users/admin/create-company-user/',
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );

      setGeneratedPassword(response.data.password);
      toast.success(`Usuario creado correctamente. Correo enviado a ${email}.`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          toast.error('El usuario ya existe.');
        } else {
          toast.error(error.response.data.error || 'Error al crear el usuario.');
        }
      } else {
        toast.error('Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className="create-user-page">
      <div className="create-user-container">
        <h1 className="create-user-title">Crear Usuario de Empresa</h1>

        {generatedPassword && (
          <div className="password-container">
            <p>
              <strong>Contraseña Generada:</strong> {generatedPassword}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-user-form">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="empresa@correo.com"
              required
            />
          </div>
          <button type="submit" className="create-user-button">
            Crear Usuario
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default AdminCreateCompanyUserPage;
