import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Download, Users, UserPlus, UserMinus, Clock, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const headcountData = [
  { name: 'Jan', value: 235 },
  { name: 'Feb', value: 238 },
  { name: 'Mar', value: 242 },
  { name: 'Apr', value: 240 },
  { name: 'May', value: 245 },
  { name: 'Jun', value: 248 },
];

const departmentDistribution = [
  { name: 'Sales', value: 45 },
  { name: 'Engineering', value: 68 },
  { name: 'Marketing', value: 28 },
  { name: 'HR', value: 15 },
  { name: 'Operations', value: 52 },
  { name: 'Finance', value: 22 },
  { name: 'Support', value: 18 },
];

const turnoverData = [
  { month: 'Jan', hires: 5, exits: 2, turnover: 0.8 },
  { month: 'Feb', hires: 4, exits: 1, turnover: 0.4 },
  { month: 'Mar', hires: 6, exits: 2, turnover: 0.8 },
  { month: 'Apr', hires: 3, exits: 5, turnover: 2.1 },
  { month: 'May', hires: 7, exits: 2, turnover: 0.8 },
  { month: 'Jun', hires: 4, exits: 1, turnover: 0.4 },
];

const attendanceData = [
  { department: 'Sales', present: 94, absent: 3, late: 3 },
  { department: 'Engineering', present: 96, absent: 2, late: 2 },
  { department: 'Marketing', present: 92, absent: 5, late: 3 },
  { department: 'HR', present: 98, absent: 1, late: 1 },
  { department: 'Operations', present: 91, absent: 6, late: 3 },
  { department: 'Finance', present: 97, absent: 2, late: 1 },
];

const leaveBalanceData = [
  { employee: 'John Smith', department: 'Sales', annual: 12, sick: 5, used: 8, remaining: 9 },
  { employee: 'Sarah Johnson', department: 'Engineering', annual: 15, sick: 5, used: 5, remaining: 15 },
  { employee: 'Mike Davis', department: 'Marketing', annual: 12, sick: 5, used: 10, remaining: 7 },
  { employee: 'Emily Brown', department: 'HR', annual: 12, sick: 5, used: 3, remaining: 14 },
  { employee: 'Chris Wilson', department: 'Operations', annual: 12, sick: 5, used: 12, remaining: 5 },
];

const performanceData = [
  { department: 'Sales', exceptional: 15, exceeds: 45, meets: 35, below: 5 },
  { department: 'Engineering', exceptional: 20, exceeds: 50, meets: 25, below: 5 },
  { department: 'Marketing', exceptional: 10, exceeds: 40, meets: 40, below: 10 },
  { department: 'HR', exceptional: 25, exceeds: 55, meets: 20, below: 0 },
  { department: 'Operations', exceptional: 12, exceeds: 38, meets: 42, below: 8 },
];

export function HRReports() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">248</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserPlus className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Hires (YTD)</p>
                <p className="text-2xl font-bold">29</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <UserMinus className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Turnover Rate</p>
                <p className="text-2xl font-bold">5.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                <p className="text-2xl font-bold">94.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="headcount" className="space-y-4">
        <TabsList>
          <TabsTrigger value="headcount">Headcount</TabsTrigger>
          <TabsTrigger value="turnover">Turnover</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Balance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Headcount Tab */}
        <TabsContent value="headcount">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Headcount Trend"
              subtitle="Monthly employee count"
              type="line"
              data={headcountData}
              height={300}
            />
            <ChartWidget
              title="Department Distribution"
              subtitle="Employees by department"
              type="pie"
              data={departmentDistribution}
              showLegend
              height={300}
            />
          </div>
        </TabsContent>

        {/* Turnover Tab */}
        <TabsContent value="turnover">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Employee Turnover Analysis</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">New Hires</TableHead>
                    <TableHead className="text-right">Exits</TableHead>
                    <TableHead className="text-right">Net Change</TableHead>
                    <TableHead className="text-right">Turnover Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turnoverData.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right text-emerald-600">+{row.hires}</TableCell>
                      <TableCell className="text-right text-red-500">-{row.exits}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        row.hires - row.exits >= 0 ? "text-emerald-600" : "text-red-500"
                      )}>
                        {row.hires - row.exits >= 0 ? '+' : ''}{row.hires - row.exits}
                      </TableCell>
                      <TableCell className="text-right">{row.turnover}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance by Department</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Present %</TableHead>
                    <TableHead className="text-right">Absent %</TableHead>
                    <TableHead className="text-right">Late %</TableHead>
                    <TableHead className="w-[200px]">Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((row) => (
                    <TableRow key={row.department}>
                      <TableCell className="font-medium">{row.department}</TableCell>
                      <TableCell className="text-right text-emerald-600">{row.present}%</TableCell>
                      <TableCell className="text-right text-red-500">{row.absent}%</TableCell>
                      <TableCell className="text-right text-orange-500">{row.late}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={row.present} className="h-2" />
                          <span className="text-sm text-muted-foreground w-12">{row.present}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Balance Tab */}
        <TabsContent value="leave">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Balance Summary</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Annual</TableHead>
                    <TableHead className="text-right">Sick</TableHead>
                    <TableHead className="text-right">Used</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveBalanceData.map((row) => (
                    <TableRow key={row.employee}>
                      <TableCell className="font-medium">{row.employee}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell className="text-right">{row.annual}</TableCell>
                      <TableCell className="text-right">{row.sick}</TableCell>
                      <TableCell className="text-right">{row.used}</TableCell>
                      <TableCell className="text-right font-medium">{row.remaining}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.remaining > 10 ? "default" : row.remaining > 5 ? "secondary" : "destructive"}>
                          {row.remaining > 10 ? 'Good' : row.remaining > 5 ? 'Low' : 'Critical'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Performance Distribution by Department</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Exceptional</TableHead>
                    <TableHead className="text-right">Exceeds</TableHead>
                    <TableHead className="text-right">Meets</TableHead>
                    <TableHead className="text-right">Below</TableHead>
                    <TableHead className="w-[200px]">Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((row) => (
                    <TableRow key={row.department}>
                      <TableCell className="font-medium">{row.department}</TableCell>
                      <TableCell className="text-right text-emerald-600">{row.exceptional}%</TableCell>
                      <TableCell className="text-right text-blue-600">{row.exceeds}%</TableCell>
                      <TableCell className="text-right text-yellow-600">{row.meets}%</TableCell>
                      <TableCell className="text-right text-red-500">{row.below}%</TableCell>
                      <TableCell>
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500" style={{ width: `${row.exceptional}%` }} />
                          <div className="bg-blue-500" style={{ width: `${row.exceeds}%` }} />
                          <div className="bg-yellow-500" style={{ width: `${row.meets}%` }} />
                          <div className="bg-red-500" style={{ width: `${row.below}%` }} />
                        </div>
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
