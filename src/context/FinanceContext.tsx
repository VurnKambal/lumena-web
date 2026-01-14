"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { FinanceState, Bucket, Transaction, IncomeType } from '../types';
import { useLocalStorage } from '../lib/storage';

interface FinanceContextType {
  state: FinanceState;
  addBucket: (bucket: Bucket) => void;
  updateBucket: (bucket: Bucket) => void;
  deleteBucket: (id: string) => void;
  setBuckets: (buckets: Bucket[]) => void;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addIncome: (amount: number, source: string, date: string, allocations: Record<string, number>) => void;
  logExpense: (amount: number, description: string, date: string, bucketId: string, transfer?: { fromBucketId: string, amount: number }) => void;
  transferFunds: (fromBucketId: string, toBucketId: string, amount: number) => void;
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

  const deleteBucket = (id: string) => {
    setState((prev) => ({
      ...prev,
      buckets: prev.buckets.filter((b) => b.id !== id),
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

  const deleteTransaction = (id: string) => {
    setState((prev) => {
      const transaction = prev.transactions.find((t) => t.id === id);
      if (!transaction) return prev;

      // Reverse the balance impact
      const updatedBuckets = prev.buckets.map((bucket) => {
        if (transaction.type === 'income' && transaction.allocations) {
           // Subtract allocated amount
           const allocatedAmount = transaction.allocations[bucket.id] || 0;
           return { ...bucket, amount: bucket.amount - allocatedAmount };
        } else if (transaction.type === 'expense' && transaction.bucketId === bucket.id) {
           // Add back amount
           return { ...bucket, amount: bucket.amount + transaction.amount };
        } else if (transaction.type === 'transfer' && transaction.fromBucketId && transaction.toBucketId) {
           // Reverse transfer
           if (bucket.id === transaction.fromBucketId) {
             return { ...bucket, amount: bucket.amount + transaction.amount };
           }
           if (bucket.id === transaction.toBucketId) {
             return { ...bucket, amount: bucket.amount - transaction.amount };
           }
        }
        return bucket;
      });

      return {
        ...prev,
        buckets: updatedBuckets,
        transactions: prev.transactions.filter((t) => t.id !== id),
      };
    });
  };

  const transferFunds = (fromBucketId: string, toBucketId: string, amount: number) => {
    setState((prev) => {
      const fromBucket = prev.buckets.find(b => b.id === fromBucketId);
      const toBucket = prev.buckets.find(b => b.id === toBucketId);

      if (!fromBucket || !toBucket) return prev;

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount,
        date: new Date().toISOString().split('T')[0],
        description: `Cover from ${fromBucket.name}`,
        fromBucketId,
        toBucketId,
        type: 'transfer',
      };

      const updatedBuckets = prev.buckets.map((bucket) => {
        if (bucket.id === fromBucketId) {
          return { ...bucket, amount: bucket.amount - amount };
        }
        if (bucket.id === toBucketId) {
          return { ...bucket, amount: bucket.amount + amount };
        }
        return bucket;
      });

      return {
        ...prev,
        buckets: updatedBuckets,
        transactions: [...prev.transactions, newTransaction],
      };
    });
  };

  const addIncome = (amount: number, source: string, date: string, allocations: Record<string, number>) => {
    setState((prev) => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount,
        date,
        description: source,
        allocations,
        type: 'income',
      };

      const updatedBuckets = prev.buckets.map((bucket) => {
        if (allocations[bucket.id]) {
          return { ...bucket, amount: bucket.amount + allocations[bucket.id] };
        }
        return bucket;
      });

      return {
        ...prev,
        buckets: updatedBuckets,
        transactions: [...prev.transactions, newTransaction],
      };
    });
  };

  const logExpense = (amount: number, description: string, date: string, bucketId: string, transfer?: { fromBucketId: string, amount: number }) => {
    setState((prev) => {
      const newTransactions = [...prev.transactions];
      let updatedBuckets = [...prev.buckets];

      // Handle Transfer First if exists
      if (transfer) {
          const fromBucket = updatedBuckets.find(b => b.id === transfer.fromBucketId);
          const toBucket = updatedBuckets.find(b => b.id === bucketId); // Transfer destination is the expense bucket

          if (fromBucket && toBucket) {
             // Create Transfer Transaction
             newTransactions.push({
                id: (Date.now() - 1).toString(), // Ensure unique ID (slight offset)
                amount: transfer.amount,
                date, // Use same date as expense
                description: `Cover from ${fromBucket.name}`,
                fromBucketId: transfer.fromBucketId,
                toBucketId: bucketId,
                type: 'transfer'
             });

             // Update Buckets for Transfer
             updatedBuckets = updatedBuckets.map(bucket => {
                 if (bucket.id === transfer.fromBucketId) {
                     return { ...bucket, amount: bucket.amount - transfer.amount };
                 }
                 if (bucket.id === bucketId) {
                     return { ...bucket, amount: bucket.amount + transfer.amount };
                 }
                 return bucket;
             });
          }
      }

      // Handle Expense
      const expenseTransaction: Transaction = {
        id: Date.now().toString(),
        amount,
        date,
        description,
        bucketId,
        type: 'expense',
      };
      newTransactions.push(expenseTransaction);

      updatedBuckets = updatedBuckets.map((bucket) => {
        if (bucket.id === bucketId) {
          return { ...bucket, amount: bucket.amount - amount };
        }
        return bucket;
      });

      return {
        ...prev,
        buckets: updatedBuckets,
        transactions: newTransactions,
      };
    });
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
        deleteBucket,
        setBuckets,
        addTransaction,
        deleteTransaction,
        addIncome,
        logExpense,
        transferFunds,
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
