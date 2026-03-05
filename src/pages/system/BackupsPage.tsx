import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const backups = [
  { id: '1', name: 'Full Backup - 2026-03-05', type: 'Full', size: '12.4 GB', status: 'completed', created: '2026-03-05 02:00', duration: '45 min' },
  { id: '2', name: 'Incremental - 2026-03-04', type: 'Incremental', size: '1.2 GB', status: 'completed', created: '2026-03-04 02:00', duration: '8 min' },
  { id: '3', name: 'Incremental - 2026-03-03', type: 'Incremental', size: '0.9 GB', status: 'completed', created: '2026-03-03 02:00', duration: '6 min' },
  { id: '4', name: 'Full Backup - 2026-02-26', type: 'Full', size: '12.1 GB', status: 'completed', created: '2026-02-26 02:00', duration: '43 min' },
  { id: '5', name: 'Manual Backup', type: 'Full', size: '12.3 GB', status: 'failed', created: '2026-02-25 14:30', duration: '-' },
];

export function BackupsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Backups" description="Manage system backups and restore points">
        <Link to="/admin/backups/new"><Button><Plus className="h-4 w-4 mr-2" /> Create Backup</Button></Link>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium flex items-center gap-2"><Database className="h-4 w-4 text-muted-foreground" />{b.name}</TableCell>
                  <TableCell><Badge variant="outline">{b.type}</Badge></TableCell>
                  <TableCell>{b.size}</TableCell>
                  <TableCell>{b.created}</TableCell>
                  <TableCell>{b.duration}</TableCell>
                  <TableCell><Badge variant={b.status === 'completed' ? 'default' : 'destructive'}>{b.status}</Badge></TableCell>
                  <TableCell><Link to={`/admin/backups/${b.id}`}><Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button></Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
