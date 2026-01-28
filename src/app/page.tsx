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
import { Plus, Minus, Wallet, ArrowRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

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

  // Recent Transactions
  const recentTransactions = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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
             {state.buckets.length === 0 ? (
                 <Card className="p-6 text-center space-y-3 bg-slate-50 border-dashed border-2 border-slate-200">
                    <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-medium text-slate-700">No buckets yet</h3>
                        <p className="text-sm text-slate-500">Create your first bucket to organize money.</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/buckets')}>Manage Buckets</Button>
                 </Card>
             ) : (
                 state.buckets.map((bucket) => {
                     // Percentage of total cash
                     const percentOfTotal = totalCash > 0 ? (bucket.amount / totalCash) * 100 : 0;
                     const isOverdraft = bucket.amount < 0;

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
                              <p className={`text-xl font-bold tabular-nums ${isOverdraft ? 'text-rose-600' : 'text-slate-700'}`}>
                                 ${bucket.amount.toFixed(2)}
                              </p>
                           </div>
                           <div className="space-y-1">
                              <ProgressBar value={percentOfTotal} max={100} className="h-1.5" colorClass="bg-slate-800" />
                              <p className={`text-xs text-right ${isOverdraft ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
                                 {isOverdraft ? '⚠️ Overdrawn' : `${percentOfTotal.toFixed(0)}% of Total`}
                              </p>
                           </div>
                        </Card>
                     );
                 })
             )}
          </div>
       </div>

       {/* Recent Activity */}
       <div className="max-w-md mx-auto px-6 space-y-4">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-brand-text">Recent Activity</h2>
              <Link href="/transactions" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
           </div>

           <Card className="divide-y divide-slate-100 overflow-hidden">
               {recentTransactions.length === 0 ? (
                   <div className="p-6 text-center text-slate-500 text-sm">
                       No recent activity.
                   </div>
               ) : (
                   recentTransactions.map((t) => (
                       <div key={t.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-3">
                               <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                   {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                               </div>
                               <div>
                                   <p className="font-medium text-slate-800 text-sm">{t.description}</p>
                                   <p className="text-xs text-slate-400">{t.date}</p>
                               </div>
                           </div>
                           <span className={`font-bold text-sm tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                               {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                           </span>
                       </div>
                   ))
               )}
           </Card>
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
