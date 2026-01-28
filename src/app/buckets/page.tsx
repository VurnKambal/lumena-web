"use client";

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BucketForm } from '@/components/buckets/BucketForm';
import { Bucket } from '@/types';
import { Plus, Edit2, Wallet } from 'lucide-react';

export default function BucketsPage() {
  const { state } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBucket, setEditingBucket] = useState<Bucket | undefined>(undefined);

  const handleEdit = (bucket: Bucket) => {
    setEditingBucket(bucket);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingBucket(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 md:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-text">Buckets</h1>
          <p className="text-slate-500">Manage your money containers.</p>
        </div>
        <Button onClick={handleCreate}>
           <Plus className="w-5 h-5 mr-2" />
           New Bucket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.buckets.map((bucket) => {
           const hasTarget = bucket.target && bucket.target > 0;
           const progress = hasTarget ? Math.min(100, (bucket.amount / bucket.target!) * 100) : 0;

           return (
             <Card key={bucket.id} className="p-5 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${bucket.color || 'bg-indigo-500'}`}>
                            <Wallet className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-lg text-slate-800">{bucket.name}</h3>
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                               {bucket.category}
                            </span>
                         </div>
                      </div>
                      <button
                        onClick={() => handleEdit(bucket)}
                        className="text-slate-300 hover:text-slate-600 transition-colors p-1"
                      >
                         <Edit2 className="w-5 h-5" />
                      </button>
                   </div>

                   <div>
                      <p className="text-sm text-slate-500 mb-1">Current Balance</p>
                      <p className="text-3xl font-bold text-slate-800 tabular-nums">
                         ${bucket.amount.toFixed(2)}
                      </p>
                   </div>
                </div>

                {hasTarget ? (
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-slate-700 font-medium tabular-nums">{progress.toFixed(0)}%</span>
                        </div>
                        <ProgressBar value={progress} max={100} colorClass={bucket.color || 'bg-indigo-500'} />
                        <p className="text-xs text-slate-400 text-right">Target: ${bucket.target?.toFixed(2)}</p>
                    </div>
                ) : (
                    <div className="mt-6 pt-6 border-t border-slate-50 text-center text-sm text-slate-400">
                        No target set
                    </div>
                )}
             </Card>
           );
        })}

        {/* Empty State / Add New Card */}
        <button
           onClick={handleCreate}
           className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all min-h-[200px]"
        >
           <Plus className="w-12 h-12 mb-3 opacity-50" />
           <span className="font-medium">Create Custom Bucket</span>
        </button>
      </div>

      <BucketForm
         isOpen={isFormOpen}
         onClose={() => setIsFormOpen(false)}
         bucket={editingBucket}
      />
    </div>
  );
}
