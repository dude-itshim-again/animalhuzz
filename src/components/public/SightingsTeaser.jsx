import React from 'react';
import { Sparkles, MapPin, Clock, ArrowRight, Lock } from 'lucide-react';

export default function SightingsTeaser({ onOpenAuth }) {
  const teaserCards = [
    {
      id: 101,
      species: 'Golden Retriever Mix',
      name: 'Barnaby',
      location: 'Student Union Lawn & Fountain',
      coords: '12.9722, 77.5954',
      time: '25 mins ago',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      badge: 'Campus Ambassador'
    },
    {
      id: 102,
      species: 'Calico Campus Cat',
      name: 'Mochi',
      location: 'Law Library Sunlit Windowsill',
      coords: '12.9711, 77.5938',
      time: '1 hour ago',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      badge: 'Library Scholar'
    },
    {
      id: 103,
      species: 'Indian Pariah Dog',
      name: 'Professor Paws',
      location: 'Engineering Workshop Yard',
      coords: '12.9729, 77.5942',
      time: '3 hours ago',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      badge: 'Canteen Veteran'
    },
    {
      id: 104,
      species: 'Purple Sunbird (Cinnyris asiaticus)',
      name: null,
      location: 'Botanical Biodiversity Pavilion',
      coords: '12.9705, 77.5961',
      time: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=600&q=80',
      badge: 'Avian Migrant'
    }
  ];

  return (
    <section id="recent-sightings" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
              Recent Campus Activity
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              Latest Scout Observations
            </h2>
            <p className="text-[#635B52] text-sm sm:text-base leading-relaxed">
              A sample of fauna observed across the grounds today. Sign in to your scout account to view the full live map and post your own discoveries.
            </p>
          </div>

          {/* Subtle CTA: Log in to explore more sightings */}
          <button
            onClick={() => onOpenAuth('login')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B4A] hover:text-[#E04D2D] hover:underline cursor-pointer self-start md:self-auto group"
          >
            <span>Log in to explore more sightings</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {teaserCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-[2.25rem] p-5 border border-[#EDE7DD] shadow-xs hover:shadow-[0_20px_40px_rgba(45,42,38,0.06)] hover:border-[#FFD4C9] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative rounded-[1.75rem] overflow-hidden aspect-[4/3] mb-4 bg-[#FAF7F2]">
                  <img
                    src={card.image}
                    alt={card.name || card.species}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs bg-white/95 backdrop-blur-md text-[#201E1D]">
                      {card.badge}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[11px] text-[#7A7369]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-[#FF6B4A]" />
                      <span>{card.time}</span>
                    </span>
                    <span className="font-bold text-[#8C8479]">#{card.id}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight group-hover:text-[#FF6B4A] transition-colors">
                    {card.name ? `${card.name}` : card.species}
                  </h3>
                  {card.name && (
                    <p className="text-xs text-[#7A7369] font-medium">{card.species}</p>
                  )}
                </div>

                {/* Location snippet */}
                <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EDE7DD] flex items-center gap-2 text-xs text-[#59534B]">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />
                  <span className="truncate">{card.location}</span>
                </div>
              </div>

              {/* Read-only overlay footer */}
              <div className="pt-3.5 mt-4 border-t border-[#F0EBE1] flex items-center justify-between text-[11px]">
                <span className="text-[#8C8479] font-medium">Read-only teaser</span>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="font-bold text-[#FF6B4A] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Unlock GPS</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle CTA bar at the bottom */}
        <div className="mt-12 p-6 rounded-3xl bg-[#FFF0EB] border border-[#FFD8CD] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#201E1D]">Want to view full observations and live coordinate pins?</div>
              <p className="text-xs text-[#7A7369]">Join our university scout network with your @universalai.in email.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('login')}
            className="bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shrink-0 cursor-pointer"
          >
            Log in to explore more sightings →
          </button>
        </div>

      </div>
    </section>
  );
}
