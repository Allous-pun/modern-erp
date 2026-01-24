import React from 'react';
import { cn } from '@/lib/utils';
import { StatusType } from '@/types/erp';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'small' | 'default';
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-pending' },
  approved: { label: 'Approved', className: 'status-success' },
  rejected: { label: 'Rejected', className: 'status-error' },
  in_progress: { label: 'In Progress', className: 'status-info' },
  completed: { label: 'Completed', className: 'status-success' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border border-border' },
  cancelled: { label: 'Cancelled', className: 'status-error' },
  // Sales statuses
  new: { label: 'New', className: 'status-info' },
  contacted: { label: 'Contacted', className: 'status-pending' },
  qualified: { label: 'Qualified', className: 'status-warning' },
  proposal: { label: 'Proposal', className: 'status-pending' },
  won: { label: 'Won', className: 'status-success' },
  lost: { label: 'Lost', className: 'status-error' },
  // Employee statuses
  active: { label: 'Active', className: 'status-success' },
  on_leave: { label: 'On Leave', className: 'status-warning' },
  terminated: { label: 'Terminated', className: 'status-error' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border border-border' },
  // Project statuses
  planning: { label: 'Planning', className: 'status-pending' },
  on_hold: { label: 'On Hold', className: 'status-warning' },
  // Priority
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border border-border' },
  medium: { label: 'Medium', className: 'status-warning' },
  high: { label: 'High', className: 'status-error' },
  urgent: { label: 'Urgent', className: 'bg-status-error text-status-error-foreground' },
};

export function StatusBadge({ status, size = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status] || { 
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '), 
    className: 'bg-muted text-muted-foreground border border-border' 
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === 'small' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface ModuleBadgeProps {
  module: 'finance' | 'hr' | 'sales' | 'procurement' | 'inventory' | 'projects' | 'admin';
  size?: 'small' | 'default';
  className?: string;
}

const moduleConfig: Record<string, { label: string; className: string }> = {
  finance: { label: 'Finance', className: 'badge-finance' },
  hr: { label: 'HR', className: 'badge-hr' },
  sales: { label: 'Sales', className: 'badge-sales' },
  procurement: { label: 'Procurement', className: 'badge-procurement' },
  inventory: { label: 'Inventory', className: 'badge-inventory' },
  projects: { label: 'Projects', className: 'badge-projects' },
  admin: { label: 'Admin', className: 'bg-primary text-primary-foreground' },
};

export function ModuleBadge({ module, size = 'default', className }: ModuleBadgeProps) {
  const config = moduleConfig[module];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === 'small' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
