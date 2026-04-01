'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, Flame, ShieldCheck,
  DollarSign, Lightbulb, BarChart2, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard, SkeletonChart } from '@/components/ui/Skeleton';
import {
  formatCurrency, formatPercent, CATEGORY_LABELS, CATEGORY_COLORS, cn,
} from '@/lib/utils';
import type { InsightData, CategorySpending } from '@/types';

interface InsightsPanelProps {
  insights: InsightData | null;
  categorySpending: CategorySpending[];
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        <span className="font-bold text-foreground">{formatCurrency(payload[0]?.value)}</span> spent
      </p>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.2 } },
};

export function InsightsPanel({ insights, categorySpending, isLoading }: InsightsPanelProps) {

  /* ── Natural language insights ── */
  const dynamicInsights = useMemo(() => {
    if (!insights) return [];
    const { monthlyComparison, highestSpendingCategory, savingsRate, netSavings } = insights;
    const diff = monthlyComparison.changePercent;
    const topCat = CATEGORY_LABELS[highestSpendingCategory];
    const topPct = categorySpending[0]?.percentage ?? 0;

    const lines: { icon: typeof Lightbulb; text: string; type: 'good' | 'bad' | 'neutral' }[] = [];

    if (Math.abs(diff) > 1) {
      lines.push({
        icon: diff > 0 ? TrendingUp : TrendingDown,
        text: diff > 0
          ? `You spent ${Math.abs(diff).toFixed(0)}% more this month than last month. Consider reviewing discretionary expenses.`
          : `Great job! You reduced spending by ${Math.abs(diff).toFixed(0)}% compared to last month.`,
        type: diff > 0 ? 'bad' : 'good',
      });
    }

    if (topCat) {
      lines.push({
        icon: Flame,
        text: `Your highest expense category is ${topCat}, accounting for ${topPct.toFixed(0)}% of total spending.`,
        type: topPct > 40 ? 'bad' : 'neutral',
      });
    }

    if (savingsRate >= 20) {
      lines.push({
        icon: CheckCircle2,
        text: `You're saving ${savingsRate.toFixed(0)}% of your income — that's above the recommended 20% goal. Excellent discipline!`,
        type: 'good',
      });
    } else if (savingsRate > 0) {
      lines.push({
        icon: AlertTriangle,
        text: `Your savings rate is ${savingsRate.toFixed(0)}%. Aim for at least 20% to build a solid financial buffer.`,
        type: 'neutral',
      });
    }

    if (netSavings > 0) {
      lines.push({
        icon: DollarSign,
        text: `Your net savings of ${formatCurrency(netSavings, true)} puts you in a positive financial position overall.`,
        type: 'good',
      });
    }

    if (categorySpending.length >= 2) {
      const second = categorySpending[1];
      lines.push({
        icon: BarChart2,
        text: `Your second biggest expense is ${CATEGORY_LABELS[second.category]} at ${formatCurrency(second.amount, true)} (${second.percentage.toFixed(0)}%).`,
        type: 'neutral',
      });
    }

    return lines.slice(0, 4);
  }, [insights, categorySpending]);

  if (isLoading || !insights) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonChart />
      </div>
    );
  }

  const { monthlyComparison, highestSpendingCategory, savingsRate, netSavings } = insights;
  const isSpendingUp = monthlyComparison.changePercent > 0;
  const healthScore = Math.min(100, Math.max(0, Math.round(savingsRate * 1.4)));
  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Needs Work';
  const healthColor = healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-blue-400' : healthScore >= 40 ? 'text-amber-400' : 'text-rose-400';
  const healthBarColor = healthScore >= 80 ? 'from-emerald-500 to-teal-400' : healthScore >= 60 ? 'from-blue-500 to-indigo-400' : healthScore >= 40 ? 'from-amber-500 to-orange-400' : 'from-rose-500 to-pink-400';

  const barData = categorySpending.slice(0, 8).map(c => ({
    name: CATEGORY_LABELS[c.category].split(' ')[0],
    full: CATEGORY_LABELS[c.category],
    amount: c.amount,
    color: CATEGORY_COLORS[c.category],
  }));

  return (
    <div className="space-y-6">

      {/* ── Smart insight cards ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Monthly spend change */}
        <motion.div variants={item}>
          <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                'h-9 w-9 rounded-xl flex items-center justify-center shadow-lg',
                isSpendingUp ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/20' : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20',
              )}>
                {isSpendingUp
                  ? <TrendingUp className="h-4.5 w-4.5 text-white" />
                  : <TrendingDown className="h-4.5 w-4.5 text-white" />}
              </div>
              <Badge variant={isSpendingUp ? 'danger' : 'success'}>
                {isSpendingUp ? '↑' : '↓'} {Math.abs(monthlyComparison.changePercent).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Monthly Spend Change</p>
            <p className="text-2xl font-bold text-foreground mt-1.5 tabular-nums">
              {formatCurrency(monthlyComparison.thisMonth, true)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              vs <span className="font-medium text-foreground">{formatCurrency(monthlyComparison.lastMonth, true)}</span> last month
            </p>
            <p className={cn(
              'text-xs font-medium mt-3 flex items-center gap-1',
              isSpendingUp ? 'text-rose-400' : 'text-emerald-400',
            )}>
              {isSpendingUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              Spending {isSpendingUp ? 'increased' : 'decreased'} this month
            </p>
          </Card>
        </motion.div>

        {/* Top spending category */}
        <motion.div variants={item}>
          <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20">
                <Flame className="h-4.5 w-4.5 text-white" />
              </div>
              <Badge variant="warning">Top Spend</Badge>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Highest Category</p>
            <p className="text-2xl font-bold text-foreground mt-1.5">
              {CATEGORY_LABELS[highestSpendingCategory]}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{formatCurrency(categorySpending[0]?.amount ?? 0)}</span> total · {categorySpending[0]?.percentage.toFixed(0)}% of spending
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${categorySpending[0]?.percentage ?? 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
              />
            </div>
          </Card>
        </motion.div>

        {/* Financial health score */}
        <motion.div variants={item}>
          <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <Badge variant={healthScore >= 60 ? 'success' : 'warning'}>{healthLabel}</Badge>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Financial Health</p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <p className={cn('text-4xl font-extrabold tabular-nums', healthColor)}>{healthScore}</p>
              <span className="text-muted-foreground font-medium">/100</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className={cn('h-full rounded-full bg-gradient-to-r', healthBarColor)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Savings rate: <span className="font-semibold text-foreground">{formatPercent(savingsRate)}</span>
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── AI-style insight cards ── */}
      {dynamicInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Smart Analysis</h3>
                <p className="text-xs text-muted-foreground">Based on your transaction history</p>
              </div>
            </div>
            <div className="space-y-3">
              {dynamicInsights.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border text-sm',
                      insight.type === 'good' ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300' :
                      insight.type === 'bad' ? 'bg-rose-500/5 border-rose-500/15 text-rose-300' :
                      'bg-muted/40 border-border text-muted-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <p className="leading-relaxed">{insight.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ── Net savings + Goals ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20">
                <DollarSign className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Net Summary</p>
                <p className={cn('text-xl font-bold', netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {netSavings >= 0 ? '+' : ''}{formatCurrency(netSavings, true)}
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Total Income', value: insights.totalIncome, color: 'text-emerald-400' },
                { label: 'Total Expenses', value: insights.totalExpenses, color: 'text-rose-400' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={cn('font-semibold', row.color)}>{formatCurrency(row.value, true)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">Net</span>
                <span className={cn('font-bold', netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {netSavings >= 0 ? '+' : ''}{formatCurrency(netSavings, true)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Target className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Savings Goals</p>
                <p className="text-xs text-muted-foreground mt-0.5">Target track based on net savings</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Emergency Fund (3mo)', target: (insights.totalExpenses / 6) * 3, current: netSavings * 0.4 },
                { label: 'Vacation Fund', target: 5000, current: netSavings * 0.15 },
                { label: 'Investment Portfolio', target: 50000, current: netSavings * 0.45 },
              ].map(goal => {
                const pct = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
                return (
                  <div key={goal.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{goal.label}</span>
                      <span className="font-semibold text-foreground">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                      <span>{formatCurrency(Math.max(0, goal.current), true)}</span>
                      <span>{formatCurrency(goal.target, true)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Category bar chart ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Spending by Category</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All-time expense breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--accent)', opacity: 0.4 }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
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
