import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, PawPrint, Sparkles, Clock, User, Phone, Mail } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedService }) {
  const [step, setStep] = useState(1);
  const [petType, setPetType] = useState('dog');
  const [service, setService] = useState(preselectedService || 'Pet Grooming & Spa');
  const [petName, setPetName] = useState('');
  const [date, setDate] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2); // Success step
    }, 800);
  };

  const handleReset = () => {
    setStep(1);
    setPetName('');
    setDate('');
    setOwnerName('');
    setOwnerPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] max-w-xl w-full p-7 sm:p-10 border border-[#E8DECC] shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE3] text-[#4A443D] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Fast Online Reservation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight mb-2">
              Book a Care Session
            </h3>
            <p className="text-sm text-[#6B635A] mb-6">
              Tell us about your furry friend and preferred time. We will confirm your appointment within 15 minutes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Pet Type Select */}
              <div>
                <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-2">
                  1. Pet Type
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'dog', label: '🐶 Dog' },
                    { id: 'cat', label: '🐱 Cat' },
                    { id: 'other', label: '🐰 Other' }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPetType(item.id)}
                      className={`py-2.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                        petType === item.id
                          ? 'bg-[#FFF0EB] border-[#FF6B4A] text-[#FF6B4A] shadow-xs'
                          : 'bg-[#FAF7F2] border-[#E8DECC] text-[#635B52] hover:bg-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Select */}
              <div>
                <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-2">
                  2. Choose Primary Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl px-4 py-3 text-sm font-semibold text-[#201E1D] focus:outline-none focus:border-[#FF6B4A]"
                >
                  <option value="Pet Grooming & Spa">Pet Grooming & Spa ($65 - $110)</option>
                  <option value="Veterinary Wellness Exam">Veterinary Wellness Exam ($85)</option>
                  <option value="Positive Pet Training">Positive Pet Training ($75 / session)</option>
                  <option value="Luxury Pet Boarding">Luxury Pet Boarding ($55 / night)</option>
                </select>
              </div>

              {/* Pet Name & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-1.5">
                    Pet's Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barnaby"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl px-4 py-2.5 text-sm text-[#201E1D] focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl px-4 py-2.5 text-sm text-[#201E1D] focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              {/* Owner Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Parent's Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl px-4 py-2.5 text-sm text-[#201E1D] focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl px-4 py-2.5 text-sm text-[#201E1D] focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#FF6B4A] hover:bg-[#E55737] disabled:opacity-75 text-white font-bold text-base py-3.5 rounded-full shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? 'Confirming Availability...' : 'Confirm Reservation Request'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF7F0] text-[#059669] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#201E1D] font-['Outfit']">
              Reservation Requested!
            </h3>
            <p className="text-sm text-[#6B635A] max-w-sm mx-auto leading-relaxed">
              We received your request for <strong>{petName || 'your pet'}</strong> on <strong>{date || 'upcoming date'}</strong>. Our concierge will text you at <strong>{ownerPhone || 'your number'}</strong> to confirm timing.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#201E1D] text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-[#FF6B4A] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
