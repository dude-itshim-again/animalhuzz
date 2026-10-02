import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      pet: 'Cooper (2yo Golden Corgi)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review: 'Finding a boarding facility that understands anxiety in dogs was impossible until we found Pawsome. The webcam streams gave me so much peace of mind while traveling. Cooper didn’t even want to leave!',
      date: '2 weeks ago',
      service: 'Luxury Boarding'
    },
    {
      id: 2,
      name: 'Dr. Marcus Vance',
      pet: 'Mochi (4yo Persian Cat)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review: 'The veterinary team here is world-class. Dr. Elena handled Mochi’s dental cleaning with extreme gentleness. The post-procedure recovery photos and detailed care guide were exceptional.',
      date: '1 month ago',
      service: 'Veterinary Wellness'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      pet: 'Ziggy & Nova (Rescue Pups)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review: 'The grooming spa transformed our messy rescue pups into clean, fragrant royalty! Hypoallergenic products made a noticeable difference on Ziggy’s sensitive skin. Highly recommend!',
      date: '3 weeks ago',
      service: 'Grooming & Spa'
    }
  ];

  return (
    <section id="reviews" className="py-20 md:py-28 bg-[#FAF7F2] border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
              Real Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              Loved by Pets, Trusted by Owners
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-lg text-[#201E1D]">4.9 / 5.0 Rating</span>
          </div>
        </div>

        {/* Testimonials Cards (Horizontal scroll on mobile, 3-col grid on desktop) */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-none">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2.5rem] p-7 sm:p-8 border border-[#EAE3D7] shadow-xs hover:shadow-[0_20px_40px_rgba(45,42,38,0.06)] hover:border-[#FFD4C9] transition-all duration-300 flex flex-col justify-between shrink-0 w-[85vw] sm:w-[360px] md:w-auto snap-center"
            >
              <div>
                {/* Rating & Service Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5EE] text-[#736B62]">
                    {item.service}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-[#4A443D] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  "{item.review}"
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-5 border-t border-[#F2ECE3] flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FFE8DF]"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#201E1D]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#7A7369] font-medium flex items-center gap-1 mt-0.5">
                    <Heart className="w-3 h-3 text-[#FF6B4A] fill-current" />
                    <span>{item.pet}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
