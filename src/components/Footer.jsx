import React from 'react';
import { PawPrint, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EDE5DA] pt-16 pb-12 text-[#5E574F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#F0EBE1]">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5 fill-current" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#201E1D] font-['Outfit']">
                Animal<span className="text-[#FF6B4A]">Huzz</span>
              </span>
            </a>
            <p className="text-sm text-[#736B62] leading-relaxed max-w-sm">
              An open, student-driven wildlife observation and mapping platform for university campuses. Built with React, PostGIS, Leaflet, and Google Gemini AI.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com/dude-itshim-again/animalhuzz" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-[#FAF5EE] hover:bg-[#201E1D] hover:text-white text-[#5E574F] flex items-center justify-center transition-all duration-200"
                title="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Nav Links Col 1: Wildlife Tracking */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#201E1D]">
              Wildlife Tracker
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#live-map" className="hover:text-[#FF6B4A] transition-colors">Interactive Live Map</a></li>
              <li><a href="#feed" className="hover:text-[#FF6B4A] transition-colors">Recent Sighting Feed</a></li>
              <li><a href="#pokedex" className="hover:text-[#FF6B4A] transition-colors">Campus Pokedex</a></li>
              <li><a href="#leaderboard" className="hover:text-[#FF6B4A] transition-colors">Student Scout Rankings</a></li>
            </ul>
          </div>

          {/* Nav Links Col 2: Campus Initiative */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#201E1D]">
              Initiative
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-[#FF6B4A] transition-colors">Animal Welfare Club</a></li>
              <li><a href="#about" className="hover:text-[#FF6B4A] transition-colors">Vaccination Drives</a></li>
              <li><a href="#about" className="hover:text-[#FF6B4A] transition-colors">Biodiversity Research</a></li>
              <li><a href="#about" className="hover:text-[#FF6B4A] transition-colors">Emergency Vet Helpline</a></li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#201E1D]">
              Campus Desk
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
                <span>Student Affairs Building, Wildlife Care Station</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                <span>Campus Vet SOS: Ext. 4040</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                <span>scouts@campuswildlife.edu</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8479] gap-4">
          <p>© {new Date().getFullYear()} AnimalHuzz Campus Wildlife Tracker. Built with care for university animals.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-[#FF6B4A] font-semibold">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Dedicated to campus dogs, cats & birds</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
