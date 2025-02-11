import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api"; // Asegúrate de que api esté correctamente configurado

// Componente de filtros
const Filters = ({ filters, setFilters, setCurrentPage }) => {
  const searchInputRef = useRef(null);

  // Manejamos los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Resetear la página a la 1 cuando los filtros cambian
    setCurrentPage(1);
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filters.search]); // El foco se mantiene cuando cambia el filtro de búsqueda

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <input
        ref={searchInputRef} // Mantener el foco
        type="text"
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
        placeholder="Buscar por nombre o email"
        className="px-4 py-2 border rounded w-1/3"
      />
      <input
        type="text"
        name="location"
        value={filters.location}
        onChange={handleFilterChange}
        placeholder="Filtrar por ubicación"
        className="px-4 py-2 border rounded w-1/3"
      />
      <input
        type="text"
        name="position"
        value={filters.position}
        onChange={handleFilterChange}
        placeholder="Filtrar por posición"
        className="px-4 py-2 border rounded w-1/3"
      />
      <input
        type="text"
        name="sector"
        value={filters.sector}
        onChange={handleFilterChange}
        placeholder="Filtrar por sector"
        className="px-4 py-2 border rounded w-1/3"
      />
    </div>
  );
};

// Componente para la tabla de usuarios
const AdminUsersTable = ({ filters, setFilters }) => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 10; // Tamaño de la página (10 usuarios por página)

  // UseEffect para manejar el debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(); // Llamamos a la función de búsqueda solo después de 1 segundo
    }, 1000);

    // Limpiar el timeout anterior si el filtro cambia antes de que el tiempo se cumpla
    return () => clearTimeout(timer);
  }, [filters, currentPage]); // También se dispara cuando cambia la página

  // Fetch usuarios con filtros aplicados
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      // Validación para evitar NaN en currentPage
      const validCurrentPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

      // Calcular el offset dinámicamente
      const offset = (validCurrentPage - 1) * itemsPerPage;

      // Solicitud a la API con los filtros y la paginación
      const response = await api.get(
        `/users/admin/get-users/`,
        {
          params: {
            limit: itemsPerPage,
            offset: offset, // Usar el offset calculado
            search: filters.search, // Usar el filtro de búsqueda
            location: filters.location, // Usar el filtro de ubicación
            position: filters.position, // Usar el filtro de posición
            sector: filters.sector, // Usar el filtro de sector
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { results, count } = response.data;
      setUsers(results);
      setTotalUsers(count); // Total de usuarios para calcular las páginas

      // Si la página actual es mayor que el total de páginas, volvemos a la página 1
      if (currentPage > Math.ceil(count / itemsPerPage)) {
        setCurrentPage(1);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage); // Calculamos el número total de páginas

  // Función para cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Cambiar la página
    }
  };

  // Función para descargar la tabla como archivo Excel
  const handleDownloadExcel = async () => {
    try {
      // Obtener todos los usuarios con filtros aplicados
      const token = localStorage.getItem("accessToken");

      const response = await api.get(
        `/users/admin/get-users/`,
        {
          params: {
            limit: 10000, // Un límite alto para obtener todos los usuarios
            offset: 0, // Empezar desde el principio
            search: filters.search, // Filtro de búsqueda por nombre o email
            location: filters.location, // Filtro de ubicación
            position: filters.position, // Filtro de posición
            sector: filters.sector, // Filtro de sector
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { results } = response.data;

      // Convertir la respuesta a formato Excel
      const worksheet = XLSX.utils.json_to_sheet(
        results.map((user) => ({
          Nombre: `${user.username}`,
          Email: user.email,
          Ubicación: user.location,
          Empresa: user.company,
          Posición: user.position_title,
          Sector: user.sector_name,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });

      saveAs(data, `Usuarios_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error("Error al descargar los usuarios:", error);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Tabla de usuarios */}
      <table className="table-auto w-full bg-white text-gray-800 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Ubicación</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Posición</th>
            <th className="px-4 py-2">Sector</th>
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <p>
          Página {currentPage} de {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
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
const AdminUsersPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    position: "",
    sector: "",
  });

  const [currentPage, setCurrentPage] = useState(1); // Página actual

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Usuarios Administrativos</h2>
      {/* Filtros */}
      <Filters filters={filters} setFilters={setFilters} setCurrentPage={setCurrentPage} />
      {/* Tabla de usuarios */}
      <AdminUsersTable filters={filters} setFilters={setFilters} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default AdminUsersPage;
