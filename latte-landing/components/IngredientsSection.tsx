'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ingredients = [
  {
    title: 'The Ube Source',
    type: 'The Foundation',
    desc: 'Gold Standard: Ube Halaya (Jam) thick, pulpy texture dissolved in warm liquid first. Cafe Standard: Ube Extract + Condensed Milk. Natural: Ube powder.',
    color: 'text-ube'
  },
  {
    title: 'Blueberries',
    type: 'The Acidic Counter',
    desc: 'Syrup or compote. They add a tart, fruity acidity that cuts through the rich, earthy sweetness of the ube.',
    color: 'text-blue-400'
  },
  {
    title: 'Milk',
    type: 'The Body',
    desc: 'Coconut milk and oat milk are top choices. Coconut enhances the tropical profile, oat milk offers a creamy frothable texture.',
    color: 'text-white/80'
  },
  {
    title: 'Espresso',
    type: 'The Bitter Contrast',
    desc: 'A double shot is standard. The robust bitterness balances the sweet ube and tart berries.',
    color: 'text-amber-700'
  }
];

export default function IngredientsSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="ingredients" ref={containerRef} className="relative w-full h-[250vh] bg-midnight">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Parallax Background Layers */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) }}
          className="absolute inset-0 z-0 bg-gradient-to-b from-midnight via-blue-900/5 to-midnight"
        />

        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row gap-12 items-center justify-center">
          
          {/* Sticky Left: Title */}
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-8xl font-light text-white mb-6"
            >
              The 
              <br />
              Dimensions 
              <br />
              <span className="text-ube">Of Taste</span>
            </motion.h2>
          </div>

          {/* Right side: Scrolling Ingredients mapping to view */}
          <div className="flex-1 w-full h-[60vh] relative">
            {ingredients.map((ing, i) => {
              // Creating custom staggered scroll ranges for each item
              const start = i * 0.25;
              const end = start + 0.25;
              
              const y = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [100, 0, 0, -100]);
              const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
              const scale = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.8, 1, 1, 0.8]);
              
              return (
                <motion.div
                  key={i}
                  style={{ y, opacity, scale }}
                  className="absolute inset-0 flex flex-col justify-center gap-4"
                >
                  <span className={`text-sm tracking-widest uppercase font-semibold ${ing.color}`}>
                    {ing.type}
                  </span>
                  <h3 className="text-4xl md:text-6xl text-white font-medium">
                    {ing.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-sm">
                    {ing.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
        
      </div>
    </section>
  );
}
