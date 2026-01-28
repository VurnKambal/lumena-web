import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Slider } from '../ui/Slider';
import { ArrowRight, Check } from 'lucide-react';

interface IncomeWizardProps {
  onClose: () => void;
}

export function IncomeWizard({ onClose }: IncomeWizardProps) {
  const { state, addIncome } = useFinance();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [amount, setAmount] = useState<string>('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Step 2 State
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const handleNext = () => {
    const incomeAmount = parseFloat(amount);
    if (isNaN(incomeAmount) || incomeAmount <= 0) return;
    if (!source) return;

    // Calculate initial allocations
    const newAllocations: Record<string, number> = {};
    state.buckets.forEach((bucket) => {
      // Calculate share based on percentage
      const share = Number(((incomeAmount * bucket.percentage) / 100).toFixed(2));
      newAllocations[bucket.id] = share;
    });

    setAllocations(newAllocations);
    setStep(2);
  };

  const handleAllocationChange = (bucketId: string, value: number) => {
    setAllocations((prev) => ({
      ...prev,
      [bucketId]: value,
    }));
  };

  const handleConfirm = () => {
    addIncome(parseFloat(amount), source, date, allocations);
    onClose();
  };

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const incomeAmount = parseFloat(amount) || 0;
  const unallocated = Number((incomeAmount - totalAllocated).toFixed(2));
  const isValid = unallocated === 0;

  if (step === 1) {
    return (
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
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Client Payment, Salary"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="date">DateReceived</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={!amount || !source}>
            Next Step <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="text-xl font-bold text-brand-text tabular-nums">${incomeAmount.toFixed(2)}</p>
        </div>
        <div className={`text-right ${unallocated !== 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
           <p className="text-sm font-medium">Unallocated</p>
           <p className="text-xl font-bold tabular-nums">${unallocated.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {state.buckets.map((bucket) => (
          <div key={bucket.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">
                {bucket.name} <span className="text-slate-400 text-xs ml-1">({bucket.percentage}%)</span>
              </label>
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  value={allocations[bucket.id] || 0}
                  onChange={(e) => handleAllocationChange(bucket.id, parseFloat(e.target.value) || 0)}
                  className="w-full text-right text-sm border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-brand-primary/20 tabular-nums"
                />
              </div>
            </div>
            <Slider
              min={0}
              max={incomeAmount}
              value={allocations[bucket.id] || 0}
              onChange={(val) => handleAllocationChange(bucket.id, val)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100">
         <Button variant="ghost" onClick={() => setStep(1)}>
            Back
         </Button>
         <Button onClick={handleConfirm} disabled={!isValid}>
            Confirm Deposit <Check className="ml-2 w-4 h-4" />
         </Button>
      </div>
    </div>
  );
}
