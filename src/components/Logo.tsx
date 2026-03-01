import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Mars Planet Background */}
        <circle cx="50" cy="50" r="45" fill="#E27D60" />
        <circle cx="50" cy="50" r="45" fill="url(#marsGradient)" />
        
        {/* Trident Silhouette */}
        <path d="M50 20V80M50 20L40 35M50 20L60 35M35 45C35 45 40 55 50 55C60 55 65 45 65 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
        
        {/* UFO Silhouette */}
        <ellipse cx="50" cy="25" rx="15" ry="5" fill="white" fillOpacity="0.8" />
        <circle cx="50" cy="22" r="4" fill="white" />

        <defs>
          <radialGradient id="marsGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(45)">
            <stop offset="0" stopColor="#E27D60" stopOpacity="0" />
            <stop offset="1" stopColor="#8D4F3D" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
