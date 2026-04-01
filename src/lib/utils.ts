import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type {
  Transaction,
  MonthlyData,
  CategorySpending,
  InsightData,
  TransactionCategory,
} from '@/types';

// Tailwind class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateStr: string, fmt = 'MMM dd, yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

// Format percentage
export function formatPercent(value: number, showSign = false): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

// Category color map
export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  salary: '#6366f1',
  freelance: '#8b5cf6',
  investment: '#a78bfa',
  food: '#f59e0b',
  transport: '#3b82f6',
  housing: '#10b981',
  entertainment: '#ec4899',
  healthcare: '#14b8a6',
  shopping: '#f97316',
  utilities: '#64748b',
  education: '#06b6d4',
  travel: '#84cc16',
  other: '#94a3b8',
};

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  investment: 'Investments',
  food: 'Food & Dining',
  transport: 'Transport',
  housing: 'Housing & Rent',
  entertainment: 'Entertainment',
  healthcare: 'Healthcare',
  shopping: 'Shopping',
  utilities: 'Utilities',
  education: 'Education',
  travel: 'Travel',
  other: 'Other',
};

// Compute monthly chart data for last N months
export function computeMonthlyData(transactions: Transaction[], months = 6): MonthlyData[] {
  const result: MonthlyData[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const monthTxns = transactions.filter((t) => {
      try {
        const d = parseISO(t.date);
        return isWithinInterval(d, { start, end });
      } catch {
        return false;
      }
    });

    const income = monthTxns
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const expenses = monthTxns
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    result.push({
      month: format(monthDate, 'MMM yy'),
      income,
      expenses,
      balance: income - expenses,
    });
  }

  return result;
}

// Compute category spending breakdown
export function computeCategorySpending(transactions: Transaction[]): CategorySpending[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  const byCategory: Partial<Record<TransactionCategory, number>> = {};
  for (const t of expenses) {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  }

  return Object.entries(byCategory)
    .map(([cat, amt]) => ({
      category: cat as TransactionCategory,
      amount: amt!,
      percentage: total > 0 ? (amt! / total) * 100 : 0,
      color: CATEGORY_COLORS[cat as TransactionCategory],
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Compute insights
export function computeInsights(transactions: Transaction[]): InsightData {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const thisMonthExpenses = transactions
    .filter((t) => {
      try {
        const d = parseISO(t.date);
        return t.type === 'expense' && isWithinInterval(d, { start: thisMonthStart, end: thisMonthEnd });
      } catch { return false; }
    })
    .reduce((s, t) => s + t.amount, 0);

  const lastMonthExpenses = transactions
    .filter((t) => {
      try {
        const d = parseISO(t.date);
        return t.type === 'expense' && isWithinInterval(d, { start: lastMonthStart, end: lastMonthEnd });
      } catch { return false; }
    })
    .reduce((s, t) => s + t.amount, 0);

  const changePercent = lastMonthExpenses > 0
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
    : 0;

  const categorySpending = computeCategorySpending(transactions);
  const highestCategory = categorySpending[0]?.category ?? 'other';

  const netSavings = income - expenses;
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

  return {
    totalBalance: netSavings,
    totalIncome: income,
    totalExpenses: expenses,
    netSavings,
    savingsRate,
    highestSpendingCategory: highestCategory,
    monthlyComparison: {
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      changePercent,
    },
  };
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Export transactions as CSV
export function exportToCSV(transactions: Transaction[], filename = 'transactions.csv') {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Merchant', 'Notes'];
  const rows = transactions.map((t) => [
    formatDate(t.date, 'yyyy-MM-dd'),
    `"${t.description}"`,
    CATEGORY_LABELS[t.category],
    t.type,
    t.amount.toString(),
    t.merchant ?? '',
    t.notes ?? '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
