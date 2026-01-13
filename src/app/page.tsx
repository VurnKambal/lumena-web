"use client";

import { useFinance } from '@/context/FinanceContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { state } = useFinance();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && state.isOnboardingComplete) {
      router.push('/dashboard');
    }
  }, [mounted, state.isOnboardingComplete, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center space-y-6">
      <h1 className="text-4xl font-bold text-brand-text">Lumena</h1>
      <p className="text-slate-500 max-w-md">
        The variable-income financial app designed to help you build safety and sanity.
      </p>
      <Button onClick={() => router.push('/onboarding')}>
        Start Onboarding
      </Button>
    </div>
  );
}
