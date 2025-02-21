import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

// Creamos la instancia del socket una sola vez, fuera del componente.
const socket = io("http://192.168.1.43:3001");

socket.on("connect", () => {
  console.log("Socket conectado, id:", socket.id);
});

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
