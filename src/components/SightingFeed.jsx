import React from 'react';
import { MapPin, Clock, Sparkles, Navigation, Camera, ExternalLink } from 'lucide-react';

export default function SightingFeed({ sightings, onSelectSighting, onTriggerUpload }) {
  const formatImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:3001${url}`;
    return url;
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  const handleViewOnMap = (id) => {
    if (onSelectSighting) {
      onSelectSighting(id);
    }
    const mapSection = document.getElementById('live-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="feed" className="py-20 md:py-28 bg-[#FFFDF9] border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
              Community Stream
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              Recent Campus Sightings
            </h2>
            <p className="text-[#635B52] max-w-md text-base leading-relaxed">
              Explore animal spots reported live by students and researchers. Click "View on Map" to navigate directly to their exact pin.
            </p>
          </div>

          <button
            onClick={onTriggerUpload}
            className="flex items-center gap-2 bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer self-start md:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Upload New Sighting</span>
          </button>
        </div>

        {/* Empty State */}
        {(!sightings || sightings.length === 0) ? (
          <div className="bg-[#FAF7F2] rounded-[3rem] p-12 text-center border-2 border-dashed border-[#E5DDD2] max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFEBE5] text-[#FF6B4A] text-3xl flex items-center justify-center mx-auto">
              🦉
            </div>
            <h3 className="text-2xl font-extrabold text-[#201E1D] font-['Outfit']">
              No Sightings Reported Yet
            </h3>
            <p className="text-[#635B52] text-sm max-w-md mx-auto leading-relaxed">
              Be the very first university scout to photograph an animal on campus! Your photo will be tagged with Gemini AI and dropped on the live map.
            </p>
            <button
              onClick={onTriggerUpload}
              className="inline-flex items-center gap-2 bg-[#FF6B4A] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Photograph First Sighting</span>
            </button>
          </div>
        ) : (
          /* Sightings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {sightings.map((item) => {
              const displayTitle = item.pet_name ? `🐾 ${item.pet_name}` : (item.species_tag && item.species_tag !== 'Unknown' ? item.species_tag : 'Campus Sighting');
              const lat = parseFloat(item.latitude);
              const lon = parseFloat(item.longitude);
              const hasCoords = !isNaN(lat) && !isNaN(lon);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[2.5rem] p-5 sm:p-6 border border-[#EBE4D8] shadow-xs hover:shadow-[0_20px_40px_rgba(45,42,38,0.08)] hover:border-[#FFD4C9] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Sighting Photo */}
                    <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] mb-5 bg-[#FAF7F2]">
                      <img
                        src={formatImageUrl(item.image_url || item.image)}
                        alt={`Campus sighting of ${displayTitle} #${item.id}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Species Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md bg-white/95 text-[#201E1D] border border-white/80 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                          <span>{displayTitle}</span>
                        </span>
                      </div>

                      {/* Sighting ID Pill */}
                      <div className="absolute bottom-3.5 right-3.5">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-black/60 text-white">
                          #{item.id}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Header */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs text-[#7A7369]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#FF6B4A]" />
                          <span>{formatTime(item.created_at)}</span>
                        </span>
                        {item.pet_name && (
                          <span className="font-bold text-[#E04D2D] bg-[#FFF0EB] px-2 py-0.5 rounded-md text-[10px]">
                            Registered Campus Pet
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight group-hover:text-[#FF6B4A] transition-colors">
                        {displayTitle}
                      </h3>
                    </div>

                    {/* Coordinates Info */}
                    {hasCoords && (
                      <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EFE8DF] flex items-center gap-2 text-xs text-[#59534B] mb-5">
                        <MapPin className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                        <span className="font-semibold truncate">
                          {lat.toFixed(5)}, {lon.toFixed(5)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                    <span className="text-xs text-[#8C8479] font-medium">
                      Verified PostGIS Pin
                    </span>
                    <button
                      onClick={() => handleViewOnMap(item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B4A] hover:text-[#E04D2D] transition-colors cursor-pointer group-hover:translate-x-0.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
