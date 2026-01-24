import React from 'react';
import {
  DollarSign, TrendingUp, Users, ShoppingCart, Package, Clock,
  AlertTriangle, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { TableWidget } from '@/components/dashboard/TableWidget';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { MultiProgressCard } from '@/components/dashboard/ProgressCard';
import { StatusBadge } from '@/components/shared/StatusBadge';

// Mock data for executive dashboard
const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
  { name: 'Aug', value: 6500 },
  { name: 'Sep', value: 8000 },
  { name: 'Oct', value: 7500 },
  { name: 'Nov', value: 9000 },
  { name: 'Dec', value: 8500 },
];

const departmentSpend = [
  { name: 'Sales', value: 35 },
  { name: 'Engineering', value: 28 },
  { name: 'Marketing', value: 18 },
  { name: 'Operations', value: 12 },
  { name: 'HR', value: 7 },
];

const pendingApprovals = [
  { id: '1', type: 'Purchase Order', reference: 'PO-2024-0142', amount: '$45,000', requester: 'John Smith', status: 'pending' },
  { id: '2', type: 'Leave Request', reference: 'LV-2024-0089', amount: '5 days', requester: 'Sarah Johnson', status: 'pending' },
  { id: '3', type: 'Invoice', reference: 'INV-2024-0234', amount: '$12,500', requester: 'Finance Dept', status: 'pending' },
  { id: '4', type: 'Budget Request', reference: 'BR-2024-0012', amount: '$150,000', requester: 'Marketing', status: 'pending' },
];

const recentActivity = [
  { id: '1', title: 'Invoice #INV-2024-0233 approved', description: 'Approved by Finance Manager', time: '10 minutes ago', status: 'success' as const },
  { id: '2', title: 'New sales order received', description: 'Order #SO-2024-0567 from Acme Corp', time: '25 minutes ago', status: 'info' as const },
  { id: '3', title: 'Low stock alert', description: 'Product SKU-001 below reorder level', time: '1 hour ago', status: 'warning' as const },
  { id: '4', title: 'Employee onboarding completed', description: 'James Wilson joined Engineering', time: '2 hours ago', status: 'success' as const },
  { id: '5', title: 'Budget review meeting scheduled', description: 'Q1 2024 review tomorrow at 10 AM', time: '3 hours ago', status: 'info' as const },
];

export function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="High-level overview of business performance and key metrics"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$2.4M"
          change={12.5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="finance"
        />
        <StatsCard
          title="Active Orders"
          value="1,284"
          change={8.2}
          changeLabel="vs last month"
          icon={<ShoppingCart className="h-5 w-5" />}
          variant="sales"
        />
        <StatsCard
          title="Total Employees"
          value="248"
          change={3.1}
          changeLabel="new this month"
          icon={<Users className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Inventory Value"
          value="$890K"
          change={-2.4}
          changeLabel="vs last month"
          icon={<Package className="h-5 w-5" />}
          variant="inventory"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Revenue Trend"
          subtitle="Monthly revenue for 2024"
          type="area"
          data={revenueData}
          className="lg:col-span-2"
        />
        <ChartWidget
          title="Spend by Department"
          subtitle="Current quarter allocation"
          type="pie"
          data={departmentSpend}
          showLegend
          height={280}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-success/10">
            <CheckCircle className="h-6 w-6 text-status-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">94%</p>
            <p className="text-sm text-muted-foreground">On-time Delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-warning/10">
            <Clock className="h-6 w-6 text-status-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-error/10">
            <AlertTriangle className="h-6 w-6 text-status-error" />
          </div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-info/10">
            <TrendingUp className="h-6 w-6 text-status-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">$45K</p>
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          </div>
        </div>
      </div>

      {/* Tables and Timeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        <TableWidget
          title="Pending Approvals"
          subtitle="Items requiring your attention"
          columns={[
            { key: 'type', header: 'Type' },
            { key: 'reference', header: 'Reference' },
            { key: 'amount', header: 'Amount' },
            { key: 'requester', header: 'Requester' },
            {
              key: 'status',
              header: 'Status',
              render: (item) => <StatusBadge status={item.status} />,
            },
          ]}
          data={pendingApprovals}
          actions={[
            { label: 'Approve', onClick: () => {} },
            { label: 'Review', onClick: () => {} },
            { label: 'Reject', onClick: () => {} },
          ]}
          className="lg:col-span-2"
        />
        
        <ActivityTimeline
          title="Recent Activity"
          items={recentActivity}
        />
      </div>

      {/* Budget Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MultiProgressCard
          title="Q1 Budget Utilization"
          items={[
            { label: 'Used', value: 68, color: 'hsl(var(--chart-1))' },
            { label: 'Committed', value: 15, color: 'hsl(var(--chart-3))' },
            { label: 'Available', value: 17, color: 'hsl(var(--chart-2))' },
          ]}
          total={100}
        />
        <MultiProgressCard
          title="Project Portfolio Status"
          items={[
            { label: 'Completed', value: 12, color: 'hsl(var(--status-success))' },
            { label: 'In Progress', value: 8, color: 'hsl(var(--status-info))' },
            { label: 'On Hold', value: 3, color: 'hsl(var(--status-warning))' },
            { label: 'Planning', value: 5, color: 'hsl(var(--status-pending))' },
          ]}
          total={28}
        />
      </div>
    </div>
  );
}
