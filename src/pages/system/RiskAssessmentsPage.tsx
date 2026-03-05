import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const assessments = [
  { id: '1', name: 'Q1 2026 Security Assessment', type: 'Security', assessor: 'Alex Admin', date: '2026-01-15', status: 'completed', risksFound: 3 },
  { id: '2', name: 'Vendor Risk Assessment - Acme', type: 'Third-Party', assessor: 'Paula Procurement', date: '2026-02-20', status: 'in_progress', risksFound: 1 },
  { id: '3', name: 'Annual Operational Review', type: 'Operational', assessor: 'Peter Project', date: '2026-03-10', status: 'scheduled', risksFound: 0 },
];

export function RiskAssessmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Risk Assessments" description="Conduct and review risk assessments">
        <Button><Plus className="h-4 w-4 mr-2" /> New Assessment</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assessor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Risks Found</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.type}</TableCell>
                  <TableCell>{a.assessor}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.risksFound}</TableCell>
                  <TableCell><Badge variant={a.status === 'completed' ? 'default' : a.status === 'in_progress' ? 'secondary' : 'outline'}>{a.status}</Badge></TableCell>
                  <TableCell><Link to={`/admin/risk-assessments/${a.id}`}><Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button></Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
