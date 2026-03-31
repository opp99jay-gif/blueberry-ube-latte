'use client';

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, Sphere } from '@react-three/drei';

function FloatingSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} scale={1.5}>
        <meshPhysicalMaterial 
          color="#9370DB" 
          roughness={0.1} 
          metalness={0.8} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
          transmission={0.5}
          thickness={1.5}
          ior={1.5}
        />
      </Sphere>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#d8b4e2" />
      <Environment preset="city" />
    </Float>
  );
}

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-midnight">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <FloatingSphere />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-ube animate-pulse"></span>
          <span className="text-white/80 text-xs font-medium tracking-widest uppercase">The Artisan Experience</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-ube to-fuchsia-400 mb-6 drop-shadow-2xl"
        >
          Blueberry <br />
          Ubé Latte
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-lg md:text-xl text-white/60 font-light mb-10 leading-relaxed"
        >
          A multi-dimensional fusion of earthy Philippine yam and tart wild blueberries. Taste the twilight.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <a
            href="#story"
            className="w-full sm:w-auto text-center px-8 py-4 bg-white text-black rounded-full font-medium transition-transform hover:scale-105"
          >
            Discover the Story
          </a>
          <a
            href="#sequence"
            className="w-full sm:w-auto text-center px-8 py-4 bg-white/10 text-white rounded-full font-medium backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20"
          >
            See the Craft
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/30 text-xs uppercase tracking-[0.3em]">Scroll into Depth</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
