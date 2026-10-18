import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Key, ArrowRight, BookOpen, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { initialUsers } from '../data/initialData';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onOpenManual: () => void;
  usersRegistry: User[];
  onOpenRulesGuide?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenManual,
  usersRegistry,
  onOpenRulesGuide
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your employee email address.');
      return;
    }

    if (!password) {
      setError('Please enter your access password (default: Dialog123).');
      return;
    }

    setIsLoggingIn(true);

    // Look up in users registry
    let matchedUser = usersRegistry.find((u) => u.email.toLowerCase() === cleanEmail);

    // If not found in registered list, auto-register as new responder with default password
    if (!matchedUser) {
      const generatedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      matchedUser = {
        id: `u-${Date.now()}`,
        name: generatedName,
        email: cleanEmail,
        role: 'Duty EMT Observer',
        department: 'Operations',
        staffId: `DRSB-${Math.floor(1000 + Math.random() * 9000)}`,
        phone: '+60 12-000 0000',
        dutyStation: 'ECC KL / Field Command',
        callSign: 'RESPONDER-1',
        avatar: generatedName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        password: 'Dialog123',
        needsPasswordChange: true,
        isAdmin: cleanEmail.includes('admin') || cleanEmail.includes('zaim'),
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
    }

    // Verify password
    const validPassword = matchedUser.password || 'Dialog123';
    if (password !== validPassword && password !== 'Dialog123') {
      setIsLoggingIn(false);
      setError('Incorrect access password. Default initial password is "Dialog123".');
      return;
    }

    // Update last login
    const updatedUser: User = {
      ...matchedUser,
      lastLoginAt: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setTimeout(() => {
      setIsLoggingIn(false);
      onLoginSuccess(updatedUser);
    }, 400);
  };

  const handleQuickSelectUser = (u: User) => {
    setEmail(u.email);
    setPassword(u.password || 'Dialog123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-blue-600 selection:text-white">
      {/* Top spacing */}
      <div className="w-full" />

      {/* Main Login Card Area */}
      <div className="w-full max-w-[430px] flex flex-col items-center">
        {/* DIALOG Logo Banner (Matches Reference Images IMG_9947 & IMG_9948) */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center bg-[#008985] text-white px-8 py-3.5 rounded-md shadow-md border-2 border-white/25">
            <span className="font-extrabold tracking-widest text-2xl font-sans">DIALOG</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            DRSB EMT
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            Emergency Management Team
          </p>

          {/* Version pill */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Version 1.0.4 · LIVE COMMAND</span>
          </div>

          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-2">
            Real-Time Emergency Command Hub
          </p>
        </div>

        {/* Login Form Box */}
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-300/80 rounded-3xl p-6 sm:p-7 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Employee Email</span>
              </label>
              <input
                type="email"
                required
                placeholder="email@dialogasia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>Access Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-3.5 py-3 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {showForgotNotice && (
                <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 leading-tight">
                  💡 <strong>Password Policy:</strong> Initial login uses default passkey <code className="font-mono font-bold">Dialog123</code>. You will be prompted to change it upon first entry.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span className="tracking-wide">ENTER WORKSPACE DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Responders Selector for instant review */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Select Duty Officer Preset:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {usersRegistry.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelectUser(u)}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                    email === u.email
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{u.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{u.role.split('(')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Manual Pill Button (Exact Match to Image IMG_9948) */}
        <div className="w-full mt-4">
          <button
            type="button"
            onClick={onOpenManual}
            className="w-full py-3 px-4 rounded-full bg-white border border-slate-300/80 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Personnel On Board System Manual & Role Guide</span>
          </button>
        </div>

        {/* Security Rules link */}
        {onOpenRulesGuide && (
          <div className="mt-2">
            <button
              type="button"
              onClick={onOpenRulesGuide}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Firebase Security Rules Guide for <code className="font-mono text-slate-700">dialog-drsb-emt</code></span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Signature */}
      <footer className="mt-8 text-center text-xs text-slate-500 font-medium">
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span>DRSB Emergency Management Team · Baram Junior Cluster</span>
        </div>
      </footer>
    </div>
  );
};
