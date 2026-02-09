import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, TrendingUp, Target } from 'lucide-react';

interface Inspection {
  id: string;
  workOrder: string;
  product: string;
  inspector: string;
  date: string;
  sampleSize: number;
  passed: number;
  failed: number;
  status: 'passed' | 'failed' | 'pending';
  defects: string[];
}

interface Defect {
  id: string;
  workOrder: string;
  product: string;
  type: string;
  severity: 'minor' | 'major' | 'critical';
  quantity: number;
  reportedBy: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved';
}

const defectTrendData = [
  { name: 'Week 1', minor: 12, major: 3, critical: 0 },
  { name: 'Week 2', minor: 8, major: 2, critical: 1 },
  { name: 'Week 3', minor: 15, major: 4, critical: 0 },
  { name: 'Week 4', minor: 6, major: 1, critical: 0 },
];

const mockInspections: Inspection[] = [
  { id: 'INS-001', workOrder: 'WO-2024-001', product: 'Widget Assembly A', inspector: 'Alex Wilson', date: '2024-02-06', sampleSize: 50, passed: 48, failed: 2, status: 'passed', defects: ['Surface scratch', 'Dimension variance'] },
  { id: 'INS-002', workOrder: 'WO-2024-002', product: 'Component X-42', inspector: 'Maria Garcia', date: '2024-02-06', sampleSize: 100, passed: 100, failed: 0, status: 'passed', defects: [] },
  { id: 'INS-003', workOrder: 'WO-2024-003', product: 'Module B-Series', inspector: 'Alex Wilson', date: '2024-02-05', sampleSize: 25, passed: 20, failed: 5, status: 'failed', defects: ['Solder bridge', 'Missing component', 'Cold solder'] },
  { id: 'INS-004', workOrder: 'WO-2024-004', product: 'Assembly Kit Pro', inspector: 'Pending', date: '2024-02-07', sampleSize: 30, passed: 0, failed: 0, status: 'pending', defects: [] },
];

const mockDefects: Defect[] = [
  { id: 'DEF-001', workOrder: 'WO-2024-003', product: 'Module B-Series', type: 'Solder Bridge', severity: 'major', quantity: 3, reportedBy: 'Alex Wilson', date: '2024-02-05', status: 'investigating' },
  { id: 'DEF-002', workOrder: 'WO-2024-001', product: 'Widget Assembly A', type: 'Surface Scratch', severity: 'minor', quantity: 2, reportedBy: 'Alex Wilson', date: '2024-02-06', status: 'open' },
  { id: 'DEF-003', workOrder: 'WO-2024-003', product: 'Module B-Series', type: 'Missing Component', severity: 'critical', quantity: 1, reportedBy: 'Alex Wilson', date: '2024-02-05', status: 'resolved' },
];

const getInspectionStatusBadge = (status: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode }> = {
    passed: { variant: 'default', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
    failed: { variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" /> },
    pending: { variant: 'secondary', icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
  };
  const { variant, icon } = config[status] || { variant: 'secondary', icon: null };
  return (
    <Badge variant={variant} className="capitalize">
      {icon}{status}
    </Badge>
  );
};

const getSeverityBadge = (severity: string) => {
  const colors: Record<string, string> = {
    minor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    major: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return <Badge variant="outline" className={colors[severity]}>{severity}</Badge>;
};

const getDefectStatusBadge = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    open: 'destructive' as any,
    investigating: 'secondary',
    resolved: 'outline',
  };
  return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
};

export function QualityControlPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inspections');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Control"
        description="Manage inspections, track defects, and monitor quality metrics"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Inspection
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="First Pass Yield"
          value="96.5%"
          change={1.2}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
        />
        <StatsCard
          title="Inspections Today"
          value="24"
          change={8}
          changeLabel="vs yesterday"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatsCard
          title="Open Defects"
          value="7"
          change={-3}
          changeLabel="vs last week"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatsCard
          title="Defect Rate"
          value="1.2%"
          change={-0.3}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget
          title="Defect Trends"
          subtitle="Weekly defect count by severity"
          type="bar"
          data={defectTrendData}
          dataKey="minor"
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quality Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { metric: 'First Pass Yield', current: 96.5, target: 95, unit: '%' },
              { metric: 'Defect Rate', current: 1.2, target: 2, unit: '%', inverse: true },
              { metric: 'Scrap Rate', current: 0.8, target: 1, unit: '%', inverse: true },
              { metric: 'Customer Returns', current: 0.3, target: 0.5, unit: '%', inverse: true },
            ].map((item) => (
              <div key={item.metric} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.metric}</span>
                    <span className={
                      (item.inverse ? item.current <= item.target : item.current >= item.target)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }>
                      {item.current}{item.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          (item.inverse ? item.current <= item.target : item.current >= item.target)
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${item.inverse
                            ? Math.max(0, 100 - (item.current / item.target) * 50)
                            : Math.min(100, (item.current / item.target) * 100)
                          }%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16">
                      Target: {item.target}{item.unit}
                    </span>
                  </div>
                </div>
                {(item.inverse ? item.current <= item.target : item.current >= item.target) ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Inspections and Defects */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="inspections">Inspections</TabsTrigger>
                <TabsTrigger value="defects">Defects</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'inspections' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection ID</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Sample</TableHead>
                  <TableHead>Pass/Fail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-mono">{inspection.id}</TableCell>
                    <TableCell>{inspection.workOrder}</TableCell>
                    <TableCell>{inspection.product}</TableCell>
                    <TableCell>{inspection.inspector}</TableCell>
                    <TableCell>{inspection.sampleSize}</TableCell>
                    <TableCell>
                      <span className="text-green-600">{inspection.passed}</span>
                      {' / '}
                      <span className="text-red-600">{inspection.failed}</span>
                    </TableCell>
                    <TableCell>{getInspectionStatusBadge(inspection.status)}</TableCell>
                    <TableCell>{inspection.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Defect ID</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDefects.map((defect) => (
                  <TableRow key={defect.id}>
                    <TableCell className="font-mono">{defect.id}</TableCell>
                    <TableCell>{defect.workOrder}</TableCell>
                    <TableCell>{defect.product}</TableCell>
                    <TableCell>{defect.type}</TableCell>
                    <TableCell>{getSeverityBadge(defect.severity)}</TableCell>
                    <TableCell>{defect.quantity}</TableCell>
                    <TableCell>{getDefectStatusBadge(defect.status)}</TableCell>
                    <TableCell>{defect.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
