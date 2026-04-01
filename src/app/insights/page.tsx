'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { InsightsPanel } from '@/features/insights/InsightsPanel';
import { useAppStore } from '@/store/useAppStore';

export default function InsightsPage() {
  const { insights, categorySpending, isLoading, loadTransactions } = useAppStore();

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <AppShell>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground mb-4">
          Smart insights computed from your transaction history
        </p>
        <InsightsPanel
          insights={insights}
          categorySpending={categorySpending}
          isLoading={isLoading}
        />
      </div>
    </AppShell>
  );
}
