"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { StepOne } from './StepOne';
import { StepTwo, StrategyType } from './StepTwo';
import { Button } from '../ui/Button';
import { IncomeType, Bucket } from '@/types';

export function Wizard() {
  const router = useRouter();
  const { setOnboardingData } = useFinance();

  const [currentStep, setCurrentStep] = useState(1);

  // Local state for Step 1
  const [incomeType, setIncomeType] = useState<IncomeType>('Irregular');
  const [safetyMargin, setSafetyMargin] = useState('');

  // Local state for Step 2
  const [strategy, setStrategy] = useState<StrategyType>('Balanced');
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [calculatedBuckets, setCalculatedBuckets] = useState<Bucket[]>([]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!safetyMargin || parseInt(safetyMargin) <= 0) {
        alert("Please enter a valid monthly minimum need.");
        return;
      }
      setCurrentStep(2);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleComplete = () => {
    // Atomic update of all data
    setOnboardingData({
      incomeType,
      safetyMargin: parseInt(safetyMargin),
      buckets: calculatedBuckets
    });

    // Redirect
    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= 1 ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 text-slate-500'}`}>1</div>
          <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= 2 ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 text-slate-500'}`}>2</div>
        </div>
        <h1 className="text-3xl font-bold text-brand-text">
          {currentStep === 1 ? "Let's get a baseline." : "Set your strategy."}
        </h1>
        <p className="text-slate-500 mt-2">
          {currentStep === 1 ? "We need to understand your cash flow to build your safety net." : "How do you want to split your money?"}
        </p>
      </div>

      {/* Steps */}
      <div className="mb-8">
        {currentStep === 1 && (
          <StepOne
            incomeType={incomeType}
            setIncomeType={setIncomeType}
            safetyMargin={safetyMargin}
            setSafetyMargin={setSafetyMargin}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            strategy={strategy}
            setStrategy={setStrategy}
            taxEnabled={taxEnabled}
            setTaxEnabled={setTaxEnabled}
            onBucketsCalculated={setCalculatedBuckets}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        {currentStep === 2 ? (
          <Button variant="outline" onClick={handleBack}>Back</Button>
        ) : (
          <div></div> // Spacer
        )}

        <Button onClick={handleNext}>
          {currentStep === 1 ? "Next: Define Buckets" : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}
