import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info' | 'pending';
}

interface ActivityTimelineProps {
  title: string;
  items: TimelineItem[];
  maxItems?: number;
  onViewAll?: () => void;
  className?: string;
}

const statusColors = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  info: 'bg-status-info',
  pending: 'bg-status-pending',
};

export function ActivityTimeline({
  title,
  items,
  maxItems = 5,
  onViewAll,
  className,
}: ActivityTimelineProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <div key={item.id} className="flex gap-3">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  item.status
                    ? statusColors[item.status]
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.icon || (
                  <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                )}
              </div>
              {index < displayItems.length - 1 && (
                <div className="mt-2 h-full w-px bg-border" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground/70">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          No recent activity
        </div>
      )}
    </div>
  );
}
