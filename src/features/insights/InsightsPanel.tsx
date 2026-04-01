'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, Award, DollarSign, BarChart2, Flame, ShieldCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard, SkeletonChart } from '@/components/ui/Skeleton';
import {
  formatCurrency, formatPercent, CATEGORY_LABELS, CATEGORY_COLORS, cn
} from '@/lib/utils';
import type { InsightData, CategorySpending } from '@/types';

interface InsightsPanelProps {
  insights: InsightData | null;
  categorySpending: CategorySpending[];
  isLoading: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.25 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground">{formatCurrency(payload[0]?.value)}</p>
    </div>
  );
}

export function InsightsPanel({ insights, categorySpending, isLoading }: InsightsPanelProps) {
  if (isLoading || !insights) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonChart />
      </div>
    );
  }

  const { monthlyComparison, highestSpendingCategory, savingsRate, netSavings } = insights;
  const spendingChange = monthlyComparison.changePercent;
  const isSpendingUp = spendingChange > 0;

  const healthScore = Math.max(0, Math.min(100, Math.round(savingsRate * 1.5)));
  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Needs Attention';
  const healthColor = healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-blue-400' : healthScore >= 40 ? 'text-amber-400' : 'text-rose-400';

  const barData = categorySpending.slice(0, 8).map((c) => ({
    name: CATEGORY_LABELS[c.category].split(' ')[0],
    amount: c.amount,
    color: CATEGORY_COLORS[c.category],
    full: CATEGORY_LABELS[c.category],
  }));

  return (
    <div className="space-y-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Monthly spending comparison */}
        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/20">
                <BarChart2 className="h-4.5 w-4.5 text-white" />
              </div>
              <Badge variant={isSpendingUp ? 'danger' : 'success'}>
                {isSpendingUp ? '↑' : '↓'} {Math.abs(spendingChange).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Monthly Spend Change</p>
            <p className="text-2xl font-bold text-foreground mt-2 tabular-nums">
              {formatCurrency(monthlyComparison.thisMonth, true)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              vs {formatCurrency(monthlyComparison.lastMonth, true)} last month
            </p>
            <div className={cn('flex items-center gap-1 mt-3 text-xs font-medium', isSpendingUp ? 'text-rose-400' : 'text-emerald-400')}>
              {isSpendingUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {isSpendingUp ? 'Spending increased' : 'Spending decreased'} this month
            </div>
          </Card>
        </motion.div>

        {/* Top category */}
        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
                <Flame className="h-4.5 w-4.5 text-white" />
              </div>
              <Badge variant="warning">Top Spend</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Highest Spending Category</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {CATEGORY_LABELS[highestSpendingCategory]}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(categorySpending[0]?.amount ?? 0)} spent in total
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                style={{ width: `${categorySpending[0]?.percentage ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {categorySpending[0]?.percentage.toFixed(0)}% of total spending
            </p>
          </Card>
        </motion.div>

        {/* Financial health */}
        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <Badge variant={healthScore >= 60 ? 'success' : 'warning'}>{healthLabel}</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Financial Health Score</p>
            <div className="flex items-end gap-2 mt-2">
              <p className={cn('text-4xl font-bold tabular-nums', healthColor)}>{healthScore}</p>
              <p className="text-muted-foreground text-sm mb-1">/100</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className={cn(
                  'h-full rounded-full',
                  healthScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                  healthScore >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-400' :
                  healthScore >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                  'bg-gradient-to-r from-rose-500 to-pink-400'
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Savings rate: {formatPercent(savingsRate)}
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Net savings & goals */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20">
                <DollarSign className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net Savings</p>
                <p className={cn('text-xl font-bold', netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {formatCurrency(Math.abs(netSavings), true)}
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Income</span>
                <span className="font-semibold text-emerald-400">{formatCurrency(insights.totalIncome, true)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-rose-400">{formatCurrency(insights.totalExpenses, true)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Net</span>
                <span className={cn('font-bold', netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {netSavings >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netSavings), true)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20">
                <Target className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Savings Goals</p>
                <p className="text-xs text-muted-foreground mt-0.5">Based on current trajectory</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Emergency Fund (3mo)', target: insights.totalExpenses / 6 * 3, current: netSavings * 0.4 },
                { label: 'Vacation Fund', target: 5000, current: netSavings * 0.15 },
                { label: 'Investment Portfolio', target: 50000, current: netSavings * 0.45 },
              ].map((goal) => {
                const pct = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
                return (
                  <div key={goal.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{goal.label}</span>
                      <span className="font-medium text-foreground">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Category spending bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Spending by Category</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">All-time expense breakdown by category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--accent)', opacity: 0.5 }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
}
