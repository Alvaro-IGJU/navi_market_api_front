import React from "react";

const ChatList = ({ chats, loading, error, onSelectChat }) => {
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
              <p className="font-semibold text-gray-800">{chat.participants[0].username}</p>
              <p className="text-gray-600 text-sm">{chat.last_message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
