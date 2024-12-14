import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Configura Axios con tu base URL
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCreateCompanyUserPage = () => {
  const { user } = useContext(AuthContext); // Contexto de autenticación
  const navigate = useNavigate(); // Navegación para redirección
  const [email, setEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    // Verificar si el usuario es superusuario
    if (!user?.is_superuser) {
      navigate('/'); // Redirigir si no es superusuario
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
      // Corregido: Mostrar email correctamente en la notificación
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
    <div className="bg-gray-900 min-h-screen text-gray-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        {/* Título principal */}
        <h1 className="text-3xl font-bold mb-6 text-[#C7AA68] text-center">
          Crear Usuario de Empresa
        </h1>

        {/* Mostrar contraseña generada */}
        {generatedPassword && (
          <div className="mt-4 p-4 bg-green-800 text-gray-100 rounded">
            <p>
              <strong>Contraseña Generada:</strong> {generatedPassword}
            </p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded focus:ring focus:ring-[#C7AA68]"
              placeholder="empresa@correo.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
          >
            Crear Usuario
          </button>
        </form>
      </div>
      {/* Toast Container para notificaciones */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default AdminCreateCompanyUserPage;
