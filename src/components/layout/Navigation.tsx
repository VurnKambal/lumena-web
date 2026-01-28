"use client";

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Settings, History } from 'lucide-react';

export function Navigation() {
  const { state } = useFinance();
  const pathname = usePathname();

  if (!state.isOnboardingComplete) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/buckets', label: 'Buckets', icon: LayoutGrid },
    { href: '/transactions', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 md:hidden z-40">
        <ul className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                    isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Sidebar (Simple) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6 z-40">
        <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">Lumena</h1>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
