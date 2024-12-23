import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, SpotLight, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useNavigate, useParams } from "react-router-dom";
import Base from "../components/Base";
import api from '../api';
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

const EventPage = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect screen size for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
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

  const handleBack = () => {
    navigate(-1); // Navega a la pantalla anterior
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <button
        onClick={handleBack}
        className="back-button"
      >
        <FontAwesomeIcon 
          icon={faCircleChevronLeft} 
          size="lg" 
          className="back-icon" 
        />
      </button>

      <Canvas
        style={{ width: "100vw", height: "100vh", backgroundColor: "#111111" }}
        shadows
      >
        <ambientLight intensity={0.3} color="#ffffff" />
        
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
            <div className="event-details">
              <h1 className="event-name">{eventDetails.event.name}</h1>
              <p className="event-description">
                {eventDetails.event.description.split("\n").map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
              <div className="event-sectors">
                <ul>
                  {eventDetails.unique_sectors.map((sector, index) => (
                    <li key={index}>{sector}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleSelectEvent}
                className="select-button"
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
