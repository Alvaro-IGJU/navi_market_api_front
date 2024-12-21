import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    sector: '',  // Sector field
    position: '',  // Position field
  });
  const [sectors, setSectors] = useState([]);
  const [positions, setPositions] = useState([]);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Obtener sectores y posiciones desde el backend
  useEffect(() => {
    const fetchSectorsAndPositions = async () => {
      try {
        const sectorResponse = await api.get('/users/sectors/');  // Cambia esta URL por la correcta
        const positionResponse = await api.get('/users/positions/');  // Cambia esta URL por la correcta

        setSectors(sectorResponse.data);
        setPositions(positionResponse.data);
      } catch (error) {
        console.error('Error fetching sectors and positions:', error);
        toast.error('No se pudieron cargar los sectores y cargos.');
      }
    };

    fetchSectorsAndPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await api.post('/users/login/', {
          email_or_username: formData.email,
          password: formData.password,
        });
        const { tokens } = response.data;
        await loginUser(tokens);
        toast.success('Inicio de sesión exitoso');
        if (response.data.role === 'Company') {
          navigate('/dashboard');
        } else {
          navigate('/events');
        }
      } else {
        const registerData = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          sector: formData.sector,    // Agregar sector
          position: formData.position, // Agregar cargo
        };
        await api.post('/users/register/', registerData);
        toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        'Error: ' +
          (error.response?.data?.email || error.response?.data?.password || 'Ha ocurrido un error inesperado.')
      );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-100">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg overflow-hidden relative">
        {/* Animación de Framer Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: 100 }} // Animación inicial
            animate={{ opacity: 1, x: 0 }}   // Animación al estar presente
            exit={{ opacity: 0, x: -100 }}   // Animación al salir
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-[#C7AA68]">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 text-[#C7AA68]">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C7AA68]"
                />
              </div>
              {!isLogin && (
                <>
                  <div>
                    <label className="block mb-1 text-[#C7AA68]">Usuario:</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C7AA68]"
                    />
                  </div>
                  {/* Selección del sector */}
                  <div>
                    <label className="block mb-1 text-[#C7AA68]">Sector:</label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      required
                      className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C7AA68]"
                    >
                      <option value="">Selecciona un sector</option>
                      {sectors.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Selección del cargo */}
                  <div>
                    <label className="block mb-1 text-[#C7AA68]">Cargo:</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C7AA68]"
                    >
                      <option value="">Selecciona un cargo</option>
                      {positions.map((position) => (
                        <option key={position.id} value={position.id}>
                          {position.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block mb-1 text-[#C7AA68]">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C7AA68]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
              >
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-4 text-sm text-[#C7AA68] hover:underline focus:outline-none"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
