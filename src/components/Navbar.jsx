import React, { useState, useEffect } from 'react';
import { PawPrint, Menu, X, ArrowRight, Heart, Calendar } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Featured Pet', href: '#featured' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Reviews', href: '#reviews' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5">
      <div 
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E2D9]' 
            : 'bg-white/60 backdrop-blur-sm border border-[#F0EBE1]'
        }`}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <PawPrint className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#201E1D] font-['Outfit']">
            Paws<span className="text-[#FF6B4A]">ome</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#59534B] hover:text-[#FF6B4A] font-medium text-sm lg:text-[15px] px-3.5 py-2 rounded-full hover:bg-[#F7F2EA] transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons (Visible on tablet and desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Tablet & Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#201E1D] hover:text-[#FF6B4A] transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
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
            <div className="pt-3 border-t border-[#F0EBE1] mt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B4A] text-white font-semibold text-base py-3.5 rounded-2xl shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
