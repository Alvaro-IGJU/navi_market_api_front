import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../HomePage.css';

const HomePage = () => {
  const [form, setForm] = useState({ email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send(
        'service_upf8436', // Reemplaza con tu Service ID
        'template_9loabtf', // Reemplaza con tu Template ID
        form,
        'nH9FAYVuNpQPLeONJ' // Reemplaza con tu Public Key
      )
      .then(
        (response) => {
          setStatus('¡Mensaje enviado exitosamente!');
          setForm({ email: '', message: '' });
        },
        (error) => {
          setStatus('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
        }
      );
  };

  return (
    <div className="flex flex-col min-h-screen font-inter bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/multimedia/videos/navi-market-video.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </video>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            BIENVENIDO A NAVI MARKET
          </h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md max-w-xl">
            ¡Explora un entorno virtual para ferias online y presentaciones empresariales!
          </p>
          <button
            onClick={() => document.getElementById('content').scrollIntoView({ behavior: 'smooth' })}
            className="mt-10 px-6 py-3 text-lg bg-gradient-to-r from-[#C7AA68] to-[#A68A50] hover:from-[#A68A50] hover:to-[#8A6E40] text-white rounded-full shadow-lg transition-all duration-300 flex items-center"
          >
            Conócenos
            <svg
              className="ml-2 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sección de contenido */}
      <div id="content" className="container mx-auto mt-10 space-y-20 px-6 text-white rounded-lg py-8">
        {/* Bloque 1 */}
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="md:w-1/2 p-4">
            <h2 className="text-3xl font-bold mb-4 title-gradient">
              Impulsando Conexiones Comerciales sin Barreras
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Navi Market es la plataforma diseñada para empresas que buscan expandir su
              alcance global sin limitaciones geográficas ni lingüísticas. Nuestro equipo de
              expertos y tecnología avanzada de inteligencia artificial está comprometido con
              crear oportunidades de negocio eficientes y significativas en un entorno virtual
              accesible desde cualquier parte del mundo.
            </p>
          </div>
          <div className="md:w-1/2 perspective-container">
            <img
              src="/multimedia/images/foto2.png"
              alt="Conexiones comerciales"
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video image-hover"
            />
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="flex flex-col md:flex-row items-start md:flex-row-reverse md:space-x-reverse md:space-x-8">
          <div className="md:w-1/2 p-4">
            <h2 className="text-3xl font-bold mb-4 title-gradient">
              Tu Fuente para Expansión Comercial y Networking Internacional
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Navi Market es la solución integral para empresas que desean potenciar su
              presencia global y expandirse en nuevos mercados. Nuestra plataforma de ferias
              virtuales facilita conexiones estratégicas, impulsando el crecimiento comercial
              a través de tecnología avanzada y sin limitaciones geográficas.
            </p>
          </div>
          <div className="md:w-1/2 perspective-container">
            <img
              src="/multimedia/images/foto1.png"
              alt="Expansión comercial"
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video image-hover middle"
            />
          </div>
        </div>

        {/* Bloque 3 */}
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="md:w-1/2 p-4">
            <h2 className="text-3xl font-bold mb-4 title-gradient">
              ¿Por Qué Elegir Navi Market para tus Necesidades Comerciales?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Independientemente de tu sector, Navi Market te ayuda a expandir tus horizontes
              comerciales, superar barreras y aprovechar al máximo tu potencial en el mercado
              global. Estas son algunas razones por las que Navi Market es la solución ideal
              para tu negocio.
            </p>
          </div>
          <div className="md:w-1/2 perspective-container">
            <img
              src="/multimedia/images/foto3.png"
              alt="Por qué elegir"
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video image-hover"
            />
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div id="contact-form" className="container mx-auto px-6 py-16 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Deja tu Mensaje</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold mb-2">
              Tu Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-900 rounded"
              placeholder="tucorreo@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-lg font-semibold mb-2">
              Tu Mensaje
            </label>
            <textarea
              name="message"
              id="message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-900 rounded"
              rows="5"
              placeholder="Escribe tu mensaje aquí..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[#C7AA68] to-[#A68A50] hover:from-[#A68A50] hover:to-[#8A6E40] text-white font-semibold rounded"
          >
            Enviar Mensaje
          </button>
          {status && <p className="text-center mt-4">{status}</p>}
        </form>
      </div>

      {/* Sección de contacto */}
      <footer className="bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:info@navi-market.com"
                  className="text-[#C7AA68] hover:text-[#A68A50] transition"
                >
                  info@navi-market.com
                </a>
              </p>
              <p>
                <strong>Teléfono:</strong>{' '}
                <a
                  href="tel:+34654229811"
                  className="text-[#C7AA68] hover:text-[#A68A50] transition"
                >
                  +34 654 22 98 11
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Ubicación y Horario</h3>
              <p>
                <strong>Dirección:</strong> C/ Pallars 73 08018 San Marti
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Redes Sociales</h3>
              <ul className="space-y-2">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
