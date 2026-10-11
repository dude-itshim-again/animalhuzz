import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardWelcome from './DashboardWelcome';
import Hero from '../Hero';
import LiveMap from '../LiveMap';
import SightingFeed from '../SightingFeed';
import CampusPokedex from '../CampusPokedex';
import Leaderboard from '../Leaderboard';
import Footer from '../Footer';
import UploadModal, { SightingSuccessToast } from './UploadModal';

export default function DashboardView({ 
  user, 
  onLogout, 
  sightings, 
  isLoadingSightings, 
  onRefreshSightings,
  onNavigate
}) {
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [toastData, setToastData] = useState(null);

  // Auto-dismiss success toast after 6 seconds
  useEffect(() => {
    if (toastData) {
      const timer = setTimeout(() => {
        setToastData(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastData]);

  const handleTriggerUpload = () => {
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newSighting) => {
    if (onRefreshSightings) {
      onRefreshSightings();
    }
  };

  const handleShowToast = (data) => {
    setToastData(data);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      {/* 1. Authenticated Dashboard Navbar */}
      <DashboardNavbar 
        user={user} 
        onLogout={onLogout} 
        onTriggerUpload={handleTriggerUpload} 
        onNavigate={onNavigate}
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
          onTriggerUploadModal={handleTriggerUpload}
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

      {/* 8. Dedicated Tailwind Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        user={user}
        onUploadSuccess={handleUploadSuccess}
        onShowToast={handleShowToast}
      />

      {/* 9. Styled Success Toast */}
      <SightingSuccessToast 
        toast={toastData} 
        onClose={() => setToastData(null)} 
      />
    </div>
  );
}
