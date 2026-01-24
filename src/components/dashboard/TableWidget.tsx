import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableWidgetProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  actions?: { label: string; onClick: (item: T) => void }[];
  onViewAll?: () => void;
  maxRows?: number;
  className?: string;
}

export function TableWidget<T extends { id: string }>({
  title,
  subtitle,
  columns,
  data,
  actions,
  onViewAll,
  maxRows = 5,
  className,
}: TableWidgetProps<T>) {
  const displayData = data.slice(0, maxRows);

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    const keys = (column.key as string).split('.');
    let value: any = item;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  return (
    <div className={cn("rounded-xl border bg-card", className)}>
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View all
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-10">
                  
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {displayData.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key as string}`}
                    className={cn("px-4 py-3 text-sm", column.className)}
                  >
                    {getCellValue(item, column)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action) => (
                          <DropdownMenuItem
                            key={action.label}
                            onClick={() => action.onClick(item)}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
