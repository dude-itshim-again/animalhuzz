import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';

export default function CtaBanner({ onOpenBooking }) {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Strong Rounded Container */}
        <div className="bg-[#201E1D] text-white rounded-[3rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Subtle warm decorative glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B4A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFB29E] font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book Today & Receive 20% Off First Visit</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight font-['Outfit'] leading-[1.12]">
                Give Your Pet the Care <br className="hidden sm:block" />
                They Truly Deserve.
              </h2>

              <p className="text-base sm:text-lg text-[#D1C9BE] max-w-lg leading-relaxed font-normal">
                Join thousands of delighted pet parents in our warm community. Schedule a complimentary tour or reserve your first wellness session in minutes.
              </p>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-y-2 gap-x-6 pt-2 text-sm text-[#EAE4DC] font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                  <span>Free Initial Health Consult</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={onOpenBooking}
                  className="flex items-center justify-center gap-3 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-bold text-base px-9 py-4 rounded-full shadow-[0_10px_30px_rgba(255,107,74,0.4)] hover:shadow-[0_14px_35px_rgba(255,107,74,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Schedule an Appointment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Right Pet Photo Frame */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px]">
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/20 aspect-[4/5] shadow-2xl bg-[#2D2A26]">
                  <img
                    src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=85"
                    alt="Adorable pet waiting happily for care"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/70">Certified Caregivers</div>
                      <div className="text-sm font-bold text-white">Always On Duty</div>
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
