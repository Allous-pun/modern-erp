import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const requests = [
  { id: '1', subject: 'john.doe@email.com', type: 'Access Request', status: 'pending', submitted: '2026-02-28', deadline: '2026-03-28' },
  { id: '2', subject: 'jane.smith@email.com', type: 'Erasure Request', status: 'in_progress', submitted: '2026-02-20', deadline: '2026-03-20' },
  { id: '3', subject: 'bob.wilson@email.com', type: 'Data Portability', status: 'completed', submitted: '2026-02-10', deadline: '2026-03-10' },
  { id: '4', subject: 'alice.johnson@email.com', type: 'Rectification', status: 'completed', submitted: '2026-02-05', deadline: '2026-03-05' },
  { id: '5', subject: 'charlie.brown@email.com', type: 'Erasure Request', status: 'pending', submitted: '2026-03-01', deadline: '2026-03-31' },
];

export function DataSubjectRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Data Subject Requests" description="Manage GDPR/CCPA data subject access requests" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.subject}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.submitted}</TableCell>
                  <TableCell>{r.deadline}</TableCell>
                  <TableCell><Badge variant={r.status === 'completed' ? 'default' : r.status === 'in_progress' ? 'secondary' : 'outline'}>{r.status}</Badge></TableCell>
                  <TableCell><Link to={`/admin/data-requests/${r.id}`}><Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button></Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
