import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, LogOut, MapPin, Trophy, Camera, Sparkles, BookOpen } from 'lucide-react';

export default function DashboardNavbar({ user, onLogout, onTriggerUpload }) {
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
    { name: 'Live Map', href: '#live-map', icon: MapPin },
    { name: 'Sightings Feed', href: '#feed', icon: Camera },
    { name: 'Campus Pokedex', href: '#pokedex', icon: BookOpen },
    { name: 'Leaderboard', href: '#leaderboard', icon: Trophy },
  ];

  const scoutName = user?.scoutName || user?.email?.split('@')[0] || 'Scout';
  const scoutEmoji = user?.avatarEmoji || (user?.avatar === 'owl' ? '🦉' : user?.avatar === 'bear' ? '🐻' : user?.avatar === 'cat' ? '🐱' : user?.avatar === 'dog' ? '🐶' : '🦊');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5">
      <div 
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E2D9]' 
            : 'bg-white/75 backdrop-blur-sm border border-[#F0EBE1]'
        }`}
      >
        {/* Brand Logo */}
        <a href="#dashboard-home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#201E1D] font-['Outfit'] block leading-none">
              Wild<span className="text-[#FF6B4A]">Lens</span>
            </span>
            <span className="text-[10px] font-bold text-[#8C8479] tracking-wider uppercase block mt-0.5">
              Scout Station
            </span>
          </div>
        </a>

        {/* Dashboard Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                className="text-[#59534B] hover:text-[#FF6B4A] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[#F7F2EA] transition-all duration-200 flex items-center gap-1.5"
              >
                <Icon className="w-4 h-4 text-[#FF6B4A]" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Section: Scout Badge & Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Upload CTA */}
          <button
            onClick={onTriggerUpload}
            className="flex items-center gap-1.5 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Log Sighting</span>
          </button>

          {/* Scout Profile Pill */}
          <div className="flex items-center gap-2 bg-[#FAF5EE] border border-[#EFE8DF] pl-2.5 pr-2 py-1.5 rounded-full shadow-xs">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-base shadow-2xs border border-[#EDE7DD]">
              {scoutEmoji}
            </div>
            <div className="text-left max-w-[130px]">
              <div className="text-xs font-extrabold text-[#201E1D] truncate leading-tight">
                {scoutName}
              </div>
              <div className="text-[10px] text-[#7A7369] font-medium truncate leading-tight">
                {user?.email}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-8 h-8 rounded-full bg-white hover:bg-red-50 text-[#736B62] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer border border-[#E8E2D9] ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
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
          <div className="flex items-center gap-3 p-3 bg-[#FAF5EE] rounded-2xl mb-3 border border-[#EFE8DF]">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs border border-[#EDE7DD]">
              {scoutEmoji}
            </div>
            <div>
              <div className="font-extrabold text-sm text-[#201E1D]">{scoutName}</div>
              <div className="text-xs text-[#7A7369]">{user?.email}</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#403B35] font-semibold text-sm px-4 py-3 rounded-2xl hover:bg-[#F9F5EE] hover:text-[#FF6B4A] transition-colors flex items-center gap-3"
                >
                  <Icon className="w-4 h-4 text-[#FF6B4A]" />
                  <span>{link.name}</span>
                </a>
              );
            })}

            <div className="pt-3 border-t border-[#F0EBE1] mt-2 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onTriggerUpload();
                }}
                className="w-full bg-[#FF6B4A] text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Upload a Sighting</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full bg-[#FAF5EE] hover:bg-red-50 text-red-600 font-bold text-sm py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
