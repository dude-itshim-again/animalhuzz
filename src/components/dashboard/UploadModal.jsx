import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, UploadCloud, MapPin, Sparkles, CheckCircle2, 
  AlertCircle, Loader2, ArrowRight, ArrowLeft, RefreshCw, 
  ShieldCheck, Check, Info, Tag, Heart
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

// University default coordinates fallback (Universal AI Campus)
const DEFAULT_CAMPUS_COORDS = {
  latitude: 12.9716,
  longitude: 77.5946
};

export default function UploadModal({ 
  isOpen, 
  onClose, 
  user, 
  onUploadSuccess,
  onShowToast 
}) {
  const fileInputRef = useRef(null);

  // Flow step: 1 = "Scan Animal", 2 = "Review & Name"
  const [step, setStep] = useState(1);

  // Form data state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [coords, setCoords] = useState(DEFAULT_CAMPUS_COORDS);
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle' | 'acquiring' | 'locked' | 'denied'
  const [geoError, setGeoError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Step 1: Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); 
  // scanResult shape: { match: boolean, petName?: string, petId?: string, species: string, matchScore?: number }

  // Step 2: Confirmation & On-the-fly naming state
  const [newPetName, setNewPetName] = useState('');
  const [editableSpecies, setEditableSpecies] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Request navigator.geolocation immediately when modal opens
  useEffect(() => {
    if (isOpen) {
      acquireCoordinates();
    } else {
      resetForm();
    }
  }, [isOpen]);

  const acquireCoordinates = () => {
    setGeoStatus('acquiring');
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoStatus('denied');
      setGeoError('Geolocation API not supported by browser. Using campus center coordinates.');
      setCoords(DEFAULT_CAMPUS_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6))
        });
        setGeoStatus('locked');
        setGeoError('');
      },
      (err) => {
        console.warn('Geolocation acquisition notice:', err.message);
        setGeoStatus('denied');
        setGeoError(err.message || 'Permission denied. Defaulted to university campus coordinates.');
        setCoords(DEFAULT_CAMPUS_COORDS);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0
      }
    );
  };

  const resetForm = () => {
    setStep(1);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setIsScanning(false);
    setScanResult(null);
    setNewPetName('');
    setEditableSpecies('');
    setIsSubmitting(false);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 20MB.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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

  // Robust fetch helper with timeout, proxy fallback, and defensive JSON parsing
  const safeFetchJson = async (endpoint, fallbackEndpoint, options = {}, timeoutMs = 90000) => {
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);

    let res = null;
    let netError = null;

    // 1. Try primary endpoint (proxied through Vite)
    try {
      res = await fetch(endpoint, {
        ...options,
        signal: controller.signal
      });

      // If Vite proxy returned 502/503/504 gateway error, attempt direct port 3001 fallback
      if ((res.status === 502 || res.status === 503 || res.status === 504) && fallbackEndpoint) {
        console.warn(`Primary endpoint ${endpoint} returned HTTP ${res.status}. Trying fallback ${fallbackEndpoint}...`);
        try {
          const directRes = await fetch(fallbackEndpoint, {
            ...options,
            signal: controller.signal
          });
          res = directRes;
        } catch (directErr) {
          console.warn('Direct fallback connection error:', directErr.message);
        }
      }
    } catch (primaryErr) {
      netError = primaryErr;
      if (fallbackEndpoint) {
        try {
          res = await fetch(fallbackEndpoint, {
            ...options,
            signal: controller.signal
          });
          netError = null;
        } catch (secondaryErr) {
          netError = secondaryErr;
        }
      }
    } finally {
      clearTimeout(timeoutTimer);
    }

    // 2. Handle complete network/timeout failures
    if (!res) {
      if (netError?.name === 'AbortError') {
        throw new Error('AI processing timed out after 90 seconds. The server took longer than expected to process the image.');
      }
      throw new Error(netError?.message || 'Unable to connect to the server. Please ensure the backend is running on port 3001.');
    }

    // 3. Read body text safely to prevent "Unexpected end of JSON input"
    let rawText = '';
    try {
      rawText = await res.text();
    } catch (readErr) {
      throw new Error(`Failed to read response from server (HTTP ${res.status}): ${readErr.message}`);
    }

    let parsedData = null;
    if (rawText && rawText.trim().length > 0) {
      try {
        parsedData = JSON.parse(rawText);
      } catch (jsonParseErr) {
        console.error('Non-JSON response received from server:', rawText);
        throw new Error(`Server returned an invalid response (HTTP ${res.status}). Ensure the backend server is running on port 3001.`);
      }
    } else {
      throw new Error(`Server returned an empty response (HTTP ${res.status}). Ensure the backend server is running on port 3001.`);
    }

    // 4. Validate success status
    if (!res.ok || parsedData?.success === false) {
      const errMsg = parsedData?.error || parsedData?.details || `Request failed with status ${res.status}`;
      throw new Error(errMsg);
    }

    return parsedData;
  };

  // STEP 1 HANDLER: Send image to POST /api/ai/scan
  const handleScanAnimal = async (e) => {
    e?.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select or capture a wildlife photo first.');
      return;
    }

    setIsScanning(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const data = await safeFetchJson(
        '/api/ai/scan',
        'http://localhost:3001/api/ai/scan',
        {
          method: 'POST',
          body: formData
        },
        90000
      );

      console.log('AI Scan result:', data);
      setScanResult(data);
      setEditableSpecies(data.species && data.species !== 'Unknown' ? data.species : '');
      setStep(2); // Transition to Step 2 Review & Name

    } catch (err) {
      console.error('Scan failed:', err);
      setErrorMessage(err.message || 'AI scanner could not process image. Please check your network.');
    } finally {
      setIsScanning(false);
    }
  };

  // STEP 2 HANDLER: Send finalized data to POST /api/upload
  const handleConfirmSighting = async (e) => {
    e?.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Image buffer missing. Please re-select the image.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Determine effective user.id from Supabase Auth or localStorage
      let userId = user?.id || user?.user_id || localStorage.getItem('user_id') || '';
      if (!userId) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user?.id) {
            userId = data.session.user.id;
          }
        } catch (authLookupErr) {
          console.warn('User ID lookup notice:', authLookupErr);
        }
      }

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('lat', coords.latitude.toString());
      formData.append('lng', coords.longitude.toString());
      
      const speciesToSend = editableSpecies.trim() || scanResult?.species || 'Unknown';
      formData.append('species', speciesToSend);

      // If matched, send petId
      if (scanResult?.match && scanResult?.petId) {
        formData.append('petId', scanResult.petId);
      }

      // If user typed a new pet name to register on the fly, send newPetName
      if (newPetName.trim()) {
        formData.append('newPetName', newPetName.trim());
      }

      if (userId) {
        formData.append('user_id', userId);
      }

      const token = user?.token || localStorage.getItem('animalhuzz_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const data = await safeFetchJson(
        '/api/upload',
        'http://localhost:3001/api/upload',
        {
          method: 'POST',
          headers,
          body: formData
        },
        60000
      );

      console.log('Sighting confirmed & uploaded:', data);

      // Trigger feed & map reload
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }

      // Trigger styled success toast
      if (onShowToast) {
        onShowToast({
          species: data.species_tag || speciesToSend,
          petName: data.pet_name || (newPetName.trim() ? newPetName.trim() : (scanResult?.match ? scanResult.petName : null)),
          matchScore: scanResult?.matchScore || null,
          isNewPet: !!newPetName.trim(),
          imageUrl: data.image_url,
          latitude: data.latitude,
          longitude: data.longitude
        });
      }

      // Close modal and reset
      onClose();
      resetForm();

    } catch (err) {
      console.error('Confirm sighting failed:', err);
      setErrorMessage(err.message || 'Failed to record sighting in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed backdrop with smooth blur */}
      <div 
        onClick={(!isScanning && !isSubmitting) ? onClose : undefined}
        className="fixed inset-0 bg-[#1A1816]/70 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-[#E8E2D9] overflow-hidden my-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Subtle decorative top warm accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FF6B4A] via-[#FFA07A] to-[#201E1D]" />

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-[#F0EBE1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
                  {step === 1 ? 'Smart Wildlife Upload' : 'AI Verification & Sighting'}
                </h3>
                <span className="text-[10px] uppercase font-black tracking-wider bg-[#FF6B4A] text-white px-2 py-0.5 rounded-full">
                  Step {step} of 2
                </span>
              </div>
              <p className="text-xs text-[#7A7369]">
                {step === 1 
                  ? 'Select photo & lock GPS to scan face with Gemini & CLIP' 
                  : 'Review AI match or register pet name before cloud recording'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isScanning || isSubmitting}
            className="w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE1] text-[#7A7369] hover:text-[#201E1D] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =================================================================== */}
        {/* STEP 1: SCAN ANIMAL                                                 */}
        {/* =================================================================== */}
        {step === 1 && (
          <form onSubmit={handleScanAnimal} className="p-6 sm:p-8 space-y-6">
            
            {/* File Dropzone & Preview */}
            <div>
              <label className="block text-xs font-bold text-[#453F38] uppercase tracking-wider mb-2">
                Sighting Photograph <span className="text-[#FF6B4A]">*</span>
              </label>

              {previewUrl ? (
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#EBE4D8] bg-[#FAF7F2] aspect-[16/10] group">
                  <img 
                    src={previewUrl} 
                    alt="Sighting preview" 
                    className="w-full h-full object-cover"
                  />

                  {!isScanning && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 transition-opacity p-4 flex flex-col justify-between">
                      <div className="self-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="bg-white/90 hover:bg-white text-red-600 rounded-full p-2 text-xs font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="truncate max-w-[200px] font-semibold">
                          {selectedFile?.name}
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium">
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
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[#201E1D] mb-1">
                    Drag and drop animal photo, or <span className="text-[#FF6B4A] underline underline-offset-2">browse</span>
                  </h4>
                  <p className="text-xs text-[#8C8479] max-w-xs mx-auto leading-relaxed">
                    Supports high-resolution camera photos (JPEG, PNG, WEBP up to 20MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />
            </div>

            {/* Geolocation Coordinates Box */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#ECE5D8] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    geoStatus === 'locked' 
                      ? 'bg-emerald-500 ring-4 ring-emerald-100' 
                      : geoStatus === 'acquiring'
                      ? 'bg-amber-500 animate-ping'
                      : 'bg-[#FF6B4A]'
                  }`} />
                  <span className="text-xs font-bold text-[#453F38] uppercase tracking-wider">
                    GPS Coordinates
                  </span>
                </div>

                {geoStatus !== 'acquiring' && (
                  <button
                    type="button"
                    onClick={acquireCoordinates}
                    className="text-[11px] font-bold text-[#FF6B4A] hover:text-[#E55737] flex items-center gap-1 cursor-pointer"
                    title="Refresh GPS"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-acquire</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {geoStatus === 'acquiring' ? (
                  <div className="flex items-center gap-2 text-[#7A7369] font-medium py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B4A]" />
                    <span>Requesting live satellite GPS pin...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-white border border-[#E2DBD0] px-3 py-1.5 rounded-xl font-mono text-[#201E1D] font-bold text-xs shadow-2xs">
                      📍 {coords.latitude}° N, {coords.longitude}° E
                    </div>
                    {geoStatus === 'locked' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                        <Check className="w-3 h-3" />
                        GPS Satellite Locked
                      </span>
                    )}
                    {geoStatus === 'denied' && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl" title={geoError}>
                        <Info className="w-3 h-3" />
                        Campus Quad Pin
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* AI Scanning Loader Status */}
            {isScanning && (
              <div className="p-4 bg-[#FAF5EE] rounded-3xl border border-[#FFDEC9] flex items-center gap-3.5 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-[#201E1D]">
                    AI is analyzing face & species...
                  </div>
                  <div className="text-[11px] text-[#7A7369]">
                    Querying Gemini Vision multimodal model & Pinecone 512D facial vector index
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isScanning}
                className="px-5 py-3 rounded-full text-xs font-bold text-[#6B6359] hover:bg-[#FAF5EE] transition-colors cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedFile || isScanning}
                className="flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#E55737] disabled:bg-[#D5CDC2] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI is analyzing face & species...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Animal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* =================================================================== */}
        {/* STEP 2: REVIEW & NAME                                               */}
        {/* =================================================================== */}
        {step === 2 && (
          <form onSubmit={handleConfirmSighting} className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Image Preview & Coordinates Strip */}
            <div className="flex items-center gap-4 p-3 bg-[#FAF7F2] rounded-3xl border border-[#ECE5D8]">
              {previewUrl && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E5DDD2] bg-black/5">
                  <img src={previewUrl} alt="Scan target" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#201E1D] truncate">
                  {selectedFile?.name || 'Sighting Capture'}
                </div>
                <div className="text-[11px] text-[#7A7369] font-mono">
                  📍 {coords.latitude}° N, {coords.longitude}° E
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="text-[11px] font-bold text-[#FF6B4A] hover:text-[#E55737] flex items-center gap-1 cursor-pointer pt-0.5"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change photo or rescan</span>
                </button>
              </div>
            </div>

            {/* Case A: MATCH FOUND */}
            {scanResult?.match === true ? (
              <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-3xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block">
                      Pinecone Face Recognition Match
                    </span>
                    <h4 className="text-lg font-extrabold text-[#201E1D] font-['Outfit']">
                      Match Found: <span className="text-emerald-700">{scanResult.petName}</span> ({scanResult.species})
                    </h4>
                    <p className="text-xs text-[#59534B] leading-relaxed">
                      Facial feature similarity exceeded 85% threshold. This observation will be logged to official resident pet <strong>{scanResult.petName}</strong>'s campus timeline.
                    </p>
                  </div>
                </div>

                {scanResult.matchScore && (
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <span>Vector Confidence:</span>
                    <span className="bg-emerald-100 px-2 py-0.5 rounded-md">
                      {(scanResult.matchScore * 100).toFixed(1)}% Match
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Case B: NO MATCH FOUND (UNRECOGNIZED) */
              <div className="space-y-4">
                <div className="p-5 bg-[#FFF7F0] border border-[#FFDEC9] rounded-3xl space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B4A] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full inline-block">
                        New Campus Discovery
                      </span>
                      <h4 className="text-base font-extrabold text-[#201E1D] font-['Outfit']">
                        Unrecognized {scanResult?.species || 'Animal'} found!
                      </h4>
                      <p className="text-xs text-[#635B52] leading-relaxed">
                        Give it a name to register it as an official campus pet, or leave blank to save as a generic sighting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input for new pet name */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="new-pet-name" 
                    className="block text-xs font-bold text-[#453F38] uppercase tracking-wider"
                  >
                    Name this pet <span className="text-[10px] text-[#8C8479] font-normal normal-case">(Optional - registers new face)</span>
                  </label>
                  <input
                    id="new-pet-name"
                    type="text"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g., Bruno, Professor Paws, Mochi..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E2DBD0] text-[#201E1D] font-medium text-sm placeholder-[#9C9488] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all disabled:opacity-50"
                  />
                  {newPetName.trim() && (
                    <p className="text-[11px] text-[#FF6B4A] font-semibold flex items-center gap-1 pt-0.5">
                      <Check className="w-3 h-3" />
                      Will be registered as official campus pet "{newPetName.trim()}" in Pinecone vector DB!
                    </p>
                  )}
                </div>

                {/* Optional species fine-tuning */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="species-tag" 
                    className="block text-xs font-bold text-[#453F38] uppercase tracking-wider"
                  >
                    Species Tag
                  </label>
                  <input
                    id="species-tag"
                    type="text"
                    value={editableSpecies}
                    onChange={(e) => setEditableSpecies(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g., Golden Retriever, Stray Dog, Macaque..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E2DBD0] text-[#201E1D] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-full text-xs font-bold text-[#6B6359] hover:bg-[#FAF5EE] transition-colors cursor-pointer disabled:opacity-40"
              >
                Back to Scan
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#E55737] disabled:bg-[#D5CDC2] text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Recording Sighting to Cloud...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>
                      {newPetName.trim() ? `Confirm & Register "${newPetName.trim()}"` : 'Confirm Sighting'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

/**
 * Styled Success Toast Component
 */
export function SightingSuccessToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 bg-white/95 backdrop-blur-xl border border-emerald-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-6 fade-in duration-300">
      <div className="flex items-start gap-3.5">
        
        {/* Photo thumbnail or icon */}
        {toast.imageUrl ? (
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-emerald-100 shadow-2xs">
            <img 
              src={toast.imageUrl} 
              alt="Sighting" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        )}

        {/* Toast details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {toast.isNewPet ? 'New Campus Pet Registered!' : 'Sighting Logged'}
            </span>
            {toast.matchScore && (
              <span className="text-[10px] font-bold text-[#FF6B4A] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
                Face Match {(toast.matchScore * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Gemini species tag */}
          <div className="text-sm font-extrabold text-[#201E1D] font-['Outfit'] truncate">
            ✨ {toast.species}
          </div>

          {/* Pinecone pet match or registration */}
          {toast.petName ? (
            <div className="text-xs font-bold text-[#FF6B4A] mt-0.5 flex items-center gap-1">
              <span>🐾 {toast.isNewPet ? 'Registered Pet:' : 'Recognized Campus Pet:'}</span>
              <span className="underline decoration-2">{toast.petName}</span>
            </div>
          ) : (
            <div className="text-[11px] text-[#7A7369] mt-0.5">
              Live location pinned on Campus GIS Map
            </div>
          )}
        </div>

        {/* Close toast button */}
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-[#FAF5EE] hover:bg-[#EDE6DA] text-[#7A7369] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
