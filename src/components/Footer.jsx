import React from 'react';
import { PawPrint, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EDE5DA] pt-16 pb-12 text-[#5E574F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#F0EBE1]">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#home" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5 fill-current" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#201E1D] font-['Outfit']">
                Paws<span className="text-[#FF6B4A]">ome</span>
              </span>
            </a>
            <p className="text-sm text-[#736B62] leading-relaxed max-w-sm">
              Providing holistic veterinary wellness, stress-free grooming, and premium cage-free boarding for dogs and cats.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#FF6B4A] hover:text-white text-[#5E574F] flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#FF6B4A] hover:text-white text-[#5E574F] flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#twitter" aria-label="X (Twitter)" className="w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#FF6B4A] hover:text-white text-[#5E574F] flex items-center justify-center transition-all duration-200">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#FF6B4A] hover:text-white text-[#5E574F] flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Nav Links Col 1: Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#201E1D]">
              Care Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#services" className="hover:text-[#FF6B4A] transition-colors">Pet Grooming & Spa</a></li>
              <li><a href="#services" className="hover:text-[#FF6B4A] transition-colors">Veterinary Wellness Exam</a></li>
              <li><a href="#services" className="hover:text-[#FF6B4A] transition-colors">Obedience & Puppy Training</a></li>
              <li><a href="#services" className="hover:text-[#FF6B4A] transition-colors">Luxury Cage-Free Boarding</a></li>
              <li><a href="#services" className="hover:text-[#FF6B4A] transition-colors">Doggie Daycare & Play Yards</a></li>
            </ul>
          </div>

          {/* Nav Links Col 2: Company */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#201E1D]">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-[#FF6B4A] transition-colors">About Our Sanctuary</a></li>
              <li><a href="#featured" className="hover:text-[#FF6B4A] transition-colors">Campus Ambassadors</a></li>
              <li><a href="#why-us" className="hover:text-[#FF6B4A] transition-colors">Why Choose Us</a></li>
              <li><a href="#reviews" className="hover:text-[#FF6B4A] transition-colors">Pet Parent Reviews</a></li>
              <li><a href="#careers" className="hover:text-[#FF6B4A] transition-colors">Careers & Vets</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#201E1D]">
              Visit or Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
                <span>742 Evergreen Campus Walk, Suite 100, West Wing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                <span>+1 (800) 555-PAWS (7297)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                <span>hello@pawsomecare.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                <span>Mon – Sun: 7:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8479] gap-4">
          <p>© {new Date().getFullYear()} Pawsome Pet Care & Wellness Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#accessibility" className="hover:underline">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
