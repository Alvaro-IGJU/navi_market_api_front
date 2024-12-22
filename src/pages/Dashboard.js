import React, { useEffect, useState, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useNavigate } from "react-router-dom";
import CompanyEventBasicStatistics from "../components/CompanyEventBasicStatistics";
import CompanyStandInteractionsChart from "../components/CompanyStandInteractionsChart";
import CompanyLeadsFunnel from "../components/CompanyLeadsFunnel";
import CompanyUsersMap from "../components/CompanyUsersMap";
import CompanyUserPositions from "../components/CompanyUserPositions";
import CompanyUserSectorsPieChart from "../components/CompanyUserSectorsPieChart";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";
import Header from "../components/Header";

const ResponsiveGridLayout = WidthProvider(Responsive);

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

  const layouts = {

    lg: [
      { i: "stats", x: 0, y: 0, w: 3, h: 2 },
      { i: "funnel", x: 3, y: 0, w: 4, h: 4 },
      { i: "map", x: 9, y: 0, w: 5, h: 4.5 },
      { i: "interactions", x: 0, y: 2, w: 3, h:3.5 },
      { i: "positions", x: 3, y: 4, w: 4, h: 3 },
      { i: "sectors", x: 9, y: 2, w: 5, h: 3 },
      { i: "other", x: 0, y: 6, w: 3, h: 1 },
    ],
    md: [
      { i: "stats", x: 0, y: 0, w: 6, h: 2 },
      { i: "funnel", x: 6, y: 0, w: 6, h: 2},
      { i: "map", x: 6, y: 2, w: 6, h: 3 },
      { i: "interactions", x: 0, y: 6, w: 6, h: 3},
      { i: "positions", x: 6, y: 6, w: 6, h: 2 },
      { i: "sectors", x: 0, y: 8, w: 6, h: 2 },
      { i: "other", x: 6, y: 8, w: 6, h: 1 },
    ],
    sm: [
      { i: "stats", x: 0, y: 0, w: 12, h: 2 },
      { i: "interactions", x: 0, y: 2, w: 12, h: 4 },
      { i: "map", x: 0, y: 6, w: 12, h: 4 },
      { i: "funnel", x: 0, y: 8, w: 12, h: 4 },
      { i: "positions", x: 0, y: 10, w: 12, h: 2 },
      { i: "sectors", x: 0, y: 12, w: 12, h: 2 },
      { i: "other", x: 0, y: 14, w: 12, h: 1 },
    ],
  };

  return (
  <>
    <Header />

    <div
      className="bg-gray-800 min-h-screen p-6"
      style={{
        padding: "20px", // Espaciado alrededor del layout
      }}
    >
      <h1
        className="text-3xl font-bold mt-3 mb-8 text-center text-white"
      >
        Dashboard de Interacciones
      </h1>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1350, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 12 }}
        rowHeight={150}
        style={{
          margin: "0 auto",
          maxWidth: "100%",
          backgroundColor: "#1F2937",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Sombra para destacar el layout
        }}
      >
        <div
          key="stats"
          style={{
            border: "1px solid #d3d3d3",
            backgroundColor: "#ffffff",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <CompanyEventBasicStatistics companyId={companyId} />
        </div>
        <div
          key="funnel"
          style={{
            border: "1px solid #d3d3d3",
            backgroundColor: "#ffffff",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <CompanyLeadsFunnel companyId={companyId} />
        </div>
        <div
          key="map"
          style={{
            border: "1px solid #d3d3d3",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <CompanyUsersMap companyId={companyId} />
        </div>
        <div
          key="interactions"
          style={{
            border: "1px solid #d3d3d3",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <CompanyStandInteractionsChart companyId={companyId} />
        </div>
        <div
          key="positions"
          style={{
            border: "1px solid #d3d3d3",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <CompanyUserPositions companyId={companyId} />
        </div>
        <div
          key="sectors"
          style={{
            border: "1px solid #d3d3d3",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <CompanyUserSectorsPieChart companyId={companyId} />
        </div>
        <div
          key="other"
          style={{
            border: "1px solid #d3d3d3",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Otra Métrica</h2>
          <p>Contenido del gráfico o estadística.</p>
        </div>
      </ResponsiveGridLayout>
    </div>
  </>
);
};

export default Dashboard;
