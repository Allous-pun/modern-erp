import React, { useState, useEffect } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, Download, Filter, CalendarIcon, Eye, RefreshCw,
  FileText, User, Settings, Database, Shield, Clock, Loader2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { format } from 'date-fns';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { systemApi, AuditLog, AuditStats } from '@/lib/api/system';
import { toast } from 'sonner';

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  view: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  login: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  logout: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  export: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  approve: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  reject: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  create_risk: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  update_risk: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  delete_risk: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  create_user: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  update_user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delete_user: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  create_role: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  update_role: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delete_role: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// Get unique modules and actions from the data for filters
const getUniqueModules = (logs: AuditLog[]) => {
  if (!logs || !Array.isArray(logs)) return ['All'];
  const modules = ['All', ...new Set(logs.map(log => log.targetType || 'System').filter(Boolean))];
  return modules;
};

const getUniqueActions = (logs: AuditLog[]) => {
  if (!logs || !Array.isArray(logs)) return ['All'];
  const actions = ['All', ...new Set(logs.map(log => log.action).filter(Boolean))];
  return actions;
};

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Date filters - removed default values
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Available filter options (populated from data)
  const [availableModules, setAvailableModules] = useState<string[]>(['All']);
  const [availableActions, setAvailableActions] = useState<string[]>(['All']);

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditStats();
  }, [currentPage, pageSize, filterModule, filterAction, fromDate, toDate]);

  useEffect(() => {
    // Update available filters when logs change
    if (logs && logs.length > 0) {
      setAvailableModules(getUniqueModules(logs));
      setAvailableActions(getUniqueActions(logs));
    }
  }, [logs]);

  useEffect(() => {
    // Apply local search filter - with safety check
    if (!logs || !Array.isArray(logs)) {
      setFilteredLogs([]);
      return;
    }
    
    if (searchQuery) {
      const filtered = logs.filter(log => 
        log.actorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  }, [logs, searchQuery]);

  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (filterModule !== 'All') {
        params.targetType = filterModule.toLowerCase();
      }
      
      if (filterAction !== 'All') {
        params.action = filterAction;
      }
      
      // Only add date filters if they're selected
      if (fromDate) {
        params.from = fromDate.toISOString();
      }
      
      if (toDate) {
        params.to = toDate.toISOString();
      }
      
      const response = await systemApi.auditLogs.list(params);
      
      // 🔍 DEBUG: Log the full response to see its structure
      console.log('Audit logs API response:', response);
      
      // The response is the array itself, not wrapped in a data property
      const logsData = Array.isArray(response) ? response : (response?.data || []);
      setLogs(logsData);
      setFilteredLogs(logsData);
      
      // If your API returns pagination info in headers or elsewhere, you'll need to adjust
      // For now, set totalCount based on array length
      setTotalCount(logsData.length);
      setTotalPages(Math.ceil(logsData.length / pageSize));
      
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs');
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const statsData = await systemApi.auditLogs.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch audit stats:', error);
      // Don't show toast for stats failure, just log it
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      setIsExporting(true);
      
      const params: any = {};
      if (filterModule !== 'All') params.targetType = filterModule;
      if (filterAction !== 'All') params.action = filterAction;
      if (fromDate) params.from = fromDate.toISOString();
      if (toDate) params.to = toDate.toISOString();
      
      // Add format to params
      params.format = format;
      
      const response = await systemApi.auditLogs.export(format, params);
      
      // Create download link
      const blob = new Blob(
        [response], 
        { type: format === 'json' ? 'application/json' : 'text/csv' }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Audit logs exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setIsExporting(false);
    }
  };

  const viewLogDetails = async (log: AuditLog) => {
    try {
      // Fetch full log details if needed
      const fullLog = await systemApi.auditLogs.get(log._id);
      setSelectedLog(fullLog);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Failed to fetch log details:', error);
      toast.error('Failed to load log details');
    }
  };

  const handleRefresh = () => {
    fetchAuditLogs();
    fetchAuditStats();
    toast.success('Audit logs refreshed');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '-';
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (e) {
      return timestamp;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track and monitor all system activities and changes"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Logs"
          value={stats?.totals?.totalLogs?.toLocaleString() || '0'}
          icon={<Database className="h-5 w-5" />}
        />
        <StatsCard
          title="Last 30 Days"
          value={stats?.totals?.logsInLast30Days?.toLocaleString() || '0'}
          icon={<Clock className="h-5 w-5" />}
          change={stats?.totals?.logsInLast30Days ? Math.round((stats.totals.logsInLast30Days / 30) * 100) : 0}
          changeLabel="avg per day"
        />
        <StatsCard
          title="Successful"
          value={stats?.totals?.successfulLogs?.toLocaleString() || '0'}
          icon={<Shield className="h-5 w-5" />}
        />
        <StatsCard
          title="Failed"
          value={stats?.totals?.failedLogs?.toLocaleString() || '0'}
          icon={<FileText className="h-5 w-5" />}
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
                  <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'MM/dd/yyyy') : 'From'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'MM/dd/yyyy') : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  {availableModules.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {availableActions.map(a => (
                    <SelectItem key={a} value={a}>
                      {a === 'All' ? 'All Actions' : a.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!filteredLogs || filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                          {log.timeAgo || formatTimestamp(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs">
                                {getInitials(log.actorName || log.actor)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{log.actorName || log.actor}</p>
                              <p className="text-xs text-muted-foreground">{log.actorEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={actionColors[log.action] || 'bg-gray-100'}>
                            {log.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{log.targetType}</p>
                            {log.targetName && (
                              <p className="text-xs text-muted-foreground">{log.targetName}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {log.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.success ? 'default' : 'destructive'} className="text-xs">
                            {log.success ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => viewLogDetails(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                    </span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{formatTimestamp(selectedLog.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Action</p>
                  <Badge className={actionColors[selectedLog.action] || 'bg-gray-100'}>
                    {selectedLog.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">User</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(selectedLog.actorName || selectedLog.actor)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedLog.actorName || selectedLog.actor}</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.actorEmail}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Target Type</p>
                  <p className="font-medium">{selectedLog.targetType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="font-medium">{selectedLog.targetName || selectedLog.targetId || '-'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{selectedLog.description}</p>
              </div>

              {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
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
                        {Object.entries(selectedLog.changes).map(([field, value]: [string, any]) => (
                          <TableRow key={field}>
                            <TableCell className="font-medium">{field}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {value?.from || value?.old || '-'}
                            </TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {value?.to || value?.new || value}
                            </TableCell>
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
                  <p className="font-mono text-sm">{selectedLog.metadata?.ipAddress || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User Agent</p>
                  <p className="text-sm truncate">{selectedLog.metadata?.userAgent || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Request ID</p>
                  <p className="font-mono text-xs">{selectedLog.metadata?.requestId || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-sm">{selectedLog.metadata?.responseTime}ms</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={selectedLog.success ? 'default' : 'destructive'}>
                  {selectedLog.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}