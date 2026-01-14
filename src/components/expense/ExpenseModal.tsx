import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
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

  const handleSubmit = () => {
    if (!amount || !description || !selectedBucketId) return;
    logExpense(parseFloat(amount), description, date, selectedBucketId);
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedBucketId(null);
    onClose();
  };

  const selectedBucket = state.buckets.find(b => b.id === selectedBucketId);

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
                        onClick={() => setSelectedBucketId(bucket.id)}
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
              <div className="space-y-2">
                 <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 flex justify-between">
                    <span>Available in {selectedBucket.name}:</span>
                    <span className={`font-bold tabular-nums ${selectedBucket.amount < parseFloat(amount || '0') ? 'text-rose-600' : 'text-slate-800'}`}>
                       ${selectedBucket.amount.toFixed(2)}
                    </span>
                 </div>
                 {parseFloat(amount || '0') > selectedBucket.amount && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-sm text-rose-700 animate-in fade-in slide-in-from-top-1">
                       <span>⚠️</span>
                       <p>This will put your <strong>{selectedBucket.name}</strong> bucket into negative balance.</p>
                    </div>
                 )}
              </div>
          )}

        </div>

        <div className="flex justify-end pt-2">
            <Button onClick={handleSubmit} disabled={!amount || !description || !selectedBucketId}>
                Log Expense
            </Button>
        </div>
      </div>
    </Modal>
  );
}
