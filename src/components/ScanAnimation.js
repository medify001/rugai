import React from 'react';
import { motion } from 'framer-motion';

const ScanAnimation = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-rugai-green/10 rounded-lg"
      initial={{ height: 0 }}
      animate={{ 
        height: "100%",
        transition: { 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
    >
      <motion.div 
        className="h-1 bg-rugai-green/50"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          transition: { 
            duration: 2,
            repeat: Infinity
          }
        }}
      />
    </motion.div>
  );
};

export default ScanAnimation;