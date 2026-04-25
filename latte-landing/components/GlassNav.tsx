"use client";

import { useState, useEffect, useRef } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "w-[90%] md:w-[70%] lg:w-[60%] max-w-4xl rounded-full bg-black/75 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] py-3 px-8"
          : "w-full max-w-5xl bg-transparent py-6 px-10"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-white font-bold text-xl tracking-widest uppercase">
            Ubé
          </Link>
        </div>
        
        {/* Center Nav Links */}
        <div className="hidden md:flex items-center justify-center space-x-6">
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

        {/* Right Side: Auth + Order */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              {/* Profile Pill - Click to toggle dropdown */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="" 
                    className="w-7 h-7 rounded-full border-2 border-purple-400/50 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-white/90 text-sm font-medium max-w-[80px] truncate">
                  {firstName}
                </span>
                {/* Dropdown arrow */}
                <svg className={`w-3 h-3 text-white/50 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-full border-2 border-purple-400/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                          {firstName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-semibold text-sm truncate">
                          {user.user_metadata?.full_name || firstName}
                        </span>
                        <span className="text-white/40 text-xs truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Signed in indicator */}
                  <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400/80 text-xs font-medium">Signed in with Google</span>
                  </div>

                  {/* Sign Out Button */}
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Sign In
            </Link>
          )}

          <button className={`transition-all duration-300 ${scrolled ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'} px-6 py-2 rounded-full text-sm font-semibold`}>
            Order Now
          </button>
        </div>
      </div>
    </nav>
  );
}
