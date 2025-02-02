import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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

        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center p-4"
        >
            <img
                src="./multimedia/images/FINAL LOGO.png"
                alt="Navi Fairs Logo"
                className="mb-6 w-64 md:w-96"
                draggable="false"
            />

            <p className="text-xl md:text-2xl text-[#FBFDF0] mb-8 max-w-2xl leading-relaxed">
                La plataforma definitiva para ferias virtuales y networking empresarial
            </p>
            <motion.button
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(255 194 143 / 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                onClick={() => window.location.href = '/events'}
                className="relative group px-8 py-4 text-lg font-semibold text-white 
                bg-[#FFC28F] rounded-full shadow-lg shadow-[#FFC28F]/20
                hover:shadow-[#FFC28F]/40 
                transition-shadow duration-500 ease-in-out 
                backdrop-blur-sm overflow-hidden
                flex items-center gap-2"
            >
                <span className="relative z-10 text-black">
                    Explorar eventos
                </span>
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-orange-400/40"
                    initial={{ x: "100%" }}
                    whileHover={{ x: "-100%" }}
                    transition={{ duration: 0.8 }}
                />
            </motion.button>
        </motion.div>
    </motion.div>
);

export default HeroSection;