import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, FileCheck, Users, Shield, Clock } from 'lucide-react';

const articles = [
  { name: 'Art. 5 - Data Processing Principles', compliance: 100 },
  { name: 'Art. 6 - Lawfulness of Processing', compliance: 95 },
  { name: 'Art. 7 - Conditions for Consent', compliance: 90 },
  { name: 'Art. 12-14 - Transparency', compliance: 98 },
  { name: 'Art. 15-20 - Data Subject Rights', compliance: 92 },
  { name: 'Art. 25 - Data Protection by Design', compliance: 88 },
  { name: 'Art. 30 - Records of Processing', compliance: 100 },
  { name: 'Art. 32 - Security of Processing', compliance: 95 },
  { name: 'Art. 33-34 - Breach Notification', compliance: 100 },
  { name: 'Art. 35 - Impact Assessment', compliance: 85 },
];

export function GDPRReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="GDPR Compliance Report" description="Detailed GDPR compliance status and reporting">
        <Button><Download className="h-4 w-4 mr-2" /> Export Report</Button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Overall GDPR Score" value="94%" icon={<FileCheck className="h-5 w-5" />} />
        <StatsCard title="DSR Processed" value="23" icon={<Users className="h-5 w-5" />} />
        <StatsCard title="DPIAs Completed" value="4" icon={<Shield className="h-5 w-5" />} />
        <StatsCard title="Avg Response Time" value="18 days" icon={<Clock className="h-5 w-5" />} />
      </div>
      <Card>
        <CardHeader><CardTitle>Compliance by Article</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {articles.map(a => (
            <div key={a.name} className="space-y-1">
              <div className="flex justify-between text-sm"><span>{a.name}</span><span className="text-muted-foreground">{a.compliance}%</span></div>
              <Progress value={a.compliance} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
