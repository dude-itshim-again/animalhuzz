import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, ArrowRight, LogIn } from 'lucide-react';

export default function PublicNavbar({ onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
    { name: 'Impact', href: '#impact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5">
      <div 
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E2D9]' 
            : 'bg-white/70 backdrop-blur-sm border border-[#F0EBE1]'
        }`}
      >
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#201E1D] font-['Outfit'] block leading-none">
              Wild<span className="text-[#FF6B4A]">Lens</span>
            </span>
            <span className="text-[10px] font-bold text-[#8C8479] tracking-wider uppercase block mt-0.5">
              Campus Wildlife Platform
            </span>
          </div>
        </a>

        {/* Public Informational Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#59534B] hover:text-[#FF6B4A] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[#F7F2EA] transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-[#59534B] hover:text-[#201E1D] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>Log In</span>
          </button>
          <button
            onClick={() => onOpenAuth('signup')}
            className="flex items-center gap-2 bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Join the Scouts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#201E1D] hover:text-[#FF6B4A] transition-colors ml-2 sm:ml-0 cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 p-5 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E8E2D9] shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#403B35] font-semibold text-base px-4 py-3 rounded-2xl hover:bg-[#F9F5EE] hover:text-[#FF6B4A] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-[#F0EBE1] mt-1 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full bg-[#FAF5EE] text-[#201E1D] font-bold text-sm py-3 rounded-2xl transition-all cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full bg-[#FF6B4A] text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join the Scouts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
