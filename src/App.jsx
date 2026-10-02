import React, { useState, useEffect } from 'react';
import PublicNavbar from './components/public/PublicNavbar';
import PublicHero from './components/public/PublicHero';
import HowItWorks from './components/public/HowItWorks';
import SightingsTeaser from './components/public/SightingsTeaser';
import ImpactSection from './components/public/ImpactSection';
import PublicCtaBanner from './components/public/PublicCtaBanner';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DashboardView from './components/dashboard/DashboardView';
import { supabase } from './utils/supabase';

// Sample fallback campus sightings (for live map and feed)
const INITIAL_DEMO_SIGHTINGS = [
  {
    id: 101,
    species_tag: 'Golden Retriever Mix',
    pet_name: 'Barnaby',
    latitude: 12.9722,
    longitude: 77.5954,
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 102,
    species_tag: 'Calico Campus Cat',
    pet_name: 'Mochi',
    latitude: 12.9711,
    longitude: 77.5938,
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString()
  },
  {
    id: 103,
    species_tag: 'Indian Pariah Dog',
    pet_name: 'Professor Paws',
    latitude: 12.9729,
    longitude: 77.5942,
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 104,
    species_tag: 'Purple Sunbird',
    pet_name: null,
    latitude: 12.9705,
    longitude: 77.5961,
    image_url: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 320).toISOString()
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup'); // 'login' | 'signup'
  const [sightings, setSightings] = useState(INITIAL_DEMO_SIGHTINGS);
  const [isLoadingSightings, setIsLoadingSightings] = useState(false);

  // Initialize auth state from localStorage or Supabase session
  useEffect(() => {
    const token = localStorage.getItem('animalhuzz_token');
    const email = localStorage.getItem('user_email');
    const scoutName = localStorage.getItem('scout_name');
    const avatar = localStorage.getItem('scout_avatar');
    const avatarEmoji = localStorage.getItem('scout_avatar_emoji');

    if (token && email) {
      setUser({
        token,
        email,
        scoutName: scoutName || email.split('@')[0],
        avatar: avatar || 'fox',
        avatarEmoji: avatarEmoji || '🦊'
      });
    }

    // Also check current active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setUser({
          token: session.access_token,
          email: session.user.email,
          scoutName: metadata.full_name || session.user.email.split('@')[0],
          avatar: metadata.avatar || 'fox',
          avatarEmoji: metadata.avatar_emoji || '🦊',
          companionName: metadata.companion_name || 'Wilderness Totem'
        });
      }
    }).catch(err => {
      console.warn('Session verification check:', err);
    });
  }, []);

  // Fetch live sightings from backend GET http://localhost:3001/api/sightings
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
      console.warn('Backend /api/sightings unreachable or offline, using default demo set:', err);
    } finally {
      setIsLoadingSightings(false);
    }
  };

  useEffect(() => {
    loadSightings();
  }, []);

  const handleOpenAuth = (mode = 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out:', err);
    }
    localStorage.removeItem('animalhuzz_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('scout_name');
    localStorage.removeItem('scout_avatar');
    localStorage.removeItem('scout_avatar_emoji');
    setUser(null);
  };

  // =========================================================================
  // CONDITIONAL RENDERING: STRICT SEPARATION BETWEEN PUBLIC AND AUTHENTICATED
  // =========================================================================
  
  if (user) {
    // PART 3: PRIVATE AUTHENTICATED DASHBOARD
    return (
      <DashboardView 
        user={user}
        onLogout={handleLogout}
        sightings={sightings}
        isLoadingSightings={isLoadingSightings}
        onRefreshSightings={loadSightings}
      />
    );
  }

  // PART 1: PUBLIC INFORMATIONAL WEBSITE (Route: `/`)
  // STRICTLY INFORMATIONAL: No live map, no upload forms, no user dashboard
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      {/* 1. Public Informational Navbar */}
      <PublicNavbar onOpenAuth={handleOpenAuth} />

      <main className="flex-1">
        {/* 2. Informational Hero Section */}
        <PublicHero onOpenAuth={handleOpenAuth} />

        {/* 3. How It Works (4-step layout: 01 Discover, 02 Capture, 03 Identify, 04 Contribute) */}
        <HowItWorks onOpenAuth={handleOpenAuth} />

        {/* 4. Recent Campus Sightings (Teaser: 4 read-only cards + "Log in to explore more sightings →") */}
        <SightingsTeaser onOpenAuth={handleOpenAuth} />

        {/* 5. Campus Biodiversity & Welfare Impact */}
        <ImpactSection />

        {/* 6. Final Call-To-Action Banner ("Your next discovery could be something extraordinary." -> "Join the Scouts") */}
        <PublicCtaBanner onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <Footer />

      {/* PART 2: Enhanced Authentication & Multi-step Onboarding Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(userData) => {
          setUser(userData);
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
