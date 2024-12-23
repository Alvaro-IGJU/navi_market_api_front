import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const CompanyPage = () => {
  const { user, renewAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
    name: '',
    sector: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    description: '',
  });
  const [sectors, setSectors] = useState([]);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Redirigir si el usuario no es de tipo Company
    if (user?.role !== 'Company') {
      navigate('/'); // Redirigir al inicio si no es una empresa
      return;
    }

    const fetchData = async () => {
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
        // Obtener los datos de la empresa
        const companyResponse = await api.get('/companies/owner/company/', { headers });
        if (companyResponse.data) {
          setCompanyData(companyResponse.data);
          setIsEditing(true);
        }

        // Obtener los sectores disponibles
        const sectorsResponse = await api.get('/users/sectors/', { headers });
        setSectors(sectorsResponse.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setMessage('No tienes una empresa asociada.');
        } else {
          setMessage('Error al cargar los datos de la empresa.');
        }
        console.error('Error al cargar datos:', error.response || error);
      }
    };

    fetchData();
  }, [user, navigate, renewAccessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: name === 'sector' ? parseInt(value, 10) || '' : value, // Convertir sector a número si no está vacío
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
    }

    if (!accessToken) {
      setMessage('No se pudo autenticar la solicitud.');
      return;
    }

    try {
      const response = await api.put(`/companies/owner/company/`, companyData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessage('Empresa actualizada con éxito.');
      setCompanyData(response.data);
    } catch (error) {
      console.error('Error al guardar los datos de la empresa:', error.response || error);
      setMessage('Error al guardar los datos de la empresa.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4 md:mt-4">
        <h1 className="text-3xl font-bold mb-6 text-[#C7AA68]">Editar Empresa</h1>
        {message && <p className={`text-lg ${message.includes('éxito') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold text-gray-200">Nombre</label>
              <input
                type="text"
                name="name"
                value={companyData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-200">Sector</label>
              <select
                name="sector"
                value={companyData.sector}
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
              <label className="block font-semibold text-gray-200">Email de Contacto</label>
              <input
                type="email"
                name="contact_email"
                value={companyData.contact_email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-200">Teléfono de Contacto</label>
              <input
                type="text"
                name="contact_phone"
                value={companyData.contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-200">Sitio Web</label>
              <input
                type="url"
                name="website"
                value={companyData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-200">Descripción</label>
              <textarea
                name="description"
                value={companyData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-[#212529] rounded focus:ring focus:ring-[#C7AA68]"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
            >
              Actualizar Empresa
            </button>
          </form>
        ) : (
          <p className="text-center">Cargando datos de la empresa...</p>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
