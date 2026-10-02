import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStats from './components/TrustStats';
import Services from './components/Services';
import FeaturedPet from './components/FeaturedPet';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import VideoModal from './components/VideoModal';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleOpenBooking = (serviceName = '') => {
    setSelectedService(serviceName);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      {/* Floating Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Page Flow */}
      <main className="flex-1">
        <Hero 
          onOpenBooking={() => handleOpenBooking()} 
          onOpenVideo={() => setVideoOpen(true)} 
        />
        
        <TrustStats />
        
        <Services 
          onSelectService={(service) => handleOpenBooking(service)} 
        />
        
        <FeaturedPet 
          onOpenBooking={() => handleOpenBooking()} 
        />
        
        <WhyChooseUs />
        
        <Testimonials />
        
        <CtaBanner 
          onOpenBooking={() => handleOpenBooking()} 
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
        preselectedService={selectedService}
      />

      <VideoModal 
        isOpen={videoOpen} 
        onClose={() => setVideoOpen(false)} 
      />
    </div>
  );
}
