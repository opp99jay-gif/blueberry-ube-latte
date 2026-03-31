export default function Footer() {
  return (
    <footer className="w-full bg-[#030303] py-12 border-t border-white/5 flex flex-col items-center">
      <div className="w-full max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-xl font-bold tracking-widest uppercase text-white mb-2">Ubé</span>
          <span className="text-white/40 text-xs tracking-wider">A modern cafe dimension.</span>
        </div>
        
        <div className="flex items-center gap-8 text-sm text-white/50">
          <a href="#story" className="hover:text-white transition-colors">Story</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <a href="#ingredients" className="hover:text-white transition-colors">Ingredients</a>
          <a href="#health" className="hover:text-white transition-colors">Health</a>
        </div>
        
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} Ubé Dimensions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
