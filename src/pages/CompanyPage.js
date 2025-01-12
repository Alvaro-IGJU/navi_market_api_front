import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Briefcase, Mail, Phone, Globe, FileText, Sparkles } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const AuroraBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="relative w-full h-full overflow-hidden bg-[#0A0F14]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F14] via-[#0A0F14] to-black opacity-98"></div>
      <div className="absolute -inset-[10px] opacity-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/10 blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 rounded-full bg-[#0A0F14]/20 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/5 blur-[120px] animate-pulse delay-1000"></div>
      </div>
    </div>
  </div>
);

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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'Company') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
        }

        if (!accessToken) {
          toast.error('No se pudo obtener un token válido.');
          return;
        }

        const headers = { Authorization: `Bearer ${accessToken}` };
        const [companyResponse, sectorsResponse] = await Promise.all([
          api.get('/companies/owner/company/', { headers }),
          api.get('/users/sectors/', { headers })
        ]);

        if (companyResponse.data) {
          setCompanyData(companyResponse.data);
          setIsEditing(true);
        }
        setSectors(sectorsResponse.data);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.warning('No tienes una empresa asociada.');
        } else {
          toast.error('Error al cargar los datos de la empresa.');
        }
      }
    };

    fetchData();
  }, [user, navigate, renewAccessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: name === 'sector' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        accessToken = await renewAccessToken(localStorage.getItem('refreshToken'));
      }

      if (!accessToken) {
        toast.error('No se pudo autenticar la solicitud.');
        return;
      }

      await api.put('/companies/owner/company/', companyData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success('Empresa actualizada con éxito.');
    } catch (error) {
      toast.error('Error al guardar los datos de la empresa.');
    }
  };

  const InputField = ({ icon: Icon, label, name, type = "text", value, options = null }) => (
    <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
      <label className="block text-sm font-medium text-[#C7AA68]">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-[#C7AA68]" />
        </div>
        {options ? (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
          >
            <option value="">Seleccionar sector</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
          />
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen font-sans text-white pt-20">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative flex items-center justify-center p-4 py-12 min-h-[calc(100vh-5rem)]"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 w-full max-w-2xl mt-8"
        >
          <div className="backdrop-blur-xl bg-[#0A0F14]/30 p-8 rounded-3xl border border-[#C7AA68]/20 shadow-2xl">
            <div className="flex items-center justify-center mb-6 space-x-2">
              <Sparkles className="w-6 h-6 text-[#C7AA68]" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] to-[#D4BC87]">
                Perfil de Empresa
              </h1>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField icon={Building2} label="Nombre" name="name" value={companyData.name} />
                <InputField icon={Briefcase} label="Sector" name="sector" value={companyData.sector} options={sectors} />
                <InputField icon={Mail} label="Email de Contacto" name="contact_email" type="email" value={companyData.contact_email} />
                <InputField icon={Phone} label="Teléfono de Contacto" name="contact_phone" value={companyData.contact_phone} />
                <InputField icon={Globe} label="Sitio Web" name="website" type="url" value={companyData.website} />

                <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                  <label className="block text-sm font-medium text-[#C7AA68]">Descripción</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <FileText className="h-5 w-5 text-[#C7AA68]" />
                    </div>
                    <textarea
                      name="description"
                      value={companyData.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
                      rows="4"
                    />
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#C7AA68] to-[#D4BC87] hover:from-[#D4BC87] hover:to-[#C7AA68] text-[#0A0F14] font-medium rounded-xl shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300"
                >
                  Actualizar Empresa
                </motion.button>
              </form>
            ) : (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C7AA68]"></div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CompanyPage;