import React, { useState, useEffect } from 'react';
import { PawPrint, Menu, X, LogIn, LogOut, User, MapPin, Compass, Trophy } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout }) {
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
    { name: 'Live Map', href: '#live-map', icon: MapPin },
    { name: 'Campus Pokedex', href: '#pokedex', icon: Compass },
    { name: 'Leaderboard', href: '#leaderboard', icon: Trophy },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5">
      <div 
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E2D9]' 
            : 'bg-white/65 backdrop-blur-sm border border-[#F0EBE1]'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <PawPrint className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#201E1D] font-['Outfit'] block leading-none">
              Animal<span className="text-[#FF6B4A]">Huzz</span>
            </span>
            <span className="text-[10px] font-bold text-[#8C8479] tracking-wider uppercase block mt-0.5">
              Campus Wildlife Tracker
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                className="text-[#59534B] hover:text-[#FF6B4A] font-semibold text-sm lg:text-[15px] px-4 py-2 rounded-full hover:bg-[#F7F2EA] transition-all duration-200 flex items-center gap-1.5"
              >
                <Icon className="w-4 h-4 text-[#FF6B4A]" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Desktop User / Auth Button */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-[#FAF5EE] border border-[#EFE8DF] pl-3.5 pr-2 py-1.5 rounded-full shadow-xs">
              <User className="w-4 h-4 text-[#FF6B4A]" />
              <span className="text-xs font-bold text-[#201E1D] max-w-[140px] truncate">
                {user.email || 'Scout User'}
              </span>
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-full bg-white hover:bg-red-50 text-[#736B62] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer border border-[#E8E2D9]"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Signup</span>
            </button>
          )}
        </div>

        {/* Mobile & Tablet Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#201E1D] hover:text-[#FF6B4A] transition-colors ml-2 sm:ml-0 cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 p-5 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E8E2D9] shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#403B35] font-semibold text-base px-4 py-3 rounded-2xl hover:bg-[#F9F5EE] hover:text-[#FF6B4A] transition-colors flex items-center gap-3"
                >
                  <Icon className="w-5 h-5 text-[#FF6B4A]" />
                  <span>{link.name}</span>
                </a>
              );
            })}
            <div className="pt-3 border-t border-[#F0EBE1] mt-1">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2 bg-[#FAF5EE] rounded-2xl">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF6B4A]" />
                    <span className="text-xs font-bold text-[#201E1D]">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Signup</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
