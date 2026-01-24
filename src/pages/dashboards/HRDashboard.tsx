import React from 'react';
import {
  Users, UserPlus, CalendarOff, Clock, Briefcase, GraduationCap,
  TrendingUp, AlertCircle
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { TableWidget } from '@/components/dashboard/TableWidget';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { MultiProgressCard } from '@/components/dashboard/ProgressCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UserAvatar } from '@/components/shared/AvatarGroup';

// Mock data for HR dashboard
const headcountData = [
  { name: 'Jan', value: 235 },
  { name: 'Feb', value: 238 },
  { name: 'Mar', value: 240 },
  { name: 'Apr', value: 242 },
  { name: 'May', value: 245 },
  { name: 'Jun', value: 248 },
];

const departmentBreakdown = [
  { name: 'Engineering', value: 68 },
  { name: 'Sales', value: 45 },
  { name: 'Operations', value: 38 },
  { name: 'Marketing', value: 32 },
  { name: 'HR', value: 18 },
  { name: 'Finance', value: 22 },
  { name: 'Other', value: 25 },
];

const pendingLeaveRequests = [
  { id: '1', employee: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', type: 'Annual', dates: 'Jan 28 - Feb 2', days: 5, status: 'pending' },
  { id: '2', employee: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', type: 'Sick', dates: 'Jan 25', days: 1, status: 'pending' },
  { id: '3', employee: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', type: 'Personal', dates: 'Feb 5 - Feb 6', days: 2, status: 'pending' },
  { id: '4', employee: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', type: 'Annual', dates: 'Feb 12 - Feb 16', days: 5, status: 'pending' },
];

const recentHires = [
  { id: '1', name: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', department: 'Engineering', position: 'Senior Developer', startDate: 'Jan 15, 2024' },
  { id: '2', name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', department: 'Marketing', position: 'Content Manager', startDate: 'Jan 10, 2024' },
  { id: '3', name: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', department: 'Sales', position: 'Account Executive', startDate: 'Jan 8, 2024' },
];

const hrActivity = [
  { id: '1', title: 'Onboarding completed', description: 'Alex Thompson completed orientation', time: '2 hours ago', status: 'success' as const },
  { id: '2', title: 'Leave approved', description: 'Sarah Johnson - 3 days annual leave', time: '4 hours ago', status: 'success' as const },
  { id: '3', title: 'Performance review due', description: '5 reviews pending for this week', time: '1 day ago', status: 'warning' as const },
  { id: '4', title: 'New job posting', description: 'Product Manager position published', time: '1 day ago', status: 'info' as const },
  { id: '5', title: 'Training scheduled', description: 'Leadership workshop on Feb 15', time: '2 days ago', status: 'info' as const },
];

export function HRDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Dashboard"
        description="Human resources overview and workforce metrics"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Dashboard' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value="248"
          change={3.1}
          changeLabel="this month"
          icon={<Users className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Open Positions"
          value="12"
          change={2}
          changeLabel="new this week"
          icon={<Briefcase className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Pending Leave Requests"
          value="8"
          change={-3}
          changeLabel="vs yesterday"
          icon={<CalendarOff className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Attendance Rate"
          value="96.5%"
          change={0.5}
          changeLabel="vs last week"
          icon={<Clock className="h-5 w-5" />}
          variant="hr"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Headcount Trend"
          subtitle="Monthly employee count"
          type="line"
          data={headcountData}
          className="lg:col-span-2"
          colors={['hsl(var(--module-hr))']}
        />
        <ChartWidget
          title="Department Distribution"
          subtitle="Employees by department"
          type="pie"
          data={departmentBreakdown}
          showLegend
          height={280}
        />
      </div>

      {/* Leave and Training Progress */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MultiProgressCard
          title="Leave Status (This Week)"
          items={[
            { label: 'On Leave', value: 8, color: 'hsl(var(--status-warning))' },
            { label: 'Working', value: 235, color: 'hsl(var(--status-success))' },
            { label: 'Holiday', value: 5, color: 'hsl(var(--status-info))' },
          ]}
          total={248}
        />
        <MultiProgressCard
          title="Training Completion"
          items={[
            { label: 'Completed', value: 180, color: 'hsl(var(--status-success))' },
            { label: 'In Progress', value: 45, color: 'hsl(var(--status-info))' },
            { label: 'Not Started', value: 23, color: 'hsl(var(--muted-foreground))' },
          ]}
          total={248}
        />
        <MultiProgressCard
          title="Performance Reviews"
          items={[
            { label: 'Completed', value: 42, color: 'hsl(var(--status-success))' },
            { label: 'Pending', value: 15, color: 'hsl(var(--status-warning))' },
            { label: 'Scheduled', value: 8, color: 'hsl(var(--status-info))' },
          ]}
          total={65}
        />
        <MultiProgressCard
          title="Recruitment Pipeline"
          items={[
            { label: 'Screening', value: 28, color: 'hsl(var(--status-pending))' },
            { label: 'Interview', value: 12, color: 'hsl(var(--status-info))' },
            { label: 'Offer', value: 4, color: 'hsl(var(--status-warning))' },
            { label: 'Hired', value: 6, color: 'hsl(var(--status-success))' },
          ]}
          total={50}
        />
      </div>

      {/* Tables and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <TableWidget
          title="Pending Leave Requests"
          subtitle="Requests awaiting approval"
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (item) => (
                <UserAvatar src={item.avatar} name={item.employee} showName />
              ),
            },
            { key: 'type', header: 'Type' },
            { key: 'dates', header: 'Dates' },
            { key: 'days', header: 'Days', className: 'text-center' },
            {
              key: 'status',
              header: 'Status',
              render: (item) => <StatusBadge status={item.status} />,
            },
          ]}
          data={pendingLeaveRequests}
          onViewAll={() => {}}
          actions={[
            { label: 'Approve', onClick: () => {} },
            { label: 'Reject', onClick: () => {} },
          ]}
          className="lg:col-span-2"
        />
        
        <ActivityTimeline
          title="HR Activity"
          items={hrActivity}
        />
      </div>

      {/* Recent Hires */}
      <TableWidget
        title="Recent Hires"
        subtitle="New employees this month"
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (item) => (
              <UserAvatar src={item.avatar} name={item.name} showName subtitle={item.position} />
            ),
          },
          { key: 'department', header: 'Department' },
          { key: 'position', header: 'Position' },
          { key: 'startDate', header: 'Start Date' },
        ]}
        data={recentHires}
        onViewAll={() => {}}
      />
    </div>
  );
}
