import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, BarChart3 } from 'lucide-react';

const cashFlowData = [
  { name: 'Jan', value: 3200 }, { name: 'Feb', value: 2800 },
  { name: 'Mar', value: 4100 }, { name: 'Apr', value: 3700 },
  { name: 'May', value: 5200 }, { name: 'Jun', value: 4800 },
];

const expenseBreakdown = [
  { name: 'Salaries', value: 42 }, { name: 'Operations', value: 22 },
  { name: 'Marketing', value: 15 }, { name: 'R&D', value: 12 },
  { name: 'Admin', value: 9 },
];

const budgetComparison = [
  { dept: 'Sales', budget: 2400, actual: 2280, variance: 5.0 },
  { dept: 'Engineering', budget: 3800, actual: 3950, variance: -3.9 },
  { dept: 'Marketing', budget: 1200, actual: 1050, variance: 12.5 },
  { dept: 'Operations', budget: 1800, actual: 1760, variance: 2.2 },
  { dept: 'HR', budget: 800, actual: 790, variance: 1.3 },
];

const ratios = [
  { label: 'Current Ratio', value: '2.4:1', benchmark: '2.0:1' },
  { label: 'Quick Ratio', value: '1.8:1', benchmark: '1.5:1' },
  { label: 'Debt-to-Equity', value: '0.45', benchmark: '<0.5' },
  { label: 'ROE', value: '18.4%', benchmark: '15%' },
  { label: 'ROA', value: '12.1%', benchmark: '10%' },
  { label: 'Interest Coverage', value: '8.2x', benchmark: '5x' },
];

export function FinancialPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Financial Overview" description="CFO financial health dashboard with key metrics and ratios" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value="$62.3M" change={14.2} changeLabel="YoY" icon={<DollarSign className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Net Income" value="$11.5M" change={8.7} changeLabel="YoY" icon={<TrendingUp className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Operating Cash" value="$8.2M" change={5.3} changeLabel="QoQ" icon={<Wallet className="h-5 w-5" />} variant="finance" />
        <StatsCard title="Total Debt" value="$14.1M" change={-3.2} changeLabel="reduction" icon={<CreditCard className="h-5 w-5" />} variant="finance" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget title="Cash Flow Trend" subtitle="Monthly net cash flow ($K)" type="area" data={cashFlowData} className="lg:col-span-2" />
        <ChartWidget title="Expense Breakdown" subtitle="% of total expenses" type="pie" data={expenseBreakdown} showLegend height={280} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Budget vs Actual ($K)</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Department</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">Variance</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {budgetComparison.map((r) => (
                  <TableRow key={r.dept}>
                    <TableCell className="font-medium">{r.dept}</TableCell>
                    <TableCell className="text-right">${r.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${r.actual.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-medium ${r.variance >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                      {r.variance >= 0 ? '+' : ''}{r.variance}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Financial Ratios</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {ratios.map((r) => (
                <div key={r.label} className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="text-lg font-bold">{r.value}</p>
                  <p className="text-xs text-muted-foreground">Benchmark: {r.benchmark}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treasury Snapshot */}
      <Card>
        <CardHeader><CardTitle className="text-base">Treasury Snapshot</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cash & Equivalents</p>
              <p className="text-2xl font-bold">$22.4M</p>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">75% of target reserve</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Short-term Investments</p>
              <p className="text-2xl font-bold">$8.6M</p>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-muted-foreground">60% utilization</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Credit Facility Available</p>
              <p className="text-2xl font-bold">$15M</p>
              <Progress value={20} className="h-2" />
              <p className="text-xs text-muted-foreground">20% drawn</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
