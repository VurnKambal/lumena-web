"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { FinanceState, Bucket, Transaction } from '../types';
import { useLocalStorage } from '../lib/storage';

interface FinanceContextType {
  state: FinanceState;
  addBucket: (bucket: Bucket) => void;
  updateBucket: (bucket: Bucket) => void;
  addTransaction: (transaction: Transaction) => void;
  resetData: () => void;
}

const initialState: FinanceState = {
  buckets: [],
  transactions: [],
  unallocatedIncome: 0,
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

  const addTransaction = (transaction: Transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, transaction],
    }));
  };

  const resetData = () => {
    setState(initialState);
  };

  return (
    <FinanceContext.Provider value={{ state, addBucket, updateBucket, addTransaction, resetData }}>
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
