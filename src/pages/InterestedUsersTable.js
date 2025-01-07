import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api";

const InterestedUsersTable = ({ companyId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(
          `/interactions/companies/${companyId}/interested-users/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interested users:", err);
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchInterestedUsers();
  }, [companyId]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        Nombre: `${user.username}`,
        Email: user.email,
        Ubicación: user.location,
        Empresa: user.company,
        Posición: user.position_title,
        Sector: user.sector_name,
        Interés: user.total_points,
        Categoría: user.priority
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios Interesados");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, `Usuarios_Interesados_${new Date().toISOString()}.xlsx`);
  };

  const getInterestClass = (points) => {
    if (points <= 50) return "bg-red-200 text-red-800"; // Rojo suave
    if (points <= 100) return "bg-yellow-200 text-yellow-800"; // Amarillo suave
    return "bg-green-200 text-green-800"; // Verde suave
  };

  if (loading) return <p className="text-gray-500">Cargando usuarios interesados...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Usuarios Interesados</h2>
      <button
        onClick={handleDownloadExcel}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mb-4"
      >
        Descargar Excel
      </button>
      <table className="table-auto w-full bg-white text-gray-800 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Ubicación</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Posición</th>
            <th className="px-4 py-2">Sector</th>
            <th className="px-4 py-2">Interés</th>
            <th className="px-4 py-2">Categoría</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-300">
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.location}</td>
              <td className="px-4 py-2">{user.company}</td>
              <td className="px-4 py-2">{user.position_title}</td>
              <td className="px-4 py-2">{user.sector_name}</td>
              <td className={`px-4 py-2 text-center ${getInterestClass(user.total_points)}`}>
                {user.total_points}
              </td>
              <td className="px-4 py-2">{user.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterestedUsersTable;
