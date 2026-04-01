'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency, CATEGORY_LABELS } from '@/lib/utils';
import type { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, type: 'spring', bounce: 0.2 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest financial activity</p>
          </div>
          <a href="/transactions" className="text-xs text-primary hover:underline font-medium">
            View all
          </a>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recent.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-colors duration-150 cursor-default"
              >
                <div className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                  txn.type === 'income'
                    ? 'bg-emerald-500/10'
                    : 'bg-rose-500/10'
                )}>
                  {txn.type === 'income' ? (
                    <ArrowUpCircle className="h-4.5 w-4.5 text-emerald-400" />
                  ) : (
                    <ArrowDownCircle className="h-4.5 w-4.5 text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(txn.date), 'MMM d')}
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      {CATEGORY_LABELS[txn.category]}
                    </Badge>
                  </div>
                </div>

                <span className={cn(
                  'text-sm font-semibold tabular-nums shrink-0',
                  txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                )}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
