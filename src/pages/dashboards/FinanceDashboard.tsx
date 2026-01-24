import React from 'react';
import {
  DollarSign, CreditCard, FileText, TrendingUp, TrendingDown,
  Wallet, PiggyBank, AlertCircle
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { TableWidget } from '@/components/dashboard/TableWidget';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { StatusBadge } from '@/components/shared/StatusBadge';

// Mock data for finance dashboard
const cashFlowData = [
  { name: 'Jan', value: 65000 },
  { name: 'Feb', value: 78000 },
  { name: 'Mar', value: 52000 },
  { name: 'Apr', value: 89000 },
  { name: 'May', value: 94000 },
  { name: 'Jun', value: 72000 },
];

const expenseBreakdown = [
  { name: 'Payroll', value: 45 },
  { name: 'Operations', value: 25 },
  { name: 'Marketing', value: 15 },
  { name: 'R&D', value: 10 },
  { name: 'Other', value: 5 },
];

const pendingInvoices = [
  { id: '1', number: 'INV-2024-0234', customer: 'Acme Corp', amount: '$12,500', dueDate: 'Jan 28, 2024', status: 'pending' },
  { id: '2', number: 'INV-2024-0235', customer: 'Tech Solutions', amount: '$8,750', dueDate: 'Jan 30, 2024', status: 'pending' },
  { id: '3', number: 'INV-2024-0236', customer: 'Global Industries', amount: '$24,000', dueDate: 'Feb 05, 2024', status: 'pending' },
  { id: '4', number: 'INV-2024-0237', customer: 'StartUp Inc', amount: '$5,200', dueDate: 'Feb 10, 2024', status: 'draft' },
  { id: '5', number: 'INV-2024-0238', customer: 'Enterprise Ltd', amount: '$18,900', dueDate: 'Feb 15, 2024', status: 'pending' },
];

const recentTransactions = [
  { id: '1', description: 'Payment received - Acme Corp', type: 'credit', amount: '+$15,000', date: 'Today', category: 'Revenue' },
  { id: '2', description: 'Payroll processing', type: 'debit', amount: '-$45,000', date: 'Today', category: 'Payroll' },
  { id: '3', description: 'Office supplies', type: 'debit', amount: '-$1,250', date: 'Yesterday', category: 'Operations' },
  { id: '4', description: 'Software license renewal', type: 'debit', amount: '-$2,400', date: 'Yesterday', category: 'IT' },
  { id: '5', description: 'Payment received - Tech Solutions', type: 'credit', amount: '+$8,500', date: 'Jan 22', category: 'Revenue' },
];

export function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Dashboard"
        description="Financial overview and key accounting metrics"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Dashboard' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue (MTD)"
          value="$485,000"
          change={15.3}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="finance"
        />
        <StatsCard
          title="Accounts Receivable"
          value="$124,500"
          change={-8.2}
          changeLabel="vs last month"
          icon={<FileText className="h-5 w-5" />}
          variant="finance"
        />
        <StatsCard
          title="Accounts Payable"
          value="$67,800"
          change={3.5}
          changeLabel="vs last month"
          icon={<CreditCard className="h-5 w-5" />}
          variant="finance"
        />
        <StatsCard
          title="Net Profit"
          value="$89,200"
          change={22.1}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="finance"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Cash Flow"
          subtitle="Monthly cash flow trends"
          type="bar"
          data={cashFlowData}
          className="lg:col-span-2"
          colors={['hsl(var(--module-finance))']}
        />
        <ChartWidget
          title="Expense Distribution"
          subtitle="Current month breakdown"
          type="pie"
          data={expenseBreakdown}
          showLegend
          height={280}
        />
      </div>

      {/* Budget Progress */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressCard
          title="Monthly Budget"
          current={342000}
          total={450000}
          unit=""
          variant="default"
        />
        <ProgressCard
          title="Q1 Forecast"
          current={1200000}
          total={1500000}
          unit=""
          variant="success"
        />
        <ProgressCard
          title="Operating Expenses"
          current={89000}
          total={100000}
          unit=""
          variant="warning"
        />
        <ProgressCard
          title="Marketing Budget"
          current={45000}
          total={50000}
          unit=""
          variant="error"
        />
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TableWidget
          title="Pending Invoices"
          subtitle="Invoices awaiting payment"
          columns={[
            { key: 'number', header: 'Invoice #' },
            { key: 'customer', header: 'Customer' },
            { key: 'amount', header: 'Amount', className: 'text-right' },
            { key: 'dueDate', header: 'Due Date' },
            {
              key: 'status',
              header: 'Status',
              render: (item) => <StatusBadge status={item.status} />,
            },
          ]}
          data={pendingInvoices}
          onViewAll={() => {}}
          actions={[
            { label: 'View', onClick: () => {} },
            { label: 'Send Reminder', onClick: () => {} },
          ]}
        />

        <TableWidget
          title="Recent Transactions"
          subtitle="Latest financial activity"
          columns={[
            { key: 'description', header: 'Description' },
            { key: 'category', header: 'Category' },
            {
              key: 'amount',
              header: 'Amount',
              className: 'text-right font-medium',
              render: (item) => (
                <span className={item.type === 'credit' ? 'text-status-success' : 'text-status-error'}>
                  {item.amount}
                </span>
              ),
            },
            { key: 'date', header: 'Date' },
          ]}
          data={recentTransactions}
          onViewAll={() => {}}
        />
      </div>

      {/* Alerts */}
      <div className="rounded-xl border border-status-warning/30 bg-status-warning-bg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-status-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-status-warning">Budget Alert</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Marketing department has exceeded 90% of their monthly budget. Consider reviewing allocations before month-end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
