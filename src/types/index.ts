export type BucketCategory = 'Tax' | 'Essentials' | 'Savings' | 'Play';
export type IncomeType = 'Steady' | 'Irregular' | 'Mixed';

export interface Bucket {
  id: string;
  name: string;
  category: BucketCategory;
  amount: number;
  percentage: number; // For income allocation
  target?: number;
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  bucketId?: string; // Optional if not yet allocated or general income
  type: 'income' | 'expense';
}

export interface FinanceState {
  buckets: Bucket[];
  transactions: Transaction[];
  unallocatedIncome: number;
  incomeType?: IncomeType;
  safetyMargin: number;
  isOnboardingComplete: boolean;
}
