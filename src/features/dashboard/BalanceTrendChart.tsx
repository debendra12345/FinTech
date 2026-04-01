'use client';

import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { SkeletonChart } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import type { MonthlyData } from '@/types';

interface BalanceTrendChartProps {
  data: MonthlyData[];
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl p-3.5 shadow-2xl min-w-[160px]">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="text-xs font-bold text-foreground tabular-nums">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function BalanceTrendChart({ data, isLoading }: BalanceTrendChartProps) {
  if (isLoading) return <SkeletonChart />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', bounce: 0.15 }}
      className="h-full"
    >
      <Card className="h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Cash Flow Trend</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Income vs. expenses — last 6 months</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: 'Income', color: '#10b981' },
              { label: 'Expenses', color: '#f43f5e' },
              { label: 'Balance', color: '#6366f1' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 hidden sm:flex">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: 'none' }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gIncome)"
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#gExpenses)"
              dot={false}
              activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gBalance)"
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
