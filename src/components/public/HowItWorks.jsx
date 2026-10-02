import React from 'react';
import { Eye, Camera, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenAuth }) {
  const steps = [
    {
      num: '01',
      tag: 'Discover',
      title: 'Spot Campus Wildlife',
      description: 'Observe resident dogs, migratory birds, butterflies, and cats across quads, library lawns, and canopies.',
      icon: Eye,
      color: 'bg-[#FFF0EB] text-[#FF6B4A]',
    },
    {
      num: '02',
      tag: 'Capture',
      title: 'Snap & Log GPS',
      description: 'Take a clear photo with your phone. WildLens locks your real-time GPS coordinates with high spatial precision.',
      icon: Camera,
      color: 'bg-[#FEF6E6] text-[#D97706]',
    },
    {
      num: '03',
      tag: 'Identify',
      title: 'Gemini AI Vision',
      description: 'Our Google Gemini 1.5 Flash vision model analyzes the photo and tags the exact species in two seconds.',
      icon: Sparkles,
      color: 'bg-[#EBF7F0] text-[#059669]',
    },
    {
      num: '04',
      tag: 'Contribute',
      title: 'Power Campus Research',
      description: 'Your observation pins to the university GIS live map, helping welfare clubs monitor vaccination and animal health.',
      icon: MapPin,
      color: 'bg-[#F0F4FE] text-[#2563EB]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-y border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            How WildLens Works
          </h2>
          <p className="text-base sm:text-lg text-[#635B52] leading-relaxed">
            Turn your daily university walks into meaningful scientific observations. Here is how every student scout participates.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#FAF7F2] rounded-[2.25rem] p-7 sm:p-8 border border-[#EDE7DD] hover:border-[#FFD4C9] hover:bg-[#FFFDF9] transition-all duration-300 shadow-xs hover:shadow-[0_16px_35px_rgba(255,107,74,0.08)] transform hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-extrabold text-2xl text-[#C9BFB2] font-['Outfit'] group-hover:text-[#FF6B4A] transition-colors">
                      {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF6B4A] mb-1.5 block">
                    Step {step.num}: {step.tag}
                  </span>

                  <h3 className="text-xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#635B52] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-[#EDE5DA]/70 flex items-center gap-1.5 text-xs font-bold text-[#8C8479]">
                  <span>Scout Protocol Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA note */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onOpenAuth('signup')}
            className="inline-flex items-center gap-2.5 text-sm font-bold text-[#FF6B4A] hover:text-[#E04D2D] hover:underline cursor-pointer"
          >
            <span>Ready to start logging sightings? Create your scout account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
