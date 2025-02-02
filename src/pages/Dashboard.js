import React, { useEffect, useState, useContext, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useNavigate } from "react-router-dom";
import CompanyEventBasicStatistics from "../components/CompanyEventBasicStatistics";
import CompanyStandInteractionsChart from "../components/CompanyStandInteractionsChart";
import CompanyStandInteractionsGrid from "../components/CompanyStandInteractionsGrid";
import CompanyLeadsFunnel from "../components/CompanyLeadsFunnel";
import CompanyUsersMap from "../components/CompanyUsersMap";
import CompanyUserPositions from "../components/CompanyUserPositions";
import CompanyUserSectorsPieChart from "../components/CompanyUserSectorsPieChart";
import TotalScore from "../components/TotalScore";
import TotalScheduleMeetings from "../components/TotalScheduleMeetings";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";
import InterestedUsersTable from "./InterestedUsersTable";
import AudiencePeaksChart from "../components/AudiencePeaksChart";
import DeviceUsagePieChart from "../components/DeviceUsagePieChart";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [interactionsData, setInteractionsData] = useState(null);
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

          const companyResponse = await api.get(`/companies/details/${companyId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCompanyName(companyResponse.data.name);

          const interactionsResponse = await api.get(
            `/interactions/companies/${companyId}/interactions/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setInteractionsData(interactionsResponse.data);

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

  if (loading) return <p className="text-gray-500">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const layouts = {
    lg: [
      { i: "funnel", x: 0, y: 0, w: 3, h: 4 },
      { i: "map", x: 0, y: 3, w: 3, h: 3 },
      { i: "stats", x: 4, y: 0, w: 3, h: 2 },
      { i: "interactions", x: 3, y: 2, w: 3, h: 2.5 },
      { i: "audiencePeaks", x: 6, y: 0, w: 3, h: 2.5 },
      { i: "interactionsGrid", x: 3, y: 4.5, w: 3, h: 1.5 },
      { i: "totalScore", x: 6, y: 0, w: 3, h: 1.5 },
      { i: "positions", x: 3, y: 3, w: 4.5, h: 3 },
      { i: "sectors", x: 8, y: 3, w: 4.5, h: 3 },
      { i: "deviceUsage", x: 9, y: 0, w: 3, h: 4 },
    ],
    md: [
      // Reducir dimensiones y ajustar posiciones para mantener la misma estructura
      { i: "funnel", x: 0, y: 0, w: 4, h: 3 }, // Más pequeño
      { i: "map", x: 0, y: 3, w: 4, h: 2.5 }, // Más pequeño
      { i: "stats", x: 4, y: 0, w: 4, h: 1.5 }, // Más pequeño
      { i: "interactions", x: 4, y: 1.5, w: 4, h: 2 }, // Más pequeño
      { i: "audiencePeaks", x: 8, y: 0, w: 4, h: 2 }, // Más pequeño
      { i: "interactionsGrid", x: 4, y: 3.5, w: 4, h: 1.5 }, // Más pequeño
      { i: "totalScore", x: 8, y: 2, w: 4, h: 1.5 }, // Más pequeño
      { i: "positions", x: 4, y: 5, w: 4, h: 2.5 }, // Más pequeño
      { i: "sectors", x: 8, y: 5, w: 4, h: 2.5 }, // Más pequeño
      { i: "deviceUsage", x: 8, y: 7.5, w: 4, h: 3 }, // Más pequeño
    ],
    sm: [
      { i: "funnel", x: 0, y: 0, w: 12, h: 3 },
      { i: "map", x: 0, y: 3, w: 12, h: 3 },
      { i: "stats", x: 0, y: 6, w: 12, h: 2 },
      { i: "interactions", x: 0, y: 8, w: 12, h: 2 },
      { i: "audiencePeaks", x: 0, y: 10, w: 12, h: 4 },
      { i: "interactionsGrid", x: 0, y: 14, w: 6, h: 1.5 },
      { i: "totalScore", x: 6, y: 14, w: 6, h: 1.5 },
      { i: "positions", x: 0, y: 16, w: 12, h: 2 },
      { i: "sectors", x: 0, y: 18, w: 12, h: 2 },
    ],
  };
  
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mt-14 flex justify-between items-center w-full px-4 py-2 bg-white">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard de {companyName || "Interacciones"}
        </h1>

        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={() => navigate("/users-table", { state: { companyId } })}
        >
          Ver Tabla de Usuarios
        </button>
      </div>

      {!loading && !error && (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1350, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 12, sm: 12 }}
          rowHeight={100}
          isDraggable={false}
          isResizable={false}
          onLayoutChange={(layout) => console.log("Layout cambiado", layout)} 
        >
          <div key="funnel" className="p-4 rounded-lg border">
            <CompanyLeadsFunnel companyId={companyId} interactionsData={interactionsData} />
          </div>
          <div key="map" className="p-4 rounded-lg border">
            <CompanyUsersMap companyId={companyId} />
          </div>
          <div key="interactions" className="p-4 rounded-lg border">
            <CompanyStandInteractionsChart companyId={companyId} interactionsData={interactionsData} />
          </div>
          <div key="interactionsGrid" className="p-4 rounded-lg border">
            <CompanyStandInteractionsGrid companyId={companyId} interactionsData={interactionsData} />
          </div>
          <div key="positions" className="p-4 rounded-lg border">
            <CompanyUserPositions companyId={companyId} />
          </div>
          <div key="deviceUsage" className="p-4 rounded-lg border">
            <DeviceUsagePieChart companyId={companyId} />
          </div>
          <div key="audiencePeaks" className="p-4 rounded-lg border">
            <AudiencePeaksChart />
          </div>
          <div key="totalScore" className="p-4 rounded-lg border mx-auto">
            <TotalScore companyId={companyId} />
          </div>
          <div key="sectors" className="p-4 rounded-lg border">
            <CompanyUserSectorsPieChart companyId={companyId} />
          </div>
        </ResponsiveGridLayout>
      )}
    </div>
  );

};

export default Dashboard;
