import React, { useState } from 'react';
import { 
  X, Mail, Lock, Sparkles, LogIn, UserPlus, AlertCircle, 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Compass 
} from 'lucide-react';
import { supabase } from '../utils/supabase';

// 5 beautifully styled companion avatar choices
export const SCOUT_CHARACTERS = [
  {
    id: 'fox',
    emoji: '🦊',
    name: 'Rusty the Fox',
    tagline: 'Swift & Curious',
    desc: 'Lawn & Woodland Trail Scout',
    bgColor: 'bg-orange-50 text-orange-600',
    borderColor: 'border-orange-200'
  },
  {
    id: 'owl',
    emoji: '🦉',
    name: 'Athena the Owl',
    tagline: 'Keen & Observant',
    desc: 'Night Canopy & Tree Spotter',
    bgColor: 'bg-amber-50 text-amber-700',
    borderColor: 'border-amber-200'
  },
  {
    id: 'bear',
    emoji: '🐻',
    name: 'Barnaby the Bear',
    tagline: 'Gentle & Resilient',
    desc: 'Quad Protector & Nature Scout',
    bgColor: 'bg-yellow-50 text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: 'Mochi the Lynx',
    tagline: 'Agile & Silent',
    desc: 'Secret Pathways Explorer',
    bgColor: 'bg-rose-50 text-rose-600',
    borderColor: 'border-rose-200'
  },
  {
    id: 'dog',
    emoji: '🐶',
    name: 'Major the Pariah',
    tagline: 'Loyal & Friendly',
    desc: 'Campus Quad Ambassador',
    bgColor: 'bg-emerald-50 text-emerald-700',
    borderColor: 'border-emerald-200'
  }
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  
  // Multi-step signup state: 1 (Scout Name) -> 2 (Scout Character) -> 3 (Account Details) -> 4 (Verification Result)
  const [step, setStep] = useState(1);
  const [scoutName, setScoutName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(SCOUT_CHARACTERS[0]);
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Sync initialMode if opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setError('');
      if (initialMode === 'signup') {
        setStep(1);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const resetSignupState = () => {
    setStep(1);
    setScoutName('');
    setSelectedCharacter(SCOUT_CHARACTERS[0]);
    setEmail('');
    setPassword('');
    setError('');
    setVerificationSuccess(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    if (newMode === 'signup') {
      resetSignupState();
    }
  };

  // STEP 1 VALIDATION -> Next to Step 2
  const handleNextFromStep1 = (e) => {
    if (e) e.preventDefault();
    if (!scoutName.trim()) {
      setError('Please tell us your scout name or handle to continue.');
      return;
    }
    setError('');
    setStep(2);
  };

  // STEP 2 VALIDATION -> Next to Step 3
  const handleNextFromStep2 = () => {
    if (!selectedCharacter) {
      setError('Please choose a companion character for your journey.');
      return;
    }
    setError('');
    setStep(3);
  };

  // STEP 3: SUBMIT SIGNUP (SUPABASE SIGNUP & ONBOARDING)
  const handleSignUpSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    // Strict domain validation
    if (!email.trim() || !password) {
      setError('Please enter both your university email and a secure password.');
      return;
    }

    if (!email.toLowerCase().endsWith('@universalai.in')) {
      setError('Access restricted. Please use your @universalai.in university email.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 4: Call supabase.auth.signUp() with name and avatar in options.data
      const { data, error: sbError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: scoutName.trim(),
            avatar: selectedCharacter.id,
            avatar_emoji: selectedCharacter.emoji,
            companion_name: selectedCharacter.name
          }
        }
      });

      if (sbError) {
        throw sbError;
      }

      const token = data.session?.access_token;

      if (token) {
        // Instant login if auto-confirm is enabled
        const userObj = {
          token,
          email: email.trim(),
          scoutName: scoutName.trim(),
          avatar: selectedCharacter.id,
          avatarEmoji: selectedCharacter.emoji,
          companionName: selectedCharacter.name
        };
        localStorage.setItem('animalhuzz_token', token);
        localStorage.setItem('user_email', email.trim());
        localStorage.setItem('scout_name', scoutName.trim());
        localStorage.setItem('scout_avatar', selectedCharacter.id);
        localStorage.setItem('scout_avatar_emoji', selectedCharacter.emoji);

        if (onAuthSuccess) {
          onAuthSuccess(userObj);
        }
        onClose();
      } else {
        // Step 4 Verification Screen: Confirmation email sent
        setVerificationSuccess(true);
        setStep(4);
      }
    } catch (err) {
      console.error('Supabase signup error:', err);
      setError(err.message || 'Failed to create scout account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN HANDLER
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your university email and password.');
      return;
    }

    // Strict domain validation check
    if (!email.toLowerCase().endsWith('@universalai.in')) {
      setError('Access restricted. Please use your @universalai.in university email.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (sbError) {
        throw sbError;
      }

      const token = data.session?.access_token;

      if (token) {
        const metadata = data.user?.user_metadata || {};
        const storedName = metadata.full_name || email.trim().split('@')[0];
        const storedAvatarId = metadata.avatar || 'fox';
        const companionMatch = SCOUT_CHARACTERS.find(c => c.id === storedAvatarId) || SCOUT_CHARACTERS[0];

        const userObj = {
          token,
          email: email.trim(),
          scoutName: storedName,
          avatar: storedAvatarId,
          avatarEmoji: companionMatch.emoji,
          companionName: metadata.companion_name || companionMatch.name
        };

        localStorage.setItem('animalhuzz_token', token);
        localStorage.setItem('user_email', email.trim());
        localStorage.setItem('scout_name', storedName);
        localStorage.setItem('scout_avatar', storedAvatarId);
        localStorage.setItem('scout_avatar_emoji', companionMatch.emoji);

        if (onAuthSuccess) {
          onAuthSuccess(userObj);
        }
        onClose();
      } else {
        throw new Error('Could not establish an active session. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Supabase login error:', err);
      setError(err.message || 'Authentication error. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 md:p-9 border border-[#E8DECC] shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE3] text-[#4A443D] flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B4A] bg-[#FFF0EB] px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>WildLens Campus Scout Network</span>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
              {mode === 'login' ? 'Scout Sign In' : 'Join the Scouts'}
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#FAF7F2] p-1 rounded-2xl mt-4 border border-[#EDE7DD]">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#201E1D] shadow-xs'
                  : 'text-[#7A7369] hover:text-[#201E1D]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#201E1D] shadow-xs'
                  : 'text-[#7A7369] hover:text-[#201E1D]'
              }`}
            >
              Multi-Step Onboarding
            </button>
          </div>
        </div>

        {/* Inline Error Message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODE: LOGIN FORM                                                    */}
        {/* ==================================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-[#6B635A] -mt-1">
              Sign in with your university credentials to view the live GPS observation map and submit wildlife sightings.
            </p>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider">
                  University Email
                </label>
                <span className="text-[10px] font-bold text-[#FF6B4A] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
                  @universalai.in Only
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@universalai.in"
                  className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#201E1D] focus:outline-none focus:border-[#FF6B4A] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#201E1D] focus:outline-none focus:border-[#FF6B4A] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6B4A] hover:bg-[#E55737] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating Credentials...</span>
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Enter Scout Dashboard</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-xs font-bold text-[#FF6B4A] hover:underline cursor-pointer"
              >
                New scout on campus? Start personalized onboarding →
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* MODE: SIGNUP MULTI-STEP ONBOARDING                                  */}
        {/* ==================================================================== */}
        {mode === 'signup' && (
          <div className="space-y-4">
            {/* Step Progress Pill Indicator */}
            {step < 4 && (
              <div className="flex items-center justify-between gap-2 py-2 px-3 bg-[#FAF7F2] rounded-2xl border border-[#EDE7DD]">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                          step === s
                            ? 'bg-[#FF6B4A] text-white shadow-xs scale-105'
                            : step > s
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#E5DCD0] text-[#7A7369]'
                        }`}
                      >
                        {step > s ? '✓' : s}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-[#201E1D]">
                    {step === 1 && 'Step 1: Scout Identity'}
                    {step === 2 && 'Step 2: Choose Companion'}
                    {step === 3 && 'Step 3: University Credentials'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#8C8479]">
                  {step} of 3
                </span>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 1: SCOUT NAME                                             */}
            {/* -------------------------------------------------------------- */}
            {step === 1 && (
              <form onSubmit={handleNextFromStep1} className="space-y-4 pt-1 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#201E1D] font-['Outfit']">
                    First, what should we call you?
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B635A]">
                    Every scout needs a field moniker or name for campus leaderboards and sightings.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-2">
                    Scout Name
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={scoutName}
                    onChange={(e) => setScoutName(e.target.value)}
                    placeholder="e.g., Scout Rohan, Ranger Arya, or Maya"
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl px-4 py-3.5 text-base font-semibold text-[#201E1D] focus:outline-none focus:border-[#FF6B4A] focus:bg-white transition-colors"
                  />
                  <p className="text-[11px] text-[#8C8479] mt-2">
                    This will appear next to your mapped wildlife contributions.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#FF6B4A] hover:bg-[#E55737] text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Choose Companion</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 2: CHOOSE SCOUT CHARACTER                                  */}
            {/* -------------------------------------------------------------- */}
            {step === 2 && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#201E1D] font-['Outfit']">
                    Every explorer needs a companion.
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B635A]">
                    Select an animal totem to accompany your campus wildlife observations.
                  </p>
                </div>

                {/* Grid of 5 companion avatar cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {SCOUT_CHARACTERS.map((char) => {
                    const isSelected = selectedCharacter?.id === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => setSelectedCharacter(char)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative ${
                          isSelected
                            ? 'border-2 border-[#FF6B4A] bg-[#FFF0EB] shadow-sm ring-2 ring-[#FF6B4A]/20'
                            : 'border-[#E5DCD0] bg-[#FAF7F2] hover:bg-[#F7F2EA]'
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl shrink-0 p-2 rounded-xl bg-white shadow-xs">
                          {char.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs sm:text-sm text-[#201E1D] truncate">
                              {char.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] shrink-0 ml-1" />
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-[#FF6B4A] truncate">
                            {char.tagline}
                          </p>
                          <p className="text-[10px] text-[#7A7369] truncate">
                            {char.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Companion Preview Pill */}
                {selectedCharacter && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DCD0] flex items-center justify-between text-xs">
                    <span className="text-[#6B635A]">Companion chosen:</span>
                    <span className="font-extrabold text-[#201E1D] flex items-center gap-1.5">
                      <span>{selectedCharacter.emoji}</span>
                      <span>{selectedCharacter.name}</span>
                    </span>
                  </div>
                )}

                {/* Step 2 Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(1); }}
                    className="px-4 py-3 rounded-2xl border border-[#EDE5DA] text-xs font-bold text-[#635B52] hover:bg-[#FAF7F2] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromStep2}
                    className="flex-1 bg-[#FF6B4A] hover:bg-[#E55737] text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Account Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 3: ACCOUNT DETAILS                                        */}
            {/* -------------------------------------------------------------- */}
            {step === 3 && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4 pt-1 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#201E1D] font-['Outfit']">
                    Scout Credentials
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B635A]">
                    Enter your official university email & create a password to link your scout identity.
                  </p>
                </div>

                {/* Scout Profile Summary Pill */}
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DCD0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedCharacter?.emoji}</span>
                    <div>
                      <span className="font-bold text-[#201E1D] block">{scoutName}</span>
                      <span className="text-[10px] text-[#7A7369]">{selectedCharacter?.name}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-[#FF6B4A] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* University Email with Strict Validation Tag */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider">
                      University Email
                    </label>
                    <span className="text-[10px] font-bold text-[#FF6B4A] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
                      @universalai.in Only
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@universalai.in"
                      className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#201E1D] focus:outline-none focus:border-[#FF6B4A] focus:bg-white transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[10px] text-[#8C8479] mt-1">
                    Strict campus validation: Only addresses ending in @universalai.in can register.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-[#4A443D] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#201E1D] focus:outline-none focus:border-[#FF6B4A] focus:bg-white transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(2); }}
                    disabled={isLoading}
                    className="px-4 py-3 rounded-2xl border border-[#EDE5DA] text-xs font-bold text-[#635B52] hover:bg-[#FAF7F2] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#FF6B4A] hover:bg-[#E55737] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Registering Scout...</span>
                      </span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 4: SUPABASE SIGNUP & VERIFICATION CONFIRMATION            */}
            {/* -------------------------------------------------------------- */}
            {step === 4 && (
              <div className="space-y-5 py-4 text-center animate-in fade-in duration-300">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFF0EB] border-2 border-[#FFD8CD] flex items-center justify-center text-4xl shadow-sm">
                  {selectedCharacter?.emoji}
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-2xl font-extrabold text-[#201E1D] font-['Outfit']">
                    Scout Credentials Dispatched!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B635A] max-w-sm mx-auto leading-relaxed">
                    We registered <span className="font-bold text-[#201E1D]">{scoutName}</span> with companion <span className="font-bold text-[#201E1D]">{selectedCharacter?.name}</span>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DD] text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#201E1D]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verification email sent to:</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5DCD0] font-mono text-xs text-[#FF6B4A] font-semibold break-all">
                    {email}
                  </div>
                  <p className="text-[11px] text-[#7A7369]">
                    Please check your university inbox and click the verification link to activate your scout privileges.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setStep(1);
                    }}
                    className="w-full bg-[#201E1D] hover:bg-[#FF6B4A] text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Proceed to Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Domain restriction note */}
        <div className="mt-5 pt-4 border-t border-[#F0EBE1] text-center">
          <p className="text-[11px] text-[#8C8479] flex items-center justify-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized access for Universal AI University students & staff</span>
          </p>
        </div>
      </div>
    </div>
  );
}
