import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Monitor, AlertTriangle, CheckCircle, Server, Headphones, Globe, Lock } from 'lucide-react';

const complianceScores = [
  { framework: 'ISO 27001', score: 94, status: 'compliant', lastAudit: 'Jan 2026' },
  { framework: 'SOC 2 Type II', score: 91, status: 'compliant', lastAudit: 'Dec 2025' },
  { framework: 'GDPR', score: 88, status: 'minor-findings', lastAudit: 'Feb 2026' },
  { framework: 'PCI DSS', score: 96, status: 'compliant', lastAudit: 'Nov 2025' },
];

const vendorRisks = [
  { vendor: 'AWS', risk: 'low', spend: '$420K/yr', contract: 'Dec 2027', score: 95 },
  { vendor: 'Salesforce', risk: 'low', spend: '$180K/yr', contract: 'Jun 2026', score: 90 },
  { vendor: 'DataDog', risk: 'medium', spend: '$65K/yr', contract: 'Mar 2026', score: 78 },
  { vendor: 'Legacy ERP Vendor', risk: 'high', spend: '$240K/yr', contract: 'Sep 2026', score: 55 },
];

const techPortfolio = [
  { category: 'Cloud Infrastructure', systems: 8, health: 96 },
  { category: 'Business Applications', systems: 12, health: 88 },
  { category: 'Security Tools', systems: 6, health: 94 },
  { category: 'Communication', systems: 4, health: 92 },
  { category: 'Legacy Systems', systems: 3, health: 62 },
];

const riskColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  compliant: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'minor-findings': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function ITGovernancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="IT Governance" description="CIO view of IT compliance, security, and vendor management" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="System Uptime" value="99.97%" change={0.02} changeLabel="improvement" icon={<Server className="h-5 w-5" />} />
        <StatsCard title="Security Incidents" value="2" change={-3} changeLabel="vs last month" icon={<Shield className="h-5 w-5" />} />
        <StatsCard title="Open Tickets" value="47" change={-12} changeLabel="resolved" icon={<Headphones className="h-5 w-5" />} />
        <StatsCard title="Digital Transform." value="68%" change={5} changeLabel="progress" icon={<Globe className="h-5 w-5" />} />
      </div>

      {/* Digital Transformation Progress */}
      <Card>
        <CardHeader><CardTitle className="text-base">Digital Transformation Progress</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm"><span>Overall Progress</span><span className="font-medium">68%</span></div>
            <Progress value={68} className="h-3" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">12</p>
              <p className="text-xs text-muted-foreground">Initiatives Completed</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-muted-foreground">5</p>
              <p className="text-xs text-muted-foreground">Planned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Scorecards */}
        <Card>
          <CardHeader><CardTitle className="text-base">Compliance Scorecards</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {complianceScores.map((c) => (
              <div key={c.framework} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{c.framework}</p>
                    <p className="text-xs text-muted-foreground">Last audit: {c.lastAudit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{c.score}%</span>
                  <Badge className={riskColors[c.status]}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vendor Risk */}
        <Card>
          <CardHeader><CardTitle className="text-base">Vendor Risk Assessment</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Vendor</TableHead><TableHead>Spend</TableHead><TableHead>Score</TableHead><TableHead>Risk</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {vendorRisks.map((v) => (
                  <TableRow key={v.vendor}>
                    <TableCell className="font-medium">{v.vendor}</TableCell>
                    <TableCell>{v.spend}</TableCell>
                    <TableCell>{v.score}</TableCell>
                    <TableCell><Badge className={riskColors[v.risk]}>{v.risk}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Technology Portfolio */}
      <Card>
        <CardHeader><CardTitle className="text-base">Technology Portfolio Health</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {techPortfolio.map((t) => (
              <div key={t.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.category} <span className="text-muted-foreground">({t.systems} systems)</span></span>
                  <span className={`font-medium ${t.health >= 90 ? 'text-emerald-600' : t.health >= 75 ? 'text-amber-600' : 'text-destructive'}`}>{t.health}%</span>
                </div>
                <Progress value={t.health} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
