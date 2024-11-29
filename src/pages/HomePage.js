import React from 'react';
import { Link } from 'react-router-dom';
import '../HomePage.css'; // Asegúrate de crear este archivo CSS

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Video de fondo */}
      <video autoPlay loop muted className="background-video">
        <source src="/multimedia/videos/navy-market-video.mp4" type="video/mp4" />

        Tu navegador no soporta videos.
      </video>

      {/* Contenido sobre el video */}
      <div className="overlay">
        <h1>BIENVENIDO A NAVY MARKET</h1>
        <p>¡Explora un entorno virtual para ferias online y presentaciones empresariales!</p>
        <Link to="/auth" className="btn btn-lg overlay-btn">
          Inicia sesión o regístrate
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
