import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText } from 'lucide-react';

const policies = [
  { id: '1', name: 'General Privacy Policy', version: '3.2', status: 'published', lastUpdated: '2026-01-15', author: 'Legal Team' },
  { id: '2', name: 'Cookie Policy', version: '2.1', status: 'published', lastUpdated: '2025-11-20', author: 'Legal Team' },
  { id: '3', name: 'Employee Data Policy', version: '1.5', status: 'draft', lastUpdated: '2026-02-28', author: 'HR Department' },
  { id: '4', name: 'Third-Party Data Sharing', version: '2.0', status: 'published', lastUpdated: '2025-12-10', author: 'Legal Team' },
  { id: '5', name: 'Data Breach Response Policy', version: '1.0', status: 'in_review', lastUpdated: '2026-03-01', author: 'Security Team' },
];

export function PrivacyPoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Privacy Policies" description="Manage privacy policy documents and versions">
        <Button><Plus className="h-4 w-4 mr-2" /> New Policy</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{p.name}</TableCell>
                  <TableCell>v{p.version}</TableCell>
                  <TableCell>{p.author}</TableCell>
                  <TableCell>{p.lastUpdated}</TableCell>
                  <TableCell><Badge variant={p.status === 'published' ? 'default' : p.status === 'draft' ? 'secondary' : 'outline'}>{p.status}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
