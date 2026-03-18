import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, CheckCircle2, XCircle, AlertCircle, Clock, Calendar,
  FileText, Users, Plus, Download, RefreshCw, Loader2, Eye,
  Edit, Trash2, Save, ChevronLeft, ChevronRight, ChevronsLeft,
  ChevronsRight, Filter, Search, Award, Target, BarChart3
} from 'lucide-react';
import { systemApi, ComplianceFramework, ComplianceChecklist, ComplianceAudit, ComplianceReport } from '@/lib/api/system';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusColors = {
  'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'compliant': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'non_compliant': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'open': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'closed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const severityColors = {
  'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function CompliancePage() {
  const { organizationData } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [checklists, setChecklists] = useState<ComplianceChecklist[]>([]);
  const [audits, setAudits] = useState<ComplianceAudit[]>([]);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  
  // Dialog states
  const [isAddFrameworkOpen, setIsAddFrameworkOpen] = useState(false);
  const [isAddChecklistOpen, setIsAddChecklistOpen] = useState(false);
  const [isAddAuditOpen, setIsAddAuditOpen] = useState(false);
  const [isViewChecklistOpen, setIsViewChecklistOpen] = useState(false);
  const [isViewAuditOpen, setIsViewAuditOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<ComplianceChecklist | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<ComplianceAudit | null>(null);
  
  // Form states
  const [newFramework, setNewFramework] = useState({
    name: '',
    assignedTo: '',
    notes: '',
  });
  
  const [newChecklist, setNewChecklist] = useState({
    framework: '',
    category: '',
    items: [] as { requirement: string; description: string; assignedTo: string; dueDate: string }[],
  });
  
  const [newAudit, setNewAudit] = useState({
    title: '',
    type: 'internal' as 'internal' | 'external',
    framework: '',
    auditor: '',
    auditDate: format(new Date(), 'yyyy-MM-dd'),
    scope: '',
    findings: [] as { finding: string; severity: 'low' | 'medium' | 'high' | 'critical' }[],
  });
  
  // Filter states
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      setIsLoading(true);
      
      // Get overview
      const overviewData = await systemApi.compliance.getOverview();
      setOverview(overviewData);
      
      // Get frameworks, checklists, audits from the export endpoint
      const exportData = await systemApi.compliance.export();
      setFrameworks(exportData.frameworks || []);
      setChecklists(exportData.checklists || []);
      setAudits(exportData.audits || []);
      setReport(exportData);
      
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFramework = async () => {
    if (!newFramework.name || !newFramework.assignedTo) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await systemApi.compliance.frameworks.create({
        name: newFramework.name,
        assignedTo: newFramework.assignedTo,
        notes: newFramework.notes || undefined,
      });
      
      toast.success('Framework added successfully');
      
      // Refresh data
      await fetchComplianceData();
      
      // Reset form
      setNewFramework({ name: '', assignedTo: '', notes: '' });
      setIsAddFrameworkOpen(false);
      
    } catch (error: any) {
      console.error('Failed to add framework:', error);
      toast.error(error.message || 'Failed to add framework');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateFrameworkStatus = async (frameworkId: string, status: string, notes?: string) => {
    try {
      await systemApi.compliance.frameworks.update(frameworkId, { status, notes } as any);
      toast.success('Framework updated successfully');
      await fetchComplianceData();
    } catch (error: any) {
      console.error('Failed to update framework:', error);
      toast.error(error.message || 'Failed to update framework');
    }
  };

  const handleAddChecklist = async () => {
    if (!newChecklist.framework || !newChecklist.category || newChecklist.items.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await systemApi.compliance.checklists.create(newChecklist);
      toast.success('Checklist created successfully');
      
      // Refresh data
      await fetchComplianceData();
      
      // Reset form
      setNewChecklist({ framework: '', category: '', items: [] });
      setIsAddChecklistOpen(false);
      
    } catch (error: any) {
      console.error('Failed to create checklist:', error);
      toast.error(error.message || 'Failed to create checklist');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateChecklistItem = async (checklistId: string, itemId: string, status: string, notes?: string) => {
    try {
      await systemApi.compliance.checklists.updateItem(checklistId, itemId, { status, notes } as any);
      toast.success('Checklist item updated');
      await fetchComplianceData();
    } catch (error: any) {
      console.error('Failed to update checklist item:', error);
      toast.error(error.message || 'Failed to update checklist item');
    }
  };

  const handleAddAudit = async () => {
    if (!newAudit.title || !newAudit.framework || !newAudit.auditor || !newAudit.scope) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await systemApi.compliance.audits.create(newAudit);
      toast.success('Audit created successfully');
      
      // Refresh data
      await fetchComplianceData();
      
      // Reset form
      setNewAudit({
        title: '',
        type: 'internal',
        framework: '',
        auditor: '',
        auditDate: format(new Date(), 'yyyy-MM-dd'),
        scope: '',
        findings: [],
      });
      setIsAddAuditOpen(false);
      
    } catch (error: any) {
      console.error('Failed to create audit:', error);
      toast.error(error.message || 'Failed to create audit');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateReport = async (framework?: string) => {
    try {
      setIsLoading(true);
      const reportData = await systemApi.compliance.getReports({ framework });
      setReport(reportData);
      toast.success('Report generated');
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await systemApi.compliance.export();
      
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Compliance data exported');
    } catch (error: any) {
      console.error('Failed to export data:', error);
      toast.error(error.message || 'Failed to export data');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Management"
        description="Manage compliance frameworks, checklists, and audits"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchComplianceData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-3xl font-bold">{overview?.overallScore || report?.overallComplianceScore || 0}%</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Frameworks</p>
                <p className="text-3xl font-bold">{frameworks.length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              <Badge className={statusColors.compliant}>Compliant: {frameworks.filter(f => f.status === 'compliant').length}</Badge>
              <Badge className={statusColors.in_progress}>In Progress: {frameworks.filter(f => f.status === 'in_progress').length}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Checklists</p>
                <p className="text-3xl font-bold">{checklists.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Audits</p>
                <p className="text-3xl font-bold">{audits.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="frameworks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Frameworks Tab */}
        <TabsContent value="frameworks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Compliance Frameworks</CardTitle>
                <CardDescription>
                  Manage compliance frameworks and track their status
                </CardDescription>
              </div>
              <Dialog open={isAddFrameworkOpen} onOpenChange={setIsAddFrameworkOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Framework
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Compliance Framework</DialogTitle>
                    <DialogDescription>
                      Add a new compliance framework to track
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="frameworkName">Framework Name *</Label>
                      <Input
                        id="frameworkName"
                        placeholder="e.g., ISO27001, GDPR, SOC2"
                        value={newFramework.name}
                        onChange={(e) => setNewFramework({ ...newFramework, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assigned To *</Label>
                      <Select 
                        value={newFramework.assignedTo}
                        onValueChange={(value) => setNewFramework({ ...newFramework, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current User</SelectItem>
                          {/* Add more users here */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about this framework"
                        value={newFramework.notes}
                        onChange={(e) => setNewFramework({ ...newFramework, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddFrameworkOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFramework} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Framework'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {frameworks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No frameworks added. Add your first compliance framework to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {frameworks.map((framework) => (
                    <div key={framework._id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{framework.name}</h4>
                            <Badge className={statusColors[framework.status]}>
                              {framework.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{framework.notes}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials(framework.assignedTo?.personalInfo?.firstName || '')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {framework.assignedTo?.personalInfo?.firstName} {framework.assignedTo?.personalInfo?.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Select
                          value={framework.status}
                          onValueChange={(value) => handleUpdateFrameworkStatus(framework._id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="compliant">Compliant</SelectItem>
                            <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checklists Tab */}
        <TabsContent value="checklists" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Compliance Checklists</CardTitle>
                <CardDescription>
                  Create and manage compliance checklists
                </CardDescription>
              </div>
              <Dialog open={isAddChecklistOpen} onOpenChange={setIsAddChecklistOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Checklist
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create Compliance Checklist</DialogTitle>
                    <DialogDescription>
                      Create a new checklist for a compliance framework
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="checklistFramework">Framework *</Label>
                      <Select 
                        value={newChecklist.framework}
                        onValueChange={(value) => setNewChecklist({ ...newChecklist, framework: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          {frameworks.map(f => (
                            <SelectItem key={f._id} value={f.name}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Access Control, Data Protection"
                        value={newChecklist.category}
                        onChange={(e) => setNewChecklist({ ...newChecklist, category: e.target.value })}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Checklist Items</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewChecklist({
                              ...newChecklist,
                              items: [
                                ...newChecklist.items,
                                { requirement: '', description: '', assignedTo: '', dueDate: '' }
                              ]
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      
                      {newChecklist.items.map((item, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">Item {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newItems = [...newChecklist.items];
                                newItems.splice(index, 1);
                                setNewChecklist({ ...newChecklist, items: newItems });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Requirement *</Label>
                            <Input
                              placeholder="e.g., A.9.1.1 Access Control Policy"
                              value={item.requirement}
                              onChange={(e) => {
                                const newItems = [...newChecklist.items];
                                newItems[index].requirement = e.target.value;
                                setNewChecklist({ ...newChecklist, items: newItems });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description *</Label>
                            <Textarea
                              placeholder="Describe the requirement"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...newChecklist.items];
                                newItems[index].description = e.target.value;
                                setNewChecklist({ ...newChecklist, items: newItems });
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Assigned To *</Label>
                              <Select 
                                value={item.assignedTo}
                                onValueChange={(value) => {
                                  const newItems = [...newChecklist.items];
                                  newItems[index].assignedTo = value;
                                  setNewChecklist({ ...newChecklist, items: newItems });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="current">Current User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Due Date *</Label>
                              <Input
                                type="date"
                                value={item.dueDate}
                                onChange={(e) => {
                                  const newItems = [...newChecklist.items];
                                  newItems[index].dueDate = e.target.value;
                                  setNewChecklist({ ...newChecklist, items: newItems });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddChecklistOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddChecklist} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Checklist'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {checklists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No checklists created. Create your first compliance checklist.
                </div>
              ) : (
                <div className="space-y-4">
                  {checklists.map((checklist) => (
                    <div key={checklist._id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{checklist.framework} - {checklist.category}</h4>
                            <Badge variant="outline">
                              {checklist.items.length} items
                            </Badge>
                            <Badge variant="outline">
                              {checklist.overallProgress}% complete
                            </Badge>
                          </div>
                          <Progress value={checklist.overallProgress} className="h-2 w-full max-w-md" />
                          <p className="text-xs text-muted-foreground">
                            Last reviewed: {formatDate(checklist.lastReviewed)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedChecklist(checklist);
                            setIsViewChecklistOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Items
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Checklist Dialog */}
          <Dialog open={isViewChecklistOpen} onOpenChange={setIsViewChecklistOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedChecklist?.framework} - {selectedChecklist?.category}
                </DialogTitle>
                <DialogDescription>
                  Manage checklist items and track progress
                </DialogDescription>
              </DialogHeader>
              {selectedChecklist && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={selectedChecklist.overallProgress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{selectedChecklist.overallProgress}% Complete</span>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedChecklist.items.map((item) => (
                      <div key={item._id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.requirement}</h4>
                              <Badge className={statusColors[item.status]}>
                                {item.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm">{item.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Due: {formatDate(item.dueDate)}</span>
                              {item.completedAt && (
                                <span>Completed: {formatDate(item.completedAt)}</span>
                              )}
                            </div>
                            {item.notes && (
                              <p className="text-sm bg-muted p-2 rounded">{item.notes}</p>
                            )}
                          </div>
                          <Select
                            value={item.status}
                            onValueChange={(value) => {
                              handleUpdateChecklistItem(
                                selectedChecklist._id,
                                item._id,
                                value,
                                'Updated via checklist'
                              );
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="compliant">Compliant</SelectItem>
                              <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Audits Tab */}
        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Compliance Audits</CardTitle>
                <CardDescription>
                  Schedule and track compliance audits
                </CardDescription>
              </div>
              <Dialog open={isAddAuditOpen} onOpenChange={setIsAddAuditOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Audit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Audit</DialogTitle>
                    <DialogDescription>
                      Schedule a new compliance audit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="auditTitle">Title *</Label>
                      <Input
                        id="auditTitle"
                        placeholder="e.g., Q1 2026 Internal Audit"
                        value={newAudit.title}
                        onChange={(e) => setNewAudit({ ...newAudit, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auditType">Type *</Label>
                        <Select 
                          value={newAudit.type}
                          onValueChange={(value: 'internal' | 'external') => 
                            setNewAudit({ ...newAudit, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="auditFramework">Framework *</Label>
                        <Select 
                          value={newAudit.framework}
                          onValueChange={(value) => setNewAudit({ ...newAudit, framework: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {frameworks.map(f => (
                              <SelectItem key={f._id} value={f.name}>{f.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auditor">Auditor *</Label>
                        <Input
                          id="auditor"
                          placeholder="Auditor name"
                          value={newAudit.auditor}
                          onChange={(e) => setNewAudit({ ...newAudit, auditor: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auditDate">Audit Date *</Label>
                        <Input
                          id="auditDate"
                          type="date"
                          value={newAudit.auditDate}
                          onChange={(e) => setNewAudit({ ...newAudit, auditDate: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scope">Scope *</Label>
                      <Textarea
                        id="scope"
                        placeholder="Describe the audit scope"
                        value={newAudit.scope}
                        onChange={(e) => setNewAudit({ ...newAudit, scope: e.target.value })}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Findings</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewAudit({
                              ...newAudit,
                              findings: [
                                ...newAudit.findings,
                                { finding: '', severity: 'medium' }
                              ]
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Finding
                        </Button>
                      </div>
                      
                      {newAudit.findings.map((finding, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">Finding {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newFindings = [...newAudit.findings];
                                newFindings.splice(index, 1);
                                setNewAudit({ ...newAudit, findings: newFindings });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Finding Description</Label>
                            <Input
                              placeholder="Describe the finding"
                              value={finding.finding}
                              onChange={(e) => {
                                const newFindings = [...newAudit.findings];
                                newFindings[index].finding = e.target.value;
                                setNewAudit({ ...newAudit, findings: newFindings });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Severity</Label>
                            <Select 
                              value={finding.severity}
                              onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => {
                                const newFindings = [...newAudit.findings];
                                newFindings[index].severity = value;
                                setNewAudit({ ...newAudit, findings: newFindings });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAuditOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAudit} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Audit'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {audits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No audits scheduled. Create your first compliance audit.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Audit Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audits.map((audit) => (
                      <TableRow key={audit._id}>
                        <TableCell className="font-medium">{audit.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{audit.type}</Badge>
                        </TableCell>
                        <TableCell>{audit.framework}</TableCell>
                        <TableCell>{audit.auditor}</TableCell>
                        <TableCell>{formatDate(audit.auditDate)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[audit.overallStatus]}>
                            {audit.overallStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {audit.findings.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAudit(audit);
                              setIsViewAuditOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* View Audit Dialog */}
          <Dialog open={isViewAuditOpen} onOpenChange={setIsViewAuditOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedAudit?.title}</DialogTitle>
                <DialogDescription>
                  Audit details and findings
                </DialogDescription>
              </DialogHeader>
              {selectedAudit && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge variant="outline">{selectedAudit.type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Framework</p>
                      <p className="font-medium">{selectedAudit.framework}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auditor</p>
                      <p className="font-medium">{selectedAudit.auditor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Audit Date</p>
                      <p className="font-medium">{formatDate(selectedAudit.auditDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Report Date</p>
                      <p className="font-medium">{formatDate(selectedAudit.reportDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={statusColors[selectedAudit.overallStatus]}>
                        {selectedAudit.overallStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Scope</p>
                    <p className="text-sm bg-muted p-3 rounded">{selectedAudit.scope}</p>
                  </div>
                  
                  {selectedAudit.findings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Findings</h4>
                      <div className="space-y-3">
                        {selectedAudit.findings.map((finding) => (
                          <div key={finding._id} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={severityColors[finding.severity]}>
                                {finding.severity}
                              </Badge>
                              <Badge className={statusColors[finding.status]}>
                                {finding.status}
                              </Badge>
                            </div>
                            <p className="text-sm">{finding.finding}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>
                  Generate and view compliance reports
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select 
                  value={frameworkFilter}
                  onValueChange={(value) => {
                    setFrameworkFilter(value);
                    handleGenerateReport(value !== 'all' ? value : undefined);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    {frameworks.map(f => (
                      <SelectItem key={f._id} value={f.name}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => handleGenerateReport()}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {report && (
                <div className="space-y-6">
                  {/* Report Summary */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                        <p className="text-2xl font-bold">{report.overallScore || report.summary?.overallScore || 0}%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Frameworks</p>
                        <p className="text-2xl font-bold">{report.frameworks?.length || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Audits</p>
                        <p className="text-2xl font-bold">{report.recentAudits?.length || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Generated</p>
                        <p className="text-sm font-medium">{formatDate(report.generatedAt)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Framework Status */}
                  {report.frameworks && report.frameworks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Framework Status</h4>
                      <div className="space-y-2">
                        {report.frameworks.map((fw, index) => (
                          <div key={index} className="flex items-center gap-4 p-2 rounded-lg border">
                            <span className="flex-1">{fw.name}</span>
                            <Badge className={statusColors[fw.status]}>
                              {fw.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Audits */}
                  {report.recentAudits && report.recentAudits.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Recent Audits</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Audit Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Findings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {report.recentAudits.map((audit, index) => (
                            <TableRow key={index}>
                              <TableCell>{audit.title}</TableCell>
                              <TableCell>{audit.type}</TableCell>
                              <TableCell>{formatDate(audit.auditDate)}</TableCell>
                              <TableCell>
                                <Badge className={statusColors[audit.overallStatus]}>
                                  {audit.overallStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {audit.openFindings} / {audit.findingsCount}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}