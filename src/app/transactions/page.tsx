'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TransactionsTable } from '@/features/transactions/TransactionsTable';
import { useAppStore } from '@/store/useAppStore';

export default function TransactionsPage() {
  const { loadTransactions, isLoading, role } = useAppStore();

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <AppShell>
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-muted-foreground">
              {role === 'viewer'
                ? 'Read-only access — switch to Admin to manage transactions'
                : 'Manage, search, and filter all your financial activity'}
            </p>
          </div>
        </div>
        <TransactionsTable />
      </div>
    </AppShell>
  );
}
