'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const storyData = [
  {
    title: "Roots in the Philippines",
    text: "The soul of this drink is Ubé (pronounced ooh-beh), a purple yam native to the Philippines. For generations, it has been the star of Filipino desserts like ube halaya and halo-halo. Its flavor is distinct—often described as a blend of vanilla, pistachio, and white chocolate."
  },
  {
    title: "The Modern Cafe Wave",
    text: "The Ube Latte phenomenon began when third-wave coffee shops started looking for natural alternatives to artificial syrups. Ube provided a stunning, natural purple hue and a complex flavor profile that paired unexpectedly well with coffee."
  },
  {
    title: "The Blueberry Twist",
    text: "The specific 'Blueberry-Ube' combination is a modern, 'fusion' innovation. The concept relies on flavor bridging: the earthy, nutty sweetness of the ube bridges the gap between the tart, acidic fruitiness of blueberry and the bitter roast of espresso."
  }
];

export default function StorySection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  return (
    <section id="story" ref={containerRef} className="relative w-full bg-midnight py-40 overflow-hidden">
      
      {/* Background typographic subtle details */}
      <div className="absolute top-0 right-0 p-20 opacity-5 whitespace-nowrap overflow-hidden z-0 select-none hidden lg:block">
        <h2 className="text-[200px] font-bold text-ube blur-3xl mix-blend-screen">THE STORY</h2>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col gap-32">
        {storyData.map((item, i) => {
          const itemStart = i * 0.3;
          const itemEnd = itemStart + 0.3;
          // Each child animates roughly in its own scroll band
          // We can't use simple map for hooks perfectly inside a map if we use hook conditionally, but it's safe at top level wrapper.
          return <StoryCard key={i} item={item} index={i} />;
        })}
      </div>
    </section>
  );
}

function StoryCard({ item, index }: { item: typeof storyData[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 0.8", "0.5 0.5"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className="flex flex-col md:flex-row gap-8 md:gap-16 items-start"
    >
      <div className="w-12 h-12 shrink-0 rounded-full border border-ube/30 flex items-center justify-center text-ube text-xl">
        0{index + 1}
      </div>
      <div className="flex-1">
        <h3 className="text-3xl md:text-5xl font-light text-white mb-6">
          {item.title}
        </h3>
        <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
          {item.text}
        </p>
      </div>
    </motion.div>
  );
}
