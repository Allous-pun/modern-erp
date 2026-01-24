import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'finance' | 'hr' | 'sales' | 'procurement' | 'inventory' | 'projects';
  size?: 'small' | 'default' | 'large';
}

const variantStyles = {
  default: 'bg-card',
  finance: 'bg-gradient-to-br from-module-finance/10 to-module-finance/5 border-module-finance/20',
  hr: 'bg-gradient-to-br from-module-hr/10 to-module-hr/5 border-module-hr/20',
  sales: 'bg-gradient-to-br from-module-sales/10 to-module-sales/5 border-module-sales/20',
  procurement: 'bg-gradient-to-br from-module-procurement/10 to-module-procurement/5 border-module-procurement/20',
  inventory: 'bg-gradient-to-br from-module-inventory/10 to-module-inventory/5 border-module-inventory/20',
  projects: 'bg-gradient-to-br from-module-projects/10 to-module-projects/5 border-module-projects/20',
};

const iconVariantStyles = {
  default: 'bg-primary/10 text-primary',
  finance: 'bg-module-finance/20 text-module-finance',
  hr: 'bg-module-hr/20 text-module-hr',
  sales: 'bg-module-sales/20 text-module-sales',
  procurement: 'bg-module-procurement/20 text-module-procurement',
  inventory: 'bg-module-inventory/20 text-module-inventory',
  projects: 'bg-module-projects/20 text-module-projects',
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  size = 'default',
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
      variantStyles[variant],
      size === 'large' && "p-6"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "font-bold tracking-tight",
            size === 'small' && "text-xl",
            size === 'default' && "text-2xl",
            size === 'large' && "text-3xl"
          )}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            iconVariantStyles[variant]
          )}>
            {icon}
          </div>
        )}
      </div>
      
      {(change !== undefined || changeLabel) && (
        <div className="mt-3 flex items-center gap-1.5">
          {change !== undefined && (
            <>
              <span className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                isPositive && "text-status-success",
                isNegative && "text-status-error",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && <TrendingUp className="h-4 w-4" />}
                {isNegative && <TrendingDown className="h-4 w-4" />}
                {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
                {Math.abs(change)}%
              </span>
            </>
          )}
          {changeLabel && (
            <span className="text-sm text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
