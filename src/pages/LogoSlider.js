import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faApple, faGoogle, faMicrosoft, faAmazon, faFacebook, 
  faTwitter, faInstagram, faLinkedin, faSpotify,
  faSlack, faDropbox, faAirbnb,
} from '@fortawesome/free-brands-svg-icons';

const LogoSlider = () => {
  const brands = [
    { id: 1, name: 'Apple', icon: faApple },
    { id: 2, name: 'Google', icon: faGoogle },
    { id: 3, name: 'Microsoft', icon: faMicrosoft },
    { id: 4, name: 'Amazon', icon: faAmazon },
    { id: 5, name: 'Facebook', icon: faFacebook },
    { id: 6, name: 'Twitter', icon: faTwitter },
    { id: 7, name: 'Instagram', icon: faInstagram },
    { id: 8, name: 'Linkedin', icon: faLinkedin },
    { id: 9, name: 'Spotify', icon: faSpotify },
    { id: 10, name: 'Slack', icon: faSlack },
    { id: 11, name: 'Dropbox', icon: faDropbox },
    { id: 12, name: 'Airbnb', icon: faAirbnb },
  ];

  return (
    <div className="w-full py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] to-[#D4BC87]">
          Empresas que confían en nosotros
        </h2>
      </motion.div>

      <div className="relative overflow-hidden">
        {/* Slider de logotipos */}
        <motion.div
          animate={{
            x: ['0%', '-100%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 120,
              ease: 'linear',
            },
          }}
          className="flex gap-20 items-center"
        >
          {/* Duplicamos los logos para el efecto infinito */}
          {[...brands, ...brands].map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 w-40 h-20 rounded-lg bg-gradient-to-r from-[#0A0F14] backdrop-blur-xl border border-[#C7AA68]/20 hover:border-[#C7AA68]/40 transition-all duration-300 flex items-center justify-center group shadow-lg"
            >
              <FontAwesomeIcon
                icon={brand.icon}
                size="3x"
                className="text-[#C7AA68] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </motion.div>

        {/* Gradientes laterales para desvanecimiento suave */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#0A0F14] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#0A0F14] to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default LogoSlider;