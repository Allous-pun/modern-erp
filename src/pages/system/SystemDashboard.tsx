import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Database, Users, Activity, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Security Policies', path: '/admin/security-policies', icon: Shield },
  { label: 'Compliance', path: '/admin/compliance', icon: FileCheck },
  { label: 'Risk Dashboard', path: '/admin/risk', icon: AlertTriangle },
  { label: 'Privacy Settings', path: '/admin/privacy', icon: Database },
  { label: 'Backups', path: '/admin/backups', icon: Database },
  { label: 'System Config', path: '/admin/system-config', icon: Activity },
];

export function SystemDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Overview" description="Monitor system health, security, and compliance status" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Security Score" value="92/100" icon={<Shield className="h-5 w-5" />} trend={{ value: 3, isPositive: true }} />
        <StatsCard title="Open Risks" value="7" icon={<AlertTriangle className="h-5 w-5" />} trend={{ value: 2, isPositive: false }} />
        <StatsCard title="Compliance Rate" value="96%" icon={<FileCheck className="h-5 w-5" />} trend={{ value: 1, isPositive: true }} />
        <StatsCard title="Active Users" value="148" icon={<Users className="h-5 w-5" />} trend={{ value: 12, isPositive: true }} />
      </div>
      <Card>
        <CardHeader><CardTitle>Quick Access</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map(l => (
              <Link key={l.path} to={l.path} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <l.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{l.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
