import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles } from "lucide-react";
import CustomCheckbox from './CustomCheckbox';

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
    company: "",
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
          company: formData.company,
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
    <div className="relative min-h-screen font-sans text-white overflow-hidden"
    style={{ overflow: "hidden", height: "100vh" }}
>
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center p-4 mt-12"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F14]/50 to-[#0A0F14]"></div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-[#0A0F14]/30 p-6 rounded-3xl border border-[#C7AA68]/20 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-[#C7AA68]" />
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] to-[#D4BC87] ml-2">
                    {isLogin ? "Bienvenido" : "Registro"}
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                    <label className="block text-sm font-medium text-[#C7AA68]">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 placeholder-white/30 text-white"
                      required
                    />
                  </motion.div>

                  {!isLogin && (
                    <>
                      <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                        <label className="block text-sm font-medium text-[#C7AA68]">Usuario</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
                          required
                        />
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                        <label className="block text-sm font-medium text-[#C7AA68]">Empresa</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
                          required
                        />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                          <label className="block text-sm font-medium text-[#C7AA68]">Sector</label>
                          <select
                            name="sector"
                            value={formData.sector}
                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
                            required
                          >
                            <option value="">Seleccionar</option>
                            {sectors.map((sector) => (
                              <option key={sector.id} value={sector.id}>{sector.name}</option>
                            ))}
                          </select>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                          <label className="block text-sm font-medium text-[#C7AA68]">Cargo</label>
                          <select
                            name="position"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
                            required
                          >
                            <option value="">Seleccionar</option>
                            {positions.map((position) => (
                              <option key={position.id} value={position.id}>{position.title}</option>
                            ))}
                          </select>
                        </motion.div>
                      </div>
                    </>
                  )}

                  <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                    <label className="block text-sm font-medium text-[#C7AA68]">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
                      required
                    />
                  </motion.div>

                  {!isLogin && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CustomCheckbox
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        label={
                          <span>
                            Acepto los{" "}
                            <a href="/terms" className="text-[#C7AA68] hover:text-[#D4BC87] underline">
                              términos y condiciones
                            </a>
                          </span>
                        }
                      />
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#C7AA68] to-[#D4BC87] hover:from-[#D4BC87] hover:to-[#C7AA68] text-[#0A0F14] font-medium rounded-xl shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300"
                  >
                    {isLogin ? "Iniciar Sesión" : "Registrarse"}
                  </motion.button>
                </form>

                {isLogin && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-4 text-sm text-[#C7AA68] hover:text-[#D4BC87] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full mt-2 text-sm text-[#C7AA68] hover:text-[#D4BC87] transition-colors"
                >
                  {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </motion.button>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
className="bg-[#0A0F14] p-8 rounded-3xl border border-[#C7AA68]/20 w-full max-w-md"
>
<div className="flex items-center justify-center mb-6 space-x-2">
  <Sparkles className="w-6 h-6 text-[#C7AA68]" />
  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] to-[#D4BC87]">
    Recuperar Contraseña
  </h2>
</div>

<form onSubmit={handlePasswordRecovery} className="space-y-6">
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#C7AA68]">Email</label>
    <input
      type="email"
      value={recoveryEmail}
      onChange={(e) => setRecoveryEmail(e.target.value)}
      className="w-full px-4 py-3 bg-[#0A0F14]/80 border border-[#C7AA68]/20 rounded-xl focus:border-[#C7AA68]/50 focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300 text-white"
      required
    />
  </div>

  <div className="flex justify-between space-x-4">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => setIsModalOpen(false)}
      className="w-1/2 py-3 border border-[#C7AA68]/50 text-[#C7AA68] rounded-xl hover:bg-[#C7AA68]/10 transition-all duration-300"
    >
      Cancelar
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isRecovering}
      className="w-1/2 py-3 bg-gradient-to-r from-[#C7AA68] to-[#D4BC87] hover:from-[#D4BC87] hover:to-[#C7AA68] text-[#0A0F14] rounded-xl shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300"
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
theme="light"
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

export default AuthPage;