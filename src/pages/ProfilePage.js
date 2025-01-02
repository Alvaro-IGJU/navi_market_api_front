import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../profilePage.css';

const ProfilePage = () => {
  const { user, setUser, renewAccessToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
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

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        company: user.company || '',
        position: user.position || '',
        sector: user.sector || '',
        profile_picture: user.profile_picture || '',
      });
    }

    const fetchOptions = async () => {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
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
        console.error('Error al cargar opciones:', error);
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
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
    }

    try {
      const response = await api.put('/users/profile/', formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(response.data);
      toast.success('Perfil actualizado exitosamente.');
    } catch (error) {
      toast.error('Error al actualizar el perfil.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
    }

    try {
      const response = await api.put('/users/change-password/', passwordData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success(response.data.detail || 'Contraseña actualizada exitosamente.');
    } catch (error) {
      toast.error('Error al cambiar la contraseña.');
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-section">
        <h1 className="profile-title">Actualizar Perfil</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form-group">
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="profile-form-group">
            <label>Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
            >
              <option value="">Selecciona un sector</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
          <div className="profile-form-group">
            <label>Cargo</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">Selecciona un cargo</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>
          <div className="profile-form-group">
            <label>Foto de Perfil</label>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {formData.profile_picture && (
              <img
                src={formData.profile_picture}
                alt="Foto de perfil"
                className="profile-picture-preview"
              />
            )}
          </div>
          <button type="submit" className="profile-submit-button">
            Guardar Cambios
          </button>
        </form>
      </div>

      <div className="password-section">
        <h2 className="profile-subtitle">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="password-form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              name="old_password"
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="password-form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              name="new_password"
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="password-submit-button">
            Cambiar Contraseña
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
