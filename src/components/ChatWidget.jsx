import React, { useState, useEffect } from "react";
import { MessageCircle, X, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import api from "../api";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatWidget = () => {
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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
    setIsChatListOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-[3rem] z-50 flex flex-col items-end space-y-4">
      {/* {activeChat && (
        <div className="mb-4 transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
          <ChatWindow chat={activeChat} onClose={() => setActiveChat(null)} />
        </div>
      )}
      
      {isChatListOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-xl p-4 w-80 transform transition-all duration-300 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Chats
            </h3>
            <button 
              onClick={toggleChatList}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : (
            <ChatList
              chats={chats}
              loading={loading}
              error={error}
              onSelectChat={handleChatSelect}
            />
          )}
        </div>
      )}

      <button
        className={`group relative flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
          isHovered ? 'scale-110 bg-blue-700' : ''
        } hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300`}
        onClick={toggleChatList}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <MessageCircle 
            className={`w-6 h-6 transition-transform duration-300 ${
              isChatListOpen ? 'rotate-360' : ''
            }`} 
          />
          {chats.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {chats.length}
            </span>
          )}
        </div>
      </button> */}
    </div>
  );
};

// Añade estos estilos en tu archivo CSS global
const styles = `
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

@keyframes rotate-360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate-360 {
  animation: rotate-360 0.3s ease-in-out;
}
`;

export default ChatWidget;