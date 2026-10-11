import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, UploadCloud, Camera, Sparkles, CheckCircle2, 
  AlertCircle, ArrowLeft, Loader2, X, RefreshCw, Database,
  Tag, Info, Heart, Check
} from 'lucide-react';

export default function AdminRegisterPet({ user, onNavigate, onLogout }) {
  const fileInputRef = useRef(null);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredPet, setRegisteredPet] = useState(null);

  // Existing pets list from PostgreSQL
  const [existingPets, setExistingPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  // Load registered pets from backend
  const fetchPets = async () => {
    setIsLoadingPets(true);
    try {
      const res = await fetch('/api/pets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setExistingPets(data);
          return;
        }
      }
      // Fallback direct URL
      const fallbackRes = await fetch('http://localhost:3001/api/pets');
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (Array.isArray(data)) setExistingPets(data);
      }
    } catch (err) {
      console.warn('Could not fetch existing pets:', err);
    } finally {
      setIsLoadingPets(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds 20MB limit.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClearForm = () => {
    setPetName('');
    setSpecies('');
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setRegisteredPet(null);

    // Validation
    if (!petName.trim()) {
      setErrorMessage('Please enter the pet name (e.g., "Bruno").');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please select or upload a reference photograph for the pet.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('name', petName.trim());
      if (species.trim()) {
        formData.append('species', species.trim());
      }

      // POST request to backend /api/pets/register
      let res;
      try {
        res = await fetch('/api/pets/register', {
          method: 'POST',
          body: formData
        });
      } catch (proxyErr) {
        res = await fetch('http://localhost:3001/api/pets/register', {
          method: 'POST',
          body: formData
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Pet registration failed.');
      }

      // On success, clear the form and show success message
      setSuccessMessage('Pet face successfully registered in Pinecone vector database.');
      setRegisteredPet(data.pet || { name: petName.trim() });
      handleClearForm();

      // Refresh registered pets list
      fetchPets();

    } catch (err) {
      console.error('Pet registration error:', err);
      setErrorMessage(err.message || 'Failed to register pet. Ensure backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#FF6B4A]">
      
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EDE5DA] px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Back button and title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('/')}
              className="w-10 h-10 rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE1] text-[#201E1D] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-[#201E1D] font-['Outfit'] tracking-tight">
                  Wild<span className="text-[#FF6B4A]">Lens</span>
                </span>
                <span className="bg-[#201E1D] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-[#7A7369] hidden sm:block">
                Pinecone Vector Embedding & Campus Pet Registry
              </p>
            </div>
          </div>

          {/* Admin badge & Scout context */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#FAF5EE] border border-[#EFE8DF] px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#201E1D]">
                {user?.scoutName || 'Administrator'}
              </span>
            </div>

            <button
              onClick={() => onNavigate('/')}
              className="bg-[#201E1D] hover:bg-[#FF6B4A] text-white text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Back to Dashboard
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        
        {/* Hero Section */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] text-[#FF6B4A] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Facial Recognition Seed System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            Register Official Campus Pet
          </h1>
          <p className="text-[#635B52] text-sm sm:text-base leading-relaxed">
            Upload an official reference photo to index its 512-dimensional CLIP embedding into the Pinecone <code className="bg-[#EFE8DC] px-1.5 py-0.5 rounded text-[#201E1D] font-mono text-xs">campus-pets</code> vector index. Incoming student sighting uploads will be matched against this face with confidence scoring.
          </p>
        </div>

        {/* Two-Column Layout: Form (Left) & Existing Indexed Pets (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Registration Form Card */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 sm:p-9 border border-[#EDE7DD] shadow-[0_20px_45px_rgba(45,42,38,0.05)] space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#201E1D] font-['Outfit']">
                    Pet Vector Registration
                  </h2>
                  <p className="text-xs text-[#7A7369]">
                    PostgreSQL UUID + 512D Pinecone Upsert
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#8C8479]">
                Index: <span className="font-mono text-[#FF6B4A]">campus-pets</span>
              </span>
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
                {registeredPet && (
                  <div className="pl-7 text-xs text-emerald-700 space-y-1">
                    <div>
                      Registered Pet: <strong className="text-emerald-900">{registeredPet.name}</strong>
                      {registeredPet.species && ` (${registeredPet.species})`}
                    </div>
                    {registeredPet.id && (
                      <div className="font-mono text-[11px] text-emerald-600 truncate">
                        PostgreSQL UUID: {registeredPet.id}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-semibold">{errorMessage}</div>
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Pet Name Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="pet-name" 
                  className="block text-xs font-bold text-[#453F38] uppercase tracking-wider"
                >
                  Pet Name <span className="text-[#FF6B4A]">*</span>
                </label>
                <input
                  id="pet-name"
                  type="text"
                  required
                  placeholder="e.g., Bruno"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E2DBD0] text-[#201E1D] font-medium text-sm placeholder-[#9C9488] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* 2. Pet Species / Role Input (Optional) */}
              <div className="space-y-2">
                <label 
                  htmlFor="pet-species" 
                  className="block text-xs font-bold text-[#453F38] uppercase tracking-wider flex items-center justify-between"
                >
                  <span>Species / Campus Role</span>
                  <span className="text-[10px] text-[#8C8479] font-normal normal-case">Optional</span>
                </label>
                <input
                  id="pet-species"
                  type="text"
                  placeholder="e.g., Campus Golden Retriever, Library Calico Cat"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E2DBD0] text-[#201E1D] font-medium text-sm placeholder-[#9C9488] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* 3. File Upload for Pet Photo */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#453F38] uppercase tracking-wider">
                  Official Reference Photograph <span className="text-[#FF6B4A]">*</span>
                </label>

                {previewUrl ? (
                  <div className="relative rounded-3xl overflow-hidden border-2 border-[#E8E2D9] bg-[#FAF7F2] aspect-[16/10] group">
                    <img 
                      src={previewUrl} 
                      alt="Pet preview" 
                      className="w-full h-full object-cover" 
                    />

                    {!isLoading && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-between">
                        <div className="self-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="bg-white/95 hover:bg-white text-red-600 rounded-full p-2 text-xs font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-white text-xs font-medium">
                          <div className="truncate max-w-[220px] font-semibold">
                            {selectedFile?.name}
                          </div>
                          <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px]">
                            {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
                      isDragging 
                        ? 'border-[#FF6B4A] bg-[#FFF2ED] scale-[0.99]' 
                        : 'border-[#E0D8CB] hover:border-[#FF6B4A] bg-[#FAF7F2] hover:bg-[#FFF9F6]'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-[#ECE5D8] flex items-center justify-center mx-auto mb-3.5 text-[#FF6B4A]">
                      <Camera className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-[#201E1D] mb-1">
                      Click to choose photo, or <span className="text-[#FF6B4A] underline underline-offset-2">drag and drop</span>
                    </h4>
                    <p className="text-xs text-[#8C8479] max-w-xs mx-auto leading-relaxed">
                      Clear frontal photo of the pet's face works best for CLIP vision feature extraction.
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !petName.trim() || !selectedFile}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B4A] hover:bg-[#E55737] disabled:bg-[#D5CDC2] text-white font-extrabold text-sm py-4 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing AI Vector...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Index Pet in Pinecone Vector DB</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* RIGHT: Currently Indexed Campus Pets */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-6 sm:p-8 border border-[#EDE7DD] shadow-[0_20px_45px_rgba(45,42,38,0.05)] space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#FF6B4A]" />
                <h3 className="text-base font-extrabold text-[#201E1D] font-['Outfit']">
                  Currently Indexed Pets ({existingPets.length})
                </h3>
              </div>
              <button
                onClick={fetchPets}
                className="text-[11px] font-bold text-[#FF6B4A] hover:text-[#E55737] flex items-center gap-1 cursor-pointer"
                title="Reload pets from database"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingPets ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* List */}
            {isLoadingPets && existingPets.length === 0 ? (
              <div className="py-12 text-center text-[#7A7369] text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#FF6B4A]" />
                <span>Reading PostgreSQL & Pinecone index...</span>
              </div>
            ) : existingPets.length === 0 ? (
              <div className="py-12 text-center text-[#8C8479] text-xs space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EE] text-2xl flex items-center justify-center mx-auto">
                  🐾
                </div>
                <div className="font-bold text-[#201E1D]">No Official Pets Indexed Yet</div>
                <p className="max-w-xs mx-auto text-[11px]">
                  Use the registration form on the left to add your first official campus pet reference!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {existingPets.map((pet) => (
                  <div 
                    key={pet.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D8] hover:border-[#FFD4C9] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E2D9] text-[#FF6B4A] flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                        🐾
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-[#201E1D] font-['Outfit'] truncate">
                          {pet.name}
                        </div>
                        <div className="text-xs text-[#7A7369] truncate">
                          {pet.species || 'Campus Pet'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check className="w-2.5 h-2.5" />
                        512D Vector Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Explanatory Note */}
            <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#EFE8DF] space-y-1.5 text-xs text-[#6B6359]">
              <div className="font-extrabold text-[#201E1D] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-[#FF6B4A]" />
                How Face Matching Works
              </div>
              <p className="text-[11px] leading-relaxed">
                When a user reports a sighting, the photo is passed through the same CLIP vision transformer. If cosine similarity against any registered pet vector exceeds <strong className="text-[#201E1D]">0.85 (85%)</strong>, the sighting is automatically attributed to that pet.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
