import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { HRDashboard } from './HRDashboard';
import { SalesDashboard } from './SalesDashboard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { 
  LayoutDashboard, CheckSquare, Clock, FileText, CalendarDays, 
  Bell, Wallet
} from 'lucide-react';

// Employee self-service dashboard (default for regular employees)
function EmployeeDashboard() {
  const { user } = useAuth();
  
  const myTasks = [
    { id: '1', title: 'Complete project proposal', description: 'Due tomorrow', time: 'High priority', status: 'warning' as const },
    { id: '2', title: 'Review code changes', description: 'PR #234 awaiting review', time: '2 hours left', status: 'info' as const },
    { id: '3', title: 'Team meeting', description: 'Sprint planning session', time: 'Today 3:00 PM', status: 'info' as const },
    { id: '4', title: 'Submit timesheet', description: 'Week ending Jan 26', time: 'Due today', status: 'warning' as const },
  ];

  const recentData = [
    { name: 'Mon', value: 8 },
    { name: 'Tue', value: 7.5 },
    { name: 'Wed', value: 8.5 },
    { name: 'Thu', value: 8 },
    { name: 'Fri', value: 7 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
        description="Here's your personal dashboard overview"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="My Tasks"
          value="12"
          change={3}
          changeLabel="new today"
          icon={<CheckSquare className="h-5 w-5" />}
        />
        <StatsCard
          title="Hours This Week"
          value="32.5"
          changeLabel="of 40 target"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Leave Balance"
          value="15 days"
          changeLabel="annual leave"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending Requests"
          value="2"
          changeLabel="awaiting approval"
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Hours Logged This Week"
          subtitle="Daily breakdown"
          type="bar"
          data={recentData}
          height={250}
          className="lg:col-span-2"
        />
        <ActivityTimeline
          title="My Tasks"
          items={myTasks}
        />
      </div>
    </div>
  );
}

// Portal dashboard for external users (customers/vendors)
function PortalDashboard() {
  const { user } = useAuth();
  
  const activity = [
    { id: '1', title: 'Order #ORD-2024-001 shipped', description: 'Expected delivery: Jan 28', time: '1 hour ago', status: 'success' as const },
    { id: '2', title: 'Invoice #INV-2024-042 created', description: 'Amount: $5,400', time: '3 hours ago', status: 'info' as const },
    { id: '3', title: 'Support ticket resolved', description: 'Ticket #TKT-2024-012', time: '1 day ago', status: 'success' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name || 'User'}!`}
        description={`${user?.role === 'customer' ? 'Customer' : 'Vendor'} Portal Dashboard`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title={user?.role === 'customer' ? 'Active Orders' : 'Purchase Orders'}
          value="5"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatsCard
          title="Open Invoices"
          value="$12,400"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatsCard
          title="Notifications"
          value="3"
          icon={<Bell className="h-5 w-5" />}
        />
      </div>

      <ActivityTimeline
        title="Recent Activity"
        items={activity}
        maxItems={5}
      />
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  // Route to role-specific dashboard
  switch (user.role) {
    case 'admin':
    case 'executive':
      return <ExecutiveDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'sales':
      return <SalesDashboard />;
    case 'customer':
    case 'vendor':
      return <PortalDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}
