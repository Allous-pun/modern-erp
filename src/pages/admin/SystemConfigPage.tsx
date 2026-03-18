import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import { 
  Save, Loader2, RefreshCw, Database, HardDrive, Cloud, Clock,
  Calendar, Settings as SettingsIcon, Server, Cpu, Wifi, Power,
  Trash2, AlertTriangle, Download, Upload, RotateCcw, Archive,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { systemApi, Backup, BackupStats } from '@/lib/api/system';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  version: string;
  environment: string;
  services: {
    database: { status: 'up' | 'down'; latency: number };
    storage: { status: 'up' | 'down'; used: number; total: number };
    cache: { status: 'up' | 'down'; latency: number };
    queue: { status: 'up' | 'down' };
  };
}

const statusColors = {
  healthy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  degraded: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  down: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  up: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

export function SystemConfigPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [backupStats, setBackupStats] = useState<BackupStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  
  // Backup retention settings
  const [retentionDays, setRetentionDays] = useState(30);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [autoBackupTime, setAutoBackupTime] = useState('02:00');
  
  // Logging settings
  const [logRetentionDays, setLogRetentionDays] = useState(90);
  const [debugMode, setDebugMode] = useState(false);
  
  // Cache settings
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [cacheTTL, setCacheTTL] = useState(3600);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch backups
      const backupsResponse = await systemApi.backups.list({ limit: 5 });
      setBackups(backupsResponse.data || []);
      
      // Fetch backup stats
      const stats = await systemApi.backups.getStats();
      setBackupStats(stats);
      
      // Mock system health (replace with real API call)
      setSystemHealth({
        status: 'healthy',
        uptime: '15 days 4 hours',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        services: {
          database: { status: 'up', latency: 45 },
          storage: { status: 'up', used: 45, total: 100 },
          cache: { status: 'up', latency: 12 },
          queue: { status: 'up' },
        },
      });
      
    } catch (error) {
      console.error('Failed to fetch system data:', error);
      toast.error('Failed to load system configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true);
      
      await systemApi.backups.create({
        includes: ['all'],
        notes: 'Manual system backup',
      });
      
      toast.success('Backup started successfully');
      
      // Refresh backups
      const response = await systemApi.backups.list({ limit: 5 });
      setBackups(response.data || []);
      
    } catch (error: any) {
      console.error('Failed to create backup:', error);
      toast.error(error.message || 'Failed to create backup');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    try {
      setIsSaving(true);
      
      await systemApi.backups.restore(selectedBackup._id);
      
      toast.success('Backup restore initiated');
      setIsRestoreDialogOpen(false);
      
    } catch (error: any) {
      console.error('Failed to restore backup:', error);
      toast.error(error.message || 'Failed to restore backup');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;
    
    try {
      setIsSaving(true);
      
      await systemApi.backups.delete(selectedBackup._id);
      
      toast.success('Backup deleted successfully');
      setIsDeleteDialogOpen(false);
      
      // Refresh backups
      const response = await systemApi.backups.list({ limit: 5 });
      setBackups(response.data || []);
      
      // Refresh stats
      const stats = await systemApi.backups.getStats();
      setBackupStats(stats);
      
    } catch (error: any) {
      console.error('Failed to delete backup:', error);
      toast.error(error.message || 'Failed to delete backup');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCleanupOldLogs = async () => {
    try {
      setIsCleaningUp(true);
      
      await systemApi.auditLogs.cleanup(logRetentionDays);
      
      toast.success(`Old audit logs cleaned up (older than ${logRetentionDays} days)`);
      
    } catch (error: any) {
      console.error('Failed to cleanup logs:', error);
      toast.error(error.message || 'Failed to cleanup logs');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Here you would save the settings to your backend
      // This could include maintenance mode, backup settings, etc.
      
      toast.success('System settings saved successfully');
      
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Configuration"
        description="Manage system-wide settings, backups, and maintenance"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSystemData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="logs">Logs & Monitoring</TabsTrigger>
        </TabsList>

        {/* System Information */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>
                Current system status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[systemHealth?.status || 'healthy']}>
                      {systemHealth?.status?.toUpperCase() || 'HEALTHY'}
                    </Badge>
                    <span className="text-sm">Uptime: {systemHealth?.uptime}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-medium">{systemHealth?.version}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Services</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[systemHealth?.services.database.status || 'up']}>
                          {systemHealth?.services.database.status?.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {systemHealth?.services.database.latency}ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage</span>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[systemHealth?.services.storage.status || 'up']}>
                          {systemHealth?.services.storage.status?.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {systemHealth?.services.storage.used}% used
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache</span>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[systemHealth?.services.cache.status || 'up']}>
                          {systemHealth?.services.cache.status?.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {systemHealth?.services.cache.latency}ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queue</span>
                      <Badge className={statusColors[systemHealth?.services.queue.status || 'up']}>
                        {systemHealth?.services.queue.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Environment</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Environment</span>
                      <Badge variant="outline">{systemHealth?.environment}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Node Version</span>
                      <span className="text-sm">v18.17.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <span className="text-sm">MongoDB 6.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Performance Settings
              </CardTitle>
              <CardDescription>
                Configure system performance and caching options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Caching</p>
                  <p className="text-sm text-muted-foreground">
                    Cache database queries and API responses
                  </p>
                </div>
                <Switch
                  checked={cacheEnabled}
                  onCheckedChange={setCacheEnabled}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Cache TTL (seconds)</Label>
                <Input
                  type="number"
                  value={cacheTTL}
                  onChange={(e) => setCacheTTL(parseInt(e.target.value))}
                  disabled={!cacheEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Time-to-live for cached items (default: 3600 seconds)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups */}
        <TabsContent value="backups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Management
                </div>
                <Button
                  size="sm"
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                >
                  {isCreatingBackup ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Backup
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Create and manage system backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Backups</p>
                        <p className="text-2xl font-bold">{backupStats?.totalBackups || 0}</p>
                      </div>
                      <Archive className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Size</p>
                        <p className="text-2xl font-bold">{backupStats?.totalSizeFormatted || '0 B'}</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold">{backupStats?.completedBackups || 0}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Failed</p>
                        <p className="text-2xl font-bold">{backupStats?.failedBackups || 0}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Recent Backups</h4>
                  <Button variant="link" size="sm" asChild>
                    <a href="/app/system/backups">View All</a>
                  </Button>
                </div>
                
                {backups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No backups found. Create your first backup.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.slice(0, 3).map((backup) => (
                      <div
                        key={backup._id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Archive className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {backup.filename.length > 40
                                ? backup.filename.substring(0, 40) + '...'
                                : backup.filename}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(backup.createdAt)}</span>
                              <span>•</span>
                              <span>{backup.formattedSize || formatFileSize(backup.fileSize)}</span>
                              <Badge className={backup.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}>
                                {backup.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setIsRestoreDialogOpen(true);
                            }}
                            disabled={backup.status !== 'completed'}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Backup Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Backups</p>
                      <p className="text-sm text-muted-foreground">
                        Schedule regular system backups
                      </p>
                    </div>
                    <Switch
                      checked={autoBackupEnabled}
                      onCheckedChange={setAutoBackupEnabled}
                    />
                  </div>
                  
                  {autoBackupEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Backup Time</Label>
                        <Input
                          type="time"
                          value={autoBackupTime}
                          onChange={(e) => setAutoBackupTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Retention Period (days)</Label>
                        <Input
                          type="number"
                          value={retentionDays}
                          onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Automatically delete backups older than this many days
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power className="h-5 w-5" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>
                Put the system into maintenance mode for updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    When enabled, only administrators can access the system
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              
              {maintenanceMode && (
                <div className="space-y-2">
                  <Label>Maintenance Message</Label>
                  <Input
                    placeholder="System is under maintenance..."
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Maintenance
              </CardTitle>
              <CardDescription>
                Optimize and repair database tables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Database Size</p>
                  <p className="text-sm text-muted-foreground">
                    Current database size: 245 MB
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <HardDrive className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Optimize Tables</p>
                  <p className="text-sm text-muted-foreground">
                    Reorganize and compact database tables
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Optimize
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Repair Tables</p>
                  <p className="text-sm text-muted-foreground">
                    Check and repair corrupted tables
                                 </p>
                </div>
                <Button variant="outline" size="sm" className="text-yellow-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Repair
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Storage Cleanup
              </CardTitle>
              <CardDescription>
                Clean up temporary files and optimize storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Temporary Files</p>
                  <p className="text-sm text-muted-foreground">
                    156 MB of temporary files
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clean Up
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">File Uploads Cache</p>
                  <p className="text-sm text-muted-foreground">
                    89 MB in upload cache
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Logs</p>
                  <p className="text-sm text-muted-foreground">
                    45 MB of log files
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Archive & Clean
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs & Monitoring */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Log Management
              </CardTitle>
              <CardDescription>
                Configure logging and audit trail settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Log Retention Period (days)</Label>
                <Input
                  type="number"
                  value={logRetentionDays}
                  onChange={(e) => setLogRetentionDays(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Automatically delete logs older than this many days
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Debug Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed debug logging
                  </p>
                </div>
                <Switch
                  checked={debugMode}
                  onCheckedChange={setDebugMode}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Audit Logs</p>
                    <p className="text-sm text-muted-foreground">
                      Track all user activities and system changes
                    </p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Error Logs</p>
                    <p className="text-sm text-muted-foreground">
                      Log all system errors and exceptions
                    </p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Access Logs</p>
                    <p className="text-sm text-muted-foreground">
                      Track API access and authentication attempts
                    </p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleCleanupOldLogs}
                  disabled={isCleaningUp}
                >
                  {isCleaningUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cleanup Old Logs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Monitoring
              </CardTitle>
              <CardDescription>
                Monitor system performance and health
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">1.2 GB / 4 GB (30%)</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disk Usage</span>
                  <span className="text-sm font-medium">45 GB / 100 GB (45%)</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Requests/sec</p>
                  <p className="text-2xl font-bold">245</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">124ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className="text-2xl font-bold">0.02%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreBackup}
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSaving ? (
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
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBackup}
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? (
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
    </div>
  );
}

// Add missing import
import { Activity } from 'lucide-react';