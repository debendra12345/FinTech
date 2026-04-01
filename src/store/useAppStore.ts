import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Transaction,
  TransactionFilters,
  UserRole,
  Theme,
  TransactionFormData,
  InsightData,
  MonthlyData,
  CategorySpending,
} from '@/types';
import { transactionService } from '@/lib/transactionService';
import {
  computeInsights,
  computeMonthlyData,
  computeCategorySpending,
} from '@/lib/utils';

interface AppState {
  // Data
  transactions: Transaction[];
  isLoading: boolean;

  // Analytics (derived)
  insights: InsightData | null;
  monthlyData: MonthlyData[];
  categorySpending: CategorySpending[];

  // Filters
  filters: TransactionFilters;

  // Role
  role: UserRole;

  // Theme
  theme: Theme;

  // Actions – Transactions
  loadTransactions: () => void;
  addTransaction: (data: TransactionFormData) => void;
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => void;
  deleteTransaction: (id: string) => void;
  resetTransactions: () => void;

  // Actions – Filters
  setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
  resetFilters: () => void;

  // Actions – Role
  setRole: (role: UserRole) => void;

  // Actions – Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  perPage: 10,
};

function recompute(transactions: Transaction[]) {
  return {
    insights: computeInsights(transactions),
    monthlyData: computeMonthlyData(transactions, 6),
    categorySpending: computeCategorySpending(transactions),
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      insights: null,
      monthlyData: [],
      categorySpending: [],
      filters: DEFAULT_FILTERS,
      role: 'admin',
      theme: 'dark',

      loadTransactions: () => {
        set({ isLoading: true });
        // Simulate network latency
        setTimeout(() => {
          const transactions = transactionService.getAll();
          set({
            transactions,
            isLoading: false,
            ...recompute(transactions),
          });
        }, 600);
      },

      addTransaction: (data) => {
        const newTxn = transactionService.add(data);
        const transactions = [newTxn, ...get().transactions];
        set({ transactions, ...recompute(transactions) });
      },

      updateTransaction: (id, data) => {
        transactionService.update(id, data);
        const transactions = get().transactions.map((t) =>
          t.id === id ? { ...t, ...data } : t
        );
        set({ transactions, ...recompute(transactions) });
      },

      deleteTransaction: (id) => {
        transactionService.delete(id);
        const transactions = get().transactions.filter((t) => t.id !== id);
        set({ transactions, ...recompute(transactions) });
      },

      resetTransactions: () => {
        const transactions = transactionService.reset();
        set({ transactions, ...recompute(transactions) });
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
            // reset page on filter change (not page itself)
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        }));
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },

      setRole: (role) => set({ role }),

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
    }),
    {
      name: 'fintech-app-store',
      partialize: (state) => ({
        role: state.role,
        theme: state.theme,
        filters: state.filters,
      }),
    }
  )
);
