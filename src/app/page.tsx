'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SummaryCards } from '@/features/dashboard/SummaryCards';
import { BalanceTrendChart } from '@/features/dashboard/BalanceTrendChart';
import { SpendingChart } from '@/features/dashboard/SpendingChart';
import { RecentTransactions } from '@/features/dashboard/RecentTransactions';
import { useAppStore } from '@/store/useAppStore';

export default function DashboardPage() {
  const {
    insights,
    monthlyData,
    categorySpending,
    transactions,
    isLoading,
    loadTransactions,
  } = useAppStore();

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Summary cards */}
        <SummaryCards insights={insights} isLoading={isLoading} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BalanceTrendChart data={monthlyData} isLoading={isLoading} />
          </div>
          <div>
            <SpendingChart data={categorySpending} isLoading={isLoading} />
          </div>
        </div>

        {/* Recent transactions */}
        <RecentTransactions transactions={transactions} isLoading={isLoading} />
      </div>
    </AppShell>
  );
}
