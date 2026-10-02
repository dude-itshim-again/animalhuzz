import React from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export default function PublicHero({ onOpenAuth }) {
  return (
    <section id="home" className="relative pt-32 sm:pt-40 pb-20 md:pb-28 overflow-hidden">
      {/* Background Organic Ambient Accents */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-[#FFE8DF]/60 via-[#FFF4EB]/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-48 right-0 w-96 h-96 bg-[#FEE9C5]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Primary CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-7">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0EB] border border-[#FFD8CD] text-[#E04D2D] font-bold text-xs sm:text-sm tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 fill-[#FF6B4A]" />
              <span>Campus Biodiversity & Animal Welfare Initiative</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold text-[#201E1D] leading-[1.08] tracking-tight font-['Outfit']">
              Discover the <br />
              <span className="relative inline-block text-[#FF6B4A]">
                wildlife around you.
                <svg className="absolute -bottom-2.5 left-0 w-full text-[#FFD4C9] -z-10" viewBox="0 0 250 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 14C60 4 190 2 246 14" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#635B52] max-w-xl leading-relaxed font-normal">
              WildLens helps students discover, document, and map the biodiversity sharing our campus. From resident quads to tree canopies, every observation powers university research and animal care.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center justify-center gap-3 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-extrabold text-base px-8 py-4 rounded-full shadow-[0_10px_25px_rgba(255,107,74,0.35)] hover:shadow-[0_14px_30px_rgba(255,107,74,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer group"
              >
                <span>Join the Scouts</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#how-it-works"
                className="flex items-center justify-center gap-2 bg-white hover:bg-[#FAF5EE] border border-[#E8E2D9] text-[#201E1D] font-bold text-base px-6 py-4 rounded-full shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer"
              >
                <span>How It Works</span>
              </a>
            </div>

            {/* Trust & Community Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[#EDE6DC]/80 w-full max-w-md">
              <div className="flex -space-x-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Student scout" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Student scout" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" 
                  alt="Student scout" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#FCE8E2] text-[#FF6B4A] font-bold text-xs flex items-center justify-center shadow-xs">
                  +1.2k
                </div>
              </div>

              <div>
                <div className="font-bold text-sm text-[#201E1D]">Universal AI University Scouts</div>
                <p className="text-xs text-[#7A7369] font-medium">Over 540+ verified observations mapped</p>
              </div>
            </div>

          </div>

          {/* Right Column: High Quality Pet Visual & Organic Shapes */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px]">
              
              {/* Soft colorful backdrop blob */}
              <div className="absolute inset-0 bg-[#FFDDCF] rounded-[3.5rem] transform rotate-3 scale-102 transition-transform duration-700 pointer-events-none -z-10 shadow-[0_20px_50px_rgba(255,107,74,0.15)]" />
              <div className="absolute inset-0 bg-[#FBF0D9] rounded-[3.5rem] transform -rotate-2 scale-98 pointer-events-none -z-10" />

              {/* Main Featured Pet Image */}
              <div className="relative rounded-[3.25rem] overflow-hidden border-4 border-white shadow-2xl bg-white aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85"
                  alt="Campus Golden Retriever ambassador smiling"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Resident Campus Ambassador</span>
                </div>
              </div>

              {/* Floating Badge 1: AI Species Recognition */}
              <div className="absolute left-2 sm:-left-8 top-6 sm:top-16 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#EFE8DF] shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-2.5 sm:gap-3 animate-float-slow z-20">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-[#7A7369] font-medium">Vision Model</div>
                  <div className="font-bold text-xs sm:text-base text-[#201E1D]">Gemini AI Vision</div>
                </div>
              </div>

              {/* Floating Badge 2: Live Coordinates */}
              <div className="absolute right-2 sm:-right-6 bottom-6 sm:bottom-12 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#EFE8DF] shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-2.5 sm:gap-3 animate-float-delayed z-20">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-[#7A7369] font-medium">GIS Database</div>
                  <div className="font-bold text-xs sm:text-base text-[#201E1D]">PostGIS GPS Mapping</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
