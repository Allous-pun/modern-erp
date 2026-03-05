import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const risks = [
  { id: '1', name: 'Data Breach via Third-Party', category: 'Security', severity: 'critical', likelihood: 'medium', owner: 'Alex Admin', status: 'open' },
  { id: '2', name: 'Regulatory Non-Compliance', category: 'Compliance', severity: 'high', likelihood: 'low', owner: 'Hannah HR', status: 'mitigating' },
  { id: '3', name: 'System Downtime', category: 'Operational', severity: 'high', likelihood: 'medium', owner: 'Peter Project', status: 'open' },
  { id: '4', name: 'Insider Threat', category: 'Security', severity: 'medium', likelihood: 'low', owner: 'Alex Admin', status: 'monitoring' },
  { id: '5', name: 'Supply Chain Disruption', category: 'Operational', severity: 'medium', likelihood: 'high', owner: 'Paula Procurement', status: 'open' },
  { id: '6', name: 'Financial Fraud', category: 'Financial', severity: 'high', likelihood: 'low', owner: 'Frank Finance', status: 'mitigating' },
];

export function RisksPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Risk Register" description="All identified risks and their current status">
        <Link to="/admin/risks/new"><Button><Plus className="h-4 w-4 mr-2" /> Add Risk</Button></Link>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell><Badge variant={r.severity === 'critical' ? 'destructive' : r.severity === 'high' ? 'default' : 'secondary'}>{r.severity}</Badge></TableCell>
                  <TableCell>{r.likelihood}</TableCell>
                  <TableCell>{r.owner}</TableCell>
                  <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                  <TableCell><Link to={`/admin/risks/${r.id}`}><Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button></Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
