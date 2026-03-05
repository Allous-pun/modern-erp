import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  { label: 'Frameworks', path: '/admin/compliance/frameworks', count: 4 },
  { label: 'Checklists', path: '/admin/compliance/checklists', count: 12 },
  { label: 'Audits', path: '/admin/compliance/audits', count: 3 },
  { label: 'Reports', path: '/admin/compliance/reports', count: 8 },
];

export function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Overview" description="Track compliance status across all frameworks" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Overall Compliance" value="96%" icon={<FileCheck className="h-5 w-5" />} trend={{ value: 2, isPositive: true }} />
        <StatsCard title="Open Findings" value="8" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatsCard title="Completed Checks" value="142" icon={<CheckCircle className="h-5 w-5" />} />
        <StatsCard title="Pending Reviews" value="5" icon={<Clock className="h-5 w-5" />} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map(s => (
          <Link key={s.path} to={s.path}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="py-6 text-center">
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Compliance by Framework</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[{ name: 'SOC 2', progress: 98 }, { name: 'ISO 27001', progress: 94 }, { name: 'GDPR', progress: 96 }, { name: 'HIPAA', progress: 91 }].map(f => (
            <div key={f.name} className="space-y-1">
              <div className="flex justify-between text-sm"><span>{f.name}</span><span className="text-muted-foreground">{f.progress}%</span></div>
              <Progress value={f.progress} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
