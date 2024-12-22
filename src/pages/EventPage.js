import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, SpotLight, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Base from "../components/Base";
import api from '../api';
const EventPage = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Para manejar redirección

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log("Fetching event with ID:", eventId);
        const response = await api.get(`/events/${eventId}/`);
        setEventDetails(response.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("No se pudo cargar la información del evento.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleSelectEvent = () => {
    // Manejar la selección del evento, por ejemplo redirigir a una página específica
     navigate("/canvas", { state: { eventId } });
  };


  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", backgroundColor: "#111111" }}
      shadows
    >
      {/* Iluminación global */}
      <ambientLight intensity={0.3} color={"#ffffff"} />

      {/* Foco encima del modelo */}
      <SpotLight
        position={[-1, 3.5, 1]}
        angle={1}
        penumbra={0.5}
        intensity={0.5}
        distance={10}
        castShadow
        target-position={[3, -0.5, 0]}
      />

      {/* Entorno HDR para reflexiones */}
      <Environment
        preset="city" // Escoge un preset como "city", "sunset", "warehouse", etc.
        background={false} // Si quieres un fondo HDR
      />

      {/* Física y modelo 3D */}
      <Physics>
        {/* Usar el Base adaptado con shouldRotate habilitado */}
        <Base shouldRotate={true} scale={0.15} position={[2, 0.5, 0]} rotation={[0.4, 0, 0.4]} />
      </Physics>

      {/* Contenido HTML superpuesto */}
      <Html position={[-5, 2, 0]} style={{ width: "50%", padding: "20px" }}>
        {loading && <p className="text-gray-300">Cargando información del evento...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {eventDetails && (
          <div className="text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">{eventDetails.name}</h1>
            <p className="text-gray-300 text-lg mb-4">{eventDetails.description}</p>
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
             
              
            </div>
            
            <button
                onClick={() => handleSelectEvent({eventId})}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Seleccionar
              </button>
          </div>
        )}
      </Html>
    </Canvas>
  );
};

export default EventPage;
