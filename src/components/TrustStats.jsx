import React from 'react';
import { Award, HeartHandshake, Smile, Clock } from 'lucide-react';

export default function TrustStats() {
  const stats = [
    {
      icon: Smile,
      value: '14,000+',
      label: 'Happy Tails Catered',
      desc: 'Dogs and cats pampered with personalized love.',
      color: 'bg-[#FFF0EB] text-[#FF6B4A]',
    },
    {
      icon: Award,
      value: '99.8%',
      label: 'Parent Satisfaction',
      desc: 'Top-rated pet sanctuary in verified reviews.',
      color: 'bg-[#FEF6E6] text-[#D97706]',
    },
    {
      icon: Clock,
      value: '24 / 7',
      label: 'Certified Supervision',
      desc: 'Dedicated caregivers & live webcam access.',
      color: 'bg-[#EBF7F0] text-[#059669]',
    },
    {
      icon: HeartHandshake,
      value: '15+ Years',
      label: 'Veterinary Experience',
      desc: 'Board-certified specialists & fear-free care.',
      color: 'bg-[#F0F4FE] text-[#2563EB]',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-y border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
            Built on Trust & Compassion
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            Setting the Highest Standard for Everyday Pet Care
          </h2>
          <p className="text-base sm:text-lg text-[#635B52] leading-relaxed">
            From puppyhood to golden years, we create a stress-free environment designed specifically around your pet’s physical, nutritional, and emotional wellness.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-[#FAF7F2] hover:bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE7DD] hover:border-[#FFD4C9] shadow-xs hover:shadow-[0_12px_30px_rgba(255,107,74,0.08)] transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#201E1D] tracking-tight font-['Outfit'] mb-1">
                  {stat.value}
                </div>
                <div className="text-base font-bold text-[#38332E] mb-2">
                  {stat.label}
                </div>
                <p className="text-xs sm:text-sm text-[#736B62] leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
