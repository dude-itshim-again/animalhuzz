import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStats from './components/TrustStats';
import LiveMap from './components/LiveMap';
import SightingFeed from './components/SightingFeed';
import CampusPokedex from './components/CampusPokedex';
import Leaderboard from './components/Leaderboard';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Sample fallback campus sightings (shown if backend DB is empty or offline)
const INITIAL_DEMO_SIGHTINGS = [
  {
    id: 101,
    species_tag: 'Golden Retriever Mix',
    pet_name: 'Barnaby',
    latitude: 12.9722,
    longitude: 77.5954,
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString() // 25 mins ago
  },
  {
    id: 102,
    species_tag: 'Calico Campus Cat',
    pet_name: 'Mochi',
    latitude: 12.9711,
    longitude: 77.5938,
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString() // 75 mins ago
  },
  {
    id: 103,
    species_tag: 'Indian Pariah Dog',
    pet_name: 'Professor Paws',
    latitude: 12.9729,
    longitude: 77.5942,
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() // 3 hours ago
  },
  {
    id: 104,
    species_tag: 'Purple Sunbird',
    pet_name: null,
    latitude: 12.9705,
    longitude: 77.5961,
    image_url: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 320).toISOString() // 5 hours ago
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sightings, setSightings] = useState(INITIAL_DEMO_SIGHTINGS);
  const [isLoadingSightings, setIsLoadingSightings] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('animalhuzz_token');
    const email = localStorage.getItem('user_email');
    if (token && email) {
      setUser({ token, email });
    }
  }, []);

  // Fetch sightings from backend GET http://localhost:3001/api/sightings
  const loadSightings = async () => {
    setIsLoadingSightings(true);
    try {
      const res = await fetch('http://localhost:3001/api/sightings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSightings(data);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend /api/sightings not reachable yet, using active client sightings:', err);
    } finally {
      setIsLoadingSightings(false);
    }
  };

  useEffect(() => {
    loadSightings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('animalhuzz_token');
    localStorage.removeItem('user_email');
    setUser(null);
  };

  const handleTriggerUpload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const uploadBtn = document.querySelector('#home button');
    if (uploadBtn) {
      setTimeout(() => uploadBtn.click(), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      {/* Floating Header Navbar */}
      <Navbar 
        user={user} 
        onOpenAuth={() => setAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero with massive "Upload a Sighting" button */}
        <Hero 
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onUploadSuccess={() => loadSightings()}
        />

        {/* 2. Trust Stats for Campus Scouts */}
        <TrustStats totalSightings={sightings.length} />

        {/* 3. Live Campus Leaflet Map */}
        <LiveMap 
          sightings={sightings} 
          isLoading={isLoadingSightings}
          onRefresh={loadSightings}
          activeMarkerId={activeMarkerId}
        />

        {/* 4. Sighting Feed Grid */}
        <SightingFeed 
          sightings={sightings}
          onSelectSighting={(id) => setActiveMarkerId(id)}
          onTriggerUpload={handleTriggerUpload}
        />

        {/* 5. Campus Pokedex: Resident University Pets */}
        <CampusPokedex 
          onTriggerUpload={handleTriggerUpload}
        />

        {/* 6. Top Campus Scouts Leaderboard */}
        <Leaderboard />

        {/* 7. Bottom Call-To-Action Banner */}
        <CtaBanner 
          onTriggerUpload={handleTriggerUpload}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Supabase Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />
    </div>
  );
}
