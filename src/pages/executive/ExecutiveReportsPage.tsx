import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, Clock, BarChart3, PieChart, TrendingUp, FileSpreadsheet } from 'lucide-react';

const templates = [
  { name: 'Board Summary Report', category: 'Strategic', format: 'PDF', description: 'Monthly board-level summary of all KPIs' },
  { name: 'Financial Performance', category: 'Finance', format: 'Excel', description: 'Detailed P&L, cash flow, and balance sheet' },
  { name: 'Operational Metrics', category: 'Operations', format: 'PDF', description: 'Production, supply chain, and quality metrics' },
  { name: 'HR Analytics', category: 'HR', format: 'PDF', description: 'Headcount, turnover, engagement, and DEI metrics' },
  { name: 'Sales Pipeline Review', category: 'Sales', format: 'Excel', description: 'Pipeline analysis with forecasting' },
  { name: 'Technology Scorecard', category: 'Technology', format: 'PDF', description: 'System health, security, and innovation metrics' },
];

const generatedReports = [
  { name: 'Q4 2025 Board Summary', generated: 'Mar 15, 2026', by: 'System', size: '2.4 MB', format: 'PDF' },
  { name: 'Financial YTD Report', generated: 'Mar 10, 2026', by: 'CFO Office', size: '5.1 MB', format: 'Excel' },
  { name: 'Monthly Operations Review', generated: 'Mar 1, 2026', by: 'COO Office', size: '1.8 MB', format: 'PDF' },
  { name: 'HR Quarterly Analytics', generated: 'Feb 28, 2026', by: 'HR Dept', size: '3.2 MB', format: 'PDF' },
  { name: 'Tech Debt Assessment', generated: 'Feb 25, 2026', by: 'CTO Office', size: '1.1 MB', format: 'PDF' },
];

const scheduled = [
  { name: 'Weekly Board Digest', frequency: 'Weekly', next: 'Mar 22, 2026', recipients: 12, status: 'active' },
  { name: 'Monthly Financial Pack', frequency: 'Monthly', next: 'Apr 1, 2026', recipients: 8, status: 'active' },
  { name: 'Quarterly Strategy Review', frequency: 'Quarterly', next: 'Apr 15, 2026', recipients: 15, status: 'active' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Strategic: <BarChart3 className="h-4 w-4" />,
  Finance: <TrendingUp className="h-4 w-4" />,
  Operations: <PieChart className="h-4 w-4" />,
  HR: <BarChart3 className="h-4 w-4" />,
  Sales: <TrendingUp className="h-4 w-4" />,
  Technology: <PieChart className="h-4 w-4" />,
};

export function ExecutiveReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Executive Reports" description="Generate, schedule, and export executive-level reports" />

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <Card key={t.name} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {categoryIcons[t.category]}
                    <Badge variant="outline">{t.category}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{t.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{t.format}</Badge>
                    <Button size="sm">Generate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Report Name</TableHead><TableHead>Generated</TableHead><TableHead>By</TableHead><TableHead>Size</TableHead><TableHead>Format</TableHead><TableHead>Action</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {generatedReports.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.generated}</TableCell>
                      <TableCell>{r.by}</TableCell>
                      <TableCell>{r.size}</TableCell>
                      <TableCell><Badge variant="outline">{r.format}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm"><Download className="mr-1 h-4 w-4" /> Download</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Report</TableHead><TableHead>Frequency</TableHead><TableHead>Next Run</TableHead><TableHead>Recipients</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {scheduled.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.frequency}</TableCell>
                      <TableCell>{s.next}</TableCell>
                      <TableCell>{s.recipients}</TableCell>
                      <TableCell><Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
