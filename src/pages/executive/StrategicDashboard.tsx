import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign, TrendingUp, Globe, Leaf, Users, Scale,
  Calendar, ArrowUpRight, Target
} from 'lucide-react';

const revenueData = [
  { name: 'Q1', value: 12400 }, { name: 'Q2', value: 14800 },
  { name: 'Q3', value: 16200 }, { name: 'Q4', value: 18900 },
];

const marketShareData = [
  { name: 'Our Company', value: 32 }, { name: 'Competitor A', value: 24 },
  { name: 'Competitor B', value: 18 }, { name: 'Others', value: 26 },
];

const strategicKPIs = [
  { label: 'Customer Retention', value: '94.2%', target: '95%', status: 'on-track' },
  { label: 'NPS Score', value: '72', target: '75', status: 'at-risk' },
  { label: 'Employee Engagement', value: '4.3/5', target: '4.5', status: 'on-track' },
  { label: 'Innovation Index', value: '8.1/10', target: '8.0', status: 'achieved' },
  { label: 'Digital Adoption', value: '78%', target: '80%', status: 'at-risk' },
  { label: 'Sustainability Score', value: 'A-', target: 'A', status: 'on-track' },
];

const boardMeetings = [
  { date: 'Mar 28, 2026', topic: 'Q1 Financial Review', status: 'upcoming' },
  { date: 'Apr 15, 2026', topic: 'Strategic Plan Revision', status: 'scheduled' },
  { date: 'Feb 20, 2026', topic: 'Annual Budget Approval', status: 'completed' },
];

const statusColors: Record<string, string> = {
  'on-track': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'at-risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'achieved': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function StrategicDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategic Dashboard"
        description="Corporate scorecard and strategic KPIs for board members and executives"
      />

      {/* Corporate Scorecard */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Annual Revenue" value="$62.3M" change={14.2} changeLabel="YoY" icon={<DollarSign className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Net Profit Margin" value="18.4%" change={2.1} changeLabel="vs target" icon={<TrendingUp className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Market Share" value="32%" change={3.5} changeLabel="YoY" icon={<Globe className="h-5 w-5" />} variant="sales" />
        <StatsCard title="Total Headcount" value="1,248" change={8.3} changeLabel="growth" icon={<Users className="h-5 w-5" />} variant="hr" />
      </div>

      {/* ESG Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Environmental</p>
              <p className="text-2xl font-bold">A-</p>
              <p className="text-xs text-muted-foreground">Carbon neutral by 2028</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Social</p>
              <p className="text-2xl font-bold">B+</p>
              <p className="text-xs text-muted-foreground">DEI score improved 12%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <Scale className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Governance</p>
              <p className="text-2xl font-bold">A</p>
              <p className="text-xs text-muted-foreground">Full board independence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget title="Quarterly Revenue" subtitle="FY 2026" type="bar" data={revenueData} className="lg:col-span-2" />
        <ChartWidget title="Market Share" subtitle="Current quarter" type="pie" data={marketShareData} showLegend height={280} />
      </div>

      {/* Strategic KPIs & Board Meetings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Strategic KPIs</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {strategicKPIs.map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{kpi.label}</p>
                    <p className="text-lg font-bold">{kpi.value} <span className="text-xs font-normal text-muted-foreground">/ {kpi.target}</span></p>
                  </div>
                  <Badge className={statusColors[kpi.status]}>{kpi.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Board Meetings</CardTitle>
            <Button variant="ghost" size="sm"><Calendar className="mr-1 h-4 w-4" /> View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {boardMeetings.map((m) => (
              <div key={m.topic} className="flex items-start gap-3 rounded-lg border p-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.topic}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
                <Badge variant={m.status === 'completed' ? 'secondary' : 'outline'}>{m.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
