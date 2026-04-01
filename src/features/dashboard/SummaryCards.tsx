'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import type { InsightData } from '@/types';
import { SkeletonCard } from '@/components/ui/Skeleton';

interface SummaryCardsProps {
  insights: InsightData | null;
  isLoading: boolean;
}

const cardConfig = [
  {
    key: 'totalBalance' as const,
    label: 'Net Balance',
    icon: DollarSign,
    gradient: 'from-violet-500 to-indigo-500',
    shadowColor: 'shadow-violet-500/20',
  },
  {
    key: 'totalIncome' as const,
    label: 'Total Income',
    icon: ArrowUpCircle,
    gradient: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/20',
  },
  {
    key: 'totalExpenses' as const,
    label: 'Total Expenses',
    icon: ArrowDownCircle,
    gradient: 'from-rose-500 to-pink-500',
    shadowColor: 'shadow-rose-500/20',
  },
  {
    key: 'netSavings' as const,
    label: 'Net Savings',
    icon: PiggyBank,
    gradient: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/20',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.25 } },
};

export function SummaryCards({ insights, isLoading }: SummaryCardsProps) {
  if (isLoading || !insights) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cardConfig.map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const savingsChange = insights.savingsRate;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cardConfig.map((config) => {
        const Icon = config.icon;
        const value = insights[config.key];
        const isNegative = value < 0;

        return (
          <motion.div key={config.key} variants={item}>
            <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              {/* Subtle gradient background */}
              <div className={cn(
                'absolute top-0 right-0 h-24 w-24 rounded-full opacity-[0.07] -translate-y-6 translate-x-6',
                `bg-gradient-to-br ${config.gradient}`,
              )} />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {config.label}
                  </p>
                  <p className={cn(
                    'text-2xl font-bold mt-2 tabular-nums',
                    config.key === 'totalExpenses' ? 'text-foreground' :
                    isNegative ? 'text-destructive' : 'text-foreground'
                  )}>
                    {formatCurrency(Math.abs(value), true)}
                  </p>
                </div>
                <div className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center shadow-lg',
                  `bg-gradient-to-br ${config.gradient}`,
                  config.shadowColor
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Savings rate shown on net savings card */}
              {config.key === 'netSavings' && (
                <div className="mt-4 flex items-center gap-1.5">
                  {savingsChange >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                  )}
                  <span className={cn(
                    'text-xs font-medium',
                    savingsChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  )}>
                    {formatPercent(savingsChange)} savings rate
                  </span>
                </div>
              )}

              {config.key === 'totalBalance' && (
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    All-time net balance
                  </span>
                </div>
              )}

              {config.key === 'totalIncome' && (
                <div className="mt-4">
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, (insights.totalIncome / (insights.totalIncome + insights.totalExpenses)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {config.key === 'totalExpenses' && (
                <div className="mt-4">
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, (insights.totalExpenses / (insights.totalIncome + insights.totalExpenses)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
