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
    // Crear una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        Nombre: `${user.username}`,
        Email: user.email,
        Posición: user.position_title,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios Interesados");

    // Generar archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, `Usuarios_Interesados_${new Date().toISOString()}.xlsx`);
  };

  if (loading) return <p className="text-gray-300">Cargando usuarios interesados...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-[#C7AA68] mb-4">Usuarios Interesados</h2>
      <button
        onClick={handleDownloadExcel}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mb-4"
      >
        Descargar Excel
      </button>
      <table className="table-auto w-full text-gray-100">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Posición</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-600">
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.position_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterestedUsersTable;
