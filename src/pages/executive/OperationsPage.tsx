import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Truck, Factory, CheckCircle, AlertTriangle, Clock, Gauge, Package } from 'lucide-react';

const efficiencyData = [
  { name: 'Jan', value: 87 }, { name: 'Feb', value: 89 }, { name: 'Mar', value: 91 },
  { name: 'Apr', value: 88 }, { name: 'May', value: 93 }, { name: 'Jun', value: 92 },
];

const supplyChainStatus = [
  { supplier: 'Raw Materials Co.', status: 'on-time', lead: '5 days', reliability: 96 },
  { supplier: 'Component Ltd.', status: 'delayed', lead: '12 days', reliability: 82 },
  { supplier: 'Packaging Inc.', status: 'on-time', lead: '3 days', reliability: 98 },
  { supplier: 'Tech Parts Global', status: 'at-risk', lead: '8 days', reliability: 88 },
];

const productionLines = [
  { name: 'Line A — Assembly', utilization: 94, status: 'running' },
  { name: 'Line B — Packaging', utilization: 78, status: 'running' },
  { name: 'Line C — Testing', utilization: 45, status: 'maintenance' },
  { name: 'Line D — Finishing', utilization: 88, status: 'running' },
];

const alerts = [
  { message: 'Line C scheduled maintenance until 5 PM', severity: 'info' },
  { message: 'Supplier delay: Component Ltd. shipment ETA +3 days', severity: 'warning' },
  { message: 'Quality defect rate above threshold on Line B', severity: 'error' },
];

const statusColors: Record<string, string> = {
  'on-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  delayed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'at-risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  running: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const alertColors: Record<string, string> = {
  info: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
  warning: 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20',
  error: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20',
};

export function OperationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Operations Dashboard" description="Real-time operations monitoring and supply chain visibility" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="OEE Score" value="91.2%" change={2.4} changeLabel="vs target" icon={<Gauge className="h-5 w-5" />} />
        <StatsCard title="On-Time Delivery" value="94%" change={1.2} changeLabel="improvement" icon={<Truck className="h-5 w-5" />} />
        <StatsCard title="Defect Rate" value="0.8%" change={-0.3} changeLabel="reduction" icon={<CheckCircle className="h-5 w-5" />} />
        <StatsCard title="Order Backlog" value="142" change={-5} changeLabel="vs last week" icon={<Package className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget title="Process Efficiency Trend" subtitle="Monthly OEE %" type="line" data={efficiencyData} />

        <Card>
          <CardHeader><CardTitle className="text-base">Production Line Monitor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {productionLines.map((line) => (
              <div key={line.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{line.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[line.status]}>{line.status}</Badge>
                    <span className="tabular-nums font-medium">{line.utilization}%</span>
                  </div>
                </div>
                <Progress value={line.utilization} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Supply Chain Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supplyChainStatus.map((s) => (
                <div key={s.supplier} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{s.supplier}</p>
                    <p className="text-xs text-muted-foreground">Lead time: {s.lead} · Reliability: {s.reliability}%</p>
                  </div>
                  <Badge className={statusColors[s.status]}>{s.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`rounded-lg p-3 text-sm ${alertColors[a.severity]}`}>
                {a.message}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
