import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const audits = [
  { id: '1', name: 'Annual SOC 2 Audit', framework: 'SOC 2', auditor: 'Deloitte', status: 'completed', date: '2025-12-15', findings: 2 },
  { id: '2', name: 'ISO Recertification', framework: 'ISO 27001', auditor: 'BSI Group', status: 'in_progress', date: '2026-03-01', findings: 0 },
  { id: '3', name: 'GDPR Assessment', framework: 'GDPR', auditor: 'Internal', status: 'scheduled', date: '2026-04-15', findings: 0 },
];

export function ComplianceAuditsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Audits" description="Schedule and track compliance audits">
        <Button><Plus className="h-4 w-4 mr-2" /> Schedule Audit</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audit</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell><Badge variant="outline">{a.framework}</Badge></TableCell>
                  <TableCell>{a.auditor}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.findings}</TableCell>
                  <TableCell><Badge variant={a.status === 'completed' ? 'default' : a.status === 'in_progress' ? 'secondary' : 'outline'}>{a.status}</Badge></TableCell>
                  <TableCell>
                    <Link to={`/admin/compliance/audits/${a.id}`}><Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button></Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
