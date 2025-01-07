import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api";

// Componente para la tabla de usuarios
const UsersTable = ({
  companyId,
  filters,
  debouncedSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setFilterOptions,
}) => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const response = await api.get(
          `/interactions/companies/${companyId}/interested-users/`,
          {
            params: {
              limit: itemsPerPage,
              offset: (currentPage - 1) * itemsPerPage,
              search: debouncedSearchQuery,
              location: filters.location,
              priority: filters.priority,
              points_min: filters.pointsMin,
              points_max: filters.pointsMax,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { results, total, filters: newFilters } = response.data;

        setUsers(results);
        setTotalUsers(total);

        if (newFilters) {
          setFilterOptions({
            locations: newFilters.locations.filter(Boolean),
            priorities: newFilters.priorities.filter(Boolean),
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching interested users:", err);
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchInterestedUsers();
  }, [companyId, currentPage, debouncedSearchQuery, filters]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

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
        Categoría: user.priority,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios Interesados");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, `Usuarios_Interesados_${new Date().toISOString()}.xlsx`);
  };

  const getInterestClass = (points) => {
    if (points <= 50) return "bg-red-200 text-red-800";
    if (points <= 100) return "bg-yellow-200 text-yellow-800";
    return "bg-green-200 text-green-800";
  };

  if (loading) return <p className="text-gray-500">Cargando usuarios interesados...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <table className="table-auto w-full bg-white text-gray-800 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Ubicación</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Posición</th>
            <th className="px-4 py-2">Sector</th>
            <th className="px-4 py-2">Puntos de interacciones</th>
            <th className="px-4 py-2">Categoría</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email} className="border-b border-gray-300">
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

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <p>
          Página {currentPage} de {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      <button
        onClick={handleDownloadExcel}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
      >
        Descargar Excel
      </button>
    </div>
  );
};

// Componente principal
const InterestedUsersTable = ({ companyId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    priority: "",
    pointsMin: "",
    pointsMax: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    priorities: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Usuarios Interesados</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
        />
        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          className="px-4 py-2 border rounded"
        >
          <option value="">Filtrar por ubicación</option>
          {filterOptions.locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="px-4 py-2 border rounded"
        >
          <option value="">Filtrar por categoría</option>
          {filterOptions.priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Puntos min"
            value={filters.pointsMin}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, pointsMin: e.target.value }))
            }
            className="px-4 py-2 border rounded w-1/4"
          />
          <input
            type="number"
            placeholder="Puntos max"
            value={filters.pointsMax}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, pointsMax: e.target.value }))
            }
            className="px-4 py-2 border rounded w-1/4"
          />
        </div>
      </div>

      <UsersTable
        companyId={companyId}
        filters={filters}
        debouncedSearchQuery={debouncedSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setFilterOptions={setFilterOptions}
      />
    </div>
  );
};

export default InterestedUsersTable;
