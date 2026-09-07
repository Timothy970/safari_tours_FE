'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Camera, User as UserIcon, Menu, X, ChevronDown, LogOut, Sliders, Luggage, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSiteSettings();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/about', label: 'About Us' },
    { href: '/policies', label: 'Policies & Terms' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Dynamic Top Announcement Banner if enabled */}
      {settings.announcement_banner_active && settings.announcement_banner_text && (
        <div className="bg-gradient-to-r from-[#062013] via-[#092B1B] to-[#0B3B24] text-[#FCFBF9] text-[11px] font-medium py-1.5 px-4 text-center border-b border-emerald-900/30 flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
          <span>{settings.announcement_banner_text}</span>
          <span className="hidden md:inline text-emerald-400">&bull; Call: {settings.primary_phone}</span>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          settings.announcement_banner_active && settings.announcement_banner_text ? 'top-[30px]' : 'top-0'
        } ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80 text-[#062013]'
            : 'bg-[#FCFBF9]/90 md:bg-gradient-to-b md:from-[#062013]/90 md:via-[#092B1B]/45 md:to-transparent py-4 text-[#062013] md:text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border-2 border-[#15803D] transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/logo.png"
                alt="Kibali Africa Tours Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-serif text-xl tracking-tight font-black ${
                    isScrolled ? 'text-[#0F1D36]' : 'text-[#0F1D36] md:text-white'
                  }`}
                >
                  KIBALI
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#15803D] bg-emerald-50 md:bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                  AFRICA
                </span>
              </div>
              <p
                className={`text-[9px] uppercase tracking-widest font-sans font-medium -mt-0.5 ${
                  isScrolled ? 'text-slate-600' : 'text-slate-600 md:text-emerald-200'
                }`}
              >
                {settings.sub_tagline || 'Conscious Travel • Refined Luxury'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-wider transition-all relative py-1 ${
                    isActive
                      ? 'text-[#15803D] font-extrabold'
                      : isScrolled
                      ? 'text-[#0F1D36] hover:text-[#15803D]'
                      : 'text-[#0F1D36] md:text-slate-100 hover:text-[#15803D] md:hover:text-emerald-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#15803D] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'text-[#0F1D36] hover:bg-slate-100'
                  : 'text-[#0F1D36] md:text-white hover:bg-black/20'
              }`}
              aria-label="Search trips"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Account / Portal / Admin */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isScrolled
                      ? 'border-slate-300 bg-white text-[#0F1D36] shadow-sm'
                      : 'border-slate-300 md:border-white/30 bg-white/80 md:bg-black/40 text-[#0F1D36] md:text-white hover:bg-black/60'
                  }`}
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-5 h-5 rounded-full object-cover border border-[#15803D]"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-[#15803D]" />
                  )}
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="bg-[#15803D] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-sm">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-[#0F1D36] animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-[#0F1D36]">{user?.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded border border-emerald-200">
                        <span className="font-semibold">{isAdmin ? 'Role' : 'Eco Points'}</span>
                        <span className="font-bold">{isAdmin ? 'Administrator' : `${user?.reward_points || 0} pts`}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <>
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#0F1D36] bg-emerald-50/60 hover:bg-emerald-100/60 border-l-2 border-[#15803D]"
                          >
                            <Sliders className="w-4 h-4 text-[#15803D]" />
                            <span>Admin Management</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/portal"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#15803D]"
                          >
                            <Luggage className="w-4 h-4 text-[#15803D]" />
                            <span>My Events & QR Tickets</span>
                          </Link>
                          <Link
                            href="/portal?tab=chats"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#15803D]"
                          >
                            <MessageSquare className="w-4 h-4 text-[#15803D]" />
                            <span>Event Group Chats</span>
                          </Link>
                          <Link
                            href="/portal?tab=vault"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#15803D]"
                          >
                            <Camera className="w-4 h-4 text-[#D97706]" />
                            <span>My Event Photos</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => logout()}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                  isScrolled
                    ? 'border-[#15803D] text-[#15803D] hover:bg-[#15803D] hover:text-white shadow-sm'
                    : 'border-white text-white hover:bg-white hover:text-[#0F1D36]'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors lg:hidden ${
                isScrolled ? 'text-[#0F1D36] hover:bg-slate-100' : 'text-[#0F1D36] md:text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar Overlay */}
        {isSearchOpen && (
          <div className="bg-white border-t border-b border-slate-200 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-5 h-5 text-[#15803D] shrink-0" />
              <input
                type="text"
                placeholder="Search expeditions by park, wildlife, duration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-sm text-[#0F1D36] focus:outline-none placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs uppercase font-bold tracking-wider rounded-lg"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-2xl text-[#0F1D36] px-6 py-6 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-3 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#0F1D36] hover:text-[#15803D] py-2 border-b border-slate-100"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-[#15803D] font-bold">&rarr;</span>
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#15803D] py-2 bg-emerald-50 px-3 rounded-lg border border-emerald-200"
                >
                  <span>Admin Management Suite</span>
                  <span className="text-xs text-[#15803D]">&rarr;</span>
                </Link>
              ) : isAuthenticated ? (
                <Link
                  href="/portal"
                  className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#0F1D36] hover:text-[#15803D] py-2 border-b border-slate-100"
                >
                  <span>My Events & Group Chats</span>
                  <span className="text-xs text-[#15803D] font-bold">&rarr;</span>
                </Link>
              ) : null}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/events"
                className="w-full text-center bg-[#15803D] hover:bg-[#166534] text-white font-sans py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-md transition-colors"
              >
                Explore Upcoming Events
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
