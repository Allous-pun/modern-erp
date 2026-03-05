import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingDown, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const topRisks = [
  { id: '1', name: 'Data Breach via Third-Party', severity: 'critical', likelihood: 'medium', status: 'open' },
  { id: '2', name: 'Regulatory Non-Compliance', severity: 'high', likelihood: 'low', status: 'mitigating' },
  { id: '3', name: 'System Downtime', severity: 'high', likelihood: 'medium', status: 'open' },
  { id: '4', name: 'Insider Threat', severity: 'medium', likelihood: 'low', status: 'monitoring' },
];

const severityColor = (s: string) => s === 'critical' ? 'destructive' : s === 'high' ? 'default' : 'secondary';

export function RiskDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Risk Dashboard" description="Overview of organizational risk posture" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Risks" value="18" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatsCard title="Critical" value="3" icon={<Shield className="h-5 w-5" />} change={-1} changeLabel="vs last month" />
        <StatsCard title="Mitigated (MTD)" value="5" icon={<TrendingDown className="h-5 w-5" />} change={2} changeLabel="vs last month" />
        <StatsCard title="Assessments Due" value="2" icon={<Activity className="h-5 w-5" />} />
      </div>
      <Card>
        <CardHeader><CardTitle>Top Risks</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {topRisks.map(r => (
            <Link key={r.id} to={`/admin/risks/${r.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">Likelihood: {r.likelihood}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={severityColor(r.severity) as any}>{r.severity}</Badge>
                <Badge variant="outline">{r.status}</Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
