import type { Transaction, TransactionFormData } from '@/types';
import { mockTransactions } from '@/lib/mockData';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'fintech_transactions';

function loadFromStorage(): Transaction[] {
  if (typeof window === 'undefined') return mockTransactions;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockTransactions;
    const parsed = JSON.parse(raw) as Transaction[];
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].status) {
      return parsed;
    }
    // Storage has old format transactions without status
    saveToStorage(mockTransactions);
    return mockTransactions;
  } catch {
    return mockTransactions;
  }
}

function saveToStorage(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // ignore
  }
}

class TransactionService {
  getAll(): Transaction[] {
    return loadFromStorage();
  }

  add(data: TransactionFormData): Transaction {
    const transactions = this.getAll();
    const newTransaction: Transaction = {
      ...data,
      id: generateId(),
      date: data.date,
    };
    const updated = [newTransaction, ...transactions];
    saveToStorage(updated);
    return newTransaction;
  }

  update(id: string, data: Partial<TransactionFormData>): Transaction {
    const transactions = this.getAll();
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');
    const updated = [...transactions];
    updated[idx] = { ...updated[idx], ...data };
    saveToStorage(updated);
    return updated[idx];
  }

  delete(id: string): void {
    const transactions = this.getAll();
    const updated = transactions.filter((t) => t.id !== id);
    saveToStorage(updated);
  }

  reset(): Transaction[] {
    saveToStorage(mockTransactions);
    return mockTransactions;
  }
}

export const transactionService = new TransactionService();
