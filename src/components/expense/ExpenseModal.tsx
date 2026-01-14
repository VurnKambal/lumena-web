import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Slider } from '../ui/Slider';
import { useFinance } from '@/context/FinanceContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const { state, logExpense } = useFinance();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);

  // State for Multi-Source Cover
  const [contributions, setContributions] = useState<Record<string, number>>({});

  const selectedBucket = state.buckets.find(b => b.id === selectedBucketId);
  const expenseAmount = parseFloat(amount || '0');
  const shortfall = selectedBucket ? Math.max(0, expenseAmount - selectedBucket.amount) : 0;

  const handleContributionChange = (bucketId: string, value: number) => {
    setContributions((prev) => ({
      ...prev,
      [bucketId]: value,
    }));
  };

  const totalContributions = Object.values(contributions).reduce((sum, val) => sum + val, 0);
  const isCovered = Math.abs(totalContributions - shortfall) < 0.01; // Float tolerance

  const handleSubmit = () => {
    if (!amount || !description || !selectedBucketId) return;

    // Prepare transfers if needed
    let transferPayload: { fromBucketId: string, amount: number }[] | undefined = undefined;

    if (shortfall > 0) {
       if (!isCovered) return;
       transferPayload = Object.entries(contributions)
          .filter(([_, val]) => val > 0)
          .map(([id, val]) => ({ fromBucketId: id, amount: val }));
    }

    logExpense(parseFloat(amount), description, date, selectedBucketId, transferPayload);

    // Reset form
    setAmount('');
    setDescription('');
    setSelectedBucketId(null);
    setContributions({});
    onClose();
  };

  const availableCoverBuckets = state.buckets.filter(b => b.id !== selectedBucketId && b.amount > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Expense">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
             <Label htmlFor="amount">Amount</Label>
             <div className="relative mt-1">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
               <Input
                 id="amount"
                 type="number"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 placeholder="0.00"
                 className="pl-8 text-lg font-medium tabular-nums"
                 autoFocus
               />
             </div>
          </div>

          <div>
             <Label htmlFor="description">Description</Label>
             <Input
               id="description"
               type="text"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="e.g. Grocery Run"
               className="mt-1"
             />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
             <Label>Charge to Bucket</Label>
             <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                {state.buckets.map((bucket) => (
                    <button
                        key={bucket.id}
                        onClick={() => {
                            setSelectedBucketId(bucket.id);
                            setContributions({}); // Reset cover choices on bucket change
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                            selectedBucketId === bucket.id
                            ? 'border-brand-primary bg-indigo-50 ring-1 ring-brand-primary'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        <div className="font-medium text-sm text-brand-text">{bucket.name}</div>
                        <div className="text-xs text-slate-500 tabular-nums">${bucket.amount.toFixed(2)}</div>
                    </button>
                ))}
             </div>
          </div>

          {selectedBucket && (
              <div className="space-y-3">
                 <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 flex justify-between">
                    <span>Available in {selectedBucket.name}:</span>
                    <span className={`font-bold tabular-nums ${shortfall > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                       ${selectedBucket.amount.toFixed(2)}
                    </span>
                 </div>

                 {shortfall > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <h3 className="font-semibold text-rose-700">Cover Shortfall</h3>
                                <p className="text-sm text-rose-600">
                                    You are short by <strong>${shortfall.toFixed(2)}</strong>.
                                    Please select buckets to cover the difference.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {availableCoverBuckets.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No other buckets have funds available.</p>
                            ) : (
                                availableCoverBuckets.map(b => (
                                    <div key={b.id} className="space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-700">{b.name}</span>
                                            <span className="text-slate-400 text-xs">${b.amount.toFixed(2)} available</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Slider
                                                min={0}
                                                max={b.amount}
                                                value={contributions[b.id] || 0}
                                                onChange={(val) => handleContributionChange(b.id, val)}
                                                className="flex-1"
                                                trackColorClass="bg-rose-200"
                                                rangeColorClass="bg-rose-500"
                                            />
                                            <div className="w-20 relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={b.amount}
                                                    value={contributions[b.id] || 0}
                                                    onChange={(e) => handleContributionChange(b.id, parseFloat(e.target.value) || 0)}
                                                    className="w-full text-right text-sm border border-rose-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-rose-500/20 tabular-nums bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-rose-200/50 text-sm font-medium">
                            <span className="text-slate-600">Total Covered:</span>
                            <span className={`tabular-nums ${isCovered ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ${totalContributions.toFixed(2)} / ${shortfall.toFixed(2)}
                            </span>
                        </div>
                    </div>
                 )}
              </div>
          )}

        </div>

        <div className="flex justify-end pt-2">
            <Button
               onClick={handleSubmit}
               disabled={!amount || !description || !selectedBucketId || (shortfall > 0 && !isCovered)}
               className={shortfall > 0 ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}
            >
                {shortfall > 0 ? 'Cover & Pay' : 'Log Expense'}
            </Button>
        </div>
      </div>
    </Modal>
  );
}
