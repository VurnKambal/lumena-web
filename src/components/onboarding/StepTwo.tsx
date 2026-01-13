import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { BucketCategory, Bucket } from '@/types';
import { Shield, Rocket, Anchor } from 'lucide-react';

export type StrategyType = 'Balanced' | 'Aggressive' | 'Survival';

interface StepTwoProps {
  strategy: StrategyType;
  setStrategy: (strategy: StrategyType) => void;
  taxEnabled: boolean;
  setTaxEnabled: (enabled: boolean) => void;
  onBucketsCalculated: (buckets: Bucket[]) => void;
}

export function StepTwo({ strategy, setStrategy, taxEnabled, setTaxEnabled, onBucketsCalculated }: StepTwoProps) {

  // Calculate buckets whenever strategy or taxEnabled changes
  useEffect(() => {
    const buckets: Bucket[] = [];
    const timestamp = Date.now().toString();

    // Helper to create bucket
    const createBucket = (name: string, category: BucketCategory, percentage: number, idx: number): Bucket => ({
      id: `${timestamp}-${idx}`,
      name,
      category,
      amount: 0,
      percentage
    });

    if (strategy === 'Balanced') {
      // 50% Essentials, 20% Savings, 15% Tax, 15% Play
      buckets.push(createBucket('Essentials', 'Essentials', 50, 1));
      buckets.push(createBucket('Savings', 'Savings', 20, 2));

      if (taxEnabled) {
        buckets.push(createBucket('Tax', 'Tax', 15, 3));
        buckets.push(createBucket('Play', 'Play', 15, 4));
      } else {
        // Tax (15%) moves to Play -> Play = 30%
        buckets.push(createBucket('Play', 'Play', 30, 4));
      }
    } else if (strategy === 'Aggressive') {
      // 40% Essentials, 40% Savings, 15% Tax, 5% Play
      buckets.push(createBucket('Essentials', 'Essentials', 40, 1));
      buckets.push(createBucket('Savings', 'Savings', 40, 2));

      if (taxEnabled) {
        buckets.push(createBucket('Tax', 'Tax', 15, 3));
        buckets.push(createBucket('Play', 'Play', 5, 4));
      } else {
        // Tax (15%) moves to Play -> Play = 20%
        buckets.push(createBucket('Play', 'Play', 20, 4));
      }
    } else if (strategy === 'Survival') {
      // 90% Essentials, 10% Savings. (Implicitly 0% Tax)
      buckets.push(createBucket('Essentials', 'Essentials', 90, 1));
      buckets.push(createBucket('Savings', 'Savings', 10, 2));
      // Tax toggle does nothing here as Tax is 0%
    }

    onBucketsCalculated(buckets);
  }, [strategy, taxEnabled]); // Removed onBucketsCalculated from dependency array to avoid infinite loop if it's unstable,
                             // but in this context passing it is fine if the parent reference is stable.
                             // React hooks lint might complain so I will trust the parent uses useCallback or refs if needed.
                             // Actually, let's just run this when inputs change.

  const handleStrategySelect = (s: StrategyType) => {
    setStrategy(s);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Choose Allocation Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <button
            onClick={() => handleStrategySelect('Balanced')}
            className={`text-left transition-all ${strategy === 'Balanced' ? 'ring-2 ring-brand-primary ring-offset-2 rounded-xl' : ''}`}
          >
            <Card className={`h-full hover:border-brand-primary ${strategy === 'Balanced' ? 'bg-indigo-50 border-brand-primary' : ''}`}>
              <div className="flex flex-col h-full space-y-3">
                <Anchor className={`w-8 h-8 ${strategy === 'Balanced' ? 'text-brand-primary' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-medium text-brand-text">Balanced</h3>
                  <p className="text-sm text-slate-500 mb-2">Steady growth.</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>50% Essentials</li>
                    <li>20% Savings</li>
                    <li>15% Tax</li>
                    <li>15% Play</li>
                  </ul>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => handleStrategySelect('Aggressive')}
            className={`text-left transition-all ${strategy === 'Aggressive' ? 'ring-2 ring-brand-primary ring-offset-2 rounded-xl' : ''}`}
          >
            <Card className={`h-full hover:border-brand-primary ${strategy === 'Aggressive' ? 'bg-indigo-50 border-brand-primary' : ''}`}>
              <div className="flex flex-col h-full space-y-3">
                <Rocket className={`w-8 h-8 ${strategy === 'Aggressive' ? 'text-brand-primary' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-medium text-brand-text">Aggressive</h3>
                  <p className="text-sm text-slate-500 mb-2">Max savings.</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>40% Essentials</li>
                    <li>40% Savings</li>
                    <li>15% Tax</li>
                    <li>5% Play</li>
                  </ul>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => handleStrategySelect('Survival')}
            className={`text-left transition-all ${strategy === 'Survival' ? 'ring-2 ring-brand-primary ring-offset-2 rounded-xl' : ''}`}
          >
            <Card className={`h-full hover:border-brand-primary ${strategy === 'Survival' ? 'bg-indigo-50 border-brand-primary' : ''}`}>
              <div className="flex flex-col h-full space-y-3">
                <Shield className={`w-8 h-8 ${strategy === 'Survival' ? 'text-brand-primary' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-medium text-brand-text">Survival</h3>
                  <p className="text-sm text-slate-500 mb-2">Lean & mean.</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>90% Essentials</li>
                    <li>10% Savings</li>
                  </ul>
                </div>
              </div>
            </Card>
          </button>

        </div>
      </section>

      <section>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox
                label="I need to set aside money for Taxes"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                disabled={strategy === 'Survival'}
            />
             <p className="text-xs text-slate-400 mt-2 ml-8">
                {strategy === 'Survival'
                    ? "Survival mode prioritizes essentials. No tax bucket by default."
                    : "If unchecked, the Tax percentage will be reallocated to Play."}
            </p>
        </div>
      </section>
    </div>
  );
}
