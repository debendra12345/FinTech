// Transaction Types
export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'utilities'
  | 'education'
  | 'travel'
  | 'other';

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  merchant?: string;
  notes?: string;
}

// User & Role Types
export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

// Filter Types
export interface TransactionFilters {
  search: string;
  category: TransactionCategory | 'all';
  type: TransactionType | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  page: number;
  perPage: number;
}

// Chart / Analytics Types
export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface InsightData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  highestSpendingCategory: TransactionCategory;
  monthlyComparison: {
    thisMonth: number;
    lastMonth: number;
    changePercent: number;
  };
}

// UI Types
export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// Form Types
export interface TransactionFormData {
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  merchant?: string;
  notes?: string;
}
