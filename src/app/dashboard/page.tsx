"use client";

import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { state, resetData } = useFinance();
  const router = useRouter();

  const handleReset = () => {
    resetData();
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <header className="mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-brand-text">Dashboard Placeholder</h1>
           <p className="text-slate-500">Welcome to your financial overview.</p>
        </div>
        <Button variant="outline" onClick={handleReset}>Reset Data</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Income Type</h3>
            <p className="text-2xl font-semibold text-brand-text">{state.incomeType || "Not Set"}</p>
        </Card>
        <Card>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Monthly Minimum Need</h3>
            <p className="text-2xl font-semibold text-brand-text">${state.safetyMargin}</p>
        </Card>
      </div>

      <section>
          <h2 className="text-xl font-semibold text-brand-text mb-4">Your Buckets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {state.buckets.map((bucket) => (
                  <Card key={bucket.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-brand-text">{bucket.name}</h3>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{bucket.percentage}%</span>
                      </div>
                      <p className="text-slate-500 text-sm capitalize">{bucket.category}</p>
                  </Card>
              ))}
          </div>
      </section>

      <section className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-auto">
          <pre className="text-xs font-mono">{JSON.stringify(state, null, 2)}</pre>
      </section>
    </div>
  );
}
