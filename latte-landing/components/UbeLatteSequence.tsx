'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';

const TOTAL_FRAMES = 120;
const INITIAL_IMAGE_PATH = (index: number) => `/sequence/latte_frame_${index}.webp`;

interface BeatMapping {
  start: number;
  end: number;
  title: string;
  subtitle: string;
  align: 'left' | 'center' | 'right';
  isCta?: boolean;
}

const beats: BeatMapping[] = [
  {
    start: 0.0,
    end: 0.20,
    title: 'THE VELVET ROOT',
    subtitle: 'Earthy, sweet ube halaya. The foundation of flavor.',
    align: 'center',
  },
  {
    start: 0.25,
    end: 0.45,
    title: 'SILKEN POUR',
    subtitle: 'Micro-foamed oat milk cascading over crystal clear ice.',
    align: 'left',
  },
  {
    start: 0.50,
    end: 0.70,
    title: 'MIDNIGHT BLUEBERRY',
    subtitle: 'A crown of tart, wild blueberry cold foam.',
    align: 'right',
  },
  {
    start: 0.75,
    end: 0.95,
    title: 'TASTE THE TWILIGHT',
    subtitle: 'Available now at our flagship roastery.',
    align: 'center',
    isCta: true,
  },
];

export default function UbeLatteSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Framer Motion Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the scroll progress to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 1. Preload Images
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    const preloadNext = (index: number) => {
      if (!isMounted) return;
      if (index >= TOTAL_FRAMES) {
        return;
      }

      const img = new Image();
      img.src = INITIAL_IMAGE_PATH(index);
      img.onload = () => {
        count++;
        if (isMounted) setLoadedCount(count);
        imagesRef.current[index] = img;
        
        // Release UI lock early after 5 frames
        if (count === 5 && !isReady && isMounted) {
          setTimeout(() => {
            if (isMounted) setIsReady(true);
          }, 300);
        }
        
        preloadNext(index + 1);
      };
      img.onerror = () => {
        count++;
        if (isMounted) setLoadedCount(count);
        preloadNext(index + 1);
      };
    };

    preloadNext(0);

    // Fallback if network is fast enough that 5 frames never took long but we need it ready anyway
    setTimeout(() => {
      if (isMounted && !isReady) setIsReady(true);
    }, 2000);

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Canvas Drawing Logic
  useEffect(() => {
    if (!isReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Handle high-DPI displays safely
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderFrame(smoothProgress.get());
    };

    const renderFrame = (progress: number) => {
      if (!ctx || !canvas) return;
      
      const frameIndex = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      
      const img = imagesRef.current[frameIndex] || imagesRef.current[ImagesFallbackIndex(frameIndex)];
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const cW = canvas.width;
      const cH = canvas.height;

      // Draw purely dark background first #050505
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cW, cH);

      // Math for 'object-fit: contain'
      const iW = img.width;
      const iH = img.height;
      if (iW === 0 || iH === 0) return; // avoid math errors if not loaded

      const ratio = Math.min(cW / iW, cH / iH);
      const scaledW = iW * ratio;
      const scaledH = iH * ratio;
      const dx = (cW - scaledW) / 2;
      const dy = (cH - scaledH) / 2;

      // Disable image smoothing for sharper look or keep it depending on aesthetic
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, dx, dy, scaledW, scaledH);
    };

    // Initial sizing
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Subscribe to framer-motion spring updates
    const unsubscribe = smoothProgress.on("change", (latest) => {
      requestAnimationFrame(() => renderFrame(latest));
    });

    // Helper to find closest loaded image if scrolling fast
    function ImagesFallbackIndex(desiredIndex: number) {
      for (let i = desiredIndex; i >= 0; i--) {
        if (imagesRef.current[i]) return i;
      }
      return 0;
    }

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isReady, smoothProgress]);

  // Transform values for "Scroll to Taste" Indicator
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Loader UI */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-midnight/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <h2 className="text-white/40 tracking-[0.2em] text-sm uppercase font-light">
                Preparing Experience
              </h2>
              <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-ube shadow-[0_0_15px_rgba(147,112,219,0.8)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* The Scrolly Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Scroll to Taste</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-ube/60 to-transparent"
          />
        </motion.div>

        {/* Scrollytelling Beats Overlay */}
        {beats.map((beat, i) => (
          <BeatText key={i} beat={beat} progress={smoothProgress} />
        ))}

      </div>
    </div>
  );
}

// Separate component for text beat using direct useTransform mappings
function BeatText({ beat, progress }: { beat: BeatMapping, progress: any }) {
  const { start, end, title, subtitle, align, isCta } = beat;
  
  const span = end - start;
  const fadeInEnd = start + span * 0.1; // 10% of their range
  const fadeOutStart = end - span * 0.1;

  const opacity = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [20, 0, 0, -20]
  );

  let alignClass = 'items-center text-center';
  if (align === 'left') alignClass = 'items-start text-left left-8 md:left-24';
  if (align === 'right') alignClass = 'items-end text-right right-8 md:right-24';
  
  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-4 max-w-2xl px-6 pointer-events-none ${
        align === 'center' ? 'left-1/2 -translate-x-1/2 items-center text-center' : alignClass
      }`}
    >
      <h2 className={`font-light tracking-tight leading-none ${
        isCta 
        ? 'text-5xl md:text-7xl lg:text-8xl text-ube pb-2 drop-shadow-[0_0_20px_rgba(147,112,219,0.3)]' 
        : 'text-5xl md:text-7xl lg:text-9xl text-white/95'
      }`}>
        {title}
      </h2>
      <p className="text-lg md:text-2xl font-light text-white/70 max-w-md tracking-wide">
        {subtitle}
      </p>
      
      {isCta && (
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(147,112,219,0.1)' }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-4 border border-ube/30 rounded-full text-ube uppercase tracking-[0.2em] text-sm pointer-events-auto transition-colors hover:border-ube/80"
        >
          Discover Menu
        </motion.button>
      )}
    </motion.div>
  );
}
