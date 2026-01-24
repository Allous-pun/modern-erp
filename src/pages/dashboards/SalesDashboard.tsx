import React from 'react';
import {
  Target, DollarSign, Users, TrendingUp, Briefcase, Megaphone,
  PhoneCall, Calendar
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { TableWidget } from '@/components/dashboard/TableWidget';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { ProgressCard, MultiProgressCard } from '@/components/dashboard/ProgressCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UserAvatar } from '@/components/shared/AvatarGroup';

// Mock data for sales dashboard
const salesData = [
  { name: 'Jan', value: 125000 },
  { name: 'Feb', value: 145000 },
  { name: 'Mar', value: 168000 },
  { name: 'Apr', value: 155000 },
  { name: 'May', value: 189000 },
  { name: 'Jun', value: 210000 },
];

const pipelineData = [
  { name: 'Qualification', value: 45 },
  { name: 'Proposal', value: 28 },
  { name: 'Negotiation', value: 15 },
  { name: 'Closing', value: 8 },
];

const topDeals = [
  { id: '1', company: 'Acme Corporation', contact: 'John Smith', value: '$450,000', stage: 'proposal', probability: '75%', closeDate: 'Feb 15' },
  { id: '2', company: 'Tech Dynamics', contact: 'Sarah Lee', value: '$280,000', stage: 'negotiation', probability: '85%', closeDate: 'Feb 10' },
  { id: '3', company: 'Global Systems', contact: 'Mike Johnson', value: '$520,000', stage: 'qualified', probability: '50%', closeDate: 'Mar 01' },
  { id: '4', company: 'Innovation Labs', contact: 'Emily Chen', value: '$175,000', stage: 'proposal', probability: '60%', closeDate: 'Feb 28' },
  { id: '5', company: 'Enterprise Co', contact: 'David Brown', value: '$320,000', stage: 'closing', probability: '90%', closeDate: 'Jan 30' },
];

const topPerformers = [
  { id: '1', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexj', deals: 12, revenue: '$1.2M', target: '120%' },
  { id: '2', name: 'Maria Garcia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', deals: 10, revenue: '$980K', target: '98%' },
  { id: '3', name: 'Chris Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris', deals: 8, revenue: '$875K', target: '87%' },
];

const recentActivity = [
  { id: '1', title: 'Deal won - Enterprise Co', description: '$320,000 closed by Alex Johnson', time: '1 hour ago', status: 'success' as const },
  { id: '2', title: 'New lead assigned', description: 'Mega Corp assigned to Maria Garcia', time: '2 hours ago', status: 'info' as const },
  { id: '3', title: 'Proposal sent', description: 'Tech Dynamics - $280K proposal', time: '3 hours ago', status: 'pending' as const },
  { id: '4', title: 'Meeting scheduled', description: 'Demo with Global Systems tomorrow', time: '4 hours ago', status: 'info' as const },
  { id: '5', title: 'Follow-up required', description: 'Innovation Labs - no response in 5 days', time: '5 hours ago', status: 'warning' as const },
];

export function SalesDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Dashboard"
        description="Sales performance and pipeline overview"
        breadcrumbs={[
          { label: 'Sales & CRM', path: '/sales' },
          { label: 'Dashboard' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenue (MTD)"
          value="$1.89M"
          change={18.5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="sales"
        />
        <StatsCard
          title="Active Deals"
          value="96"
          change={12}
          changeLabel="new this week"
          icon={<Briefcase className="h-5 w-5" />}
          variant="sales"
        />
        <StatsCard
          title="Conversion Rate"
          value="24.5%"
          change={3.2}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
          variant="sales"
        />
        <StatsCard
          title="Avg. Deal Size"
          value="$45K"
          change={8.7}
          changeLabel="vs last quarter"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="sales"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Revenue Trend"
          subtitle="Monthly revenue performance"
          type="area"
          data={salesData}
          className="lg:col-span-2"
          colors={['hsl(var(--module-sales))']}
        />
        <ChartWidget
          title="Pipeline by Stage"
          subtitle="Deals distribution"
          type="pie"
          data={pipelineData}
          showLegend
          height={280}
        />
      </div>

      {/* Sales Targets and Pipeline */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressCard
          title="Monthly Target"
          current={1890000}
          total={2000000}
          unit=""
          variant="success"
        />
        <ProgressCard
          title="Quarterly Target"
          current={4200000}
          total={6000000}
          unit=""
          variant="warning"
        />
        <MultiProgressCard
          title="Lead Sources"
          items={[
            { label: 'Inbound', value: 45, color: 'hsl(var(--chart-1))' },
            { label: 'Outbound', value: 30, color: 'hsl(var(--chart-2))' },
            { label: 'Referral', value: 15, color: 'hsl(var(--chart-3))' },
            { label: 'Events', value: 10, color: 'hsl(var(--chart-4))' },
          ]}
          total={100}
        />
        <MultiProgressCard
          title="Deal Win Rate"
          items={[
            { label: 'Won', value: 35, color: 'hsl(var(--status-success))' },
            { label: 'Lost', value: 22, color: 'hsl(var(--status-error))' },
            { label: 'Open', value: 43, color: 'hsl(var(--status-info))' },
          ]}
          total={100}
        />
      </div>

      {/* Tables and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <TableWidget
          title="Top Deals"
          subtitle="Highest value opportunities"
          columns={[
            { key: 'company', header: 'Company' },
            { key: 'contact', header: 'Contact' },
            { key: 'value', header: 'Value', className: 'text-right font-medium' },
            {
              key: 'stage',
              header: 'Stage',
              render: (item) => <StatusBadge status={item.stage} />,
            },
            { key: 'probability', header: 'Prob.', className: 'text-center' },
            { key: 'closeDate', header: 'Close Date' },
          ]}
          data={topDeals}
          onViewAll={() => {}}
          actions={[
            { label: 'View Details', onClick: () => {} },
            { label: 'Update Stage', onClick: () => {} },
          ]}
          className="lg:col-span-2"
        />
        
        <ActivityTimeline
          title="Recent Activity"
          items={recentActivity}
        />
      </div>

      {/* Top Performers */}
      <TableWidget
        title="Top Performers"
        subtitle="Sales team leaderboard this month"
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (item) => (
              <UserAvatar src={item.avatar} name={item.name} showName />
            ),
          },
          { key: 'deals', header: 'Deals Closed', className: 'text-center' },
          { key: 'revenue', header: 'Revenue', className: 'text-right font-medium' },
          {
            key: 'target',
            header: 'Target %',
            className: 'text-center',
            render: (item) => (
              <span className={parseInt(item.target) >= 100 ? 'text-status-success font-medium' : ''}>
                {item.target}
              </span>
            ),
          },
        ]}
        data={topPerformers}
      />
    </div>
  );
}
