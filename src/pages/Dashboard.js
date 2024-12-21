import React, { useEffect, useState, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import { useNavigate } from "react-router-dom"; // Para redirección
import Header from "../components/Header";
import EventInteractionsChart from "../components/CompanyStandInteractionsChart";
import EventVisitsChart from "../components/CompanyEventBasicStatistics"; // Nuevo componente
import api from "../api";
import { AuthContext } from "../contexts/AuthContext"; // Contexto de autenticación
import CompanyEventBasicStatistics from "../components/CompanyEventBasicStatistics";
import CompanyStandInteractionsChart from "../components/CompanyStandInteractionsChart";
import CompanyLeadsFunnel from "../components/CompanyLeadsFunnel";
import CompanyUsersMap from "../components/CompanyUsersMap";

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Obtener usuario desde el contexto
  const navigate = useNavigate(); // Redirección
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null); // Control de expansión
  const hasFetched = useRef(false); // Controlar llamadas duplicadas
  const companyId = user?.company_relation;

  // Verificar si el usuario tiene el rol adecuado
  useEffect(() => {
    if (user?.role !== "Company") {
      navigate("/"); // Redirigir a la página de inicio u otra página
    }
  }, [user, navigate]);

  useEffect(() => {
    if (companyId && !hasFetched.current) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const totalDuration = response.data.interaction_details.reduce(
            (sum, item) => sum + item.total_duration,
            0
          );
          setTotalTime(totalDuration);
          setLoading(false);
        } catch (err) {
          console.error("Error al obtener los datos:", err);
          setError("No se pudieron cargar las estadísticas.");
          setLoading(false);
        }
      };

      fetchData();
      hasFetched.current = true; // Evita múltiples llamadas
    }
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const expandContent = (content) => {
    setExpandedContent(content);
  };

  const collapseContent = () => {
    setExpandedContent(null);
  };

  return (
    <>
      <Header />
      <div
        className="container  p-4 text-white"
        style={{
          maxWidth: "95vw", // Reducir márgenes laterales
          margin: "0 auto", // Centrar el contenedor
          padding: "0 10px",
          height: "100vh",
        }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard de Interacciones</h1>

        <div
          className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
          style={{ gridAutoRows: "minmax(200px, auto)" }} // Ajustar proporciones
        >
          {/* Primera Columna */}
          <div className="grid gap-4">
              <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer"
              onClick={() => expandContent(<CompanyEventBasicStatistics companyId={companyId} />)}
            >
              <CompanyEventBasicStatistics companyId={companyId} />
            </motion.div>
            <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer min-h-[200px]"
              onClick={() => expandContent(<CompanyStandInteractionsChart companyId={companyId} />)}
            >
              <CompanyStandInteractionsChart companyId={companyId} />
            </motion.div>
            <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer min-h-[200px]"
              onClick={() => expandContent(<p>Otra Métrica</p>)}
            >
              <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Otra Métrica</h2>
              <p>Contenido del gráfico o estadística.</p>
            </motion.div>
          </div>

          {/* Segunda Columna */}
          <div className="grid gap-4">
            <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer min-h-[200px]"
              onClick={() => expandContent(<CompanyLeadsFunnel companyId={companyId} />)}
            >
              <CompanyLeadsFunnel companyId={companyId} />
            </motion.div>
            <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer min-h-[200px]"
              onClick={() =>
                expandContent(
                  <p className="text-3xl font-bold">
                    {Math.floor(totalTime / 60)} minutos {totalTime % 60} segundos
                  </p>
                )
              }
            >
              <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Tiempo Total</h2>
              <p className="text-3xl font-bold">
                {Math.floor(totalTime / 60)} minutos {totalTime % 60} segundos
              </p>
            </motion.div>
          </div>

          {/* Tercera Columna */}
          <div className="grid gap-4">
            <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer min-h-[200px]"
              onClick={() => expandContent(<CompanyUsersMap companyId={companyId} />)}
            >
              <CompanyUsersMap companyId={companyId} />
            </motion.div>
            <motion.div
              layout
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer min-h-[200px]"
              onClick={() => expandContent(<p>Métrica Secundaria</p>)}
            >
              <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Métrica Secundaria</h2>
              <p>Contenido adicional.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal con transición */}
      <AnimatePresence>
        {expandedContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={collapseContent}
          >
            <motion.div
              className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
              layout
            >
              {expandedContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
