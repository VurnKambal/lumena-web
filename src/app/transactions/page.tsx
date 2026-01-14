"use client";

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Trash2, Filter, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TransactionsPage() {
  const { state, deleteTransaction } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterBucket, setFilterBucket] = useState<string>('all');

  // Filter & Sort
  const filteredTransactions = state.transactions
    .filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterBucket !== 'all' && t.bucketId !== filterBucket) {
         // Special handling for income which might not have a single bucketId but allocations
         if (t.type === 'income' && t.allocations && t.allocations[filterBucket]) return true;
         return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getBucketName = (id?: string) => {
    if (!id) return 'Unallocated';
    return state.buckets.find((b) => b.id === id)?.name || 'Unknown Bucket';
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure? This will reverse the transaction and update your balances.")) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text">Transactions</h1>
          <p className="text-slate-500">History of your financial events.</p>
        </div>

        <div className="flex gap-2">
            <div className="relative">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
                <select
                    value={filterBucket}
                    onChange={(e) => setFilterBucket(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                    <option value="all">All Buckets</option>
                    {state.buckets.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {filteredTransactions.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
                 <p>No transactions found matching your filters.</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                     <thead>
                         <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                             <th className="p-4">Date</th>
                             <th className="p-4">Description</th>
                             <th className="p-4">Bucket</th>
                             <th className="p-4 text-right">Amount</th>
                             <th className="p-4 w-10"></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {filteredTransactions.map((t) => (
                             <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                                 <td className="p-4 text-slate-600 whitespace-nowrap text-sm">{t.date}</td>
                                 <td className="p-4 font-medium text-slate-800">
                                     <div className="flex items-center gap-2">
                                         {t.type === 'income' ? (
                                             <div className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                                                 <ArrowDownLeft className="w-3 h-3" />
                                             </div>
                                         ) : (
                                              <div className="p-1 bg-rose-100 text-rose-600 rounded-full">
                                                 <ArrowUpRight className="w-3 h-3" />
                                              </div>
                                         )}
                                         {t.description}
                                     </div>
                                 </td>
                                 <td className="p-4">
                                     {t.type === 'income' ? (
                                         <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                             Income Allocation
                                         </span>
                                     ) : (
                                         <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                             {getBucketName(t.bucketId)}
                                         </span>
                                     )}
                                 </td>
                                 <td className={`p-4 text-right font-bold tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                     {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                 </td>
                                 <td className="p-4 text-center">
                                     <button
                                         onClick={() => handleDelete(t.id)}
                                         className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                         title="Delete Transaction"
                                     >
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}
      </div>
    </div>
  );
}
