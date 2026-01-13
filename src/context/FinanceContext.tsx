"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { FinanceState, Bucket, Transaction, IncomeType } from '../types';
import { useLocalStorage } from '../lib/storage';

interface FinanceContextType {
  state: FinanceState;
  addBucket: (bucket: Bucket) => void;
  updateBucket: (bucket: Bucket) => void;
  setBuckets: (buckets: Bucket[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setIncomeType: (type: IncomeType) => void;
  setSafetyMargin: (amount: number) => void;
  completeOnboarding: () => void;
  setOnboardingData: (data: { incomeType: IncomeType; safetyMargin: number; buckets: Bucket[] }) => void;
  resetData: () => void;
}

const initialState: FinanceState = {
  buckets: [],
  transactions: [],
  unallocatedIncome: 0,
  incomeType: undefined,
  safetyMargin: 0,
  isOnboardingComplete: false,
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<FinanceState>('lumena-finance-data', initialState);

  const addBucket = (bucket: Bucket) => {
    setState((prev) => ({
      ...prev,
      buckets: [...prev.buckets, bucket],
    }));
  };

  const updateBucket = (updatedBucket: Bucket) => {
    setState((prev) => ({
      ...prev,
      buckets: prev.buckets.map((b) => (b.id === updatedBucket.id ? updatedBucket : b)),
    }));
  };

  const setBuckets = (buckets: Bucket[]) => {
    setState((prev) => ({
      ...prev,
      buckets,
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, transaction],
    }));
  };

  const setIncomeType = (type: IncomeType) => {
    setState((prev) => ({
      ...prev,
      incomeType: type,
    }));
  };

  const setSafetyMargin = (amount: number) => {
    setState((prev) => ({
      ...prev,
      safetyMargin: amount,
    }));
  };

  const completeOnboarding = () => {
    setState((prev) => ({
      ...prev,
      isOnboardingComplete: true,
    }));
  };

  const setOnboardingData = (data: { incomeType: IncomeType; safetyMargin: number; buckets: Bucket[] }) => {
    // 1. Direct Sync Write to localStorage to ensure persistence across redirect
    if (typeof window !== 'undefined') {
      try {
        const STORAGE_KEY = 'lumena-finance-data';
        const currentStored = window.localStorage.getItem(STORAGE_KEY);
        const parsedCurrent = currentStored ? JSON.parse(currentStored) : initialState;

        const newState = {
          ...parsedCurrent,
          incomeType: data.incomeType,
          safetyMargin: data.safetyMargin,
          buckets: data.buckets,
          isOnboardingComplete: true,
        };

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

        // 2. Update React State (will be consistent on re-mount/re-hydration)
        setState(newState);
      } catch (error) {
        console.error("Failed to save onboarding data:", error);
      }
    } else {
        // Fallback for SSR (should not happen in handler)
        setState((prev) => ({
          ...prev,
          incomeType: data.incomeType,
          safetyMargin: data.safetyMargin,
          buckets: data.buckets,
          isOnboardingComplete: true,
        }));
    }
  };

  const resetData = () => {
    setState(initialState);
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        addBucket,
        updateBucket,
        setBuckets,
        addTransaction,
        setIncomeType,
        setSafetyMargin,
        completeOnboarding,
        setOnboardingData,
        resetData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
