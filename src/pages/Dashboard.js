import React, { useEffect, useState, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import CompanyEventBasicStatistics from "../components/CompanyEventBasicStatistics";
import CompanyStandInteractionsChart from "../components/CompanyStandInteractionsChart";
import CompanyLeadsFunnel from "../components/CompanyLeadsFunnel";
import CompanyUsersMap from "../components/CompanyUsersMap";
import CompanyUserPositions from "../components/CompanyUserPositions";
import CompanyUserSectorsPieChart from "../components/CompanyUserSectorsPieChart";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";
import Header from "../components/Header";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const hasFetched = useRef(false);
  const companyId = user?.company_relation;

  useEffect(() => {
    if (user?.role !== "Company") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (companyId && !hasFetched.current) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          await api.get(`/interactions/companies/${companyId}/interactions/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load data.");
          setLoading(false);
        }
      };

      fetchData();
      hasFetched.current = true;
    }
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const expandContent = (content) => setExpandedContent(content);
  const collapseContent = () => setExpandedContent(null);

  return (
    <>
      <Header />

      <div
        className="text-white"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
         
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard de Interacciones</h1>

        <Grid2
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: "90%", margin: "0 auto" }}
          columns={12}
        >
          {/* Estadísticas de Visitas */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => expandContent(<CompanyEventBasicStatistics companyId={companyId} />)}
            >
              <CompanyEventBasicStatistics companyId={companyId} />
            </motion.div>
          </Grid2>

          {/* Embudo de Leads */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer h-full"
              onClick={() => expandContent(<CompanyLeadsFunnel companyId={companyId} />)}
              style={{ height: "100%" }}
            >
              <CompanyLeadsFunnel companyId={companyId} />
            </motion.div>
          </Grid2>

          {/* Mapa de Usuarios */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer "
              onClick={() => expandContent(<CompanyUsersMap companyId={companyId} />)}
            >
              <CompanyUsersMap companyId={companyId} />
            </motion.div>
          </Grid2>

          {/* Interacciones Totales por Tipo */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => expandContent(<CompanyStandInteractionsChart companyId={companyId} />)}
            >
              <CompanyStandInteractionsChart companyId={companyId} />
            </motion.div>
          </Grid2>

          

        

          {/* Posiciones de Usuarios */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => expandContent(<CompanyUserPositions companyId={companyId} />)}
            >
              <CompanyUserPositions companyId={companyId} />
            </motion.div>
          </Grid2>

          {/* Sectores de Usuarios */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => expandContent(<CompanyUserSectorsPieChart companyId={companyId} />)}
            >
              <CompanyUserSectorsPieChart companyId={companyId} />
            </motion.div>
          </Grid2>
            {/* Otra Métrica */}
        <Grid2 size={{ xs: 12, md: 3 }}>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => expandContent(<p>Otra Métrica</p>)}
            >
              <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Otra Métrica</h2>
              <p>Contenido del gráfico o estadística.</p>
            </motion.div>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 7 }}>
          </Grid2>
        </Grid2>
      </div>

      <AnimatePresence>
        {expandedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={collapseContent}
          >
            <motion.div
              className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
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