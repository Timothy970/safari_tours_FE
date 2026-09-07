'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Map, User } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Explore',
      icon: Compass,
      isActive: pathname === '/',
    },
    {
      href: '/rewards',
      label: 'Impact',
      icon: Sparkles,
      isActive: pathname === '/rewards',
    },
    {
      href: '/trips',
      label: 'Trips',
      icon: Map,
      isActive: pathname.startsWith('/trips'),
    },
    {
      href: '/portal',
      label: 'Profile',
      icon: User,
      isActive: pathname.startsWith('/portal'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F5F2ED]/95 backdrop-blur-xl border-t border-[#4B3621]/15 px-4 py-2.5 shadow-[0_-4px_20px_rgba(75,54,33,0.08)] rounded-t-2xl"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                item.isActive
                  ? 'text-[#C68E3D] font-bold scale-105'
                  : 'text-[#4E453D]/70 hover:text-[#C68E3D]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${item.isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] uppercase tracking-wider font-sans font-semibold">
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68E3D] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
