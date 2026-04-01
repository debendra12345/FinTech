import { cn } from '@/lib/utils';

type BadgeVariant = 'income' | 'expense' | 'transfer' | 'default' | 'success' | 'warning' | 'danger';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const badgeStyles: Record<BadgeVariant, string> = {
  income: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  expense: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
  transfer: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  default: 'bg-muted text-muted-foreground border border-border',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
};

const dotStyles: Record<BadgeVariant, string> = {
  income: 'bg-emerald-400',
  expense: 'bg-rose-400',
  transfer: 'bg-blue-400',
  default: 'bg-muted-foreground',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
};

function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}

export { Badge };
