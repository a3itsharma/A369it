import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Rocket, Users, BookOpen, Sparkles } from 'lucide-react';

export const ChapterCard = ({ number, title, summary, passage }: { number: number, title: string, summary: string, passage: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
      viewport={{ once: true }}
      className="glass-card p-6 md:p-12 hover:bg-white/[0.03] transition-all duration-700 group cursor-default"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-10">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl mars-gradient flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-2xl shimmer-foil shrink-0 opacity-80">
          {number}
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-matte-charcoal dark:text-white group-hover:text-electric-blue transition-colors leading-tight">{title}</h3>
      </div>
      <p className="text-tesla-silver/50 mb-10 leading-relaxed italic text-xl font-light">"{summary}"</p>
      <div className="p-6 md:p-8 bg-black/5 dark:bg-black/40 rounded-2xl border border-black/[0.02] dark:border-white/[0.02]">
        <p className="text-base text-tesla-silver/40 font-serif leading-relaxed tracking-wide">
          <Sparkles size={16} className="inline mr-4 text-electric-blue/30" />
          {passage}
        </p>
      </div>
    </motion.div>
  );
};

export const ExperimentVisual = () => {
  return (
    <div className="relative w-full aspect-video glass-card overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 mars-gradient opacity-20"></div>
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 rounded-full bg-electric-blue blur-3xl"
        ></motion.div>
        <Zap size={48} className="text-electric-blue animate-pulse absolute" />
        <div className="mt-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-electric-blue mb-2">Experiment Active</div>
          <div className="text-xl font-serif">The Skyway Ladder</div>
        </div>
      </div>
      
      {/* Arcs */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200]
          }}
          transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() }}
          className="absolute w-1 h-1 bg-electric-blue rounded-full"
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
};
