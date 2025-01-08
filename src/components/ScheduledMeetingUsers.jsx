import React, { useEffect, useState } from "react";
import api from "../api";

const ScheduledMeetingUsers = ({ companyId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeChatUser, setActiveChatUser] = useState(null);

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
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledMeetingUsers(currentPage);
  }, [companyId, currentPage]);

  const handleAccept = (user) => {
    setActiveChatUser(user);
  };

  const handleReject = (userId) => {
    console.log(`Rejecting meeting for user with ID: ${userId}`);
    // Implement your reject logic here
  };

  const closeChat = () => {
    setActiveChatUser(null);
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

          {/* Chat Modal */}
          {activeChatUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  Chat con {activeChatUser.username}
                </h3>
                <div className="border border-gray-300 rounded p-4 mb-4 h-48 overflow-y-auto">
                  {/* Chat messages will be displayed here */}
                  <p className="text-gray-600">Chat iniciado...</p>
                </div>
                <textarea
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  placeholder="Escribe tu mensaje..."
                ></textarea>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closeChat}
                  >
                    Cerrar
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledMeetingUsers;
