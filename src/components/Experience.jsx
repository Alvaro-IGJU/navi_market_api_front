import React, { useRef, useEffect, useContext } from "react";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import Stand from "./Stand";
import Base from "./Base";
import api from "../api"; // Axios configurado
import { AuthContext } from "../contexts/AuthContext"; // Contexto de autenticación

const Experience = () => {
  const characterRef = useRef();
  const { user } = useContext(AuthContext);

  // Cambia este ID según el evento actual
  const eventId = 2; // ID del evento actual

  const registerVisit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(`/interactions/visits/register/${eventId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Visita registrada.");
    } catch (error) {
      console.error("Error al registrar la entrada:", error.response || error);
    }
  };

  const closeVisit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(`/interactions/visits/close/${eventId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Visita cerrada. Tiempo total: ${response.data.total_time} segundos`);
    } catch (error) {
      console.error("Error al registrar la salida:", error.response || error);
    }
  };

  useEffect(() => {
    if (user) {
      // Registrar visita al montar el componente
      registerVisit();
    }

    const handleUnload = (event) => {
      // Ejecutar closeVisit cuando el usuario cierre la pestaña o navegue fuera de la página
      closeVisit();
      event.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // No hacemos nada al cambiar de pestaña
        return;
      }
    };

    // Escuchar el evento `beforeunload` para cerrar la visita al cerrar la pestaña
    window.addEventListener("beforeunload", handleUnload);
    // Escuchar el evento `pagehide` para cerrar la visita al navegar fuera
    window.addEventListener("pagehide", handleUnload);
    // Escuchar cambios en la visibilidad
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Limpiar eventos
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  return (
    <>
      {/* Entorno */}
      <Environment preset="sunset" />

      {/* Simulación física */}
      <Physics>
        {/* Modelo base */}
        <Base position={[-3, -2, 2]} scale={[1, 1, 1]} />

        {/* Stand con contador */}
        <Stand position={[-3, -1, 2]} size={[1, 1, 1]} color="blue" characterRef={characterRef} />
        <Stand position={[4, -1, 2]} size={[1, 1, 1]} color="red" characterRef={characterRef} />

        {/* Personaje */}
        <CharacterController characterRef={characterRef} />
      </Physics>
    </>
  );
};

export default Experience;
