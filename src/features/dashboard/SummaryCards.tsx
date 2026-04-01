'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign,
  ArrowUpCircle, ArrowDownCircle, PiggyBank,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import type { InsightData } from '@/types';
import { SkeletonCard } from '@/components/ui/Skeleton';

interface SummaryCardsProps {
  insights: InsightData | null;
  isLoading: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.2, duration: 0.5 } },
};

export function SummaryCards({ insights, isLoading }: SummaryCardsProps) {
  if (isLoading || !insights) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const { monthlyComparison, savingsRate } = insights;
  const expenseDelta = monthlyComparison.changePercent;

  const cards = [
    {
      key: 'totalBalance',
      label: 'Net Balance',
      value: insights.totalBalance,
      icon: DollarSign,
      iconBg: 'from-violet-500 to-indigo-600',
      iconShadow: 'shadow-violet-500/25',
      delta: savingsRate,
      deltaLabel: 'savings rate',
      deltaPositive: savingsRate >= 0,
      bar: null,
      subtext: 'All-time net position',
    },
    {
      key: 'totalIncome',
      label: 'Total Income',
      value: insights.totalIncome,
      icon: ArrowUpCircle,
      iconBg: 'from-emerald-500 to-teal-600',
      iconShadow: 'shadow-emerald-500/25',
      delta: null,
      deltaLabel: '',
      deltaPositive: true,
      bar: { pct: (insights.totalIncome / Math.max(1, insights.totalIncome + insights.totalExpenses)) * 100, color: 'from-emerald-500 to-teal-400' },
      subtext: 'Across all sources',
    },
    {
      key: 'totalExpenses',
      label: 'Total Expenses',
      value: insights.totalExpenses,
      icon: ArrowDownCircle,
      iconBg: 'from-rose-500 to-pink-600',
      iconShadow: 'shadow-rose-500/25',
      delta: expenseDelta,
      deltaLabel: 'vs last month',
      deltaPositive: expenseDelta <= 0,
      bar: { pct: (insights.totalExpenses / Math.max(1, insights.totalIncome + insights.totalExpenses)) * 100, color: 'from-rose-500 to-pink-400' },
      subtext: monthlyComparison.thisMonth > 0
        ? `$${(monthlyComparison.thisMonth / 1000).toFixed(1)}k this month`
        : 'No expenses this month',
    },
    {
      key: 'netSavings',
      label: 'Net Savings',
      value: insights.netSavings,
      icon: PiggyBank,
      iconBg: 'from-amber-500 to-orange-600',
      iconShadow: 'shadow-amber-500/25',
      delta: savingsRate,
      deltaLabel: 'savings rate',
      deltaPositive: savingsRate >= 20,
      bar: { pct: Math.min(100, Math.max(0, savingsRate)), color: 'from-amber-500 to-orange-400' },
      subtext: savingsRate >= 20 ? 'On track 🎯' : savingsRate >= 10 ? 'Getting there' : 'Room to improve',
    },
  ] as const;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isNeg = card.value < 0;

        return (
          <motion.div key={card.key} variants={item}>
            <Card className="group relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-default border-border/60">
              {/* Orb accent */}
              <div className={cn(
                'absolute -top-8 -right-8 h-28 w-28 rounded-full blur-2xl opacity-[0.08]',
                `bg-gradient-to-br ${card.iconBg}`,
              )} />

              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    {card.label}
                  </p>
                  <p className={cn(
                    'text-[1.65rem] font-extrabold leading-none tabular-nums tracking-tight',
                    isNeg ? 'text-rose-400' : 'text-foreground'
                  )}>
                    {isNeg ? '-' : ''}{formatCurrency(Math.abs(card.value), true)}
                  </p>
                </div>
                <div className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 mt-0.5',
                  `bg-gradient-to-br ${card.iconBg}`,
                  card.iconShadow,
                )}>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Progress bar */}
              {card.bar && (
                <div className="mt-4">
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${card.bar.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      className={cn('h-full rounded-full bg-gradient-to-r', card.bar.color)}
                    />
                  </div>
                </div>
              )}

              {/* Bottom row */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{card.subtext}</span>
                {card.delta !== null && (
                  <div className={cn(
                    'flex items-center gap-1 text-[11px] font-semibold rounded-full px-2 py-0.5',
                    card.deltaPositive
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-rose-400 bg-rose-500/10',
                  )}>
                    {card.deltaPositive
                      ? <TrendingUp className="h-3 w-3" />
                      : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(card.delta).toFixed(1)}%
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
