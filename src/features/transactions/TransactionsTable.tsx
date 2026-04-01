'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ArrowUpDown, ChevronUp, ChevronDown,
  Edit2, Trash2, Plus, Download, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { TransactionForm } from './TransactionForm';
import {
  formatCurrency, formatDate, CATEGORY_LABELS, exportToCSV, debounce, cn
} from '@/lib/utils';
import type { Transaction, TransactionCategory, TransactionType } from '@/types';

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
];

const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investment' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'housing', label: 'Housing' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

export function TransactionsTable() {
  const {
    transactions,
    filters,
    setFilter,
    role,
    deleteTransaction,
    isLoading,
  } = useAppStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [deleteTxnId, setDeleteTxnId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounced search update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((v: unknown) => setFilter('search', v as string), 350),
    [setFilter]
  );

  useEffect(() => {
    debouncedSearch(localSearch);
  }, [localSearch, debouncedSearch]);

  // Filtered & sorted transactions
  const filtered = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.merchant?.toLowerCase().includes(q) ||
          CATEGORY_LABELS[t.category].toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return filters.sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    });

    return result;
  }, [transactions, filters]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / filters.perPage);
  const paginated = filtered.slice(
    (filters.page - 1) * filters.perPage,
    filters.page * filters.perPage
  );

  function toggleSort(field: 'date' | 'amount') {
    if (filters.sortBy === field) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', field);
      setFilter('sortOrder', 'desc');
    }
  }

  function handleDelete() {
    if (!deleteTxnId) return;
    deleteTransaction(deleteTxnId);
    toast.success('Transaction deleted');
    setDeleteTxnId(null);
  }

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => {
    if (filters.sortBy !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return filters.sortOrder === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
      : <ChevronDown className="h-3.5 w-3.5 text-primary" />;
  };

  const TypeIcon = ({ type }: { type: TransactionType }) => {
    if (type === 'income') return <ArrowUpCircle className="h-4 w-4 text-emerald-400" />;
    if (type === 'expense') return <ArrowDownCircle className="h-4 w-4 text-rose-400" />;
    return <ArrowLeftRight className="h-4 w-4 text-blue-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          id="search-transactions"
          placeholder="Search transactions..."
          leftIcon={<Search className="h-4 w-4" />}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="sm:max-w-xs"
        />

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Select
            id="filter-type"
            options={TYPE_FILTER_OPTIONS}
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value as TransactionType | 'all')}
            className="w-36"
          />
          <Select
            id="filter-category"
            options={CATEGORY_FILTER_OPTIONS}
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value as TransactionCategory | 'all')}
            className="w-44"
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            onClick={() => exportToCSV(filtered)}
            id="export-csv"
          >
            Export CSV
          </Button>
          {role === 'admin' && (
            <Button
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => { setEditTxn(null); setFormOpen(true); }}
              id="add-transaction"
            >
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
        {(filters.search || filters.category !== 'all' || filters.type !== 'all') && (
          <button
            onClick={() => {
              setLocalSearch('');
              setFilter('search', '');
              setFilter('category', 'all');
              setFilter('type', 'all');
            }}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Filter className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={6} /></div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
              <ArrowLeftRight className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-base font-medium text-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filters.search || filters.type !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first transaction to get started'}
            </p>
            {role === 'admin' && (
              <Button
                className="mt-4"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => { setEditTxn(null); setFormOpen(true); }}
              >
                Add Transaction
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 px-5 py-3 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </span>
              <button
                onClick={() => toggleSort('date')}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors text-left"
              >
                Date <SortIcon field="date" />
              </button>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
              <button
                onClick={() => toggleSort('amount')}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                Amount <SortIcon field="amount" />
              </button>
              {role === 'admin' && (
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              )}
            </div>

            {/* Rows */}
            <AnimatePresence mode="popLayout">
              {paginated.map((txn, i) => (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr,auto] gap-3 md:gap-4',
                    'px-5 py-4 border-b border-border last:border-0',
                    'hover:bg-accent/30 transition-colors duration-150 group'
                  )}
                >
                  {/* Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                      txn.type === 'income' ? 'bg-emerald-500/10' :
                      txn.type === 'expense' ? 'bg-rose-500/10' : 'bg-blue-500/10'
                    )}>
                      <TypeIcon type={txn.type} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
                      {txn.merchant && (
                        <p className="text-xs text-muted-foreground mt-0.5">{txn.merchant}</p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center md:block">
                    <span className="text-xs text-muted-foreground md:hidden mr-2 w-20 shrink-0">Date:</span>
                    <span className="text-sm text-foreground">{formatDate(txn.date, 'MMM d, yyyy')}</span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center md:block">
                    <span className="text-xs text-muted-foreground md:hidden mr-2 w-20 shrink-0">Category:</span>
                    <Badge variant={txn.type === 'income' ? 'income' : txn.type === 'expense' ? 'expense' : 'transfer'} dot>
                      {CATEGORY_LABELS[txn.category]}
                    </Badge>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center md:justify-start">
                    <span className="text-xs text-muted-foreground md:hidden mr-2 w-20 shrink-0">Amount:</span>
                    <span className={cn(
                      'text-sm font-semibold tabular-nums',
                      txn.type === 'income' ? 'text-emerald-400' :
                      txn.type === 'expense' ? 'text-rose-400' : 'text-blue-400'
                    )}>
                      {txn.type === 'income' ? '+' : txn.type === 'expense' ? '-' : ''}
                      {formatCurrency(txn.amount)}
                    </span>
                  </div>

                  {/* Actions */}
                  {role === 'admin' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditTxn(txn); setFormOpen(true); }}
                        aria-label="Edit transaction"
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTxnId(txn.id)}
                        aria-label="Delete transaction"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page <= 1}
              onClick={() => setFilter('page', filters.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page >= totalPages}
              onClick={() => setFilter('page', filters.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTxn(null); }}
        editTransaction={editTxn}
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTxnId}
        onClose={() => setDeleteTxnId(null)}
        title="Delete Transaction"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={() => setDeleteTxnId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} id="confirm-delete">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
