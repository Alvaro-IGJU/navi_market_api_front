import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => (
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
            className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
        >
            <source src="/multimedia/videos/navi-market-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1B1B]/50 via-transparent to-[#1B1B1B]"></div>

        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center p-4"
        >
            {/* Imagen con efecto de hover y sin posibilidad de arrastrar */}
            <img
                src="./multimedia/images/FINAL LOGO.png"
                alt="Navi Fairs Logo"
                className="mb-6 w-64 md:w-96"
                draggable="false" // Evita que la imagen sea arrastrada
            />

            <p className="text-xl md:text-2xl text-[#FBFDF0] mb-8 max-w-2xl leading-relaxed">
                La plataforma definitiva para ferias virtuales y networking empresarial
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/events'}
                className="px-8 py-4 text-lg bg-gradient-to-r from-[#310491] to-[#FFC28F] hover:from-[#FFC28F] hover:to-[#310491] rounded-full shadow-lg shadow-[#FFC28F]/20 hover:shadow-[#FFC28F]/40 transition-colors duration-500 ease-in-out backdrop-blur-sm"
            >
                Explorar eventos
            </motion.button>
        </motion.div>
    </motion.div>
);

export default HeroSection;
