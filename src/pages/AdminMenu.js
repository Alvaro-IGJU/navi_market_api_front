import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Store, 
  Layers, 
  Users, 
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const AuroraBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="relative w-full h-full overflow-hidden bg-[#0A0F14]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F14] via-[#0A0F14] to-black opacity-98"></div>
      <div className="absolute -inset-[10px] opacity-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/10 blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 rounded-full bg-[#0A0F14]/20 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-[#C7AA68]/5 blur-[120px] animate-pulse delay-1000"></div>
      </div>
    </div>
  </div>
);

const AdminMenu = () => {
  const navigate = useNavigate();

  const adminOptions = [
    {
      name: "Dashboard",
      description: "Ver estadísticas generales",
      route: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Administrar eventos",
      description: "Añadir un nuevo evento",
      route: "/admin/events",
      icon: CalendarDays
    },
    {
      name: "Administrar stands",
      description: "Crear un nuevo stand",
      route: "/admin/stands",
      icon: Store
    },
    {
      name: "Administrar sectores",
      description: "Definir un nuevo sector",
      route: "/admin/sectors",
      icon: Layers
    },
    {
      name: "Administrar posiciones",
      description: "Asignar posiciones en un sector",
      route: "/admin/positions",
      icon: Users
    },
    {
      name: "Crear Usuario Empresa",
      description: "Registrar un nuevo usuario de empresa",
      route: "/admin/create-company-user",
      icon: Building2
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen font-sans text-white pt-28"> {/* Añadido pt-20 para el espacio del header */}
      <AuroraBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 mb-2"
        >
          <Sparkles className="w-6 h-6 text-[#C7AA68]" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C7AA68] to-[#D4BC87]">
            Panel de Administración
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mb-8"
        >
          Selecciona una opción para gestionar los recursos
        </motion.p>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {adminOptions.map((option, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(option.route)}
              className="backdrop-blur-xl bg-[#0A0F14]/30 p-6 rounded-3xl border border-[#C7AA68]/20 shadow-2xl cursor-pointer group hover:shadow-lg hover:shadow-[#C7AA68]/10 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-2xl bg-[#C7AA68]/10 text-[#C7AA68] group-hover:bg-[#C7AA68] group-hover:text-[#0A0F14] transition-all duration-300">
                  <option.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-[#C7AA68]">{option.name}</h3>
              </div>
              
              <p className="text-gray-400 mb-4 min-h-[2.5rem]">{option.description}</p>
              
              <div className="flex items-center text-[#C7AA68] group-hover:text-[#D4BC87] transition-colors">
                <span className="text-sm font-medium">Acceder</span>
                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMenu;