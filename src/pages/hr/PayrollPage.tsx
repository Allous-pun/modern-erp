import React, { useState } from 'react';
import { DollarSign, Download, Play, CheckCircle, Clock, FileText, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const payrollData = [
  { id: 'PAY001', employee: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', department: 'Engineering', baseSalary: 8500, bonuses: 1200, deductions: 2100, netPay: 7600, status: 'paid' },
  { id: 'PAY002', employee: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', department: 'Engineering', baseSalary: 9200, bonuses: 800, deductions: 2350, netPay: 7650, status: 'paid' },
  { id: 'PAY003', employee: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', department: 'Marketing', baseSalary: 6800, bonuses: 500, deductions: 1650, netPay: 5650, status: 'pending' },
  { id: 'PAY004', employee: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', department: 'Sales', baseSalary: 5500, bonuses: 2500, deductions: 1800, netPay: 6200, status: 'paid' },
  { id: 'PAY005', employee: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', department: 'HR', baseSalary: 5200, bonuses: 300, deductions: 1250, netPay: 4250, status: 'pending' },
  { id: 'PAY006', employee: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', department: 'Marketing', baseSalary: 11000, bonuses: 1500, deductions: 2900, netPay: 9600, status: 'paid' },
  { id: 'PAY007', employee: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', department: 'Sales', baseSalary: 10500, bonuses: 3000, deductions: 3100, netPay: 10400, status: 'processing' },
  { id: 'PAY008', employee: 'Rachel Green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel', department: 'HR', baseSalary: 9800, bonuses: 1000, deductions: 2500, netPay: 8300, status: 'paid' },
];

const monthlyTrend = [
  { name: 'Aug', value: 485000 },
  { name: 'Sep', value: 492000 },
  { name: 'Oct', value: 498000 },
  { name: 'Nov', value: 505000 },
  { name: 'Dec', value: 520000 },
  { name: 'Jan', value: 515000 },
];

const payrollHistory = [
  { id: 'RUN001', period: 'January 2024', processedDate: 'Jan 25, 2024', employees: 248, totalAmount: 515000, status: 'completed' },
  { id: 'RUN002', period: 'December 2023', processedDate: 'Dec 26, 2023', employees: 245, totalAmount: 520000, status: 'completed' },
  { id: 'RUN003', period: 'November 2023', processedDate: 'Nov 27, 2023', employees: 242, totalAmount: 505000, status: 'completed' },
  { id: 'RUN004', period: 'October 2023', processedDate: 'Oct 26, 2023', employees: 240, totalAmount: 498000, status: 'completed' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Paid</Badge>;
    case 'pending':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Pending</Badge>;
    case 'processing':
      return <Badge className="bg-status-info/10 text-status-info border-status-info/20">Processing</Badge>;
    case 'completed':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PayrollPage() {
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredPayroll = payrollData.filter(record => {
    return departmentFilter === 'all' || record.department === departmentFilter;
  });

  const totalPayroll = payrollData.reduce((sum, r) => sum + r.netPay, 0);
  const paidCount = payrollData.filter(r => r.status === 'paid').length;
  const pendingCount = payrollData.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Manage employee compensation and payroll processing"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Payroll' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Run Payroll
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Payroll"
          value={formatCurrency(totalPayroll)}
          change={2.1}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Employees Paid"
          value={`${paidCount}/${payrollData.length}`}
          change={paidCount}
          changeLabel="completed"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Pending Payments"
          value={pendingCount.toString()}
          change={-3}
          changeLabel="remaining"
          icon={<Clock className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Avg Net Pay"
          value={formatCurrency(totalPayroll / payrollData.length)}
          change={1.5}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="hr"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Payroll Trend"
          subtitle="Monthly payroll expenses"
          type="area"
          data={monthlyTrend}
          className="lg:col-span-2"
          colors={['hsl(var(--module-hr))']}
        />
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Summary</CardTitle>
            <CardDescription>January 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gross Salaries</span>
                <span className="font-medium">$612,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Bonuses</span>
                <span className="font-medium text-status-success">+$45,800</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax Deductions</span>
                <span className="font-medium text-status-error">-$98,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Benefits</span>
                <span className="font-medium text-status-error">-$44,800</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Net Payroll</span>
                  <span className="font-bold text-lg">{formatCurrency(totalPayroll)}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Processing Progress</p>
              <Progress value={(paidCount / payrollData.length) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{paidCount} of {payrollData.length} employees processed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Payroll</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Employee Payroll - January 2024</CardTitle>
                  <CardDescription>Individual employee compensation details</CardDescription>
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead className="text-right">Bonuses</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={record.avatar} alt={record.employee} />
                            <AvatarFallback>{record.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{record.employee}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell className="text-right">{formatCurrency(record.baseSalary)}</TableCell>
                      <TableCell className="text-right text-status-success">+{formatCurrency(record.bonuses)}</TableCell>
                      <TableCell className="text-right text-status-error">-{formatCurrency(record.deductions)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(record.netPay)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Past payroll runs and summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Processed Date</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollHistory.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">{run.period}</TableCell>
                      <TableCell>{run.processedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {run.employees}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(run.totalAmount)}</TableCell>
                      <TableCell>{getStatusBadge(run.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
