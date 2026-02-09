import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Factory, ClipboardList, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const productionData = [
  { name: 'Mon', planned: 120, actual: 115 },
  { name: 'Tue', planned: 130, actual: 128 },
  { name: 'Wed', planned: 125, actual: 130 },
  { name: 'Thu', planned: 140, actual: 135 },
  { name: 'Fri', planned: 135, actual: 140 },
  { name: 'Sat', planned: 80, actual: 82 },
  { name: 'Sun', planned: 0, actual: 0 },
];

const activeWorkOrders = [
  { id: 'WO-2024-001', product: 'Widget Assembly A', quantity: 500, progress: 75, status: 'in_progress', dueDate: '2024-02-10' },
  { id: 'WO-2024-002', product: 'Component X-42', quantity: 1000, progress: 45, status: 'in_progress', dueDate: '2024-02-12' },
  { id: 'WO-2024-003', product: 'Module B-Series', quantity: 250, progress: 90, status: 'in_progress', dueDate: '2024-02-08' },
  { id: 'WO-2024-004', product: 'Assembly Kit Pro', quantity: 150, progress: 20, status: 'pending', dueDate: '2024-02-15' },
];

const qualityMetrics = [
  { metric: 'First Pass Yield', value: 96.5, target: 95, unit: '%' },
  { metric: 'Defect Rate', value: 1.2, target: 2, unit: '%' },
  { metric: 'Scrap Rate', value: 0.8, target: 1, unit: '%' },
  { metric: 'Rework Rate', value: 2.1, target: 3, unit: '%' },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    in_progress: 'default',
    pending: 'secondary',
    completed: 'outline',
    delayed: 'destructive',
  };
  return <Badge variant={variants[status] || 'secondary'} className="capitalize">{status.replace('_', ' ')}</Badge>;
};

export function ManufacturingDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manufacturing"
        description="Production overview and work order management"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Work Orders"
          value="24"
          change={8}
          changeLabel="vs last week"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatsCard
          title="Production Efficiency"
          value="94.2%"
          change={2.3}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Units Produced Today"
          value="1,284"
          change={12}
          changeLabel="vs yesterday"
          icon={<Factory className="h-5 w-5" />}
        />
        <StatsCard
          title="Quality Score"
          value="96.5%"
          change={0.5}
          changeLabel="vs last week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget
          title="Production Output"
          subtitle="Planned vs Actual units this week"
          type="bar"
          data={productionData}
          dataKey="actual"
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityMetrics.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metric.metric}</span>
                  <span className={metric.value <= metric.target ? 'text-primary' : 'text-destructive'}>
                    {metric.value}{metric.unit} / {metric.target}{metric.unit}
                  </span>
                </div>
                <Progress 
                  value={metric.metric.includes('Yield') ? metric.value : 100 - (metric.value / metric.target * 50)} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Work Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Active Work Orders</CardTitle>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> Real-time
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeWorkOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{order.product}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qty: {order.quantity.toLocaleString()} • Due: {order.dueDate}
                  </p>
                </div>
                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-medium">{order.progress}%</span>
                  </div>
                  <Progress value={order.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-medium text-destructive">3 Overdue Orders</p>
                <p className="text-sm text-muted-foreground">Require immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-600">5 Due Today</p>
                <p className="text-sm text-muted-foreground">On track for completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-primary">12 Completed Today</p>
                <p className="text-sm text-muted-foreground">98% on-time delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
