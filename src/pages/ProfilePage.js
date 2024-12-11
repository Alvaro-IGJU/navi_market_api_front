import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import api from '../api';

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
    setMessage('');

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
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setMessage('Error al actualizar el perfil.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

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
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setPasswordMessage(
        error.response?.data?.detail || 'Error al cambiar la contraseña.'
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Actualizar Perfil</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nombre</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Apellido</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Empresa</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Cargo</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Selecciona un cargo</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
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
            <label className="block text-gray-700 font-bold mb-2">Foto de Perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded"
            />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-4 w-32 h-32 rounded-full object-cover"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Actualizar
          </button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}

        <h2 className="text-xl font-bold mt-8 mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Contraseña Actual</label>
            <input
              type="password"
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cambiar Contraseña
          </button>
        </form>
        {passwordMessage && <p className="mt-4 text-green-600">{passwordMessage}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
