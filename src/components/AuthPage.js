import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    sector: "",
    position: "",
    username: "", // Asegúrate de incluir 'username' en el estado
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [positions, setPositions] = useState([]);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para el modal de recuperación de contraseña
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "block";
    }
  });

  // Obtener sectores y posiciones desde el backend
  useEffect(() => {
    const fetchSectorsAndPositions = async () => {
      try {
        // Realiza las solicitudes a la API
        const sectorResponse = await api.get("/users/sectors/");
        const positionResponse = await api.get("/users/positions/");

        // Verifica si las respuestas son válidas antes de usarlas
        if (sectorResponse && sectorResponse.data) {
          setSectors(sectorResponse.data);
        } else {
          console.error("Error: sectorResponse no contiene datos válidos");
          console.log(sectorResponse, sectorResponse.data);
        }

        if (positionResponse && positionResponse.data) {
          setPositions(positionResponse.data);
        } else {
          console.error("Error: positionResponse no contiene datos válidos");
          console.log(positionResponse, positionResponse.data);
        }
      } catch (error) {
        console.error("Error fetching sectors and positions:", error);
        toast.error("No se pudieron cargar los sectores y cargos.");
      }
    };

    fetchSectorsAndPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

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
        const { tokens } = response.data;
        await loginUser(tokens);
        toast.success("Inicio de sesión exitoso");
        if (response.data.role === "Company") {
          navigate("/dashboard");
        } else {
          navigate("/events");
        }
      } else {
        const registerData = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          sector: formData.sector,
          position: formData.position,
        };
        await api.post("/users/register/", registerData);
        toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Error: " +
          (error.response?.data?.email ||
            error.response?.data?.password ||
            "Ha ocurrido un error inesperado.")
      );
    }
  };

  // Función para manejar la recuperación de contraseña
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsRecovering(true);
    try {
      // Asegúrate de que esta ruta exista en tu backend
      await api.post("/users/forgot-password/", { email: recoveryEmail });
      toast.success("Se ha enviado un correo de recuperación.");
      setIsModalOpen(false);
      setRecoveryEmail("");
    } catch (error) {
      console.error(error);
      toast.error(
        "Error: " +
          (error.response?.data?.email ||
            error.response?.data?.message ||
            "Ha ocurrido un error inesperado.")
      );
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-100">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-[#C7AA68]">
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
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
              <div>
                {!isLogin && (
                  <label className="flex items-center text-sm text-[#C7AA68]">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Acepto los{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline ml-1 text-[#C7AA68] hover:text-[#9E8A52]"
                    >
                      términos y condiciones
                    </a>
                  </label>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
              >
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </button>
            </form>
            {isLogin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-2 text-sm text-[#C7AA68] hover:underline focus:outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-4 text-sm text-[#C7AA68] hover:underline focus:outline-none"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Modal de Recuperación de Contraseña */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
              />

              {/* Contenido del Modal */}
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                  <h2 className="text-2xl font-bold mb-4 text-[#C7AA68] text-center">
                    Recuperar Contraseña
                  </h2>
                  <form onSubmit={handlePasswordRecovery} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-[#C7AA68]">Correo Electrónico:</label>
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C7AA68]"
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition duration-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isRecovering}
                        className="px-4 py-2 bg-[#C7AA68] text-gray-900 rounded hover:bg-[#9E8A52] transition duration-300"
                      >
                        {isRecovering ? "Enviando..." : "Enviar"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
