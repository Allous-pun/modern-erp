import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, Download, Filter, CalendarIcon, Eye, RefreshCw,
  FileText, User, Settings, Database, Shield, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { StatsCard } from '@/components/dashboard/StatsCard';

interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'approve' | 'reject';
  module: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-25 14:32:15',
    user: { name: 'John Smith', email: 'john.smith@company.com' },
    action: 'update',
    module: 'HR',
    resource: 'Employee',
    resourceId: 'EMP-001',
    details: 'Updated employee salary',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    changes: [
      { field: 'salary', oldValue: '$75,000', newValue: '$82,000' },
      { field: 'effective_date', oldValue: '', newValue: '2024-02-01' },
    ],
  },
  {
    id: '2',
    timestamp: '2024-01-25 14:28:42',
    user: { name: 'Sarah Johnson', email: 'sarah.j@company.com' },
    action: 'approve',
    module: 'Finance',
    resource: 'Invoice',
    resourceId: 'INV-2024-042',
    details: 'Approved invoice for payment',
    ipAddress: '192.168.1.105',
    userAgent: 'Firefox 121.0',
  },
  {
    id: '3',
    timestamp: '2024-01-25 14:15:30',
    user: { name: 'Mike Chen', email: 'mike.chen@company.com' },
    action: 'create',
    module: 'Procurement',
    resource: 'Purchase Order',
    resourceId: 'PO-2024-089',
    details: 'Created new purchase order',
    ipAddress: '192.168.1.110',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    id: '4',
    timestamp: '2024-01-25 13:55:18',
    user: { name: 'Emily Davis', email: 'emily.d@company.com' },
    action: 'delete',
    module: 'Sales',
    resource: 'Lead',
    resourceId: 'LEAD-456',
    details: 'Deleted duplicate lead record',
    ipAddress: '192.168.1.115',
    userAgent: 'Safari 17.2',
  },
  {
    id: '5',
    timestamp: '2024-01-25 13:42:05',
    user: { name: 'Alex Thompson', email: 'alex.t@company.com' },
    action: 'export',
    module: 'Reports',
    resource: 'Financial Report',
    resourceId: 'RPT-Q4-2023',
    details: 'Exported Q4 financial report to PDF',
    ipAddress: '192.168.1.120',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    id: '6',
    timestamp: '2024-01-25 13:30:22',
    user: { name: 'Lisa Wang', email: 'lisa.w@company.com' },
    action: 'login',
    module: 'System',
    resource: 'Session',
    resourceId: 'SES-789',
    details: 'User logged in successfully',
    ipAddress: '10.0.0.50',
    userAgent: 'Chrome 120.0.0.0 (Mobile)',
  },
  {
    id: '7',
    timestamp: '2024-01-25 13:15:44',
    user: { name: 'David Brown', email: 'david.b@company.com' },
    action: 'update',
    module: 'Admin',
    resource: 'Role',
    resourceId: 'ROLE-003',
    details: 'Modified role permissions',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    changes: [
      { field: 'permissions', oldValue: 'finance.view', newValue: 'finance.view, finance.edit' },
    ],
  },
  {
    id: '8',
    timestamp: '2024-01-25 12:58:33',
    user: { name: 'Jennifer Lee', email: 'jennifer.l@company.com' },
    action: 'reject',
    module: 'HR',
    resource: 'Leave Request',
    resourceId: 'LR-2024-156',
    details: 'Rejected leave request - insufficient notice',
    ipAddress: '192.168.1.125',
    userAgent: 'Firefox 121.0',
  },
  {
    id: '9',
    timestamp: '2024-01-25 12:45:10',
    user: { name: 'Robert Wilson', email: 'robert.w@company.com' },
    action: 'view',
    module: 'Finance',
    resource: 'Bank Statement',
    resourceId: 'BS-2024-01',
    details: 'Viewed January bank statement',
    ipAddress: '192.168.1.130',
    userAgent: 'Edge 120.0.0.0',
  },
  {
    id: '10',
    timestamp: '2024-01-25 12:30:55',
    user: { name: 'Amanda Garcia', email: 'amanda.g@company.com' },
    action: 'logout',
    module: 'System',
    resource: 'Session',
    resourceId: 'SES-654',
    details: 'User logged out',
    ipAddress: '192.168.1.135',
    userAgent: 'Chrome 120.0.0.0',
  },
];

const actionColors: Record<AuditLog['action'], string> = {
  create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  view: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  login: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  logout: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  export: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  approve: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  reject: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

const modules = ['All', 'System', 'Admin', 'Finance', 'HR', 'Sales', 'Procurement', 'Inventory'];
const actions = ['All', 'create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'approve', 'reject'];

export function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === 'All' || log.module === filterModule;
    const matchesAction = filterAction === 'All' || log.action === filterAction;
    return matchesSearch && matchesModule && matchesAction;
  });

  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track and monitor all system activities and changes"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Events"
          value="1,247"
          icon={<Clock className="h-5 w-5" />}
          change={12}
          changeLabel="vs yesterday"
        />
        <StatsCard
          title="Active Users"
          value="48"
          icon={<User className="h-5 w-5" />}
        />
        <StatsCard
          title="Data Changes"
          value="324"
          icon={<Database className="h-5 w-5" />}
        />
        <StatsCard
          title="Security Events"
          value="15"
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map(a => (
                    <SelectItem key={a} value={a}>{a === 'All' ? 'All Actions' : a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={log.user.avatar} />
                        <AvatarFallback className="text-xs">{log.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{log.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={actionColors[log.action]}>
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{log.resource}</p>
                      <p className="text-xs text-muted-foreground">{log.resourceId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{log.details}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => viewLogDetails(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Action</p>
                  <Badge className={actionColors[selectedLog.action]}>
                    {selectedLog.action.charAt(0).toUpperCase() + selectedLog.action.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">User</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{selectedLog.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedLog.user.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Module</p>
                  <p className="font-medium">{selectedLog.module}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resource</p>
                  <p className="font-medium">{selectedLog.resource} ({selectedLog.resourceId})</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Details</p>
                <p className="font-medium">{selectedLog.details}</p>
              </div>

              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Changes</p>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Old Value</TableHead>
                          <TableHead>New Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLog.changes.map((change, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{change.field}</TableCell>
                            <TableCell className="text-muted-foreground">{change.oldValue || '-'}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">{change.newValue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User Agent</p>
                  <p className="text-sm">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
