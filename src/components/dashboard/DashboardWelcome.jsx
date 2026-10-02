import React from 'react';
import { Camera, MapPin, Sparkles, Trophy, Award, ShieldCheck } from 'lucide-react';

export default function DashboardWelcome({ user, onTriggerUpload }) {
  const scoutName = user?.scoutName || user?.email?.split('@')[0] || 'Scout';
  const scoutEmoji = user?.avatarEmoji || (user?.avatar === 'owl' ? '🦉' : user?.avatar === 'bear' ? '🐻' : user?.avatar === 'cat' ? '🐱' : user?.avatar === 'dog' ? '🐶' : '🦊');
  const companionName = user?.companionName || 'Wilderness Totem';

  return (
    <section id="dashboard-home" className="pt-28 sm:pt-36 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rounded Welcome Card */}
        <div className="bg-[#FAF7F2] rounded-[3rem] p-6 sm:p-10 border border-[#EDE7DD] shadow-xs relative overflow-hidden">
          
          {/* Subtle warm glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFDDCF]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#FBF0D9]/60 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Companion & Salutation */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative">
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-[2rem] bg-white border-2 border-[#FFD8CD] shadow-sm flex items-center justify-center text-4xl sm:text-5xl shrink-0">
                  {scoutEmoji}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Scout Active">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#FF6B4A] text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Authenticated Campus Scout</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
                  Welcome to the field, <span className="text-[#FF6B4A]">{scoutName}</span>!
                </h1>
                <p className="text-xs sm:text-sm text-[#635B52]">
                  Companion <span className="font-bold text-[#201E1D]">{companionName}</span> is standing by. Your observations directly update the university biodiversity GIS map.
                </p>
              </div>
            </div>

            {/* Right: Quick action cards */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={onTriggerUpload}
                className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-extrabold text-sm px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap New Observation</span>
              </button>
              
              <a
                href="#live-map"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-[#FAF5EE] border border-[#EDE7DD] text-[#201E1D] font-bold text-sm px-5 py-3.5 rounded-full transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                <span>Jump to Live Map</span>
              </a>
            </div>

          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 pt-6 border-t border-[#EDE5DA] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <div className="text-[11px] font-bold text-[#8C8479] uppercase tracking-wider">Scout Rank</div>
              <div className="text-lg font-extrabold text-[#201E1D] font-['Outfit'] mt-0.5">Junior Pathfinder</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#8C8479] uppercase tracking-wider">Vision Engine</div>
              <div className="text-lg font-extrabold text-[#FF6B4A] font-['Outfit'] mt-0.5">Gemini 1.5 Flash</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#8C8479] uppercase tracking-wider">Spatial Database</div>
              <div className="text-lg font-extrabold text-emerald-700 font-['Outfit'] mt-0.5">PostGIS Active</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#8C8479] uppercase tracking-wider">Campus Domain</div>
              <div className="text-lg font-extrabold text-[#201E1D] font-['Outfit'] mt-0.5">Universal AI In</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
