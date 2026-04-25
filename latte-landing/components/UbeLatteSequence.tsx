'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';

// Reduced from 120 to 40 frames for mobile performance
const TOTAL_FRAMES_DESKTOP = 120;
const TOTAL_FRAMES_MOBILE = 40;
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
  const [isMobile, setIsMobile] = useState(false);
  const lastFrameRef = useRef(-1);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalFrames = isMobile ? TOTAL_FRAMES_MOBILE : TOTAL_FRAMES_DESKTOP;

  // Framer Motion Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Lighter spring for mobile
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 60 : 100,
    damping: isMobile ? 20 : 30,
    restDelta: 0.001,
  });

  // 1. Preload Images (skip frames on mobile)
  useEffect(() => {
    let isMounted = true;
    let count = 0;

    const step = isMobile ? Math.floor(TOTAL_FRAMES_DESKTOP / TOTAL_FRAMES_MOBILE) : 1;

    const preloadNext = (sourceIndex: number, targetIndex: number) => {
      if (!isMounted) return;
      if (sourceIndex >= TOTAL_FRAMES_DESKTOP || targetIndex >= totalFrames) {
        return;
      }

      const img = new Image();
      img.src = INITIAL_IMAGE_PATH(sourceIndex);
      img.onload = () => {
        count++;
        if (isMounted) setLoadedCount(count);
        imagesRef.current[targetIndex] = img;
        
        // Release UI lock early after 3 frames
        if (count >= 3 && !isReady && isMounted) {
          setTimeout(() => {
            if (isMounted) setIsReady(true);
          }, 200);
        }
        
        preloadNext(sourceIndex + step, targetIndex + 1);
      };
      img.onerror = () => {
        count++;
        if (isMounted) setLoadedCount(count);
        preloadNext(sourceIndex + step, targetIndex + 1);
      };
    };

    preloadNext(0, 0);

    // Fallback timeout
    setTimeout(() => {
      if (isMounted && !isReady) setIsReady(true);
    }, 2000);

    return () => {
      isMounted = false;
    };
  }, [isMobile, totalFrames]);

  // 2. Canvas Drawing Logic - optimized to skip redundant frames
  useEffect(() => {
    if (!isReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Lower DPR on mobile for performance
    const getDPR = () => Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);

    const resizeCanvas = () => {
      const dpr = getDPR();
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      lastFrameRef.current = -1; // force redraw after resize
      renderFrame(smoothProgress.get());
    };

    const renderFrame = (progress: number) => {
      if (!ctx || !canvas) return;
      
      const frameIndex = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1
      );

      // Skip if same frame - huge GPU savings
      if (frameIndex === lastFrameRef.current) return;
      lastFrameRef.current = frameIndex;
      
      const img = imagesRef.current[frameIndex] || imagesRef.current[findFallback(frameIndex)];
      if (!img) return;

      const cW = canvas.width;
      const cH = canvas.height;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cW, cH);

      const iW = img.width;
      const iH = img.height;
      if (iW === 0 || iH === 0) return;

      const ratio = Math.min(cW / iW, cH / iH);
      const scaledW = iW * ratio;
      const scaledH = iH * ratio;
      const dx = (cW - scaledW) / 2;
      const dy = (cH - scaledH) / 2;

      ctx.imageSmoothingEnabled = !isMobile;
      ctx.imageSmoothingQuality = 'low';

      ctx.drawImage(img, dx, dy, scaledW, scaledH);
    };

    function findFallback(desiredIndex: number) {
      for (let i = desiredIndex; i >= 0; i--) {
        if (imagesRef.current[i]) return i;
      }
      return 0;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const unsubscribe = smoothProgress.on("change", (latest) => {
      requestAnimationFrame(() => renderFrame(latest));
    });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isReady, smoothProgress, isMobile, totalFrames]);

  // Transform values for "Scroll to Taste" Indicator
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Loader UI */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-midnight/95">
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
                  animate={{ width: `${(loadedCount / totalFrames) * 100}%` }}
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

// Separate component for text beat
function BeatText({ beat, progress }: { beat: BeatMapping, progress: any }) {
  const { start, end, title, subtitle, align, isCta } = beat;
  
  const span = end - start;
  const fadeInEnd = start + span * 0.1;
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
