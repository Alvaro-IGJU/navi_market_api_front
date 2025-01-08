import React, { useEffect, useState } from "react";
import api from "../api";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/api/companies/chats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data.chats || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("No se pudieron cargar los chats.");
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <p className="text-gray-500">Cargando chats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4 w-72">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chats Disponibles</h3>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="cursor-pointer p-2 rounded hover:bg-gray-100 flex items-center gap-3"
            onClick={() => onSelectChat(chat)}
          >
            <img
              src={chat.profile_picture || "/multimedia/images/default-avatar.jpg"}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{chat.name}</p>
              <p className="text-gray-600 text-sm">{chat.last_message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
