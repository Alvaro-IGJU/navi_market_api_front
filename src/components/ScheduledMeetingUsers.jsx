import React, { useEffect, useState } from "react";
import api from "../api";

const ScheduledMeetingUsers = ({ companyId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchScheduledMeetingUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await api.get(
        `/interactions/companies/${companyId}/scheduled-meeting/`,
        {
          params: { page },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(response.data.users || []);
      setTotalPages(response.data.total_pages || 1);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching scheduled meeting users:", err);
      setError("No se pudieron cargar los usuarios.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledMeetingUsers(currentPage);
  }, [companyId, currentPage]);

  const handleAccept = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/companies/create-chat/`,
        {
          participant_id: user.id,
          company_id: companyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("¡Chat creado exitosamente!");

      // Eliminar el usuario de la lista
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Error creating chat:", err);
      alert(
        err.response?.data?.error || "No se pudo iniciar el chat. Inténtalo de nuevo."
      );
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/companies/reject-meeting/`,
        {
          user_id: userId,
          company_id: companyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("¡Solicitud rechazada con éxito!");

      // Eliminar el usuario de la lista
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error rejecting meeting:", err);
      alert(
        err.response?.data?.error || "No se pudo rechazar la solicitud. Inténtalo de nuevo."
      );
    }
  };

  if (loading) return <p className="text-gray-500">Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Usuarios que intentaron agendar una reunión
      </h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No se encontraron usuarios.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.profile_picture || "/multimedia/images/default-avatar.jpg"}
                    alt={`${user.username}'s profile`}
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user.username}
                  </h3>
                </div>
                <p className="text-gray-600 mt-2">Email: {user.email}</p>
                <p className="text-gray-600">Ubicación: {user.location || "N/A"}</p>
                <p className="text-gray-600">Empresa: {user.company || "N/A"}</p>
                <p className="text-gray-600">Posición: {user.position || "N/A"}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAccept(user)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
            >
              Anterior
            </button>
            <p>
              Página {currentPage} de {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledMeetingUsers;
