import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Laptop, Brain } from 'lucide-react';

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

const FeaturesSection = () => (
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
          className="p-8 rounded-2xl border border-[#FFC28F]/20 hover:border-[#FFC28F]/40 transition-all duration-300"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 * idx }}
            className="text-[#FFC28F] mb-4"
          >
            {feature.icon}
          </motion.div>
          <h3 className="text-xl font-bold text-[#FBFDF0] mb-2">{feature.title}</h3>
          <p className="text-[#FBFDF0]/80">{feature.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default FeaturesSection;
