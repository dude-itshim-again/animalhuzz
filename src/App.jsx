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
import AdminRegisterPet from './pages/AdminRegisterPet';
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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync browser path with state
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize auth state from localStorage or Supabase session
  useEffect(() => {
    const token = localStorage.getItem('animalhuzz_token');
    const email = localStorage.getItem('user_email');
    const scoutName = localStorage.getItem('scout_name');
    const avatar = localStorage.getItem('scout_avatar');
    const avatarEmoji = localStorage.getItem('scout_avatar_emoji');
    const userId = localStorage.getItem('user_id');

    if (token && email) {
      setUser({
        id: userId || null,
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
        if (session.user.id) {
          localStorage.setItem('user_id', session.user.id);
        }
        const metadata = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
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
    localStorage.removeItem('user_id');
    localStorage.removeItem('scout_name');
    localStorage.removeItem('scout_avatar');
    localStorage.removeItem('scout_avatar_emoji');
    setUser(null);
  };

  // =========================================================================
  // ROUTING & CONDITIONAL RENDERING
  // =========================================================================
  
  // 1. Protected Admin Route: /dashboard/admin/register-pet
  if (currentPath === '/dashboard/admin/register-pet') {
    if (user) {
      return (
        <AdminRegisterPet 
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );
    } else {
      // Unauthenticated access to admin route: Prompt sign-in
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
          <PublicNavbar onOpenAuth={handleOpenAuth} />
          
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-10 border border-[#E8E2D9] shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center mx-auto text-3xl shadow-xs">
                🔒
              </div>
              <h2 className="text-2xl font-extrabold text-[#201E1D] font-['Outfit']">
                Protected Admin Console
              </h2>
              <p className="text-xs sm:text-sm text-[#635B52] leading-relaxed">
                Access to the Pinecone pet facial vector registry is restricted to authorized University Scouts. Please sign in to continue.
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="w-full bg-[#FF6B4A] hover:bg-[#E55737] text-white font-extrabold text-sm py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Sign In to Continue
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-[#FAF5EE] hover:bg-[#F2ECE1] text-[#201E1D] font-bold text-xs py-3 rounded-full transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </main>

          <Footer />

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
  }

  // 2. Private Authenticated Dashboard
  if (user) {
    return (
      <DashboardView 
        user={user}
        onLogout={handleLogout}
        sightings={sightings}
        isLoadingSightings={isLoadingSightings}
        onRefreshSightings={loadSightings}
        onNavigate={navigate}
      />
    );
  }

  // 3. Public Informational Website (Route: `/`)
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      {/* 1. Public Informational Navbar */}
      <PublicNavbar onOpenAuth={handleOpenAuth} />

      <main className="flex-1">
        {/* 2. Informational Hero Section */}
        <PublicHero onOpenAuth={handleOpenAuth} />

        {/* 3. How It Works */}
        <HowItWorks onOpenAuth={handleOpenAuth} />

        {/* 4. Recent Campus Sightings */}
        <SightingsTeaser onOpenAuth={handleOpenAuth} />

        {/* 5. Campus Biodiversity & Welfare Impact */}
        <ImpactSection />

        {/* 6. Call-To-Action Banner */}
        <PublicCtaBanner onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication & Onboarding Modal */}
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
