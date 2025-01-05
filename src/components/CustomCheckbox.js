import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomCheckbox = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer group ${className}`}>
      <div className="relative">
        <motion.div
          className={`w-5 h-5 rounded-md border-2 transition-colors duration-200 ${
            checked 
              ? 'bg-gradient-to-r from-[#C7AA68] to-[#D4BC87] border-transparent' 
              : 'border-[#C7AA68]/30 hover:border-[#C7AA68]/50 bg-[#0A0F14]/80'
          }`}
          animate={{
            scale: checked ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.2
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: checked ? 1 : 0,
              scale: checked ? 1 : 0.5,
            }}
            transition={{
              duration: 0.2
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="w-3.5 h-3.5 text-[#0A0F14]" />
          </motion.div>
        </motion.div>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 w-0 h-0"
        />
      </div>
      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-200">
        {label}
      </span>
    </label>
  );
};

export default CustomCheckbox;