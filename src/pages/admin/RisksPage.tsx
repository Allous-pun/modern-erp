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
  AlertTriangle, TrendingUp, TrendingDown, Minus, Shield,
  Plus, Download, RefreshCw, Loader2, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, Search, BarChart3, PieChart, Calendar, Clock,
  CheckCircle2, XCircle, AlertCircle, Target, Flag
} from 'lucide-react';
import { systemApi, Risk, RiskDashboard, RiskAssessment, RiskFilterParams } from '@/lib/api/system';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

const riskLevelColors = {
  'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const statusColors = {
  'identified': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  'assessed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'mitigating': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'monitoring': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'closed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

const categoryColors = {
  'cybersecurity': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'operational': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'financial': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'compliance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'reputational': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'hr': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'strategic': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const impactLabels = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'critical': 'Critical',
};

const probabilityLabels = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
};

const mitigationStrategyLabels = {
  'avoid': 'Avoid',
  'reduce': 'Reduce',
  'transfer': 'Transfer',
  'accept': 'Accept',
};

export function RisksPage() {
  const { organizationData } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data states
  const [dashboard, setDashboard] = useState<RiskDashboard | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  
  // Dialog states
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);
  const [isViewRiskOpen, setIsViewRiskOpen] = useState(false);
  const [isEditRiskOpen, setIsEditRiskOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddAssessmentOpen, setIsAddAssessmentOpen] = useState(false);
  const [isViewAssessmentOpen, setIsViewAssessmentOpen] = useState(false);
  
  // Form states
  const [newRisk, setNewRisk] = useState({
    title: '',
    description: '',
    category: 'operational' as Risk['category'],
    impact: 'medium' as Risk['impact'],
    probability: 'medium' as Risk['probability'],
    mitigationStrategy: 'reduce' as Risk['mitigationStrategy'],
    mitigationPlan: '',
    contingencyPlan: '',
    owner: '',
    stakeholders: [] as string[],
    financialImpact: {
      currency: 'USD',
      minAmount: 0,
      maxAmount: 0,
      expectedAmount: 0,
    },
    notes: '',
  });
  
  const [editRisk, setEditRisk] = useState<Partial<Risk>>({});
  
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'identified' as Risk['status'],
    notes: '',
  });
  
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    scope: '',
    methodology: '',
    findings: [] as { riskId: string; observations: string }[],
    recommendations: [] as { recommendation: string; priority: 'low' | 'medium' | 'high' | 'critical'; assignedTo: string; dueDate: string }[],
  });
  
  // Filter states
  const [filters, setFilters] = useState<RiskFilterParams>({
    page: 1,
    limit: 10,
    category: 'all',
    status: 'all',
    level: 'all',
  });
  
  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchRiskData();
  }, []);

  useEffect(() => {
    fetchRisks();
  }, [filters]);

  const fetchRiskData = async () => {
    try {
      setIsLoading(true);
      
      // Get dashboard
      const dashboardData = await systemApi.risks.getDashboard();
      setDashboard(dashboardData);
      
      // Get assessments - with better error handling
      try {
        const assessmentsResponse = await systemApi.risks.assessments.list();
        // Make sure we're setting an array even if data is undefined
        setAssessments(assessmentsResponse?.data || []);
      } catch (assessmentError) {
        console.error('Failed to fetch assessments:', assessmentError);
        setAssessments([]); // Set empty array on error
        // Don't show error toast for assessments failure to avoid multiple toasts
      }
      
    } catch (error) {
      console.error('Failed to fetch risk data:', error);
      toast.error('Failed to load risk data');
      // Ensure assessments is at least an empty array
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRisks = async () => {
    try {
      const params: RiskFilterParams = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.level && filters.level !== 'all') params.level = filters.level;
      
      const response = await systemApi.risks.list(params);
      setRisks(response.data || []);
      setTotalCount(response.total || 0);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Failed to fetch risks:', error);
      toast.error('Failed to load risks');
      setRisks([]);
    }
  };

  const handleAddRisk = async () => {
    if (!newRisk.title || !newRisk.description || !newRisk.owner) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await systemApi.risks.create(newRisk);
      toast.success('Risk created successfully');
      
      // Refresh data
      await fetchRiskData();
      await fetchRisks();
      
      // Reset form
      setNewRisk({
        title: '',
        description: '',
        category: 'operational',
        impact: 'medium',
        probability: 'medium',
        mitigationStrategy: 'reduce',
        mitigationPlan: '',
        contingencyPlan: '',
        owner: '',
        stakeholders: [],
        financialImpact: {
          currency: 'USD',
          minAmount: 0,
          maxAmount: 0,
          expectedAmount: 0,
        },
        notes: '',
      });
      setIsAddRiskOpen(false);
      
    } catch (error: any) {
      console.error('Failed to create risk:', error);
      toast.error(error.message || 'Failed to create risk');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRisk = async () => {
    if (!selectedRisk) return;

    try {
      setIsSaving(true);
      
      await systemApi.risks.update(selectedRisk._id, editRisk);
      toast.success('Risk updated successfully');
      
      // Refresh data
      await fetchRiskData();
      await fetchRisks();
      
      setIsEditRiskOpen(false);
      
    } catch (error: any) {
      console.error('Failed to update risk:', error);
      toast.error(error.message || 'Failed to update risk');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRisk) return;

    try {
      setIsSaving(true);
      
      await systemApi.risks.updateStatus(selectedRisk._id, statusUpdate);
      toast.success('Risk status updated');
      
      // Refresh data
      await fetchRiskData();
      await fetchRisks();
      
      setIsStatusDialogOpen(false);
      
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveRisk = async () => {
    if (!selectedRisk) return;

    try {
      setIsSaving(true);
      
      await systemApi.risks.archive(selectedRisk._id);
      toast.success('Risk archived');
      
      // Refresh data
      await fetchRiskData();
      await fetchRisks();
      
      setIsDeleteDialogOpen(false);
      
    } catch (error: any) {
      console.error('Failed to archive risk:', error);
      toast.error(error.message || 'Failed to archive risk');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAssessment = async () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.scope) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await systemApi.risks.assessments.create(newAssessment);
      toast.success('Assessment created successfully');
      
      // Refresh data
      await fetchRiskData();
      
      // Reset form
      setNewAssessment({
        title: '',
        description: '',
        scope: '',
        methodology: '',
        findings: [],
        recommendations: [],
      });
      setIsAddAssessmentOpen(false);
      
    } catch (error: any) {
      console.error('Failed to create assessment:', error);
      toast.error(error.message || 'Failed to create assessment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await systemApi.risks.export();
      
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risks-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Risks exported successfully');
    } catch (error: any) {
      console.error('Failed to export risks:', error);
      toast.error(error.message || 'Failed to export risks');
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const calculateRiskScore = (impact: Risk['impact'], probability: Risk['probability']) => {
    const impactValues = { low: 1, medium: 2, high: 3, critical: 4 };
    const probabilityValues = { low: 1, medium: 2, high: 3 };
    return impactValues[impact] * probabilityValues[probability];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
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
        title="Risk Management"
        description="Identify, assess, and mitigate business risks"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchRiskData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddRiskOpen} onOpenChange={setIsAddRiskOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Risk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Risk</DialogTitle>
                  <DialogDescription>
                    Create a new risk to track in the risk register
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="riskTitle">Title *</Label>
                    <Input
                      id="riskTitle"
                      placeholder="e.g., Data Breach from Phishing Attack"
                      value={newRisk.title}
                      onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="riskDescription">Description *</Label>
                    <Textarea
                      id="riskDescription"
                      placeholder="Describe the risk"
                      rows={3}
                      value={newRisk.description}
                      onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select 
                        value={newRisk.category}
                        onValueChange={(value: any) => setNewRisk({ ...newRisk, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="reputational">Reputational</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="strategic">Strategic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Owner *</Label>
                      <Select 
                        value={newRisk.owner}
                        onValueChange={(value) => setNewRisk({ ...newRisk, owner: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Impact *</Label>
                      <Select 
                        value={newRisk.impact}
                        onValueChange={(value: any) => setNewRisk({ ...newRisk, impact: value })}
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
                    
                    <div className="space-y-2">
                      <Label>Probability *</Label>
                      <Select 
                        value={newRisk.probability}
                        onValueChange={(value: any) => setNewRisk({ ...newRisk, probability: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mitigation Strategy *</Label>
                    <Select 
                      value={newRisk.mitigationStrategy}
                      onValueChange={(value: any) => setNewRisk({ ...newRisk, mitigationStrategy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avoid">Avoid</SelectItem>
                        <SelectItem value="reduce">Reduce</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="accept">Accept</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mitigationPlan">Mitigation Plan *</Label>
                    <Textarea
                      id="mitigationPlan"
                      placeholder="Describe the mitigation plan"
                      rows={2}
                      value={newRisk.mitigationPlan}
                      onChange={(e) => setNewRisk({ ...newRisk, mitigationPlan: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contingencyPlan">Contingency Plan</Label>
                    <Textarea
                      id="contingencyPlan"
                      placeholder="Describe the contingency plan"
                      rows={2}
                      value={newRisk.contingencyPlan}
                      onChange={(e) => setNewRisk({ ...newRisk, contingencyPlan: e.target.value })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h4 className="font-medium">Financial Impact</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        value={newRisk.financialImpact.currency}
                        onValueChange={(value) => setNewRisk({
                          ...newRisk,
                          financialImpact: { ...newRisk.financialImpact, currency: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="KSH">KSH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Min Amount</Label>
                      <Input
                        type="number"
                        value={newRisk.financialImpact.minAmount}
                        onChange={(e) => setNewRisk({
                          ...newRisk,
                          financialImpact: { ...newRisk.financialImpact, minAmount: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Amount</Label>
                      <Input
                        type="number"
                        value={newRisk.financialImpact.maxAmount}
                        onChange={(e) => setNewRisk({
                          ...newRisk,
                          financialImpact: { ...newRisk.financialImpact, maxAmount: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Amount</Label>
                      <Input
                        type="number"
                        value={newRisk.financialImpact.expectedAmount}
                        onChange={(e) => setNewRisk({
                          ...newRisk,
                          financialImpact: { ...newRisk.financialImpact, expectedAmount: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes about this risk"
                      rows={2}
                      value={newRisk.notes}
                      onChange={(e) => setNewRisk({ ...newRisk, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRiskOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRisk} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Risk'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Dashboard Metrics with safe checks */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Risks</p>
                <p className="text-3xl font-bold">{dashboard?.metrics?.totalRisks || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{dashboard?.metrics?.averageScore || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">By Level</p>
                <div className="flex gap-2 mt-1">
                  <Badge className={riskLevelColors.critical}>C: {dashboard?.metrics?.byLevel?.critical || 0}</Badge>
                  <Badge className={riskLevelColors.high}>H: {dashboard?.metrics?.byLevel?.high || 0}</Badge>
                  <Badge className={riskLevelColors.medium}>M: {dashboard?.metrics?.byLevel?.medium || 0}</Badge>
                  <Badge className={riskLevelColors.low}>L: {dashboard?.metrics?.byLevel?.low || 0}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">By Status</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge className={statusColors.identified}>I: {dashboard?.metrics?.byStatus?.identified || 0}</Badge>
                  <Badge className={statusColors.mitigating}>M: {dashboard?.metrics?.byStatus?.mitigating || 0}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="register" className="space-y-6">
        <TabsList>
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="reviews">Upcoming Reviews</TabsTrigger>
        </TabsList>

        {/* Risk Register Tab */}
        <TabsContent value="register" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>Risk Register</CardTitle>
                <div className="flex gap-2">
                  <Select 
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="reputational">Reputational</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="identified">Identified</SelectItem>
                      <SelectItem value="assessed">Assessed</SelectItem>
                      <SelectItem value="mitigating">Mitigating</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filters.level}
                    onValueChange={(value) => handleFilterChange('level', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {risks && risks.length > 0 ? (
                <div className="space-y-4">
                  {risks.map((risk) => (
                    <Card key={risk._id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{risk.title}</h4>
                              <Badge className={riskLevelColors[risk.riskLevel]}>
                                {risk.riskLevel.toUpperCase()}
                              </Badge>
                              <Badge className={statusColors[risk.status]}>
                                {risk.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge className={categoryColors[risk.category]}>
                                {risk.category}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                Score: {risk.riskScore}
                              </span>
                              <span className="flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Impact: {impactLabels[risk.impact]}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                Probability: {probabilityLabels[risk.probability]}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Risk ID: {risk.riskId}</span>
                              <span>Identified: {formatDate(risk.identifiedDate)}</span>
                              <span>Next Review: {formatDate(risk.nextReviewDate)}</span>
                            </div>
                            
                            {risk.financialImpact && (
                              <p className="text-sm">
                                Financial Impact: {formatCurrency(risk.financialImpact.minAmount || 0, risk.financialImpact.currency)} - {formatCurrency(risk.financialImpact.maxAmount || 0, risk.financialImpact.currency)}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRisk(risk);
                                setIsViewRiskOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRisk(risk);
                                setEditRisk(risk);
                                setIsEditRiskOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRisk(risk);
                                setStatusUpdate({ status: risk.status, notes: '' });
                                setIsStatusDialogOpen(true);
                              }}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No risks found. Add your first risk to get started.
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} - {Math.min((filters.page || 1) * (filters.limit || 10), totalCount)} of {totalCount}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={filters.page === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((filters.page || 1) - 1)}
                      disabled={filters.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((filters.page || 1) + 1)}
                      disabled={filters.page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={filters.page === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Risk Assessments</CardTitle>
                <CardDescription>
                  Track and manage risk assessments
                </CardDescription>
              </div>
              <Dialog open={isAddAssessmentOpen} onOpenChange={setIsAddAssessmentOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Risk Assessment</DialogTitle>
                    <DialogDescription>
                      Conduct a new risk assessment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessmentTitle">Title *</Label>
                      <Input
                        id="assessmentTitle"
                        placeholder="e.g., Q1 2026 Risk Assessment"
                        value={newAssessment.title}
                        onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assessmentDescription">Description *</Label>
                      <Textarea
                        id="assessmentDescription"
                        placeholder="Describe the assessment"
                        rows={2}
                        value={newAssessment.description}
                        onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scope">Scope *</Label>
                      <Input
                        id="scope"
                        placeholder="e.g., All business units"
                        value={newAssessment.scope}
                        onChange={(e) => setNewAssessment({ ...newAssessment, scope: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="methodology">Methodology</Label>
                      <Input
                        id="methodology"
                        placeholder="e.g., ISO 31000"
                        value={newAssessment.methodology}
                        onChange={(e) => setNewAssessment({ ...newAssessment, methodology: e.target.value })}
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
                            setNewAssessment({
                              ...newAssessment,
                              findings: [
                                ...newAssessment.findings,
                                { riskId: '', observations: '' }
                              ]
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Finding
                        </Button>
                      </div>
                      
                      {newAssessment.findings.map((finding, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">Finding {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newFindings = [...newAssessment.findings];
                                newFindings.splice(index, 1);
                                setNewAssessment({ ...newAssessment, findings: newFindings });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Risk ID</Label>
                            <Select 
                              value={finding.riskId}
                              onValueChange={(value) => {
                                const newFindings = [...newAssessment.findings];
                                newFindings[index].riskId = value;
                                setNewAssessment({ ...newAssessment, findings: newFindings });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk" />
                              </SelectTrigger>
                              <SelectContent>
                                {risks.map(r => (
                                  <SelectItem key={r._id} value={r._id}>
                                    {r.riskId} - {r.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Observations</Label>
                            <Textarea
                              placeholder="Observations about this risk"
                              value={finding.observations}
                              onChange={(e) => {
                                const newFindings = [...newAssessment.findings];
                                newFindings[index].observations = e.target.value;
                                setNewAssessment({ ...newAssessment, findings: newFindings });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Recommendations</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewAssessment({
                              ...newAssessment,
                              recommendations: [
                                ...newAssessment.recommendations,
                                { recommendation: '', priority: 'medium', assignedTo: '', dueDate: '' }
                              ]
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Recommendation
                        </Button>
                      </div>
                      
                      {newAssessment.recommendations.map((rec, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">Recommendation {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newRecs = [...newAssessment.recommendations];
                                newRecs.splice(index, 1);
                                setNewAssessment({ ...newAssessment, recommendations: newRecs });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Recommendation</Label>
                            <Input
                              placeholder="e.g., Implement phishing simulation tests"
                              value={rec.recommendation}
                              onChange={(e) => {
                                const newRecs = [...newAssessment.recommendations];
                                newRecs[index].recommendation = e.target.value;
                                setNewAssessment({ ...newAssessment, recommendations: newRecs });
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <Select 
                                value={rec.priority}
                                onValueChange={(value: any) => {
                                  const newRecs = [...newAssessment.recommendations];
                                  newRecs[index].priority = value;
                                  setNewAssessment({ ...newAssessment, recommendations: newRecs });
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
                            <div className="space-y-2">
                              <Label>Assigned To</Label>
                              <Select 
                                value={rec.assignedTo}
                                onValueChange={(value) => {
                                  const newRecs = [...newAssessment.recommendations];
                                  newRecs[index].assignedTo = value;
                                  setNewAssessment({ ...newAssessment, recommendations: newRecs });
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
                          </div>
                          <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input
                              type="date"
                              value={rec.dueDate}
                              onChange={(e) => {
                                const newRecs = [...newAssessment.recommendations];
                                newRecs[index].dueDate = e.target.value;
                                setNewAssessment({ ...newAssessment, recommendations: newRecs });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAssessmentOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAssessment} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Assessment'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {!assessments || assessments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No assessments found. Create your first risk assessment.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Risks</TableHead>
                      <TableHead>Recommendations</TableHead>
                      <TableHead>Assessor</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment._id}>
                        <TableCell className="font-medium">{assessment.title}</TableCell>
                        <TableCell>{formatDate(assessment.assessmentDate)}</TableCell>
                        <TableCell>{assessment.scope}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{assessment.findings?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{assessment.recommendations?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          {assessment.assessor?.personalInfo?.firstName} {assessment.assessor?.personalInfo?.lastName}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAssessment(assessment);
                              setIsViewAssessmentOpen(true);
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
        </TabsContent>

        {/* Upcoming Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
              <CardDescription>
                Risks that need review in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard?.upcomingReviews && dashboard.upcomingReviews.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.upcomingReviews.map((review) => (
                    <div key={review._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{review.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>Next Review: {formatDate(review.nextReviewDate)}</span>
                          <span>Owner: {review.owner.name}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const risk = risks.find(r => r._id === review._id);
                          if (risk) {
                            setSelectedRisk(risk);
                            setIsViewRiskOpen(true);
                          }
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming reviews
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Risk Dialog */}
      <Dialog open={isViewRiskOpen} onOpenChange={setIsViewRiskOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Risk Details</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{selectedRisk.title}</h3>
                <Badge className={riskLevelColors[selectedRisk.riskLevel]}>
                  {selectedRisk.riskLevel.toUpperCase()}
                </Badge>
                <Badge className={statusColors[selectedRisk.status]}>
                  {selectedRisk.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-muted-foreground">{selectedRisk.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Risk ID</p>
                  <p className="font-medium">{selectedRisk.riskId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge className={categoryColors[selectedRisk.category]}>
                    {selectedRisk.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Impact</p>
                  <p className="font-medium">{impactLabels[selectedRisk.impact]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Probability</p>
                  <p className="font-medium">{probabilityLabels[selectedRisk.probability]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="font-medium">{selectedRisk.riskScore}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">
                    {selectedRisk.owner?.personalInfo?.firstName} {selectedRisk.owner?.personalInfo?.lastName}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Mitigation Plan</h4>
                <p className="text-sm bg-muted p-3 rounded">{selectedRisk.mitigationPlan}</p>
              </div>
              
              {selectedRisk.contingencyPlan && (
                <div>
                  <h4 className="font-medium mb-2">Contingency Plan</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedRisk.contingencyPlan}</p>
                </div>
              )}
              
              {selectedRisk.financialImpact && (
                <div>
                  <h4 className="font-medium mb-2">Financial Impact</h4>
                  <p className="text-sm">
                    {formatCurrency(selectedRisk.financialImpact.minAmount || 0, selectedRisk.financialImpact.currency)} - {formatCurrency(selectedRisk.financialImpact.maxAmount || 0, selectedRisk.financialImpact.currency)}
                    {selectedRisk.financialImpact.expectedAmount ? ` (Expected: ${formatCurrency(selectedRisk.financialImpact.expectedAmount, selectedRisk.financialImpact.currency)})` : ''}
                  </p>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-3">History</h4>
                <div className="space-y-3">
                  {selectedRisk.history?.map((entry, index) => (
                    <div key={index} className="text-sm border-l-2 pl-3 py-1">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-muted-foreground">
                        By {entry.performedBy?.personalInfo?.firstName} {entry.performedBy?.personalInfo?.lastName} - {formatDate(entry.performedAt)}
                      </p>
                      {entry.notes && <p className="mt-1">{entry.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewRiskOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewRiskOpen(false);
                    setEditRisk(selectedRisk);
                    setIsEditRiskOpen(true);
                  }}
                >
                  Edit Risk
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Risk Dialog */}
      <Dialog open={isEditRiskOpen} onOpenChange={setIsEditRiskOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editRisk.title || ''}
                  onChange={(e) => setEditRisk({ ...editRisk, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  rows={3}
                  value={editRisk.description || ''}
                  onChange={(e) => setEditRisk({ ...editRisk, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Impact</Label>
                  <Select 
                    value={editRisk.impact || selectedRisk.impact}
                    onValueChange={(value: any) => setEditRisk({ ...editRisk, impact: value })}
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
                
                <div className="space-y-2">
                  <Label>Probability</Label>
                  <Select 
                    value={editRisk.probability || selectedRisk.probability}
                    onValueChange={(value: any) => setEditRisk({ ...editRisk, probability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mitigation Plan</Label>
                <Textarea
                  rows={2}
                  value={editRisk.mitigationPlan || ''}
                  onChange={(e) => setEditRisk({ ...editRisk, mitigationPlan: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Contingency Plan</Label>
                <Textarea
                  rows={2}
                  value={editRisk.contingencyPlan || ''}
                  onChange={(e) => setEditRisk({ ...editRisk, contingencyPlan: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRiskOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRisk} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Risk Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the status of this risk and add notes
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={statusUpdate.status}
                onValueChange={(value: any) => setStatusUpdate({ ...statusUpdate, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="assessed">Assessed</SelectItem>
                  <SelectItem value="mitigating">Mitigating</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusNotes">Notes</Label>
              <Textarea
                id="statusNotes"
                placeholder="Add notes about this status change"
                value={statusUpdate.notes}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateStatus} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete/Archive Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Risk</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this risk? This action can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveRisk}
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Archiving...
                </>
              ) : (
                'Archive'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Assessment Dialog */}
      <Dialog open={isViewAssessmentOpen} onOpenChange={setIsViewAssessmentOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedAssessment.title}</h3>
                <p className="text-muted-foreground mt-1">{selectedAssessment.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedAssessment.assessmentDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assessor</p>
                  <p className="font-medium">
                    {selectedAssessment.assessor?.personalInfo?.firstName} {selectedAssessment.assessor?.personalInfo?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scope</p>
                  <p className="font-medium">{selectedAssessment.scope}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Methodology</p>
                  <p className="font-medium">{selectedAssessment.methodology}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Findings</h4>
                <div className="space-y-3">
                  {selectedAssessment.findings?.map((finding, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">Risk: {typeof finding.riskId === 'string' ? finding.riskId : finding.riskId?.title}</p>
                      <p className="text-sm mt-1">{finding.observations}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Recommendations</h4>
                <div className="space-y-3">
                  {selectedAssessment.recommendations?.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">{rec.status}</Badge>
                      </div>
                      <p className="text-sm">{rec.recommendation}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {formatDate(rec.dueDate)} • Assigned to: {rec.assignedTo?.personalInfo?.firstName} {rec.assignedTo?.personalInfo?.lastName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}