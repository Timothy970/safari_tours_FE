'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mountain, User, Mail, Phone, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/portal';

  const { user, register, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace(redirectUrl);
    }
  }, [isAuthLoading, user, redirectUrl, router]);

  const validate = () => {
    const errs: { fullName?: string; email?: string; phone?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validates Kenyan format (07..., 01..., +2547..., +2541...) or international phone (+XXX...)
    const phoneRegex = /^(?:(?:\+?254|0)[17]\d{8}|\+?[1-9]\d{8,14})$/;

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full legal name.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. explorer@example.com).';
    }

    if (!phone.trim()) {
      errs.phone = 'M-Pesa phone number is required for booking dispatches.';
    } else {
      const cleanPhone = phone.trim().replace(/[\s-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        errs.phone = 'Please enter a valid mobile number (e.g. 0712345678 or +254712345678).';
      }
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Validation Error', 'Please check and correct the highlighted fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phone.trim().replace(/[\s-]/g, ''),
        password,
      });

      if (res.success) {
        showToast('success', 'Welcome to Kibali Africa!', '100 Welcome Reward Points credited to your profile.');
        router.push(redirectUrl);
      } else {
        showToast('error', 'Registration Failed', res.error || 'Could not register account.');
      }
    } catch {
      showToast('error', 'Error', 'Failed to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FCFBF9]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] border border-emerald-200 mx-auto mb-3 flex items-center justify-center shadow-sm">
            <Mountain className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F1D36]">Create Your Adventurer Profile</h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Join Kibali Africa to book hikes, access group chats, and receive verified QR boarding passes.
          </p>
        </div>

        {/* Welcome Points Badge */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950">
          <span>
            Earn <strong>100 Reward Points</strong> instantly upon registration!
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.fullName ? 'text-rose-500' : 'text-slate-400'}`} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder="e.g. Jane Goodall"
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F1D36] focus:outline-none transition-colors ${
                  errors.fullName
                    ? 'bg-rose-50/40 border border-rose-400 focus:border-rose-500 text-rose-900'
                    : 'bg-slate-50 border border-slate-200 focus:border-[#15803D]'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email ? 'text-rose-500' : 'text-slate-400'}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="explorer@example.com"
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F1D36] focus:outline-none transition-colors ${
                  errors.email
                    ? 'bg-rose-50/40 border border-rose-400 focus:border-rose-500 text-rose-900'
                    : 'bg-slate-50 border border-slate-200 focus:border-[#15803D]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number (M-Pesa enabled) *
            </label>
            <div className="relative">
              <Phone className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-rose-500' : 'text-slate-400'}`} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="0712345678 or +254712345678"
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F1D36] focus:outline-none transition-colors ${
                  errors.phone
                    ? 'bg-rose-50/40 border border-rose-400 focus:border-rose-500 text-rose-900'
                    : 'bg-slate-50 border border-slate-200 focus:border-[#15803D]'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password ? 'text-rose-500' : 'text-slate-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="At least 6 characters"
                className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0F1D36] focus:outline-none transition-colors ${
                  errors.password
                    ? 'bg-rose-50/40 border border-rose-400 focus:border-rose-500 text-rose-900'
                    : 'bg-slate-50 border border-slate-200 focus:border-[#15803D]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md glow-green transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <span>Create Explorer Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Already registered? </span>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-[#15803D] font-bold hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-[#FCFBF9]">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
