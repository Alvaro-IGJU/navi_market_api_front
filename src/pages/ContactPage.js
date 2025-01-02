import React, { useState } from "react";
import "../contactPage.css"; // Archivo CSS específico para la página de contacto

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simula el envío del formulario
    setTimeout(() => {
      setMessage("¡Tu mensaje ha sido enviado correctamente!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contáctanos</h1>

        {/* Detalles de contacto */}
        <div className="contact-details">
          <div className="contact-item">
            <h3>Dirección</h3>
            <p>Calle Ejemplo 123, Ciudad, País</p>
          </div>
          <div className="contact-item">
            <h3>Teléfono</h3>
            <p>+34 123 456 789</p>
          </div>
          <div className="contact-item">
            <h3>Email</h3>
            <p>contacto@empresa.com</p>
          </div>
        </div>

        {message && <p className="success-message">{message}</p>}

        {/* Formulario de contacto */}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Tu nombre"
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Tu correo electrónico"
            />
          </div>
          <div className="form-field">
            <label>Asunto</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              placeholder="Asunto del mensaje"
            />
          </div>
          <div className="form-field">
            <label>Mensaje</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              required
              placeholder="Tu mensaje"
            ></textarea>
          </div>
          <button type="submit" className="contact-button">
            Enviar
          </button>
        </form>

        {/* Mapa */}
        <div className="contact-map">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.95373531531803!3d-37.81621897975179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57718d9c78581e3!2sFederation+Square!5e0!3m2!1sen!2sau!4v1486088120832"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
