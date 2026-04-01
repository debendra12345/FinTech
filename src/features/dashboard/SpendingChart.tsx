'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { SkeletonChart } from '@/components/ui/Skeleton';
import { formatCurrency, CATEGORY_LABELS } from '@/lib/utils';
import type { CategorySpending } from '@/types';

interface SpendingChartProps {
  data: CategorySpending[];
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-popover border border-border rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{CATEGORY_LABELS[d.name as keyof typeof CATEGORY_LABELS] ?? d.name}</p>
      <p className="text-sm font-bold text-foreground mt-1">{formatCurrency(d.value)}</p>
      <p className="text-xs text-muted-foreground">{d.payload.percentage.toFixed(1)}% of total</p>
    </div>
  );
}

export function SpendingChart({ data, isLoading }: SpendingChartProps) {
  if (isLoading) return <SkeletonChart className="h-full" />;

  const top6 = data.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', bounce: 0.2 }}
    >
      <Card className="h-full">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-foreground">Spending Breakdown</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Top categories by expense amount</p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={top6}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {top6.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-2 space-y-2">
          {top6.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-muted-foreground">{item.percentage.toFixed(0)}%</span>
                <span className="font-medium text-foreground w-20 text-right">{formatCurrency(item.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
