import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, AlertTriangle } from 'lucide-react';

const breaches = [
  { id: '1', title: 'Unauthorized Email Access', severity: 'medium', date: '2025-09-15', recordsAffected: 45, status: 'resolved', reportedToAuthority: true },
  { id: '2', title: 'Phishing Incident', severity: 'low', date: '2025-11-02', recordsAffected: 3, status: 'resolved', reportedToAuthority: false },
  { id: '3', title: 'Third-Party Vendor Leak', severity: 'high', date: '2026-01-20', recordsAffected: 1200, status: 'investigating', reportedToAuthority: true },
];

export function DataBreachesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Data Breaches" description="Track and manage data breach incidents">
        <Button variant="destructive"><Plus className="h-4 w-4 mr-2" /> Report Breach</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Records Affected</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breaches.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted-foreground" />{b.title}</TableCell>
                  <TableCell><Badge variant={b.severity === 'high' ? 'destructive' : b.severity === 'medium' ? 'default' : 'secondary'}>{b.severity}</Badge></TableCell>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.recordsAffected.toLocaleString()}</TableCell>
                  <TableCell>{b.reportedToAuthority ? 'Yes' : 'No'}</TableCell>
                  <TableCell><Badge variant={b.status === 'resolved' ? 'default' : 'secondary'}>{b.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
