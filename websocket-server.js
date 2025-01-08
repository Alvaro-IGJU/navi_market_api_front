const WebSocket = require("ws");

const PORT = 8080; // Cambia el puerto si es necesario
const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket Server is running on ws://localhost:${PORT}`);

// Manejar conexiones WebSocket
server.on("connection", (ws) => {
    console.log("New client connected");

    // Escuchar mensajes de los clientes
    ws.on("message", (message) => {
        console.log(`Received: ${message}`);

        // Reenviar el mensaje a todos los clientes conectados
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Manejar desconexiones
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
