import React, { useState, useEffect } from "react";
import api from "../api";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatWidget = () => {
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/companies/chats/", {
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

  useEffect(() => {
    fetchChats();
  }, []);

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setIsChatListOpen(false); // Cierra la lista de chats al seleccionar uno
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {activeChat && (
        <ChatWindow
          chat={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
      <div
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer"
        onClick={toggleChatList}
      >
        {isChatListOpen ? "Cerrar Chats" : "Abrir Chats"}
      </div>
      {isChatListOpen && (
        <ChatList
          chats={chats}
          loading={loading}
          error={error}
          onSelectChat={handleChatSelect}
        />
      )}
    </div>
  );
};

export default ChatWidget;
