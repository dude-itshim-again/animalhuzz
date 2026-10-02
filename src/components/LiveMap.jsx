import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Filter, Layers, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';

export default function LiveMap({ sightings, isLoading, onRefresh, activeMarkerId }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const [filterSpecies, setFilterSpecies] = useState('ALL');

  const defaultCenter = [12.9716, 77.5946]; // University Campus default

  // Helper: Format image url
  const formatImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:3001${url}`;
    return url;
  };

  // Helper: Format date
  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    }).setView(defaultCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Enable scroll zoom on focus/click
    map.on('focus', () => map.scrollWheelZoom.enable());

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when sightings or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => {
      map.removeLayer(marker);
    });
    markersRef.current.clear();

    const validSightings = (sightings || []).filter((s) => {
      const lat = parseFloat(s.latitude);
      const lon = parseFloat(s.longitude);
      if (isNaN(lat) || isNaN(lon)) return false;

      if (filterSpecies === 'ALL') return true;
      const tag = (s.species_tag || '').toLowerCase();
      const pet = (s.pet_name || '').toLowerCase();
      if (filterSpecies === 'DOGS') return tag.includes('dog') || pet.includes('dog') || tag.includes('hound') || tag.includes('pup');
      if (filterSpecies === 'CATS') return tag.includes('cat') || pet.includes('cat') || tag.includes('kitten');
      if (filterSpecies === 'BIRDS') return tag.includes('bird') || tag.includes('crow') || tag.includes('pigeon') || tag.includes('myna') || tag.includes('sparrow');
      return !tag.includes('dog') && !tag.includes('cat') && !tag.includes('bird');
    });

    const markerList = [];

    validSightings.forEach((s) => {
      const lat = parseFloat(s.latitude);
      const lon = parseFloat(s.longitude);
      const title = s.pet_name ? `🐾 ${s.pet_name}` : (s.species_tag && s.species_tag !== 'Unknown' ? s.species_tag : 'Campus Sighting');
      const img = formatImageUrl(s.image_url || s.image);

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: #FF6B4A;
            color: white;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(255,107,74,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transform: translateY(-6px);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            🐾
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 4px;">
          <div style="border-radius: 16px; overflow: hidden; height: 130px; margin-bottom: 8px; background: #FAF7F2;">
            <img src="${img}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #201E1D; margin-bottom: 2px;">
            ${title} #${s.id}
          </div>
          <div style="font-size: 11px; color: #7A7369; margin-bottom: 4px;">
            🕒 ${formatTime(s.created_at)}
          </div>
          <div style="font-size: 11px; color: #E04D2D; font-weight: 600;">
            📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      markersRef.current.set(s.id, { marker, lat, lon });
      markerList.push(marker);
    });

    // Fit bounds if markers exist
    if (markerList.length > 0) {
      const group = L.featureGroup(markerList);
      map.fitBounds(group.getBounds().pad(0.18));
    }
  }, [sightings, filterSpecies]);

  // Fly to active marker when selected from feed
  useEffect(() => {
    if (!activeMarkerId || !mapInstanceRef.current) return;
    const entry = markersRef.current.get(activeMarkerId);
    if (entry) {
      mapInstanceRef.current.flyTo([entry.lat, entry.lon], 17, { duration: 1.2 });
      setTimeout(() => {
        entry.marker.openPopup();
      }, 1200);
    }
  }, [activeMarkerId]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (markersRef.current.size > 0) {
      const markerList = Array.from(markersRef.current.values()).map(v => v.marker);
      const group = L.featureGroup(markerList);
      map.fitBounds(group.getBounds().pad(0.18));
    } else {
      map.setView(defaultCenter, 15);
    }
  };

  return (
    <section id="live-map" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] border border-[#FFD8CD] text-[#E04D2D] font-bold text-xs uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A] animate-ping" />
              <span>Real-Time Campus Map</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              Live Campus Sightings Map
            </h2>
            <p className="text-[#635B52] text-sm sm:text-base leading-relaxed">
              Every pin represents a student-reported animal sighting validated with GPS PostGIS coordinates and auto-tagged by Gemini AI.
            </p>
          </div>

          {/* Action Pills & Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleRecenter}
              className="flex items-center gap-2 bg-white hover:bg-[#FAF5EE] border border-[#EDE7DD] text-[#201E1D] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#FF6B4A]" />
              <span>Recenter</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-[#FAF5EE] border border-[#EDE7DD] text-[#201E1D] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
              title="Refresh live pins"
            >
              <RefreshCw className={`w-4 h-4 text-[#FF6B4A] ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="bg-[#FFE8DF] text-[#E04D2D] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xs">
              {(sightings || []).length} Reported
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-[#8C8479] uppercase tracking-wider mr-2">Filter Species:</span>
          {['ALL', 'DOGS', 'CATS', 'BIRDS', 'OTHERS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterSpecies(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterSpecies === cat
                  ? 'bg-[#201E1D] text-white shadow-xs'
                  : 'bg-white text-[#635B52] border border-[#EDE7DD] hover:bg-[#FAF5EE]'
              }`}
            >
              {cat === 'ALL' && '🌐 All Species'}
              {cat === 'DOGS' && '🐶 Dogs'}
              {cat === 'CATS' && '🐱 Cats'}
              {cat === 'BIRDS' && '🐦 Birds'}
              {cat === 'OTHERS' && '🦔 Wildlife & Others'}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-[#EFECE6] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[420px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Overlay Badge */}
          <div className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#EDE7DD] shadow-md flex items-center gap-2.5 pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-[#201E1D]">OpenStreetMap & PostGIS Live</span>
          </div>
        </div>

      </div>
    </section>
  );
}
