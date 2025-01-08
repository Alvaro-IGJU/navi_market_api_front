import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatWidget = () => {
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

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
      {isChatListOpen && <ChatList onSelectChat={handleChatSelect} />}
    </div>
  );
};

export default ChatWidget;
