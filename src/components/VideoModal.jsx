import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#201E1D] text-white rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close tour video"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">1-Minute Sanctuary Tour</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold font-['Outfit']">
            Welcome to the Pawsome Experience
          </h3>

          {/* Video / Visual Simulation */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] bg-black border border-white/10 shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85"
              alt="Two happy dogs running joyfully in a green grassy campus yard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                "Our cage-free campus spans 12,000 sq.ft of indoor agility courses, warm resting dens, and sterile surgical suites."
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs bg-[#FF6B4A] px-3 py-1 rounded-full font-bold">100% Cage-Free</span>
                <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">Supervised 24/7</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-white/60">
            <span>Video shot live on campus facilities</span>
            <button
              onClick={onClose}
              className="text-[#FF6B4A] hover:underline font-bold text-sm cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
