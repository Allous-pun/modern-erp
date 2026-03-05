import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const frameworks = [
  { id: '1', name: 'SOC 2 Type II', description: 'Service Organization Controls', status: 'active', progress: 98, controls: 64, lastAudit: '2025-12-15' },
  { id: '2', name: 'ISO 27001', description: 'Information Security Management', status: 'active', progress: 94, controls: 114, lastAudit: '2025-11-20' },
  { id: '3', name: 'GDPR', description: 'General Data Protection Regulation', status: 'active', progress: 96, controls: 42, lastAudit: '2026-01-10' },
  { id: '4', name: 'HIPAA', description: 'Health Insurance Portability Act', status: 'in_review', progress: 91, controls: 78, lastAudit: '2025-10-05' },
];

export function ComplianceFrameworksPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Frameworks" description="Manage regulatory and compliance frameworks">
        <Button><Plus className="h-4 w-4 mr-2" /> Add Framework</Button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frameworks.map(f => (
          <Card key={f.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
                <Badge variant={f.status === 'active' ? 'default' : 'secondary'}>{f.status}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><span>Compliance</span><span>{f.progress}%</span></div>
                <Progress value={f.progress} />
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{f.controls} controls</span>
                <Link to={`/admin/compliance/frameworks/${f.id}`} className="flex items-center gap-1 text-primary hover:underline">
                  View Details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
