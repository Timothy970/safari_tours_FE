'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mountain, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams.get('redirect');

  const { user, login, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) {
      if (explicitRedirect && explicitRedirect !== '/portal') {
        router.replace(explicitRedirect);
      } else if (user.role === 'admin' || user.role === 'super_admin') {
        router.replace('/admin');
      } else {
        router.replace('/portal');
      }
    }
  }, [isAuthLoading, user, explicitRedirect, router]);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. explorer@example.com).';
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
      showToast('error', 'Validation Error', 'Please correct the highlighted errors before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        showToast('success', 'Welcome Back!', 'Successfully signed in to Kibali Africa.');
        const loggedUser = res.user;
        const isAdminUser = loggedUser?.role === 'admin' || loggedUser?.role === 'super_admin';
        if (explicitRedirect && explicitRedirect !== '/portal') {
          router.push(explicitRedirect);
        } else if (isAdminUser) {
          router.push('/admin');
        } else {
          router.push('/portal');
        }
      } else {
        showToast('error', 'Authentication Failed', res.error || 'Invalid email or password.');
      }
    } catch {
      showToast('error', 'Connection Error', 'Cannot reach authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FCFBF9]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] border border-emerald-200 p-0.5 mx-auto mb-3 flex items-center justify-center shadow-sm">
            <Mountain className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F1D36]">Sign In to Kibali Portal</h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Access your event tickets, QR boarding passes, group chats, and photo vault.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-rose-500' : 'text-slate-400'}`} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs text-[#0F1D36] focus:outline-none transition-colors ${
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.password ? 'text-rose-500' : 'text-slate-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs text-[#0F1D36] focus:outline-none transition-colors ${
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
            className="w-full py-3 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md glow-green transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-2 border-t border-slate-100 space-y-2">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/auth/register" className="font-bold text-[#15803D] hover:underline">
              Join Kibali Tribe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-[#FCFBF9]">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
