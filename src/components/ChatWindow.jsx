import React, { useState, useEffect } from "react";

const ChatWindow = ({ chat, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establecer conexión WebSocket al abrir el chat
    const ws = new WebSocket(`ws://localhost:8000/companies/ws/companies/${chat.id}/`);

    ws.onopen = () => {
      console.log("WebSocket conectado");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado");
    };

    setSocket(ws);

    // Cerrar la conexión WebSocket al desmontar el componente
    return () => {
      ws.close();
    };
  }, [chat.id]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const message = { sender: "Tú", text: input };
      socket.send(JSON.stringify({ message }));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{chat.name}</h3>
        <button onClick={onClose} className="text-white text-xl">
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === "Tú" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded ${
                message.sender === "Tú" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <strong>{message.sender}</strong>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
