import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Compass } from 'lucide-react';

export default function PublicCtaBanner({ onOpenAuth }) {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Rounded Container */}
        <div className="bg-[#201E1D] text-white rounded-[3rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Subtle warm ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B4A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFB29E] font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Student Expedition</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight font-['Outfit'] leading-[1.12]">
                Your next discovery <br className="hidden sm:block" />
                could be something extraordinary.
              </h2>

              <p className="text-base sm:text-lg text-[#D1C9BE] max-w-xl leading-relaxed font-normal">
                Join our university scout network with your <span className="text-[#FFB29E] font-semibold">@universalai.in</span> credentials. Unlock the live map, submit photos, and help us maintain a healthier, happier campus for every living creature.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-y-2 gap-x-6 pt-2 text-sm text-[#EAE4DC] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B4A]" />
                  <span>Instant Gemini AI Recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#FF6B4A]" />
                  <span>Campus Welfare Committee Certified</span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-4">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center justify-center gap-3 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-extrabold text-base px-9 py-4 rounded-full shadow-[0_10px_30px_rgba(255,107,74,0.4)] hover:shadow-[0_14px_35px_rgba(255,107,74,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                >
                  <span>Join the Scouts</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px]">
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/20 aspect-[4/5] shadow-2xl bg-[#2D2A26]">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=85"
                    alt="Campus dogs playing happily"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-white/70">Animal Welfare Club</div>
                      <div className="text-xs font-bold text-white">Universal AI University</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white">
                      <Compass className="w-4 h-4" />
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
