import React from 'react';
import { Heart, Sparkles, Award, ArrowRight, MapPin, Calendar } from 'lucide-react';

export default function FeaturedPet({ onOpenBooking }) {
  return (
    <section id="featured" className="py-20 md:py-28 bg-[#FFFDF9] border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Container */}
        <div className="bg-[#FAF4ED] rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-[#E8DECC] relative overflow-hidden shadow-xs">
          
          {/* Subtle Ambient Background Blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFEBE5]/60 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FEF2DC]/50 rounded-full blur-2xl pointer-events-none -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            
            {/* Left Visual: Asymmetric Photo Frame with Personality Chips */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-[460px]">
                {/* Organic backdrop frame */}
                <div className="absolute inset-0 bg-[#FF6B4A]/10 rounded-[3rem] -rotate-3 scale-102" />
                
                <div className="relative rounded-[2.75rem] overflow-hidden border-4 border-white shadow-xl aspect-[4/5] bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
                    alt="Barnaby, a rescued Golden Retriever looking happy and attentive"
                    className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badge on Photo */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-xs font-extrabold text-[#201E1D]">Pet of the Month</span>
                  </div>
                </div>

                {/* Floating personality card */}
                <div className="absolute -bottom-5 right-2 sm:-right-6 bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#EDE5DA] shadow-lg flex items-center gap-2.5 sm:gap-3 z-20">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs text-[#7A7369] font-medium">Favorite Activity</div>
                    <div className="font-extrabold text-xs sm:text-sm text-[#201E1D]">Agility Hurdles & Treats</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] border border-[#FFD8CD] text-[#E04D2D] font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Campus Ambassador Story</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight leading-[1.12]">
                  Meet Barnaby: From Shy Rescue to Campus Sunshine
                </h2>
              </div>

              <p className="text-[#635B52] text-base sm:text-lg leading-relaxed">
                When Barnaby first arrived at our campus center two years ago, he was timid and nervous around open spaces. Through our gentle socialization routines, hydrotherapy, and positive training, he blossomed into our resident welcoming ambassador.
              </p>

              {/* Personality Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8C8479]">Personality Highlights</div>
                <div className="flex flex-wrap gap-2.5">
                  <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#E5DDD2] text-xs sm:text-sm font-semibold text-[#38332E]">
                    🎾 Tennis Ball Enthusiast
                  </span>
                  <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#E5DDD2] text-xs sm:text-sm font-semibold text-[#38332E]">
                    🐾 Fear-Free Graduate
                  </span>
                  <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#E5DDD2] text-xs sm:text-sm font-semibold text-[#38332E]">
                    ❤️ Belly Rub Champion
                  </span>
                  <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#E5DDD2] text-xs sm:text-sm font-semibold text-[#38332E]">
                    🐶 Great with Cats & Puppies
                  </span>
                </div>
              </div>

              {/* Stats / Info Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DECC]/80">
                <div>
                  <div className="text-xs text-[#7A7369]">Breed & Age</div>
                  <div className="font-bold text-sm sm:text-base text-[#201E1D]">Golden Mix • 3 Yrs</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A7369]">Health Status</div>
                  <div className="font-bold text-sm sm:text-base text-[#10B981]">100% Up to Date</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-xs text-[#7A7369]">Care Plan</div>
                  <div className="font-bold text-sm sm:text-base text-[#201E1D]">VIP Wellness</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-3">
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-3 bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-bold text-base px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Give Your Pet the VIP Experience</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
