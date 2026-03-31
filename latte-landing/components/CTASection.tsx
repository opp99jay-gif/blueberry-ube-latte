'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="relative w-full py-40 bg-midnight flex flex-col items-center justify-center overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-ube to-fuchsia-600 rounded-full mix-blend-screen opacity-10 blur-[150px]"></div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 text-center px-4">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-medium tracking-tighter text-white drop-shadow-2xl mb-8"
        >
          Ready to experience <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ube to-fuchsia-400">the fusion?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="#"
            className="px-12 py-6 bg-white text-black text-xl font-medium rounded-full hover:scale-105 transition-transform drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] shadow-[0_0_40px_rgba(147,112,219,0.5)] border border-white/50"
          >
            Find a Location
          </a>
        </motion.div>
      </div>
    </section>
  );
}
