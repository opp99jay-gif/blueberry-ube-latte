"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function AppleGlassNav({ items }: { items: { name: string; href: string }[] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "w-[90%] md:w-[60%] lg:w-[50%] max-w-3xl rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] py-3 px-8"
          : "w-full max-w-5xl bg-transparent py-6 px-10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Link href="/" className="text-white font-bold text-xl tracking-widest uppercase">
            Ubé
          </Link>
        </div>
        
        <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex justify-end">
          <button className={`transition-all duration-300 ${scrolled ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'} px-6 py-2 rounded-full text-sm font-semibold backdrop-blur-md`}>
            Order Now
          </button>
        </div>
      </div>
    </nav>
  );
}
