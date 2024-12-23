import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, SpotLight, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Base from "../components/Base";
import api from '../api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventPage = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect screen size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Define mobile size as 768px or less
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);
    
    // Initial check
    handleResize();

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log("Fetching event with ID:", eventId);
        const response = await api.get(`/events/${eventId}/`);
        setEventDetails(response.data);
        toast.success("Evento cargado correctamente.");
      } catch (err) {
        console.error("Error fetching event details:", err);
        toast.error("No se pudo cargar la información del evento.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleSelectEvent = () => {
    navigate("/canvas", { state: { eventId } });
    toast.info("Evento seleccionado.");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Canvas
        style={{ width: "100vw", height: "100vh", backgroundColor: "#111111" }}
        shadows
      >
        <ambientLight intensity={0.3} color={"#ffffff"} />
        
        {/* Conditionally render SpotLight and other elements based on screen size */}
        {!isMobile && (
          <>
            <SpotLight
              position={[-1, 3.5, 1]}
              angle={1}
              penumbra={0.5}
              intensity={0.5}
              distance={10}
              castShadow
              target-position={[3, -0.5, 0]}
            />
            <Environment preset="city" background={false} />
            <Physics>
              <Base shouldRotate={true} scale={0.15} position={[2, 0.5, 0]} rotation={[0.4, 0, 0.4]} />
            </Physics>
          </>
        )}
        
        <Html position={[-5, 2, 0]} style={{ padding: "40px" }}>
          {loading && <p className="text-gray-300">Cargando información del evento...</p>}
          {eventDetails && (
            <div className="text-white p-10 rounded-lg shadow-2xl" style={{ backgroundColor: "#222", width: "200%" }}>
              <h1 className="text-4xl font-bold text-white-400 mb-6">{eventDetails.event.name}</h1>
              <p className="text-gray-300 text-lg mb-6">
                {eventDetails.event.description.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <div className="text-gray-300 text-lg mb-6">
                <ul className="custom-list">
                  {eventDetails.unique_sectors.map((sector, index) => (
                    <li key={index} className="text-white">{sector}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleSelectEvent}
                className="bg-yellow-500 text-black px-6 py-3 rounded hover:bg-yellow-600 transition duration-300"
              >
                Seleccionar
              </button>
            </div>
          )}
        </Html>
      </Canvas>
    </>
  );
};

export default EventPage;
