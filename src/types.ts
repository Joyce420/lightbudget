export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  categoryIcon: string;
  account: string;
  date: string; // ISO string '2026-09-22T12:45:00'
  remark: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color?: string;
}

export interface AppSettings {
  monthlyBudget: number;
  defaultAccount: string;
  theme: 'auto' | 'light' | 'dark';
  currencySymbol: string;
  currencyCode: string;
}

export interface MonthSummary {
  totalExpense: number;
  totalIncome: number;
  balance: number;
  budget: number;
  budgetUsedPercent: number;
  budgetRemaining: number;
  remainingDays: number;
}

export type CloudSyncState = 'local' | 'connecting' | 'synced' | 'error';
