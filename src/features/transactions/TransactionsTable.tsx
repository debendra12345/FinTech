'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Plus, Download, ArrowUpDown, ChevronUp, ChevronDown,
  Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight,
  SlidersHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { TransactionForm } from './TransactionForm';
import {
  formatCurrency, formatDate, CATEGORY_LABELS, exportToCSV, debounce, cn,
} from '@/lib/utils';
import type { Transaction, TransactionCategory, TransactionType } from '@/types';

/* ─────────────────────────────────── constants ─── */

const TYPE_OPTIONS: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
];

const CATEGORY_OPTIONS: { value: TransactionCategory | 'all'; label: string }[] = [
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

const PER_PAGE = 12;

/* ─────────────────────────────────── component ─── */

export function TransactionsTable() {
  const { transactions, filters, setFilter, role, deleteTransaction, isLoading } = useAppStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [deleteTxnId, setDeleteTxnId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((v: unknown) => setFilter('search', v as string), 300),
    [setFilter],
  );
  useEffect(() => { debouncedSearch(localSearch); }, [localSearch, debouncedSearch]);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ── derived ── */
  const filtered = useMemo(() => {
    let r = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      r = r.filter(t =>
        t.description.toLowerCase().includes(q) ||
        (t.merchant ?? '').toLowerCase().includes(q) ||
        CATEGORY_LABELS[t.category].toLowerCase().includes(q),
      );
    }
    if (filters.category !== 'all') r = r.filter(t => t.category === filters.category);
    if (filters.type !== 'all') r = r.filter(t => t.type === filters.type);

    r.sort((a, b) => {
      const mult = filters.sortOrder === 'desc' ? -1 : 1;
      return filters.sortBy === 'date'
        ? mult * (new Date(a.date).getTime() - new Date(b.date).getTime())
        : mult * (a.amount - b.amount);
    });
    return r;
  }, [transactions, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const page = Math.min(filters.page, Math.max(1, totalPages));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all';

  function toggleSort(field: 'date' | 'amount') {
    if (filters.sortBy === field) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', field);
      setFilter('sortOrder', 'desc');
    }
  }

  function clearFilters() {
    setLocalSearch('');
    setFilter('search', '');
    setFilter('category', 'all');
    setFilter('type', 'all');
  }

  function handleDelete() {
    if (!deleteTxnId) return;
    deleteTransaction(deleteTxnId);
    toast.success('Transaction deleted');
    setDeleteTxnId(null);
  }

  /* ── sub-components ── */
  function SortTh({ field, label }: { field: 'date' | 'amount'; label: string }) {
    const active = filters.sortBy === field;
    return (
      <th
        className="px-4 py-3 text-left cursor-pointer select-none group"
        onClick={() => toggleSort(field)}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
          {label}
          {active
            ? filters.sortOrder === 'asc'
              ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
              : <ChevronDown className="h-3.5 w-3.5 text-primary" />
            : <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />}
        </div>
      </th>
    );
  }

  function TypeIcon({ type }: { type: TransactionType }) {
    if (type === 'income') return <ArrowUpCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
    if (type === 'expense') return <ArrowDownCircle className="h-4 w-4 text-rose-400 shrink-0" />;
    return <ArrowLeftRight className="h-4 w-4 text-blue-400 shrink-0" />;
  }

  return (
    <div className="space-y-4">

      {/* ── Viewer mode banner ── */}
      {role === 'viewer' && (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-sm text-amber-400 font-medium">
            Read-only mode — switch to <strong>Admin</strong> in the top bar to add or edit transactions
          </p>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search… (press / to focus)"
            id="search-transactions"
            className={cn(
              'w-full h-9 pl-9 pr-8 rounded-xl border border-border bg-input text-sm',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring transition-colors',
            )}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter button */}
        <Button
          variant={filtersOpen || (filters.category !== 'all' || filters.type !== 'all') ? 'secondary' : 'outline'}
          size="sm"
          leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          onClick={() => setFiltersOpen(p => !p)}
          id="toggle-filters"
        >
          Filters
          {(filters.category !== 'all' || filters.type !== 'all') && (
            <span className="ml-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {(filters.category !== 'all' ? 1 : 0) + (filters.type !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            onClick={() => exportToCSV(filtered)}
            id="export-csv"
          >
            CSV
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

      {/* ── Filter panel ── */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/40 border border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type:</span>
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter('type', opt.value)}
                    className={cn(
                      'h-7 px-3 rounded-full text-xs font-medium border transition-all duration-150',
                      filters.type === opt.value
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="w-full border-t border-border/60 pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category:</span>
                {CATEGORY_OPTIONS.slice(1).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter('category', opt.value)}
                    className={cn(
                      'h-7 px-3 rounded-full text-xs font-medium border transition-all duration-150',
                      filters.category === opt.value
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active filter chips ── */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              "{filters.search}"
              <button onClick={() => setLocalSearch('')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {filters.type}
              <button onClick={() => setFilter('type', 'all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {CATEGORY_LABELS[filters.category as TransactionCategory]}
              <button onClick={() => setFilter('category', 'all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
            Clear all
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={8} /></div>
        ) : paginated.length === 0 ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border">
              <ArrowLeftRight className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {hasActiveFilters ? 'No matching transactions' : 'No transactions yet'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start by adding your first transaction to track your finances.'}
            </p>
            <div className="flex gap-3 mt-5">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} leftIcon={<X className="h-3.5 w-3.5" />}>
                  Clear filters
                </Button>
              )}
              {role === 'admin' && !hasActiveFilters && (
                <Button size="sm" onClick={() => { setEditTxn(null); setFormOpen(true); }} leftIcon={<Plus className="h-3.5 w-3.5" />}>
                  Add Transaction
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-5 py-3 text-left">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Description</span>
                  </th>
                  <SortTh field="date" label="Date" />
                  <th className="px-4 py-3 text-left">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Category</span>
                  </th>
                  <SortTh field="amount" label="Amount" />
                  {role === 'admin' && (
                    <th className="px-4 py-3 text-right">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginated.map((txn, i) => (
                    <motion.tr
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/60 last:border-0 hover:bg-accent/40 transition-colors duration-100 group"
                    >
                      {/* Description */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                            txn.type === 'income' ? 'bg-emerald-500/10' :
                            txn.type === 'expense' ? 'bg-rose-500/10' : 'bg-blue-500/10',
                          )}>
                            <TypeIcon type={txn.type} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate max-w-[220px]">
                              {txn.description}
                            </p>
                            {txn.merchant && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">{txn.merchant}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(txn.date, 'MMM d, yyyy')}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={txn.type === 'income' ? 'income' : txn.type === 'expense' ? 'expense' : 'transfer'}
                          dot
                        >
                          {CATEGORY_LABELS[txn.category]}
                        </Badge>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={cn(
                          'text-sm font-semibold tabular-nums',
                          txn.type === 'income' ? 'text-emerald-400' :
                          txn.type === 'expense' ? 'text-rose-400' : 'text-blue-400',
                        )}>
                          {txn.type === 'income' ? '+' : txn.type === 'expense' ? '-' : ''}
                          {formatCurrency(txn.amount)}
                        </span>
                      </td>

                      {/* Actions — admin only */}
                      {role === 'admin' && (
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => { setEditTxn(txn); setFormOpen(true); }}
                              aria-label="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
                              onClick={() => setDeleteTxnId(txn.id)}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline" size="sm"
              disabled={page <= 1}
              onClick={() => setFilter('page', page - 1)}
            >← Previous</Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + idx;
                return p <= totalPages ? (
                  <button
                    key={p}
                    onClick={() => setFilter('page', p)}
                    className={cn(
                      'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                      p === page
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-muted-foreground',
                    )}
                  >{p}</button>
                ) : null;
              })}
            </div>
            <Button
              variant="outline" size="sm"
              disabled={page >= totalPages}
              onClick={() => setFilter('page', page + 1)}
            >Next →</Button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <TransactionForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTxn(null); }}
        editTransaction={editTxn}
      />

      <Modal
        isOpen={!!deleteTxnId}
        onClose={() => setDeleteTxnId(null)}
        title="Delete Transaction"
        description="This will permanently remove this transaction. This action cannot be undone."
        size="sm"
      >
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={() => setDeleteTxnId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} id="confirm-delete">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
