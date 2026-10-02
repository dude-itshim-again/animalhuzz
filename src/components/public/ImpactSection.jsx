import React from 'react';
import { MapPin, Sparkles, Users, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ImpactSection() {
  const stats = [
    {
      icon: MapPin,
      value: '540+',
      label: 'Campus Sightings Mapped',
      desc: 'GPS coordinates cataloged across quads, gardens, and canopies.',
      color: 'bg-[#FFF0EB] text-[#FF6B4A]',
    },
    {
      icon: Sparkles,
      value: '99.2%',
      label: 'Gemini AI Vision Accuracy',
      desc: 'Automated species tagging calibrated for regional university fauna.',
      color: 'bg-[#FEF6E6] text-[#D97706]',
    },
    {
      icon: Users,
      value: '1,200+',
      label: 'Student Scout Community',
      desc: 'Undergraduates, postgrads, and faculty scouts participating actively.',
      color: 'bg-[#EBF7F0] text-[#059669]',
    },
    {
      icon: Heart,
      value: '18 Known',
      label: 'Campus Pets Safeguarded',
      desc: 'Monitored for anti-rabies vaccination, nutrition, and welfare checks.',
      color: 'bg-[#F0F4FE] text-[#2563EB]',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div id="impact" className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
            Campus Impact & Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            Protecting & Documenting Our Campus Biodiversity
          </h2>
          <p className="text-base sm:text-lg text-[#635B52] leading-relaxed">
            WildLens transforms casual campus sightings into an open ecological census. Our data assists veterinary care teams, supports biodiversity research, and ensures resident animals are treated with dignity and care.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-[#FAF7F2] hover:bg-white rounded-[2rem] p-7 border border-[#EDE7DD] hover:border-[#FFD4C9] shadow-xs hover:shadow-[0_16px_35px_rgba(255,107,74,0.08)] transition-all duration-300 transform hover:-translate-y-1 group"
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
