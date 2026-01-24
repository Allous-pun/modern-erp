import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  unit?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  className?: string;
}

const variantColors = {
  default: 'bg-primary',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
};

export function ProgressCard({
  title,
  current,
  total,
  unit = '',
  variant = 'default',
  showPercentage = true,
  className,
}: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {showPercentage && (
          <span className="text-sm font-semibold">{percentage}%</span>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-500", variantColors[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {current.toLocaleString()} {unit}
        </span>
        <span className="text-muted-foreground">
          {total.toLocaleString()} {unit}
        </span>
      </div>
    </div>
  );
}

interface MultiProgressCardProps {
  title: string;
  items: {
    label: string;
    value: number;
    color: string;
  }[];
  total: number;
  className?: string;
}

export function MultiProgressCard({
  title,
  items,
  total,
  className,
}: MultiProgressCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      
      {/* Stacked progress bar */}
      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-muted">
        {items.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div
              key={index}
              className="h-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: item.color,
              }}
            />
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="ml-auto text-xs font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
