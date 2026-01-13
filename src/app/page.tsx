"use client";

import { useFinance } from '@/context/FinanceContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { IncomeWizard } from '@/components/income/IncomeWizard';
import { ExpenseModal } from '@/components/expense/ExpenseModal';
import { Plus, Minus, Wallet } from 'lucide-react';

export default function Home() {
  const { state } = useFinance();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !state.isOnboardingComplete) {
      router.push('/onboarding');
    }
  }, [mounted, state.isOnboardingComplete, router]);

  if (!mounted || !state.isOnboardingComplete) return null;

  // Calculations
  const totalCash = state.buckets.reduce((acc, b) => acc + b.amount, 0);
  const monthlyBurnRate = state.safetyMargin || 1; // Avoid div by zero
  const runwayMonths = totalCash / monthlyBurnRate;
  const safeToSpend = state.buckets.find(b => b.category === 'Play')?.amount || 0;

  // Runway Bar: Goal 6 months?
  const runwayGoalMonths = 6;
  const runwayProgress = Math.min(100, (runwayMonths / runwayGoalMonths) * 100);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
       {/* Hero Section */}
       <div className="bg-white p-6 pb-12 rounded-b-3xl shadow-sm border-b border-slate-100">
          <div className="max-w-md mx-auto space-y-8">
             <div className="text-center space-y-2">
                <p className="text-slate-500 font-medium">Safe to Spend</p>
                <h1 className="text-5xl font-bold text-indigo-600 tabular-nums tracking-tight">
                   ${safeToSpend.toFixed(2)}
                </h1>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                   <span>Runway</span>
                   <span className="tabular-nums">{runwayMonths.toFixed(1)} Months</span>
                </div>
                <ProgressBar value={runwayProgress} max={100} colorClass="bg-emerald-500" />
                <p className="text-xs text-slate-400 text-right">Goal: {runwayGoalMonths} Months</p>
             </div>
          </div>
       </div>

       {/* Bucket Overview */}
       <div className="max-w-md mx-auto p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brand-text">Your Buckets</h2>
          <div className="grid grid-cols-1 gap-4">
             {state.buckets.map((bucket) => {
                 // Percentage of total cash
                 const percentOfTotal = totalCash > 0 ? (bucket.amount / totalCash) * 100 : 0;
                 return (
                    <Card key={bucket.id} className="p-4 space-y-3">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                             <div className={`p-2 rounded-lg ${
                                bucket.category === 'Essentials' ? 'bg-blue-50 text-blue-600' :
                                bucket.category === 'Savings' ? 'bg-emerald-50 text-emerald-600' :
                                bucket.category === 'Tax' ? 'bg-amber-50 text-amber-600' :
                                'bg-indigo-50 text-indigo-600'
                             }`}>
                                <Wallet className="w-5 h-5" />
                             </div>
                             <div>
                                <h3 className="font-semibold text-brand-text">{bucket.name}</h3>
                                <p className="text-xs text-slate-400">{bucket.percentage}% Allocation</p>
                             </div>
                          </div>
                          <p className="text-xl font-bold text-slate-700 tabular-nums">
                             ${bucket.amount.toFixed(2)}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <ProgressBar value={percentOfTotal} max={100} className="h-1.5" colorClass="bg-slate-800" />
                          <p className="text-xs text-slate-400 text-right">{percentOfTotal.toFixed(0)}% of Total</p>
                       </div>
                    </Card>
                 );
             })}
          </div>
       </div>

       {/* Floating Action Buttons */}
       <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <button
             onClick={() => setIsExpenseOpen(true)}
             className="w-14 h-14 bg-white text-rose-500 rounded-full shadow-lg border border-rose-100 flex items-center justify-center hover:bg-rose-50 transition-colors"
             aria-label="Log Expense"
          >
             <Minus className="w-8 h-8" />
          </button>
          <button
             onClick={() => setIsIncomeOpen(true)}
             className="w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-colors"
             aria-label="Add Income"
          >
             <Plus className="w-8 h-8" />
          </button>
       </div>

       {/* Modals */}
       <Modal isOpen={isIncomeOpen} onClose={() => setIsIncomeOpen(false)} title="Add Income">
          <IncomeWizard onClose={() => setIsIncomeOpen(false)} />
       </Modal>

       <ExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />

    </div>
  );
}
