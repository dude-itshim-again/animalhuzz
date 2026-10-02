import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Sparkles, ShieldCheck, Heart, AlertCircle, CheckCircle, RefreshCw, X, ArrowUpRight } from 'lucide-react';

export default function Hero({ user, onOpenAuth, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle' | 'acquiring' | 'locked' | 'failed'
  const [geoError, setGeoError] = useState('');
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Fetch campus pets for tagging
  useEffect(() => {
    fetch('http://localhost:3001/api/pets')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setPets(data);
      })
      .catch(() => {
        // Fallback default campus pets if DB is loading
        setPets([
          { id: '1', name: 'Barnaby', species: 'Golden Retriever Mix' },
          { id: '2', name: 'Mochi', species: 'Library Calico Cat' },
          { id: '3', name: 'Professor Paws', species: 'Canteen Brown Dog' },
        ]);
      });
  }, []);

  // Trigger file input click when "Upload a Sighting" is clicked
  const handleUploadClick = () => {
    const token = localStorage.getItem('animalhuzz_token');
    if (!token && !user) {
      if (onOpenAuth) onOpenAuth();
      // Notice: user can still choose file after logging in
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Acquire GPS coordinates with robust error callback
  const acquireGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('failed');
      setGeoError('Geolocation is not supported by your browser.');
      // Default to campus central coordinates (e.g., 12.9716, 77.5946)
      setCoords({ latitude: 12.9716, longitude: 77.5946 });
      return;
    }

    setGeoStatus('acquiring');
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setGeoStatus('locked');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoStatus('failed');
        setGeoError(err.message || 'Location permission denied. Using campus default pin.');
        // Fallback to campus coordinate
        setCoords({ latitude: 12.9716, longitude: 77.5946 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle image selection
  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
      acquireGeolocation();
    }
  };

  // Reset form
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCoords(null);
    setGeoStatus('idle');
    setGeoError('');
    setSelectedPetId('');
    setUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit sighting to POST http://localhost:3001/api/upload
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    const lat = coords ? coords.latitude : 12.9716;
    const lon = coords ? coords.longitude : 77.5946;

    setIsUploading(true);
    setUploadStatus('Sending sighting photo & GPS to server...');
    setSuccessInfo(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('latitude', lat);
    formData.append('longitude', lon);
    if (selectedPetId) {
      formData.append('pet_id', selectedPetId);
    }

    const token = localStorage.getItem('animalhuzz_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      setUploadStatus('Identifying species with Gemini AI...');
      const res = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload sighting');
      }

      setUploadStatus('Sighting successfully recorded!');
      setSuccessInfo(data.sighting || data);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => {
        handleCancel();
      }, 3500);

    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus(`Upload failed: ${err.message}.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="home" className="relative pt-32 sm:pt-40 pb-20 md:pb-28 overflow-hidden">
      {/* Background Organic Ambient Accents */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-[#FFE8DF]/60 via-[#FFF4EB]/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-48 right-0 w-96 h-96 bg-[#FEE9C5]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Massive CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-7">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0EB] border border-[#FFD8CD] text-[#E04D2D] font-bold text-xs sm:text-sm tracking-wide shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A] animate-ping" />
              <span>Campus Wildlife Community Tracker</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.15rem] font-extrabold text-[#201E1D] leading-[1.08] tracking-tight font-['Outfit']">
              Who did you spot <br />
              <span className="relative inline-block text-[#FF6B4A]">
                on campus today?
                <svg className="absolute -bottom-2.5 left-0 w-full text-[#FFD4C9] -z-10" viewBox="0 0 250 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 14C60 4 190 2 246 14" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#635B52] max-w-xl leading-relaxed font-normal">
              Snap a photo, drop a pin, and help us map the resident dogs, cats, and birds of the university. Powered by Gemini AI vision and live student reporting.
            </p>

            {/* Massive Upload Button (Or Photo Action Card if file chosen) */}
            {!selectedFile ? (
              <div className="pt-2 w-full sm:w-auto">
                <button
                  onClick={handleUploadClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-4 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-extrabold text-lg sm:text-xl px-9 py-5 rounded-full shadow-[0_12px_32px_rgba(255,107,74,0.38)] hover:shadow-[0_16px_40px_rgba(255,107,74,0.48)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span>Upload a Sighting</span>
                  <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                <p className="text-xs text-[#8C8479] mt-3 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span>Triggers camera/photo upload & instant GPS coordinate lock</span>
                </p>
              </div>
            ) : (
              /* Selected Photo Card & Upload Confirmation */
              <div className="w-full max-w-xl bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#FFD8CD] shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Sighting preview thumbnail" 
                        className="w-16 h-16 rounded-2xl object-cover border border-[#E8DEC0]"
                      />
                    )}
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-[#201E1D]">Photo Ready for Submission</div>
                      <div className="text-xs text-[#7A7369] font-medium">{selectedFile.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    disabled={isUploading}
                    className="p-1.5 rounded-full bg-[#FAF5EE] text-[#7A7369] hover:text-[#201E1D] cursor-pointer"
                    title="Cancel upload"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* GPS Status Indicator */}
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EDE7DD] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${geoStatus === 'locked' ? 'text-emerald-600' : 'text-[#FF6B4A]'}`} />
                    <span className="font-semibold text-[#38332E]">
                      {geoStatus === 'acquiring' && 'Acquiring GPS location...'}
                      {geoStatus === 'locked' && `GPS Locked: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`}
                      {geoStatus === 'failed' && (geoError || 'Using default campus pin')}
                    </span>
                  </div>
                  {geoStatus === 'acquiring' && (
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF6B4A] animate-spin" />
                  )}
                </div>

                {/* Optional Tag to Known Campus Pet */}
                {pets.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#635B52] uppercase tracking-wider mb-1">
                      Link to Known Campus Pet (Optional)
                    </label>
                    <select
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-xl px-3 py-2 text-xs font-semibold text-[#201E1D] focus:outline-none focus:border-[#FF6B4A]"
                    >
                      <option value="">None / Unregistered or Wild Animal</option>
                      {pets.map((p) => (
                        <option key={p.id} value={p.id}>
                          🐾 {p.name} ({p.species})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Message */}
                {uploadStatus && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    uploadStatus.includes('failed') ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-[#E04D2D]'
                  }`}>
                    {uploadStatus}
                  </div>
                )}

                {/* Success Card */}
                {successInfo && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Identified: {successInfo.species_tag || 'Campus Animal'}</span>
                    </div>
                    <p className="text-emerald-700">Added to Live Map and Student Feed!</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleConfirmUpload}
                    disabled={isUploading}
                    className="flex-1 bg-[#FF6B4A] hover:bg-[#E55737] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Confirm & Upload Pin</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUploading}
                    className="px-4 py-3 rounded-2xl border border-[#EDE5DA] text-xs font-bold text-[#635B52] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Scout community trust indicator */}
            <div className="pt-3 flex flex-wrap items-center gap-4 border-t border-[#EDE6DC]/80 w-full max-w-md">
              <div className="flex -space-x-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Student Scout" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Student Scout" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" 
                  alt="Student Scout" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#FCE8E2] text-[#FF6B4A] font-bold text-xs flex items-center justify-center shadow-xs">
                  +1.2k
                </div>
              </div>

              <div>
                <div className="font-bold text-sm text-[#201E1D]">1,200+ Student Scouts Active</div>
                <p className="text-xs text-[#7A7369] font-medium">Over 500+ sightings mapped across campus</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Organic Shapes */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px]">
              
              {/* Soft colorful backdrop blob */}
              <div className="absolute inset-0 bg-[#FFDDCF] rounded-[3.5rem] transform rotate-3 scale-102 transition-transform duration-700 pointer-events-none -z-10 shadow-[0_20px_50px_rgba(255,107,74,0.15)]" />
              <div className="absolute inset-0 bg-[#FBF0D9] rounded-[3.5rem] transform -rotate-2 scale-98 pointer-events-none -z-10" />

              {/* Main Featured Campus Pet Image */}
              <div className="relative rounded-[3.25rem] overflow-hidden border-4 border-white shadow-2xl bg-white aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85"
                  alt="Campus Golden Retriever ambassador smiling"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Spotted at Student Quad • 15m ago</span>
                </div>
              </div>

              {/* Floating Badge 1: Live GPS Map Pin */}
              <div className="absolute left-2 sm:-left-8 top-6 sm:top-16 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#EFE8DF] shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-2.5 sm:gap-3 animate-float-slow z-20">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-[#7A7369] font-medium">Coordinates</div>
                  <div className="font-bold text-xs sm:text-base text-[#201E1D]">Live PostGIS Pins</div>
                </div>
              </div>

              {/* Floating Badge 2: Gemini AI Vision */}
              <div className="absolute right-2 sm:-right-6 bottom-6 sm:bottom-12 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#EFE8DF] shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-2.5 sm:gap-3 animate-float-delayed z-20">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-[#7A7369] font-medium">Auto-Detection</div>
                  <div className="font-bold text-xs sm:text-base text-[#201E1D]">Gemini AI Vision</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
