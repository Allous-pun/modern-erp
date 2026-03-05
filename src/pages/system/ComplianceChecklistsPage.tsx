import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const checklists = [
  { id: '1', name: 'Data Access Controls', framework: 'SOC 2', items: 12, completed: 12, status: 'complete', assignee: 'Alex Admin' },
  { id: '2', name: 'Encryption Standards', framework: 'ISO 27001', items: 8, completed: 7, status: 'in_progress', assignee: 'Frank Finance' },
  { id: '3', name: 'Data Subject Rights', framework: 'GDPR', items: 15, completed: 14, status: 'in_progress', assignee: 'Hannah HR' },
  { id: '4', name: 'PHI Handling', framework: 'HIPAA', items: 10, completed: 8, status: 'in_progress', assignee: 'Alex Admin' },
  { id: '5', name: 'Incident Response', framework: 'SOC 2', items: 6, completed: 6, status: 'complete', assignee: 'Peter Project' },
];

export function ComplianceChecklistsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Checklists" description="Track compliance checklist completion">
        <Button><Plus className="h-4 w-4 mr-2" /> New Checklist</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Checklist</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline">{c.framework}</Badge></TableCell>
                  <TableCell>{c.completed}/{c.items}</TableCell>
                  <TableCell>{c.assignee}</TableCell>
                  <TableCell><Badge variant={c.status === 'complete' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                  <TableCell>
                    <Link to={`/admin/compliance/checklists/${c.id}`}><Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button></Link>
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
