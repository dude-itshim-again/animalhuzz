import React, { useState } from 'react';
import { Sparkles, Award, MapPin, Heart, Camera, Check } from 'lucide-react';

export default function CampusPokedex({ onTriggerUpload }) {
  const [pets] = useState([
    {
      id: 'barnaby',
      name: 'Barnaby',
      species: 'Golden Retriever Mix',
      role: 'Head Campus Ambassador',
      favSpot: 'Student Union Lawn & Fountain',
      stats: { sightings: 142, treatScore: '10/10', temperament: 'Ultra Friendly' },
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      badge: 'Golden Mascot',
      traits: ['🎾 Ball Enthusiast', '❤️ Belly Rub Pro', '🎓 Class Attender']
    },
    {
      id: 'mochi',
      name: 'Mochi',
      species: 'Calico Campus Cat',
      role: 'Chief Library Inspector',
      favSpot: 'Law Library Sunlit Windowsill',
      stats: { sightings: 98, treatScore: '8.5/10', temperament: 'Calm & Intellectual' },
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      badge: 'Library Scholar',
      traits: ['📚 Book Nap Lover', '🐱 Silent Watcher', '🧶 String Hunter']
    },
    {
      id: 'professor-paws',
      name: 'Professor Paws',
      species: 'Indian Pariah Dog',
      role: 'Canteen Guardian',
      favSpot: 'West Wing Cafe & Engineering Yard',
      stats: { sightings: 185, treatScore: '10/10', temperament: 'Loyal & Brave' },
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      badge: 'Canteen Veteran',
      traits: ['🥪 Samosa Sniffer', '🐾 Campus Patrol', '☀️ Afternoon Sunbather']
    }
  ]);

  return (
    <section id="pokedex" className="py-20 md:py-28 bg-[#FAF7F2] border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
              Campus Pokedex
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              Resident University Pets
            </h2>
            <p className="text-[#635B52] text-sm sm:text-base leading-relaxed">
              Meet our officially recognized campus pets. Tag them when you upload a photo to update their live whereabouts on the map!
            </p>
          </div>

          <button
            onClick={onTriggerUpload}
            className="flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer self-start md:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Spot & Tag a Pet</span>
          </button>
        </div>

        {/* Pokedex Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-[2.5rem] p-6 sm:p-7 border border-[#EDE7DD] shadow-xs hover:shadow-[0_20px_40px_rgba(45,42,38,0.08)] hover:border-[#FFD4C9] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo frame */}
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] mb-6 bg-[#FAF7F2]">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xs bg-white/95 backdrop-blur-md text-[#FF6B4A] border border-white">
                      {pet.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                    {pet.stats.sightings} Sightings
                  </div>
                </div>

                {/* Name & Role */}
                <div className="mb-3">
                  <h3 className="text-2xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight group-hover:text-[#FF6B4A] transition-colors">
                    {pet.name}
                  </h3>
                  <p className="text-xs font-bold text-[#8C8479] uppercase tracking-wider mt-0.5">
                    {pet.role} • {pet.species}
                  </p>
                </div>

                {/* Favorite Spot */}
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EFE8DF] flex items-start gap-2.5 text-xs text-[#59534B] mb-5">
                  <MapPin className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#201E1D]">Frequent Spot:</span> {pet.favSpot}
                  </div>
                </div>

                {/* Traits */}
                <div className="space-y-2 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {pet.traits.map((t, i) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5EE] text-[#59534B] border border-[#EFE8DF]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Tag CTA */}
              <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Healthy & Monitored</span>
                </span>
                <button
                  onClick={onTriggerUpload}
                  className="text-xs font-bold text-[#FF6B4A] hover:underline cursor-pointer"
                >
                  I spotted {pet.name}!
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
