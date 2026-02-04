import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Download, Filter } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/dashboard/StatsCard';
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

const todayAttendance = [
  { id: '1', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', department: 'Engineering', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'present', workHours: '8h 45m' },
  { id: '2', name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', department: 'Engineering', checkIn: '09:15 AM', checkOut: '-', status: 'present', workHours: '6h 15m' },
  { id: '3', name: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', department: 'Marketing', checkIn: '08:30 AM', checkOut: '04:00 PM', status: 'early-leave', workHours: '7h 30m' },
  { id: '4', name: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', department: 'Sales', checkIn: '-', checkOut: '-', status: 'on-leave', workHours: '-' },
  { id: '5', name: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', department: 'HR', checkIn: '10:30 AM', checkOut: '-', status: 'late', workHours: '5h 00m' },
  { id: '6', name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', department: 'Marketing', checkIn: '08:55 AM', checkOut: '06:00 PM', status: 'present', workHours: '9h 05m' },
  { id: '7', name: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', department: 'Sales', checkIn: '-', checkOut: '-', status: 'absent', workHours: '-' },
  { id: '8', name: 'Rachel Green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel', department: 'HR', checkIn: '09:00 AM', checkOut: '05:45 PM', status: 'present', workHours: '8h 45m' },
];

const weeklyStats = [
  { day: 'Mon', present: 235, absent: 8, late: 5 },
  { day: 'Tue', present: 238, absent: 6, late: 4 },
  { day: 'Wed', present: 240, absent: 5, late: 3 },
  { day: 'Thu', present: 232, absent: 10, late: 6 },
  { day: 'Fri', present: 228, absent: 12, late: 8 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Present</Badge>;
    case 'absent':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Absent</Badge>;
    case 'late':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Late</Badge>;
    case 'early-leave':
      return <Badge className="bg-status-info/10 text-status-info border-status-info/20">Early Leave</Badge>;
    case 'on-leave':
      return <Badge className="bg-muted text-muted-foreground">On Leave</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function AttendancePage() {
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAttendance = todayAttendance.filter(record => {
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesDepartment && matchesStatus;
  });

  const presentCount = todayAttendance.filter(r => r.status === 'present').length;
  const absentCount = todayAttendance.filter(r => r.status === 'absent').length;
  const lateCount = todayAttendance.filter(r => r.status === 'late').length;
  const onLeaveCount = todayAttendance.filter(r => r.status === 'on-leave').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track employee attendance and working hours"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Attendance' },
        ]}
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Present Today"
          value={presentCount.toString()}
          change={2.5}
          changeLabel="vs yesterday"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Absent"
          value={absentCount.toString()}
          change={-1}
          changeLabel="vs yesterday"
          icon={<XCircle className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Late Arrivals"
          value={lateCount.toString()}
          change={-2}
          changeLabel="vs yesterday"
          icon={<Clock className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="On Leave"
          value={onLeaveCount.toString()}
          change={0}
          changeLabel="vs yesterday"
          icon={<Calendar className="h-5 w-5" />}
          variant="hr"
        />
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Attendance statistics for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {weeklyStats.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-sm font-medium mb-2">{day.day}</p>
                <div className="space-y-2">
                  <div className="h-24 bg-muted rounded-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-status-success/60 transition-all"
                      style={{ height: `${(day.present / 248) * 100}%` }}
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-status-warning/60 transition-all"
                      style={{ height: `${(day.late / 248) * 100}%` }}
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-status-error/60 transition-all"
                      style={{ height: `${(day.absent / 248) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{day.present} present</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-success/60" />
              <span className="text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-warning/60" />
              <span className="text-muted-foreground">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-error/60" />
              <span className="text-muted-foreground">Absent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>January 24, 2024</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={record.avatar} alt={record.name} />
                        <AvatarFallback>{record.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell className={record.checkIn === '-' ? 'text-muted-foreground' : ''}>
                    {record.checkIn}
                  </TableCell>
                  <TableCell className={record.checkOut === '-' ? 'text-muted-foreground' : ''}>
                    {record.checkOut}
                  </TableCell>
                  <TableCell className={record.workHours === '-' ? 'text-muted-foreground' : ''}>
                    {record.workHours}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
