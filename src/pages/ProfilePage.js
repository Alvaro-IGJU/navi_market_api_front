import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import api from '../api';
import { use } from 'react';

const ProfilePage = () => {
  const { user, setUser, renewAccessToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    position: '',
    sector: '',
    profile_picture: '',
  });
  const [positions, setPositions] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    console.log(user)
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        company: user.company || '',
        position: user.position || '',
        sector: user.sector || '',
        profile_picture: user.profile_picture || '',
      });
      setPreview(user.profile_picture || '');
    }

    const fetchOptions = async () => {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      if (!accessToken) {
        console.error('No se pudo obtener un token válido.');
        return;
      }

      const headers = { Authorization: `Bearer ${accessToken}` };

      try {
        const [positionsResponse, sectorsResponse] = await Promise.all([
          api.get('/users/positions/', { headers }),
          api.get('/users/sectors/', { headers }),
        ]);
          
        setPositions(positionsResponse.data);
        setSectors(sectorsResponse.data);
      } catch (error) {
        console.error('Error al cargar opciones:', error.response || error);
      }
    };

    fetchOptions();
  }, [user, renewAccessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({ ...prevData, profile_picture: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset previous message

    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
    }

    if (!accessToken) {
      setMessage('No se pudo autenticar la solicitud.');
      return;
    }

    try {
      const response = await api.put('/users/profile/', formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(response.data);
      setMessage('Perfil actualizado exitosamente.');

      // Hide message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setMessage('Error al actualizar el perfil.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(''); // Reset password message

    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
    }

    if (!accessToken) {
      setPasswordMessage('No se pudo autenticar la solicitud.');
      return;
    }

    try {
      const response = await api.put('/users/change-password/', passwordData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPasswordMessage(response.data.detail || 'Contraseña actualizada exitosamente.');

      // Hide password message after 3 seconds
      setTimeout(() => {
        setPasswordMessage('');
      }, 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setPasswordMessage(
        error.response?.data?.detail || 'Error al cambiar la contraseña.'
      );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4 md:mt-4">
        <h1 className="text-3xl font-bold mb-6 text-[#C7AA68]">Actualizar Perfil</h1>
        {message && <p className="text-lg text-green-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold text-gray-200">Nombre</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-gray-200">Apellido</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-gray-200">Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
            >
              <option value="">Selecciona un sector</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-200">Cargo</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
            >
              <option value="">Selecciona un cargo</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-gray-200 mb-2">Foto de Perfil</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*" // Solo permite seleccionar imágenes
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-24 h-24 rounded-full border-2 border-[#C7AA68] object-cover"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
          >
            Actualizar Perfil
          </button>
        </form>

        <h2 className="text-2xl font-bold mt-6 text-[#C7AA68]">Cambiar Contraseña</h2>
        {passwordMessage && <p className="text-lg text-green-500">{passwordMessage}</p>}
        <form onSubmit={handlePasswordSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block font-semibold text-gray-200">Contraseña Actual</label>
            <input
              type="password"
              name="old_password"
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold text-gray-200">Nueva Contraseña</label>
            <input
              type="password"
              name="new_password"
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
