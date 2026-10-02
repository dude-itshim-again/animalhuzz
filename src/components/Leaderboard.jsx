import React from 'react';
import { Trophy, Medal, Star, Flame, Sparkles, ShieldCheck } from 'lucide-react';

export default function Leaderboard() {
  const scouts = [
    {
      rank: 1,
      name: 'Aanya Sharma',
      department: 'Biotechnology • 3rd Year',
      sightings: 47,
      rarity: 'Oriental Magpie-Robin',
      badge: 'Master Tracker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      streak: '18 Days'
    },
    {
      rank: 2,
      name: 'Rohan Mehra',
      department: 'Computer Science • 2nd Year',
      sightings: 39,
      rarity: 'Mongoose & Macaque',
      badge: 'Wildlife Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      streak: '12 Days'
    },
    {
      rank: 3,
      name: 'Priya Nambiar',
      department: 'Architecture • 4th Year',
      sightings: 34,
      rarity: 'Barn Owl (Night Sighting)',
      badge: 'Night Owl Scout',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      streak: '9 Days'
    },
    {
      rank: 4,
      name: 'Devansh Kulkarni',
      department: 'Mechanical Eng • 1st Year',
      sightings: 28,
      rarity: 'Purple Sunbird',
      badge: 'Campus Scout',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      streak: '6 Days'
    }
  ];

  return (
    <section id="leaderboard" className="py-20 md:py-28 bg-white border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
            Student Hall of Fame
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            Top Campus Wildlife Scouts
          </h2>
          <p className="text-base sm:text-lg text-[#635B52] leading-relaxed">
            Students who regularly document, monitor, and care for campus animals. Upload sightings to level up your scout ranking!
          </p>
        </div>

        {/* Leaderboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scouts.map((scout) => (
            <div
              key={scout.rank}
              className={`rounded-[2rem] p-6 border transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between group ${
                scout.rank === 1
                  ? 'bg-[#FFF9F6] border-[#FFD4C9] ring-2 ring-[#FF6B4A]/20'
                  : 'bg-[#FAF7F2] border-[#EDE7DD] hover:bg-white'
              }`}
            >
              <div>
                {/* Header Rank & Streak */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs ${
                    scout.rank === 1 ? 'bg-[#FF6B4A] text-white' :
                    scout.rank === 2 ? 'bg-[#F59E0B] text-white' :
                    scout.rank === 3 ? 'bg-[#8B5CF6] text-white' :
                    'bg-[#EFE8DF] text-[#635B52]'
                  }`}>
                    #{scout.rank}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#E04D2D] bg-[#FFF0EB] px-2.5 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{scout.streak}</span>
                  </div>
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={scout.avatar}
                    alt={scout.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-[#201E1D] group-hover:text-[#FF6B4A] transition-colors">
                      {scout.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#8C8479]">
                      {scout.department}
                    </p>
                  </div>
                </div>

                {/* Badge Tag */}
                <div className="mb-4">
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white text-[#201E1D] border border-[#E8DEC0] inline-flex items-center gap-1 shadow-2xs">
                    <Trophy className="w-3 h-3 text-[#FF6B4A]" />
                    <span>{scout.badge}</span>
                  </span>
                </div>

                {/* Sightings & Rarest Species */}
                <div className="space-y-2 text-xs pt-3 border-t border-[#EDE5DA]/70">
                  <div className="flex justify-between items-center">
                    <span className="text-[#7A7369]">Total Sightings</span>
                    <span className="font-extrabold text-[#201E1D]">{scout.sightings} Pins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#7A7369]">Rarest Spot</span>
                    <span className="font-bold text-[#FF6B4A] text-right truncate max-w-[130px]">{scout.rarity}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EDE5DA]/70 text-[11px] font-bold text-center text-[#8C8479]">
                Verified Scout Contributor
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
