import React from 'react';
import { Scissors, Stethoscope, GraduationCap, Home, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Services({ onSelectService }) {
  const services = [
    {
      id: 'grooming',
      title: 'Pet Grooming & Spa',
      tag: 'Relax & Refresh',
      description: 'Hypoallergenic soothing baths, breed-specific styling, de-shedding treatments, ear care, and gentle pawdicures.',
      icon: Scissors,
      color: 'bg-[#FFEBE5]',
      accentColor: 'text-[#E04D2D]',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
      features: ['Aromatherapy bath', 'Teeth & ear hygiene', 'Nail clipping & buffering']
    },
    {
      id: 'veterinary',
      title: 'Veterinary Wellness',
      tag: 'Medical Health',
      description: 'Comprehensive physical exams, core vaccinations, microchipping, nutrition planning, and preventive diagnostics.',
      icon: Stethoscope,
      color: 'bg-[#E8F8F0]',
      accentColor: 'text-[#059669]',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb3cfcb0def?auto=format&fit=crop&w=600&q=80',
      features: ['Full wellness checkup', 'Vaccination boosters', 'Diagnostic dental care']
    },
    {
      id: 'training',
      title: 'Positive Pet Training',
      tag: 'Behavior & Skills',
      description: 'Evidence-based positive reinforcement training for puppies and adult dogs. Leash manners, obedience, and socialization.',
      icon: GraduationCap,
      color: 'bg-[#FEF5E7]',
      accentColor: 'text-[#D97706]',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
      features: ['Puppy socialization', 'Recall & leash mastery', 'Agility & fun tricks']
    },
    {
      id: 'boarding',
      title: 'Luxury Pet Boarding',
      tag: 'Home Away From Home',
      description: 'Spacious climate-controlled suites, constant cuddle time, supervised outdoor play yards, and 24/7 web camera streaming.',
      icon: Home,
      color: 'bg-[#EFF4FE]',
      accentColor: 'text-[#2563EB]',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
      features: ['HD suite webcam', '4x daily outdoor runs', 'Gourmet meal schedule']
    }
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
              Tailored Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              Everything Your Companion Needs to Thrive
            </h2>
          </div>
          <p className="text-[#635B52] max-w-md text-base leading-relaxed">
            Our certified specialists tailor every treatment, walk, and visit to your pet’s unique personality and health requirements.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-[2.5rem] p-7 sm:p-9 border border-[#EBE4D8] shadow-xs hover:shadow-[0_20px_40px_rgba(45,42,38,0.06)] hover:border-[#FFD4C9] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badge row */}
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] mb-7 bg-[#F7F2EA]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-xs backdrop-blur-md bg-white/90 ${item.accentColor}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Title & Icon Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight group-hover:text-[#FF6B4A] transition-colors">
                      {item.title}
                    </h3>
                    <div className={`w-12 h-12 rounded-2xl ${item.color} ${item.accentColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#635B52] text-sm sm:text-base leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Bullet features */}
                  <ul className="space-y-2 mb-8">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A443D] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Row */}
                <div className="pt-5 border-t border-[#F0EBE1] flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#7A7369]">
                    Custom packages available
                  </span>
                  <button
                    onClick={() => onSelectService(item.title)}
                    className="flex items-center gap-2 text-sm font-bold text-[#201E1D] group-hover:text-[#FF6B4A] transition-colors cursor-pointer"
                  >
                    <span>Book Service</span>
                    <div className="w-9 h-9 rounded-full bg-[#FAF5EE] group-hover:bg-[#FF6B4A] group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
