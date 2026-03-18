import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Cpu, Lightbulb, Rocket, Bug, Code, Layers, GitBranch, Gauge } from 'lucide-react';

const innovationPipeline = [
  { stage: 'Ideation', count: 24, color: 'bg-blue-500' },
  { stage: 'Research', count: 12, color: 'bg-indigo-500' },
  { stage: 'Prototype', count: 6, color: 'bg-violet-500' },
  { stage: 'Pilot', count: 3, color: 'bg-purple-500' },
  { stage: 'Production', count: 2, color: 'bg-emerald-500' },
];

const rdProjects = [
  { name: 'AI-Powered Analytics', budget: '$1.2M', progress: 72, status: 'on-track' },
  { name: 'Cloud Migration v3', budget: '$800K', progress: 45, status: 'on-track' },
  { name: 'IoT Platform', budget: '$650K', progress: 28, status: 'at-risk' },
  { name: 'Mobile App Redesign', budget: '$400K', progress: 90, status: 'on-track' },
];

const techDebtData = [
  { name: 'Legacy APIs', value: 35 }, { name: 'Infra', value: 25 },
  { name: 'Security', value: 20 }, { name: 'Testing', value: 15 },
  { name: 'Documentation', value: 5 },
];

const performanceMetrics = [
  { label: 'API Latency (P99)', value: '142ms', target: '<200ms', met: true },
  { label: 'Uptime (30d)', value: '99.97%', target: '99.9%', met: true },
  { label: 'Deploy Frequency', value: '18/week', target: '15/week', met: true },
  { label: 'MTTR', value: '24 min', target: '<30 min', met: true },
  { label: 'Test Coverage', value: '78%', target: '80%', met: false },
  { label: 'Build Time', value: '4.2 min', target: '<5 min', met: true },
];

const statusColors: Record<string, string> = {
  'on-track': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'at-risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function TechnologyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Technology Dashboard" description="CTO view of technology strategy, innovation, and performance" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="R&D Spend" value="$3.1M" change={12} changeLabel="YoY" icon={<Lightbulb className="h-5 w-5" />} />
        <StatsCard title="Active Projects" value="14" change={3} changeLabel="new this Q" icon={<Rocket className="h-5 w-5" />} />
        <StatsCard title="Tech Debt Score" value="B+" change={1} changeLabel="grade improvement" icon={<Bug className="h-5 w-5" />} />
        <StatsCard title="Engineering Team" value="86" change={8} changeLabel="new hires" icon={<Code className="h-5 w-5" />} />
      </div>

      {/* Innovation Pipeline */}
      <Card>
        <CardHeader><CardTitle className="text-base">Innovation Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            {innovationPipeline.map((s) => (
              <div key={s.stage} className="flex-1 text-center">
                <div className={`mx-auto mb-2 rounded-lg ${s.color} flex items-center justify-center text-white font-bold`}
                  style={{ height: `${Math.max(s.count * 4, 32)}px` }}>
                  {s.count}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{s.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* R&D Projects */}
        <Card>
          <CardHeader><CardTitle className="text-base">R&D Projects</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {rdProjects.map((p) => (
              <div key={p.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{p.budget}</span>
                    <Badge className={statusColors[p.status]}>{p.status}</Badge>
                  </div>
                </div>
                <Progress value={p.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{p.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tech Debt */}
        <ChartWidget title="Technical Debt Distribution" subtitle="By category" type="pie" data={techDebtData} showLegend height={300} />
      </div>

      {/* System Performance */}
      <Card>
        <CardHeader><CardTitle className="text-base">System Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {performanceMetrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-bold">{m.value}</p>
                  <p className="text-xs text-muted-foreground">Target: {m.target}</p>
                </div>
                <div className={`h-3 w-3 rounded-full ${m.met ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
