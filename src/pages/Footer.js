import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1B1B1B]/80 backdrop-blur-md mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-[#FBFDF0] mb-4">Navi Fairs</h3>
            <p className="text-[#FBFDF0]/80">
              Transformando el futuro del comercio internacional a través de la tecnología.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#FBFDF0] mb-4">Contacto</h3>
            <ul className="space-y-2 text-[#FBFDF0]/80">
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
            <h3 className="text-xl font-bold text-[#FBFDF0] mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-[#FBFDF0]/80 hover:text-[#FFC28F] cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-[#FBFDF0]/80 hover:text-[#FFC28F] cursor-pointer transition-colors" />
              <Linkedin className="w-6 h-6 text-[#FBFDF0]/80 hover:text-[#FFC28F] cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-[#FBFDF0]/80 hover:text-[#FFC28F] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-[#FBFDF0]/10">
          <p className="text-[#FBFDF0]/60 text-sm">
            © {new Date().getFullYear()} Navi Fairs. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
