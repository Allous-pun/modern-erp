import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, Target, BarChart3, ArrowUpRight } from 'lucide-react';

const revenueProfit = [
  { name: 'Jan', revenue: 5200, profit: 1200 }, { name: 'Feb', revenue: 4800, profit: 980 },
  { name: 'Mar', revenue: 6100, profit: 1450 }, { name: 'Apr', revenue: 5700, profit: 1320 },
  { name: 'May', revenue: 7200, profit: 1800 }, { name: 'Jun', revenue: 6800, profit: 1650 },
  { name: 'Jul', revenue: 7500, profit: 1900 }, { name: 'Aug', revenue: 8100, profit: 2100 },
  { name: 'Sep', revenue: 7800, profit: 1950 }, { name: 'Oct', revenue: 8500, profit: 2250 },
  { name: 'Nov', revenue: 9200, profit: 2400 }, { name: 'Dec', revenue: 8800, profit: 2300 },
];

const departmentPerformance = [
  { name: 'Sales', target: 92, actual: 96 },
  { name: 'Engineering', target: 85, actual: 88 },
  { name: 'Marketing', target: 78, actual: 72 },
  { name: 'Operations', target: 90, actual: 91 },
  { name: 'Support', target: 88, actual: 94 },
];

const forecastData = [
  { name: 'Q1', actual: 16100, forecast: 15000 },
  { name: 'Q2', actual: 19700, forecast: 18500 },
  { name: 'Q3', actual: 23400, forecast: 22000 },
  { name: 'Q4', actual: null, forecast: 26500 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Business Analytics" description="Comprehensive analytics and executive insights" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="YTD Revenue" value="$62.3M" change={14.2} changeLabel="YoY" icon={<DollarSign className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Gross Margin" value="42.8%" change={1.5} changeLabel="vs target" icon={<TrendingUp className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Customer Count" value="2,847" change={12.3} changeLabel="growth" icon={<Users className="h-5 w-5" />} variant="sales" />
        <StatsCard title="Win Rate" value="34.2%" change={3.8} changeLabel="improvement" icon={<Target className="h-5 w-5" />} variant="sales" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget title="Revenue & Profit Trend" subtitle="Monthly breakdown" type="area" data={revenueProfit} dataKey="revenue" />
        <ChartWidget title="Forecast vs Actual" subtitle="Quarterly projection" type="bar" data={forecastData.map(d => ({ name: d.name, value: d.actual || d.forecast }))} />
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader><CardTitle className="text-base">Department Performance vs Target</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentPerformance.map((dept) => {
              const met = dept.actual >= dept.target;
              return (
                <div key={dept.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Target: {dept.target}%</span>
                      <Badge className={met ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}>
                        {dept.actual}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={dept.actual} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
