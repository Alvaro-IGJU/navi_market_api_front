import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Laptop, Brain, Send, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import LogoSlider from './LogoSlider';

const AuroraBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="relative w-full h-full overflow-hidden bg-[#0A0F14]"> {/* Fondo aún más oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F14] via-[#0A0F14] to-black opacity-98"></div> {/* Fondo más oscuro con mayor opacidad */}
      
      {/* Efectos de Aurora con opacidades más bajas */}
      <div className="absolute -inset-[10px] opacity-10"> {/* Reducida aún más la opacidad de los efectos */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/10 blur-[120px] animate-pulse"></div> {/* Aurora más oscura */}
        <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 rounded-full bg-[#0A0F14]/20 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/5 blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-[#0A0F14]/15 blur-[120px] animate-pulse delay-300"></div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [form, setForm] = useState({ email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('¡Mensaje enviado exitosamente!');
      setForm({ email: '', message: '' });
    } catch (error) {
      setStatus('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
    }
  };

  const features = [
    {
      title: "Conexiones Globales",
      desc: "Expande tu alcance más allá de las fronteras físicas con nuestra plataforma internacional",
      icon: <Globe className="w-8 h-8" />,
    },
    {
      title: "Ferias Virtuales",
      desc: "Accede a exposiciones interactivas 24/7 desde cualquier lugar del mundo",
      icon: <Laptop className="w-8 h-8" />,
    },
    {
      title: "IA Avanzada",
      desc: "Matching inteligente de negocios potenciado por algoritmos de última generación",
      icon: <Brain className="w-8 h-8" />,
    }
  ];

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">
      <AuroraBackground />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
        >
          <source src="/multimedia/videos/navi-market-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#283941]/50 via-transparent to-[#283941]"></div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center p-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] via-[#D4BC87] to-[#C7AA68] animate-gradient">
            NAVI MARKET
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            La plataforma definitiva para ferias virtuales y networking empresarial
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/events'}
            className="px-8 py-4 text-lg bg-gradient-to-r from-[#C7AA68] to-[#A68A50] hover:from-[#A68A50] hover:to-[#8A6E40] rounded-full shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300 backdrop-blur-sm"
          >
            Explorar eventos
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-[#C7AA68]/20 hover:border-[#C7AA68]/40 transition-all duration-300"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 * idx }}
                className="text-[#C7AA68] mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <LogoSlider />
      {/* Contact Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-20"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-[#C7AA68]/20 rounded-lg text-white focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                placeholder="Tu correo electrónico"
                required
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-[#C7AA68]/20 rounded-lg text-white focus:border-[#C7AA68] focus:ring-2 focus:ring-[#C7AA68]/20 transition-all duration-300"
                placeholder="Tu mensaje"
                rows="5"
                required
              ></textarea>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#C7AA68] to-[#A68A50] hover:from-[#A68A50] hover:to-[#8A6E40] text-white font-medium rounded-lg shadow-lg shadow-[#C7AA68]/20 hover:shadow-[#C7AA68]/40 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Send className="w-5 h-5" />
              Enviar Mensaje
            </motion.button>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                {status}
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-[#283941]/80 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Navi Market</h3>
              <p className="text-gray-400">
                Transformando el futuro del comercio internacional a través de la tecnología.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> info@navi-market.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +34 654 22 98 11
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> C/ Pallars 73 08018 San Marti
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-400 hover:text-[#C7AA68] cursor-pointer transition-colors" />
                <Twitter className="w-6 h-6 text-gray-400 hover:text-[#C7AA68] cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-[#C7AA68] cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-gray-400 hover:text-[#C7AA68] cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;