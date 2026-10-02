import React from 'react';
import { Camera, HeartHandshake, ShieldCheck, Sparkles, Check } from 'lucide-react';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Fear-Free Certified Protocols',
      description: 'Every handler and veterinary nurse is rigorously certified in low-stress handling, calming pheromones, and positive body-language cues.',
      color: 'bg-[#FFF0EB] text-[#FF6B4A]'
    },
    {
      icon: Camera,
      title: 'Live 4K Pet Webcams',
      description: 'Check in on your fur baby anytime from your phone. Watch them play in our sunlit indoor parks and cuddle during afternoon nap time.',
      color: 'bg-[#EBF7F0] text-[#059669]'
    },
    {
      icon: HeartHandshake,
      title: 'All-Inclusive Transparent Pricing',
      description: 'No hidden add-on fees for medication administration, extra belly rubs, playtime, or specialized dietary preparation.',
      color: 'bg-[#FEF5E7] text-[#D97706]'
    },
    {
      icon: Sparkles,
      title: 'Customized Wellness Journals',
      description: 'Receive daily digital report cards featuring high-res photos, bathroom logs, meal updates, and trainer notes after every single visit.',
      color: 'bg-[#EFF4FE] text-[#2563EB]'
    }
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-white border-t border-[#F0EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF6B4A] uppercase bg-[#FFF0EB] px-3.5 py-1.5 rounded-full inline-block">
            Why Pet Parents Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            Designed from the Ground Up for Pet Comfort
          </h2>
          <p className="text-base sm:text-lg text-[#635B52] leading-relaxed">
            We understand leaving your companion in someone else's hands requires total trust. Here is how we guarantee your complete peace of mind.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF7F2] rounded-[2rem] p-7 sm:p-8 border border-[#EDE7DD] hover:border-[#FFD4C9] hover:bg-[#FFFDF9] transition-all duration-300 shadow-xs hover:shadow-[0_16px_32px_rgba(255,107,74,0.06)] transform hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#635B52] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EDE5DA] flex items-center gap-2 text-xs font-bold text-[#FF6B4A]">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Standard on all visits</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
