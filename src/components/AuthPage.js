import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuroraBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="relative w-full h-full overflow-hidden bg-[#0A0F14]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F14] via-[#0A0F14] to-black opacity-98"></div>
      <div className="absolute -inset-[10px] opacity-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/10 blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 rounded-full bg-[#0A0F14]/20 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/5 blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-[#0A0F14]/15 blur-[120px] animate-pulse delay-300"></div>
      </div>
    </div>
  </div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    sector: "",
    position: "",
    username: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectorsAndPositions = async () => {
      try {
        const [sectorResponse, positionResponse] = await Promise.all([
          api.get("/users/sectors/"),
          api.get("/users/positions/")
        ]);
        
        setSectors(sectorResponse.data || []);
        setPositions(positionResponse.data || []);
      } catch (error) {
        toast.error("No se pudieron cargar los sectores y cargos.");
      }
    };

    fetchSectorsAndPositions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && !acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    try {
      if (isLogin) {
        const response = await api.post("/users/login/", {
          email_or_username: formData.email,
          password: formData.password,
        });
        await loginUser(response.data.tokens);
        toast.success("Inicio de sesión exitoso");
        navigate(response.data.role === "Company" ? "/dashboard" : "/events");
      } else {
        await api.post("/users/register/", {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          sector: formData.sector,
          position: formData.position,
        });
        toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Ha ocurrido un error inesperado.");
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsRecovering(true);
    try {
      await api.post("/users/forgot-password/", { email: recoveryEmail });
      toast.success("Se ha enviado un correo de recuperación.");
      setIsModalOpen(false);
      setRecoveryEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al procesar la solicitud.");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">
      <AuroraBackground />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center"
      >
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        >
          <source src="/multimedia/videos/navi-market-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#283941]/50 via-transparent to-[#283941]"></div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-[#C7AA68]/20 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] via-[#D4BC87] to-[#C7AA68]">
                  {isLogin ? "Bienvenido" : "Registro"}
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                    <label className="block text-sm text-[#C7AA68]">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-[#C7AA68]/20 rounded-lg focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                      required
                    />
                  </motion.div>

                  {!isLogin && (
                    <>
                      <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                        <label className="block text-sm text-[#C7AA68]">Usuario</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full px-3 py-2 bg-white/5 border border-[#C7AA68]/20 rounded-lg focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                          required
                        />
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                        <label className="block text-sm text-[#C7AA68]">Sector</label>
                        <select
                          name="sector"
                          value={formData.sector}
                          onChange={(e) => setFormData({...formData, sector: e.target.value})}
                          className="w-full px-3 py-2 bg-white/5 border border-[#C7AA68]/20 rounded-lg focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                          required
                        >
                          <option value="">Seleccionar</option>
                          {sectors.map((sector) => (
                            <option key={sector.id} value={sector.id}>{sector.name}</option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                        <label className="block text-sm text-[#C7AA68]">Cargo</label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          className="w-full px-3 py-2 bg-white/5 border border-[#C7AA68]/20 rounded-lg focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                          required
                        >
                          <option value="">Seleccionar</option>
                          {positions.map((position) => (
                            <option key={position.id} value={position.id}>{position.title}</option>
                          ))}
                        </select>
                      </motion.div>
                    </>
                  )}

                  <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                    <label className="block text-sm text-[#C7AA68]">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-[#C7AA68]/20 rounded-lg focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                      required
                    />
                  </motion.div>

                  {!isLogin && (
                    <div className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="rounded border-[#C7AA68]/20 text-[#C7AA68]"
                      />
                      <label className="text-gray-300">
                        Acepto los{" "}
                        <a href="/terms" className="text-[#C7AA68] hover:text-[#D4BC87] underline">
                          términos y condiciones
                        </a>
                      </label>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-[#C7AA68] to-[#A68A50] hover:from-[#A68A50] hover:to-[#8A6E40] text-white font-medium rounded-lg shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300"
                  >
                    {isLogin ? "Iniciar Sesión" : "Registrarse"}
                  </motion.button>
                </form>

                {isLogin && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-2 text-xs text-[#C7AA68] hover:text-[#D4BC87]"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}

                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full mt-2 text-xs text-[#C7AA68] hover:text-[#D4BC87]"
                >
                  {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal de recuperación de contraseña */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1F25] p-8 rounded-2xl border border-[#C7AA68]/20 w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] to-[#D4BC87]">
                Recuperar Contraseña
              </h2>
              
              <form onSubmit={handlePasswordRecovery} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm text-[#C7AA68]">Email</label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-[#C7AA68]/20 rounded-lg focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className="flex justify-between space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 py-3 border border-[#C7AA68] text-[#C7AA68] rounded-lg hover:bg-[#C7AA68]/10 transition-all duration-300"
                  >
                    Cancelar
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isRecovering}
                    className="w-1/2 py-3 bg-gradient-to-r from-[#C7AA68] to-[#A68A50] hover:from-[#A68A50] hover:to-[#8A6E40] text-white rounded-lg shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300"
                  >
                    {isRecovering ? "Enviando..." : "Recuperar"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AuthPage;