'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

const processData = [
  {
    layer: 'Base Layer (Blueberry)',
    desc: 'Simmered blueberries with sugar and water until thickened. Strained for a smoother texture. The sour syrup anchors the flavor profile.',
    image: '/assembly/base.png'
  },
  {
    layer: 'Middle Layer (Milk & Ube)',
    desc: 'Ube extract, powder, or halaya mixed with oat or coconut milk. Poured over ice to float above the dense fruit.',
    image: '/assembly/middle.png'
  },
  {
    layer: 'Top Layer (Coffee)',
    desc: 'A double shot of espresso is slowly poured over the back of a spoon so it floats rather than mixing instantly.',
    image: '/assembly/top.png'
  },
  {
    layer: 'Optional Finish',
    desc: 'Topped with ube cold foam, whipped cream, or fresh blueberries for an added visual appeal.',
    image: '/assembly/finish.png'
  }
];

const craftData = [
  {
    title: 'Temperature',
    desc: 'Best served iced to maintain the distinct colorful layers and refreshing quality.',
    image: '/craft/temperature.png'
  },
  {
    title: 'Texture',
    desc: 'Ube halaya adds a slight thickness or chew, while powders offer a smoother consistency. The rustic compote contrasts with liquid milk.',
    image: '/craft/texture.png'
  },
  {
    title: 'Color Theory',
    desc: 'The visual gradient ombre effect moves from dark blue/purple at the bottom to light lavender, topped with dark brown crema.',
    image: '/craft/color.png'
  }
];

export default function FeaturesSection() {
  return (
    <section id="process" className="w-full bg-midnight py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        
        {/* Process Grid */}
        <div>
          <h2 className="text-4xl md:text-6xl font-light text-white mb-12 text-center tracking-tight">
            The Assembly <span className="text-ube">Process</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processData.map((p, i) => (
              <TiltCard key={i} title={p.layer} desc={p.desc} index={i} image={p.image} />
            ))}
          </div>
        </div>

        {/* Craft Grid */}
        <div>
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight">
              The <span className="text-blue-400">Craft</span>
            </h2>
            <p className="text-white/40 max-w-xl font-light text-lg">
              Creating this visual gradient ombre effect is a deliberate, multi-dimensional process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {craftData.map((c, i) => (
              <TiltCard key={`craft-${i}`} title={c.title} desc={c.desc} index={i} highlight image={c.image} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function TiltCard({ title, desc, index, highlight = false, image }: { title: string, desc: string, index: number, highlight?: boolean, image?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
      className={`relative group rounded-3xl p-8 flex flex-col justify-end min-h-[400px] overflow-hidden backdrop-blur-3xl border border-white/5 shadow-2xl transition-colors duration-500
      ${highlight ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-white/5 hover:bg-white/10'}`}
    >
      {/* Background Image Area (if provided) */}
      {image && (
        <div 
          className="absolute inset-x-0 top-0 h-56 z-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ transform: "translateZ(-20px)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/40 to-transparent z-10" />
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" loading="lazy" className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ transform: "translateZ(-50px)" }} 
      />
      
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex flex-col gap-4 mt-auto">
        <h3 className={`text-2xl font-semibold tracking-tight ${highlight ? 'text-white' : 'text-ube'}`}>
          {title}
        </h3>
        <p className="text-white/60 font-light leading-relaxed text-sm md:text-base drop-shadow-md">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
