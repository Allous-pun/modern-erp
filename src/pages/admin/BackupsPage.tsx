import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Database, Download, RefreshCw, Loader2, Plus, MoreHorizontal,
  Trash2, RotateCcw, Info, Calendar, HardDrive, CheckCircle2,
  XCircle, AlertCircle, Clock, FileText, Archive, Shield,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { systemApi, Backup, BackupStats } from '@/lib/api/system';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatsCard } from '@/components/dashboard/StatsCard';

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const typeColors: Record<string, string> = {
  manual: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  automatic: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

export function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Backup[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Form state for new backup
  const [newBackup, setNewBackup] = useState({
    includes: ['all'] as string[],
    notes: '',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchBackups();
    fetchBackupStats();
  }, [currentPage, pageSize]);

  const fetchBackups = async () => {
    try {
      setIsLoading(true);
      const response = await systemApi.backups.list({
        page: currentPage,
        limit: pageSize,
      });
      
      // Log the response to debug
      console.log('Backups response:', response);
      
      // Check if response is the array directly
      if (Array.isArray(response)) {
        setBackups(response);
        setFilteredLogs(response);
        setTotalCount(response.length);
        setTotalPages(Math.ceil(response.length / pageSize));
      } 
      // Or if it's wrapped in a data property
      else if (response?.data && Array.isArray(response.data)) {
        setBackups(response.data);
        setFilteredLogs(response.data);
        setTotalCount(response.total || response.data.length);
        setTotalPages(response.pages || Math.ceil((response.total || response.data.length) / pageSize));
      }
      // Fallback to empty array
      else {
        console.warn('Unexpected response format:', response);
        setBackups([]);
        setFilteredLogs([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch backups:', error);
      toast.error('Failed to load backups');
      setBackups([]);
      setFilteredLogs([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBackupStats = async () => {
    try {
      const statsData = await systemApi.backups.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch backup stats:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsCreating(true);
      
      const response = await systemApi.backups.create({
        includes: newBackup.includes,
        notes: newBackup.notes || undefined,
      });
      
      toast.success('Backup started successfully');
      
      // Reset form and close dialog
      setNewBackup({ includes: ['all'], notes: '' });
      setIsCreateDialogOpen(false);
      
      // Refresh backups
      await fetchBackups();
      await fetchBackupStats();
    } catch (error: any) {
      console.error('Failed to create backup:', error);
      toast.error(error.message || 'Failed to create backup');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadBackup = async (backup: Backup) => {
    try {
      const blob = await systemApi.backups.download(backup._id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.filename || `backup-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.gz`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Backup downloaded successfully');
    } catch (error) {
      console.error('Failed to download backup:', error);
      toast.error('Failed to download backup');
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    try {
      setIsRestoring(true);
      
      await systemApi.backups.restore(selectedBackup._id);
      
      toast.success('Backup restore started successfully');
      setIsRestoreDialogOpen(false);
      
      // Refresh backups
      await fetchBackups();
    } catch (error: any) {
      console.error('Failed to restore backup:', error);
      toast.error(error.message || 'Failed to restore backup');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;
    
    try {
      setIsDeleting(true);
      
      await systemApi.backups.delete(selectedBackup._id);
      
      toast.success('Backup deleted successfully');
      setIsDeleteDialogOpen(false);
      
      // Refresh backups
      await fetchBackups();
      await fetchBackupStats();
    } catch (error: any) {
      console.error('Failed to delete backup:', error);
      toast.error(error.message || 'Failed to delete backup');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchBackups();
    fetchBackupStats();
    toast.success('Backups refreshed');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  // Calculate paginated data for display
  const paginatedBackups = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backup Management"
        description="Create, download, and restore system backups"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Backup
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Backup</DialogTitle>
                  <DialogDescription>
                    Create a manual backup of your system data. This may take a few minutes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Include Data</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-all" 
                        checked={newBackup.includes.includes('all')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewBackup({ ...newBackup, includes: ['all'] });
                          } else {
                            setNewBackup({ ...newBackup, includes: [] });
                          }
                        }}
                      />
                      <Label htmlFor="include-all">All data (recommended)</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will include all databases, files, and configurations
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this backup..."
                      value={newBackup.notes}
                      onChange={(e) => setNewBackup({ ...newBackup, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBackup} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Start Backup'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Backups"
          value={stats?.totalBackups?.toString() || '0'}
          icon={<Database className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Size"
          value={stats?.totalSizeFormatted || '0 Bytes'}
          icon={<HardDrive className="h-5 w-5" />}
        />
        <StatsCard
          title="Completed"
          value={stats?.completedBackups?.toString() || '0'}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Failed"
          value={stats?.failedBackups?.toString() || '0'}
          icon={<XCircle className="h-5 w-5 text-red-600" />}
        />
      </div>

      {/* Backups Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Backup History</CardTitle>
            {filteredLogs.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredLogs.length} backup{filteredLogs.length !== 1 ? 's' : ''}
                </span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Backup</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBackups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No backups found. Create your first backup to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedBackups.map((backup) => (
                      <TableRow key={backup._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                              <Archive className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{backup.filename}</p>
                              {backup.notes && (
                                <p className="text-xs text-muted-foreground">{backup.notes}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeColors[backup.type]}>
                            {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[backup.status]}>
                              {backup.status === 'in_progress' ? 'In Progress' : 
                               backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                            </Badge>
                            {backup.status === 'failed' && backup.errorMessage && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  setSelectedBackup(backup);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{backup.formattedSize || formatFileSize(backup.fileSize)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(backup.createdBy?.personalInfo?.firstName || '')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {backup.createdBy?.personalInfo?.firstName} {backup.createdBy?.personalInfo?.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{formatDate(backup.createdAt)}</span>
                            <span className="text-xs text-muted-foreground">{getTimeAgo(backup.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownloadBackup(backup)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBackup(backup);
                                  setIsRestoreDialogOpen(true);
                                }}
                                disabled={backup.status !== 'completed'}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBackup(backup);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <Info className="mr-2 h-4 w-4" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedBackup(backup);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredLogs.length > pageSize && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length}
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
                      Page {currentPage} of {Math.ceil(filteredLogs.length / pageSize)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredLogs.length / pageSize)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.ceil(filteredLogs.length / pageSize))}
                      disabled={currentPage === Math.ceil(filteredLogs.length / pageSize)}
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

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this backup? This will overwrite current data and cannot be undone.
              {selectedBackup && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{selectedBackup.filename}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {formatDate(selectedBackup.createdAt)}
                  </p>
                  {selectedBackup.notes && (
                    <p className="text-xs text-muted-foreground mt-1">Notes: {selectedBackup.notes}</p>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreBackup}
              disabled={isRestoring}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                'Restore Backup'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this backup? This action cannot be undone.
              {selectedBackup && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{selectedBackup.filename}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {formatDate(selectedBackup.createdAt)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBackup}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Backup Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Backup Details</DialogTitle>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Filename</p>
                  <p className="font-medium break-all">{selectedBackup.filename}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedBackup.status]}>
                    {selectedBackup.status === 'in_progress' ? 'In Progress' : 
                     selectedBackup.status.charAt(0).toUpperCase() + selectedBackup.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge className={typeColors[selectedBackup.type]}>
                    {selectedBackup.type.charAt(0).toUpperCase() + selectedBackup.type.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{selectedBackup.formattedSize || formatFileSize(selectedBackup.fileSize)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {getInitials(selectedBackup.createdBy?.personalInfo?.firstName || '')}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {selectedBackup.createdBy?.personalInfo?.firstName} {selectedBackup.createdBy?.personalInfo?.lastName}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(selectedBackup.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(selectedBackup.createdAt)}</p>
                </div>
              </div>

              {selectedBackup.completedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Completed At</p>
                    <p className="font-medium">{formatDate(selectedBackup.completedAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {Math.round((new Date(selectedBackup.completedAt).getTime() - new Date(selectedBackup.createdAt).getTime()) / 1000)} seconds
                    </p>
                  </div>
                </div>
              )}

              {selectedBackup.notes && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium p-3 bg-muted rounded-lg">{selectedBackup.notes}</p>
                </div>
              )}

              {selectedBackup.errorMessage && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground text-red-600">Error Message</p>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-400">{selectedBackup.errorMessage}</p>
                    {selectedBackup.errorStack && process.env.NODE_ENV === 'development' && (
                      <pre className="mt-2 text-xs text-red-600/80 dark:text-red-400/80 overflow-auto">
                        {selectedBackup.errorStack}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Encrypted</p>
                  <p className="font-medium">{selectedBackup.isEncrypted ? 'Yes' : 'No'}</p>
                </div>
                {selectedBackup.encryptionMethod && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Encryption Method</p>
                    <p className="font-medium">{selectedBackup.encryptionMethod}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Restore Count</p>
                  <p className="font-medium">{selectedBackup.restoreCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Archived</p>
                  <p className="font-medium">{selectedBackup.isArchived ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}