import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, SpotLight, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Base from "../components/Base";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

const supportsWebGL = () => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return !!gl;
};

const EventPage = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false); // Estado adicional para tabletas
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "block";
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024); // Pantallas entre móvil y PC
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Verificamos al montar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log("Fetching event with ID:", eventId);
        const response = await api.get(`/events/${eventId}/`);
        setEventDetails(response.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
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
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!supportsWebGL()) {
    return <p>Tu dispositivo no soporta WebGL. Intenta actualizar tu navegador o usar otro dispositivo.</p>;
  }

  return (
    <>
      {searchParams.get('unique') !== "true" && <button
        onClick={handleBack}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          background: "none",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FontAwesomeIcon 
          icon={faCircleChevronLeft} 
          beat={hover}
          size="lg" 
          style={{ color: "#FFD43B" }} 
        />
      </button>}

      <Canvas
        style={{ width: "100vw", height: "100vh", backgroundColor: "#111111" }}
        shadows
      >
        <ambientLight intensity={0.3} color={"#ffffff"} />
        
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
        
        <Html position={[0, 0, 0]}>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: isMobile ? "10%" : isTablet ? "-390px" : "-550px", // Diferentes valores para móvil, tablet y PC
              transform: isMobile
                ? "translate(-50%, -50%)"
                : isTablet
                ? "translate(0, -50%)"
                : "translate(0, -50%)", // Centrado horizontal en móvil, ajustado en tablet
              zIndex: 1000,
              backgroundColor: "#222",
              padding: "20px",
              borderRadius: "10px",
              width: isMobile ? "300px" : isTablet ? "350px" : "400px", // Ancho dinámico
              color: "white",
            }}
          >
            {loading ? (
              <p className="text-gray-300">Cargando información del evento...</p>
            ) : (
              eventDetails && (
                <>
                  <h1 className="text-4xl font-bold mb-6">{eventDetails.event.name}</h1>
                  <p className="text-gray-300 text-lg mb-6">
                    {eventDetails.event.description.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <div className="text-gray-300 text-lg mb-6">
                    <ul>
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
                </>
              )
            )}
          </div>
        </Html>
      </Canvas>
    </>
  );
};

export default EventPage;
