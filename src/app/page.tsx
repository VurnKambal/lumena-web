"use client";

import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { Bucket } from '@/types';

function Dashboard() {
  const { state, addBucket, resetData } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddBucket = () => {
    const newBucket: Bucket = {
      id: Date.now().toString(),
      name: 'New Savings',
      category: 'Savings',
      amount: 100,
      percentage: 10
    };
    addBucket(newBucket);
  };

  return (
    <div className="min-h-screen p-8 space-y-8 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-brand-text">Lumena Design System</h1>
        <p className="text-slate-500">Foundation Verification Page</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Typography & Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-brand-bg border border-slate-200 rounded-xl">Background (Slate-50)</div>
          <div className="p-4 bg-brand-card border border-slate-200 rounded-xl text-brand-text">Card (White) + Text (Midnight)</div>
          <div className="p-4 bg-brand-primary text-white rounded-xl">Primary (Indigo)</div>
          <div className="p-4 bg-brand-success text-white rounded-xl">Success (Mint)</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Components</h2>
        <Card>
          <h3 className="text-lg font-medium mb-2">Card Component</h3>
          <p className="text-slate-600 mb-4">This is a standard card using `rounded-xl` and `border-slate-200`.</p>
          <div className="flex gap-4">
            <Button variant="primary">Primary Action</Button>
            <Button variant="success">Success Action</Button>
            <Button variant="outline">Outline Action</Button>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Logic & Persistence</h2>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Finance State</h3>
            <div className="space-x-2">
              <Button variant="primary" onClick={handleAddBucket}>Add Bucket</Button>
              <Button variant="outline" onClick={resetData}>Reset</Button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-200">
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}
