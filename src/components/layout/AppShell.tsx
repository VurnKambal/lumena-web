"use client";

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Navigation } from './Navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useFinance();
  const showNav = state.isOnboardingComplete;

  return (
    <div className={`min-h-screen ${showNav ? 'md:pl-64' : ''}`}>
       <Navigation />
       <main className={showNav ? "pb-20 md:pb-0" : ""}>
          {children}
       </main>
    </div>
  );
}
