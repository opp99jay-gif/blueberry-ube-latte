"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { logout } from "@/app/auth/actions";

export function AppleGlassNav({ 
  items, 
  user 
}: { 
  items: { name: string; href: string }[];
  user: User | null;
}) {
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
          ? "w-[90%] md:w-[60%] lg:w-[50%] max-w-3xl rounded-full bg-black/75 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] py-3 px-8"
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
          {user ? (
            <button 
              onClick={() => logout()}
              className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          <button className={`transition-all duration-300 ${scrolled ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'} px-6 py-2 rounded-full text-sm font-semibold`}>
            Order Now
          </button>
        </div>
      </div>
    </nav>
  );
}
