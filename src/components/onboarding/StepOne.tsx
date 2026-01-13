import React from 'react';
import { Card } from '../ui/Card';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { IncomeType } from '@/types';
import { Briefcase, Activity, TrendingUp } from 'lucide-react';

interface StepOneProps {
  incomeType: IncomeType;
  setIncomeType: (type: IncomeType) => void;
  safetyMargin: string;
  setSafetyMargin: (value: string) => void;
}

export function StepOne({ incomeType, setIncomeType, safetyMargin, setSafetyMargin }: StepOneProps) {
  const handleIncomeSelect = (type: IncomeType) => {
    setIncomeType(type);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">How do you get paid?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleIncomeSelect('Steady')}
            className={`text-left transition-all ${incomeType === 'Steady' ? 'ring-2 ring-brand-primary ring-offset-2 rounded-xl' : ''}`}
          >
            <Card className={`h-full hover:border-brand-primary ${incomeType === 'Steady' ? 'bg-indigo-50 border-brand-primary' : ''}`}>
              <div className="flex flex-col h-full space-y-3">
                <Briefcase className={`w-8 h-8 ${incomeType === 'Steady' ? 'text-brand-primary' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-medium text-brand-text">Steady</h3>
                  <p className="text-sm text-slate-500">Fixed salary, paid regularly.</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => handleIncomeSelect('Irregular')}
            className={`text-left transition-all ${incomeType === 'Irregular' ? 'ring-2 ring-brand-primary ring-offset-2 rounded-xl' : ''}`}
          >
            <Card className={`h-full hover:border-brand-primary ${incomeType === 'Irregular' ? 'bg-indigo-50 border-brand-primary' : ''}`}>
              <div className="flex flex-col h-full space-y-3">
                <Activity className={`w-8 h-8 ${incomeType === 'Irregular' ? 'text-brand-primary' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-medium text-brand-text">Irregular</h3>
                  <p className="text-sm text-slate-500">Freelance or gigs. Varies monthly.</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => handleIncomeSelect('Mixed')}
            className={`text-left transition-all ${incomeType === 'Mixed' ? 'ring-2 ring-brand-primary ring-offset-2 rounded-xl' : ''}`}
          >
            <Card className={`h-full hover:border-brand-primary ${incomeType === 'Mixed' ? 'bg-indigo-50 border-brand-primary' : ''}`}>
              <div className="flex flex-col h-full space-y-3">
                <TrendingUp className={`w-8 h-8 ${incomeType === 'Mixed' ? 'text-brand-primary' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-medium text-brand-text">Mixed</h3>
                  <p className="text-sm text-slate-500">Base salary + commission.</p>
                </div>
              </div>
            </Card>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <Label htmlFor="safetyMargin">Monthly Minimum Need</Label>
          <p className="text-sm text-slate-500 mb-2">Rent + Bills + Food. The bare minimum to survive.</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
            <Input
              id="safetyMargin"
              type="number"
              value={safetyMargin}
              onChange={(e) => setSafetyMargin(e.target.value)}
              placeholder="3000"
              className="pl-8 text-lg"
              min="0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
