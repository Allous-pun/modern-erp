import React, { useState } from 'react';
import { CalendarOff, Plus, CheckCircle, XCircle, Clock, Calendar, Plane, Heart, Baby } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const leaveRequests = [
  { id: 'LV001', employee: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', type: 'Annual', startDate: 'Jan 28, 2024', endDate: 'Feb 2, 2024', days: 5, reason: 'Family vacation', status: 'pending', appliedOn: 'Jan 20, 2024' },
  { id: 'LV002', employee: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', type: 'Sick', startDate: 'Jan 25, 2024', endDate: 'Jan 25, 2024', days: 1, reason: 'Doctor appointment', status: 'approved', appliedOn: 'Jan 24, 2024' },
  { id: 'LV003', employee: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', type: 'Personal', startDate: 'Feb 5, 2024', endDate: 'Feb 6, 2024', days: 2, reason: 'Personal matters', status: 'pending', appliedOn: 'Jan 22, 2024' },
  { id: 'LV004', employee: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', type: 'Annual', startDate: 'Feb 12, 2024', endDate: 'Feb 16, 2024', days: 5, reason: 'Planned holiday', status: 'approved', appliedOn: 'Jan 15, 2024' },
  { id: 'LV005', employee: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', type: 'Sick', startDate: 'Jan 23, 2024', endDate: 'Jan 24, 2024', days: 2, reason: 'Unwell', status: 'approved', appliedOn: 'Jan 23, 2024' },
  { id: 'LV006', employee: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', type: 'Maternity', startDate: 'Mar 1, 2024', endDate: 'May 31, 2024', days: 65, reason: 'Maternity leave', status: 'approved', appliedOn: 'Jan 10, 2024' },
  { id: 'LV007', employee: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', type: 'Annual', startDate: 'Jan 15, 2024', endDate: 'Jan 17, 2024', days: 3, reason: 'Family event', status: 'rejected', appliedOn: 'Jan 10, 2024' },
];

const leaveBalances = [
  { type: 'Annual', icon: Plane, total: 21, used: 8, color: 'bg-status-info' },
  { type: 'Sick', icon: Heart, total: 10, used: 3, color: 'bg-status-warning' },
  { type: 'Personal', icon: Calendar, total: 5, used: 2, color: 'bg-module-hr' },
  { type: 'Maternity/Paternity', icon: Baby, total: 90, used: 0, color: 'bg-status-success' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Pending</Badge>;
    case 'approved':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'Annual':
      return <Badge variant="outline" className="bg-status-info/10 text-status-info border-status-info/20">{type}</Badge>;
    case 'Sick':
      return <Badge variant="outline" className="bg-status-warning/10 text-status-warning border-status-warning/20">{type}</Badge>;
    case 'Personal':
      return <Badge variant="outline" className="bg-module-hr/10 text-module-hr border-module-hr/20">{type}</Badge>;
    case 'Maternity':
    case 'Paternity':
      return <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success/20">{type}</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export function LeavePage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'approved').length;
  
  const filteredRequests = leaveRequests.filter(request => {
    return statusFilter === 'all' || request.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Manage employee leave requests and balances"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Leave Management' },
        ]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea id="reason" placeholder="Please provide a reason for your leave request..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Requests"
          value={pendingCount.toString()}
          change={-2}
          changeLabel="vs yesterday"
          icon={<Clock className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Approved This Month"
          value={approvedCount.toString()}
          change={3}
          changeLabel="this month"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="On Leave Today"
          value="8"
          change={2}
          changeLabel="employees"
          icon={<CalendarOff className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Avg Days Used"
          value="12.5"
          change={0.5}
          changeLabel="per employee"
          icon={<Calendar className="h-5 w-5" />}
          variant="hr"
        />
      </div>

      {/* Leave Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Balances (Company Average)</CardTitle>
          <CardDescription>Overview of leave utilization across the organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaveBalances.map((balance) => {
              const Icon = balance.icon;
              const remaining = balance.total - balance.used;
              const percentage = (balance.used / balance.total) * 100;
              
              return (
                <div key={balance.type} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${balance.color}/10`}>
                      <Icon className={`h-5 w-5 ${balance.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <p className="font-medium">{balance.type}</p>
                      <p className="text-sm text-muted-foreground">{remaining} days remaining</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{balance.used} used</span>
                    <span>{balance.total} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>All employee leave requests</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.avatar} alt={request.employee} />
                        <AvatarFallback>{request.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{request.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(request.type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{request.startDate}</div>
                      <div className="text-muted-foreground">to {request.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-status-success">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-status-error">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
