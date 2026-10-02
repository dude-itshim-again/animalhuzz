import React, { useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardWelcome from './DashboardWelcome';
import Hero from '../Hero';
import LiveMap from '../LiveMap';
import SightingFeed from '../SightingFeed';
import CampusPokedex from '../CampusPokedex';
import Leaderboard from '../Leaderboard';
import Footer from '../Footer';

export default function DashboardView({ 
  user, 
  onLogout, 
  sightings, 
  isLoadingSightings, 
  onRefreshSightings 
}) {
  const [activeMarkerId, setActiveMarkerId] = useState(null);

  const handleTriggerUpload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const uploadBtn = document.querySelector('#home button');
    if (uploadBtn) {
      setTimeout(() => uploadBtn.click(), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      {/* 1. Authenticated Dashboard Navbar */}
      <DashboardNavbar 
        user={user} 
        onLogout={onLogout} 
        onTriggerUpload={handleTriggerUpload} 
      />

      <main className="flex-1">
        {/* 2. Personalized Scout Welcome Banner */}
        <DashboardWelcome 
          user={user} 
          onTriggerUpload={handleTriggerUpload} 
        />

        {/* 3. Interactive Upload Section with Camera & GPS */}
        <Hero 
          user={user}
          onUploadSuccess={onRefreshSightings}
        />

        {/* 4. Live Campus Leaflet Map */}
        <LiveMap 
          sightings={sightings} 
          isLoading={isLoadingSightings}
          onRefresh={onRefreshSightings}
          activeMarkerId={activeMarkerId}
        />

        {/* 5. Chronological Sighting Feed */}
        <SightingFeed 
          sightings={sightings}
          onSelectSighting={(id) => setActiveMarkerId(id)}
          onTriggerUpload={handleTriggerUpload}
        />

        {/* 6. Campus Pokedex: Resident University Pets */}
        <CampusPokedex 
          onTriggerUpload={handleTriggerUpload}
        />

        {/* 7. Top Campus Scouts Leaderboard */}
        <Leaderboard />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
