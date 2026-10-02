import React from 'react';
import { Camera, Sparkles, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function CtaBanner({ onTriggerUpload }) {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rounded Container */}
        <div className="bg-[#201E1D] text-white rounded-[3rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Subtle warm glow background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B4A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFB29E] font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join the Student Wildlife Network</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight font-['Outfit'] leading-[1.12]">
                Spot an Animal on Campus? <br className="hidden sm:block" />
                Map It in Seconds.
              </h2>

              <p className="text-base sm:text-lg text-[#D1C9BE] max-w-lg leading-relaxed font-normal">
                Help our campus animal welfare committee track vaccinations, monitor health, and document the diverse species sharing our grounds.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-y-2 gap-x-6 pt-2 text-sm text-[#EAE4DC] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B4A]" />
                  <span>Automated AI Species Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                  <span>High-Precision GPS Mapping</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={onTriggerUpload}
                  className="flex items-center justify-center gap-3 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-bold text-base px-9 py-4 rounded-full shadow-[0_10px_30px_rgba(255,107,74,0.4)] hover:shadow-[0_14px_35px_rgba(255,107,74,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>Upload a Sighting Now</span>
                </button>
              </div>

            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px]">
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/20 aspect-[4/5] shadow-2xl bg-[#2D2A26]">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=85"
                    alt="Campus dogs playing happily"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute bottom-5 left-5 right-5 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/70">Animal Welfare Club</div>
                      <div className="text-sm font-bold text-white">Protecting Campus Wildlife</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
