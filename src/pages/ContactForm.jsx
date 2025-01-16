import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const [form, setForm] = useState({ email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('¡Mensaje enviado exitosamente!');
      setForm({ email: '', message: '' });
    } catch {
      setStatus('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div whileHover={{ scale: 1.01 }} className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-[#310491]/10 backdrop-blur-sm border border-[#FFC28F]/20 rounded-lg text-[#FBFDF0] focus:border-[#FFC28F] focus:ring-2 focus:ring-[#FFC28F]/20 transition-all duration-300"
              placeholder="Tu correo electrónico"
              required
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.01 }} className="relative">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-[#310491]/10 backdrop-blur-sm border border-[#FFC28F]/20 rounded-lg text-[#FBFDF0] focus:border-[#FFC28F] focus:ring-2 focus:ring-[#FFC28F]/20 transition-all duration-300"
              placeholder="Tu mensaje"
              rows="5"
              required
            ></textarea>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-[#FFC28F] text-[#FBFDF0] font-medium rounded-lg shadow-lg shadow-[#FFC28F]/20 flex items-center justify-center gap-2 backdrop-blur-sm text-black"

          >
            <Send className="w-5 h-5 text-indigo-800" />
            Enviar Mensaje
          </motion.button>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 rounded-lg bg-[#310491]/10 backdrop-blur-sm"
            >
              {status}
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
