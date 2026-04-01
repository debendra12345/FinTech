import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-200',
          {
            'bg-card border-border shadow-card': variant === 'default',
            'bg-card/60 backdrop-blur-xl border-border/50 shadow-glass': variant === 'glass',
            'bg-card border-border shadow-elevated': variant === 'elevated',
            'p-4': padding === 'sm',
            'p-5 sm:p-6': padding === 'md',
            'p-6 sm:p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-sm font-medium text-muted-foreground tracking-wide uppercase', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

interface CardValueProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardValue = forwardRef<HTMLParagraphElement, CardValueProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-2xl font-bold text-foreground mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);
CardValue.displayName = 'CardValue';

export { Card, CardHeader, CardTitle, CardValue };
