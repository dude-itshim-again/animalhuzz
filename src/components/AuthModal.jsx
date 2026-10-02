import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Login handler with strict @universalai.in validation
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (!email.toLowerCase().endsWith('@universalai.in')) {
      setError('Access restricted. Please use your @universalai.in university email.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

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
        localStorage.setItem('animalhuzz_token', token);
        localStorage.setItem('user_email', email.trim());
        if (onAuthSuccess) {
          onAuthSuccess({ token, email: email.trim() });
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

  // Sign up handler with strict @universalai.in validation
  const handleSignUp = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (!email.toLowerCase().endsWith('@universalai.in')) {
      setError('Access restricted. Please use your @universalai.in university email.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const { data, error: sbError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password
      });

      if (sbError) {
        throw sbError;
      }

      const token = data.session?.access_token;

      if (token) {
        localStorage.setItem('animalhuzz_token', token);
        localStorage.setItem('user_email', email.trim());
        if (onAuthSuccess) {
          onAuthSuccess({ token, email: email.trim() });
        }
        onClose();
      } else {
        setSuccessMsg('Account registered! Please check your university email to confirm registration, then log in.');
        setMode('login');
      }
    } catch (err) {
      console.error('Supabase signup error:', err);
      setError(err.message || 'Failed to create scout account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] max-w-md w-full p-7 sm:p-9 border border-[#E8DECC] shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE3] text-[#4A443D] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B4A] bg-[#FFF0EB] px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Wildlife Scout</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#201E1D] font-['Outfit'] tracking-tight">
            {mode === 'signup' ? 'Create Scout Account' : 'Welcome Back, Scout'}
          </h3>
          <p className="text-xs sm:text-sm text-[#6B635A]">
            {mode === 'signup' 
              ? 'Join university students in spotting, tagging, and caring for campus fauna.'
              : 'Sign in to record sightings, earn badges, and climb the scout leaderboard.'}
          </p>
        </div>

        {/* Tabs: Login / Signup */}
        <div className="flex bg-[#FAF7F2] p-1 rounded-2xl mb-5 border border-[#EDE7DD]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#201E1D] shadow-xs'
                : 'text-[#7A7369] hover:text-[#201E1D]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#201E1D] shadow-xs'
                : 'text-[#7A7369] hover:text-[#201E1D]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'signup' ? handleSignUp : handleLogin} className="space-y-4">
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
                <span>Validating with Supabase...</span>
              </span>
            ) : mode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Scout Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In to Tracker</span>
              </>
            )}
          </button>
        </form>

        {/* Security & Domain restriction note */}
        <div className="mt-5 pt-4 border-t border-[#F0EBE1] text-center space-y-1">
          <p className="text-[11px] text-[#8C8479] flex items-center justify-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized access for Universal AI University students & staff</span>
          </p>
        </div>
      </div>
    </div>
  );
}
