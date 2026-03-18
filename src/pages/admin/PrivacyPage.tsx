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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, Lock, Eye, KeyRound, Fingerprint, FileCheck, Scale, Gavel,
  AlertTriangle, TrendingUp, TrendingDown, Minus, AlertCircle,
  Plus, Download, RefreshCw, Loader2, Edit, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, Search, BarChart3, PieChart, Calendar, Clock,
  CheckCircle2, XCircle, Target, Flag, Users, FileText,
  Database, UserCheck, UserX, FileDigit, Globe, Upload,
  UserCog, Settings, ShieldAlert, FileWarning, FileSpreadsheet
} from 'lucide-react';
import { systemApi, PrivacySettings, DataSubjectRequest, PrivacyPolicy, DataBreach, GDPRReport } from '@/lib/api/system';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'investigating': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'mitigated': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

const requestTypeColors = {
  'access': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'rectification': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'erasure': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'restrict': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'portability': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'object': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const breachSeverityColors = {
  'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const requestTypeLabels = {
  'access': 'Access Request',
  'rectification': 'Rectification',
  'erasure': 'Erasure (Right to be Forgotten)',
  'restrict': 'Restriction of Processing',
  'portability': 'Data Portability',
  'object': 'Object to Processing',
};

export function PrivacyPage() {
  const { organizationData } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data states
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [dsrList, setDsrList] = useState<DataSubjectRequest[]>([]);
  const [policies, setPolicies] = useState<PrivacyPolicy[]>([]);
  const [breaches, setBreaches] = useState<DataBreach[]>([]);
  const [complianceReport, setComplianceReport] = useState<GDPRReport | null>(null);
  const [selectedDSR, setSelectedDSR] = useState<DataSubjectRequest | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<PrivacyPolicy | null>(null);
  const [selectedBreach, setSelectedBreach] = useState<DataBreach | null>(null);
  
  // Dialog states
  const [isEditRetentionOpen, setIsEditRetentionOpen] = useState(false);
  const [isEditConsentOpen, setIsEditConsentOpen] = useState(false);
  const [isAddDSROpen, setIsAddDSROpen] = useState(false);
  const [isViewDSROpen, setIsViewDSROpen] = useState(false);
  const [isEditDSROpen, setIsEditDSROpen] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isViewPolicyOpen, setIsViewPolicyOpen] = useState(false);
  const [isReportBreachOpen, setIsReportBreachOpen] = useState(false);
  const [isViewBreachOpen, setIsViewBreachOpen] = useState(false);
  const [isEditBreachOpen, setIsEditBreachOpen] = useState(false);
  const [isUploadDPAOpen, setIsUploadDPAOpen] = useState(false);
  
  // Form states
  const [retentionForm, setRetentionForm] = useState({
    userDataRetentionDays: 365,
    activityLogRetentionDays: 90,
    financialDataRetentionDays: 2190,
    hrDataRetentionDays: 1825,
    autoAnonymizeAfterRetention: true,
  });
  
  const [consentForm, setConsentForm] = useState({
    requireConsentForDataProcessing: true,
    consentVersion: '1.0',
    consentText: '',
    purposes: [] as Array<{
      purposeId: string;
      purposeName: string;
      description: string;
      required: boolean;
      isActive: boolean;
    }>,
  });
  
  const [newPurpose, setNewPurpose] = useState({
    purposeId: '',
    purposeName: '',
    description: '',
    required: false,
    isActive: true,
  });
  
  const [dsrForm, setDsrForm] = useState({
    userId: '',
    requestType: 'access' as 'access' | 'rectification' | 'erasure' | 'restrict' | 'portability' | 'object',
    description: '',
  });
  
  const [dsrUpdateForm, setDsrUpdateForm] = useState({
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'rejected',
    notes: '',
  });
  
  const [policyForm, setPolicyForm] = useState({
    version: '',
    effectiveDate: '',
    content: '',
    notes: '',
  });
  
  const [breachForm, setBreachForm] = useState({
    discoveryDate: '',
    description: '',
    affectedData: [] as string[],
    affectedUsers: [] as string[],
    affectedRecords: 0,
    riskAssessment: '',
    actionsTaken: '',
  });
  
  const [breachUpdateForm, setBreachUpdateForm] = useState({
    status: 'investigating' as 'investigating' | 'mitigated' | 'resolved' | 'closed',
    notifiedAuthority: false,
    notifiedAffected: false,
  });
  
  const [newAffectedData, setNewAffectedData] = useState('');
  const [newAffectedUser, setNewAffectedUser] = useState('');
  
  const [dpaForm, setDpaForm] = useState<{
    title: string;
    counterparty: string;
    agreementDate: string;
    effectiveDate: string;
    expiryDate: string;
    scope: string;
    file: File | null;
  }>({
    title: '',
    counterparty: '',
    agreementDate: '',
    effectiveDate: '',
    expiryDate: '',
    scope: '',
    file: null,
  });
  
  // Filter states
  const [dsrFilters, setDsrFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    type: 'all',
  });
  
  // Pagination
  const [dsrTotalPages, setDsrTotalPages] = useState(1);
  const [dsrTotalCount, setDsrTotalCount] = useState(0);

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  useEffect(() => {
    fetchDSRList();
  }, [dsrFilters]);

  const fetchPrivacyData = async () => {
    try {
      setIsLoading(true);
      
      // Get privacy settings
      const settingsData = await systemApi.privacy.getSettings();
      setSettings(settingsData);
      
      // Initialize forms with current settings
      if (settingsData) {
        setRetentionForm({
          userDataRetentionDays: settingsData.dataRetention.userDataRetentionDays,
          activityLogRetentionDays: settingsData.dataRetention.activityLogRetentionDays,
          financialDataRetentionDays: settingsData.dataRetention.financialDataRetentionDays,
          hrDataRetentionDays: settingsData.dataRetention.hrDataRetentionDays,
          autoAnonymizeAfterRetention: settingsData.dataRetention.autoAnonymizeAfterRetention,
        });
        
        setConsentForm({
          requireConsentForDataProcessing: settingsData.consentSettings.requireConsentForDataProcessing,
          consentVersion: settingsData.consentSettings.consentVersion,
          consentText: settingsData.consentSettings.consentText || '',
          purposes: settingsData.consentSettings.purposes || [],
        });
      }
      
      // Get privacy policies
      try {
        const policiesData = await systemApi.privacy.policies.list();
        setPolicies(policiesData?.data || []);
      } catch (policyError) {
        console.error('Failed to fetch privacy policies:', policyError);
        setPolicies([]);
      }
      
      // Get compliance report
      try {
        const reportData = await systemApi.privacy.getComplianceReport();
        setComplianceReport(reportData);
      } catch (reportError) {
        console.error('Failed to fetch compliance report:', reportError);
      }
      
    } catch (error) {
      console.error('Failed to fetch privacy data:', error);
      toast.error('Failed to load privacy data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDSRList = async () => {
    try {
      const params: any = {
        page: dsrFilters.page,
        limit: dsrFilters.limit,
      };
      if (dsrFilters.status !== 'all') params.status = dsrFilters.status;
      if (dsrFilters.type !== 'all') params.type = dsrFilters.type;
      
      const response = await systemApi.privacy.dsr.list(params);
      setDsrList(response.data || []);
      setDsrTotalCount(response.total || 0);
      setDsrTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Failed to fetch DSR list:', error);
      toast.error('Failed to load data subject requests');
      setDsrList([]);
    }
  };

  const handleUpdateRetention = async () => {
    try {
      setIsSaving(true);
      
      await systemApi.privacy.updateRetention(retentionForm);
      toast.success('Retention policies updated successfully');
      
      // Refresh data
      await fetchPrivacyData();
      setIsEditRetentionOpen(false);
      
    } catch (error: any) {
      console.error('Failed to update retention policies:', error);
      toast.error(error.message || 'Failed to update retention policies');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateConsent = async () => {
    try {
      setIsSaving(true);
      
      await systemApi.privacy.consent.updateSettings({
        requireConsentForDataProcessing: consentForm.requireConsentForDataProcessing,
        consentVersion: consentForm.consentVersion,
        consentText: consentForm.consentText,
        purposes: consentForm.purposes,
      });
      
      toast.success('Consent settings updated successfully');
      
      // Refresh data
      await fetchPrivacyData();
      setIsEditConsentOpen(false);
      
    } catch (error: any) {
      console.error('Failed to update consent settings:', error);
      toast.error(error.message || 'Failed to update consent settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPurpose = () => {
    if (!newPurpose.purposeId || !newPurpose.purposeName || !newPurpose.description) {
      toast.error('Please fill in all purpose fields');
      return;
    }
    
    setConsentForm({
      ...consentForm,
      purposes: [...consentForm.purposes, { ...newPurpose }],
    });
    
    setNewPurpose({
      purposeId: '',
      purposeName: '',
      description: '',
      required: false,
      isActive: true,
    });
  };

  const handleRemovePurpose = (index: number) => {
    const updatedPurposes = [...consentForm.purposes];
    updatedPurposes.splice(index, 1);
    setConsentForm({ ...consentForm, purposes: updatedPurposes });
  };

  const handleCreateDSR = async () => {
    if (!dsrForm.userId || !dsrForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await systemApi.privacy.dsr.create(dsrForm);
      toast.success('Data subject request created successfully');
      
      // Refresh data
      await fetchDSRList();
      await fetchPrivacyData();
      
      // Reset form
      setDsrForm({
        userId: '',
        requestType: 'access',
        description: '',
      });
      setIsAddDSROpen(false);
      
    } catch (error: any) {
      console.error('Failed to create DSR:', error);
      toast.error(error.message || 'Failed to create DSR');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateDSR = async () => {
    if (!selectedDSR) return;

    try {
      setIsSaving(true);
      
      await systemApi.privacy.dsr.update(selectedDSR.requestId, dsrUpdateForm);
      toast.success('Data subject request updated successfully');
      
      // Refresh data
      await fetchDSRList();
      await fetchPrivacyData();
      
      setIsEditDSROpen(false);
      
    } catch (error: any) {
      console.error('Failed to update DSR:', error);
      toast.error(error.message || 'Failed to update DSR');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!policyForm.version || !policyForm.effectiveDate || !policyForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await systemApi.privacy.policies.create(policyForm);
      toast.success('Privacy policy created successfully');
      
      // Refresh data
      await fetchPrivacyData();
      
      // Reset form
      setPolicyForm({
        version: '',
        effectiveDate: '',
        content: '',
        notes: '',
      });
      setIsAddPolicyOpen(false);
      
    } catch (error: any) {
      console.error('Failed to create privacy policy:', error);
      toast.error(error.message || 'Failed to create privacy policy');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReportBreach = async () => {
    if (!breachForm.discoveryDate || !breachForm.description || !breachForm.riskAssessment || !breachForm.actionsTaken) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await systemApi.privacy.breaches.report(breachForm);
      toast.success('Data breach reported successfully');
      
      // Refresh data
      await fetchPrivacyData();
      
      // Reset form
      setBreachForm({
        discoveryDate: '',
        description: '',
        affectedData: [],
        affectedUsers: [],
        affectedRecords: 0,
        riskAssessment: '',
        actionsTaken: '',
      });
      setIsReportBreachOpen(false);
      
    } catch (error: any) {
      console.error('Failed to report data breach:', error);
      toast.error(error.message || 'Failed to report data breach');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBreach = async () => {
    if (!selectedBreach) return;

    try {
      setIsSaving(true);
      
      await systemApi.privacy.breaches.update(selectedBreach.breachId, breachUpdateForm);
      toast.success('Data breach updated successfully');
      
      // Refresh data
      await fetchPrivacyData();
      
      setIsEditBreachOpen(false);
      
    } catch (error: any) {
      console.error('Failed to update data breach:', error);
      toast.error(error.message || 'Failed to update data breach');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadDPA = async () => {
    if (!dpaForm.title || !dpaForm.counterparty || !dpaForm.effectiveDate || !dpaForm.file) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }

    try {
      setIsSaving(true);
      
      const formData = new FormData();
      formData.append('title', dpaForm.title);
      formData.append('counterparty', dpaForm.counterparty);
      formData.append('agreementDate', dpaForm.agreementDate || dpaForm.effectiveDate);
      formData.append('effectiveDate', dpaForm.effectiveDate);
      if (dpaForm.expiryDate) formData.append('expiryDate', dpaForm.expiryDate);
      formData.append('scope', dpaForm.scope);
      formData.append('file', dpaForm.file);
      
      await systemApi.privacy.uploadDPA(formData);
      toast.success('Data Processing Agreement uploaded successfully');
      
      // Refresh data
      await fetchPrivacyData();
      
      // Reset form
      setDpaForm({
        title: '',
        counterparty: '',
        agreementDate: '',
        effectiveDate: '',
        expiryDate: '',
        scope: '',
        file: null,
      });
      setIsUploadDPAOpen(false);
      
    } catch (error: any) {
      console.error('Failed to upload DPA:', error);
      toast.error(error.message || 'Failed to upload DPA');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await systemApi.privacy.export();
      
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `privacy-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Privacy data exported successfully');
    } catch (error: any) {
      console.error('Failed to export privacy data:', error);
      toast.error(error.message || 'Failed to export privacy data');
    }
  };

  const handleAddAffectedData = () => {
    if (!newAffectedData) return;
    setBreachForm({
      ...breachForm,
      affectedData: [...breachForm.affectedData, newAffectedData],
    });
    setNewAffectedData('');
  };

  const handleRemoveAffectedData = (index: number) => {
    const updatedData = [...breachForm.affectedData];
    updatedData.splice(index, 1);
    setBreachForm({ ...breachForm, affectedData: updatedData });
  };

  const handleAddAffectedUser = () => {
    if (!newAffectedUser) return;
    setBreachForm({
      ...breachForm,
      affectedUsers: [...breachForm.affectedUsers, newAffectedUser],
    });
    setNewAffectedUser('');
  };

  const handleRemoveAffectedUser = (index: number) => {
    const updatedUsers = [...breachForm.affectedUsers];
    updatedUsers.splice(index, 1);
    setBreachForm({ ...breachForm, affectedUsers: updatedUsers });
  };

  const handleDSRPageChange = (page: number) => {
    setDsrFilters({ ...dsrFilters, page });
  };

  const handleDSRFilterChange = (key: string, value: string) => {
    setDsrFilters({ ...dsrFilters, [key]: value, page: 1 });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
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
        title="Data Privacy & GDPR"
        description="Manage privacy settings, consent, and data subject requests"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchPrivacyData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isUploadDPAOpen} onOpenChange={setIsUploadDPAOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload DPA
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Data Processing Agreement</DialogTitle>
                  <DialogDescription>
                    Upload a Data Processing Agreement (DPA) with a third-party vendor
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dpaTitle">Title *</Label>
                    <Input
                      id="dpaTitle"
                      placeholder="e.g., Microsoft Data Processing Agreement"
                      value={dpaForm.title}
                      onChange={(e) => setDpaForm({ ...dpaForm, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="counterparty">Counterparty *</Label>
                    <Input
                      id="counterparty"
                      placeholder="e.g., Microsoft Corporation"
                      value={dpaForm.counterparty}
                      onChange={(e) => setDpaForm({ ...dpaForm, counterparty: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="effectiveDate">Effective Date *</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={dpaForm.effectiveDate}
                        onChange={(e) => setDpaForm({ ...dpaForm, effectiveDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={dpaForm.expiryDate}
                        onChange={(e) => setDpaForm({ ...dpaForm, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope</Label>
                    <Input
                      id="scope"
                      placeholder="e.g., Azure Services and Office 365"
                      value={dpaForm.scope}
                      onChange={(e) => setDpaForm({ ...dpaForm, scope: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dpaFile">DPA File (PDF) *</Label>
                    <Input
                      id="dpaFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDpaForm({ ...dpaForm, file });
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, DOC, DOCX
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDPAOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleUploadDPA} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload DPA'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Dashboard Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-3xl font-bold">{complianceReport?.complianceScore || settings?.complianceScore || 0}%</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Consents</p>
                <p className="text-3xl font-bold">{complianceReport?.summary?.totalUsersWithConsent || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending DSRs</p>
                <p className="text-3xl font-bold">{complianceReport?.summary?.pendingDSR || 0}</p>
              </div>
              <FileDigit className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Breaches</p>
                <p className="text-3xl font-bold">{complianceReport?.summary?.dataBreaches || 0}</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="dsr">Data Subject Requests</TabsTrigger>
          <TabsTrigger value="policies">Privacy Policies</TabsTrigger>
          <TabsTrigger value="breaches">Data Breaches</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>
                  Overall GDPR compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Compliance Score</span>
                      <span className="text-sm text-muted-foreground">{complianceReport?.complianceScore || settings?.complianceScore || 0}%</span>
                    </div>
                    <Progress value={complianceReport?.complianceScore || settings?.complianceScore || 0} className="h-2" />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Data Protection Officer</span>
                      <span className="text-sm font-medium">
                        {settings?.gdprSettings?.dataProtectionOfficer?.name || 'Not configured'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cross-border Transfers</span>
                      <Badge variant={settings?.gdprSettings?.crossBorderTransfers ? "default" : "secondary"}>
                        {settings?.gdprSettings?.crossBorderTransfers ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auto-anonymization</span>
                      <Badge variant={settings?.dataRetention?.autoAnonymizeAfterRetention ? "default" : "secondary"}>
                        {settings?.dataRetention?.autoAnonymizeAfterRetention ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Retention Summary</CardTitle>
                <CardDescription>
                  Current retention periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">User Data</span>
                    <span className="text-sm font-medium">{settings?.dataRetention?.userDataRetentionDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Activity Logs</span>
                    <span className="text-sm font-medium">{settings?.dataRetention?.activityLogRetentionDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Financial Data</span>
                    <span className="text-sm font-medium">{settings?.dataRetention?.financialDataRetentionDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">HR Data</span>
                    <span className="text-sm font-medium">{settings?.dataRetention?.hrDataRetentionDays} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Data Subject Requests</CardTitle>
                <CardDescription>
                  Latest DSR activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complianceReport?.recentDSR && complianceReport.recentDSR.length > 0 ? (
                  <div className="space-y-3">
                    {complianceReport.recentDSR.slice(0, 3).map((request) => (
                      <div key={request.requestId} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{request.requestType}</p>
                          <p className="text-xs text-muted-foreground">Due: {formatDate(request.dueDate)}</p>
                        </div>
                        <Badge className={statusColors[request.status]}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent data subject requests
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Consent Purposes</CardTitle>
                <CardDescription>
                  Active consent purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settings?.consentSettings?.purposes && settings.consentSettings.purposes.length > 0 ? (
                  <div className="space-y-2">
                    {settings.consentSettings.purposes.map((purpose) => (
                      <div key={purpose.purposeId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {purpose.required ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          <span className="text-sm">{purpose.purposeName}</span>
                        </div>
                        <Badge variant={purpose.isActive ? "default" : "secondary"}>
                          {purpose.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No consent purposes configured
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Data Retention Policies</CardTitle>
                <CardDescription>
                  Configure how long different types of data are retained
                </CardDescription>
              </div>
              <Button onClick={() => setIsEditRetentionOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Policies
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">User Data</h4>
                    <p className="text-2xl font-bold">{settings?.dataRetention?.userDataRetentionDays} days</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Personal information, profiles, and user accounts
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Activity Logs</h4>
                    <p className="text-2xl font-bold">{settings?.dataRetention?.activityLogRetentionDays} days</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      User actions, system events, and audit trails
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Financial Data</h4>
                    <p className="text-2xl font-bold">{settings?.dataRetention?.financialDataRetentionDays} days</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transactions, invoices, and payment records
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">HR Data</h4>
                    <p className="text-2xl font-bold">{settings?.dataRetention?.hrDataRetentionDays} days</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Employee records, contracts, and performance data
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Auto-anonymization</h4>
                    <p className="text-xs text-muted-foreground">
                      Automatically anonymize data after retention period
                    </p>
                  </div>
                  <Badge variant={settings?.dataRetention?.autoAnonymizeAfterRetention ? "default" : "secondary"}>
                    {settings?.dataRetention?.autoAnonymizeAfterRetention ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consent Management Tab */}
        <TabsContent value="consent" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Consent Settings</CardTitle>
                <CardDescription>
                  Configure consent requirements and purposes
                </CardDescription>
              </div>
              <Button onClick={() => setIsEditConsentOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Settings
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Require Consent for Data Processing</h4>
                    <p className="text-xs text-muted-foreground">
                      Users must consent before processing their data
                    </p>
                  </div>
                  <Switch checked={settings?.consentSettings?.requireConsentForDataProcessing} disabled />
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Consent Purposes</h4>
                  <div className="space-y-3">
                    {settings?.consentSettings?.purposes?.map((purpose) => (
                      <div key={purpose.purposeId} className="flex items-start justify-between p-3 border rounded">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{purpose.purposeName}</h5>
                            {purpose.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{purpose.description}</p>
                        </div>
                        <Badge variant={purpose.isActive ? "default" : "secondary"}>
                          {purpose.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {settings?.consentSettings?.consentText && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Consent Text</h4>
                      <p className="text-sm bg-muted p-3 rounded">
                        {settings.consentSettings.consentText}
                      </p>
                    </div>
                  </>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Consent Version</h4>
                  <Badge variant="outline">{settings?.consentSettings?.consentVersion}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {formatDate(settings?.consentSettings?.consentLastUpdated || '')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
          {/* Data Subject Requests Tab */}
          <TabsContent value="dsr" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Data Subject Requests</CardTitle>
                  <CardDescription>
                    Manage GDPR/CCPA data subject requests
                  </CardDescription>
                </div>
                <Dialog open={isAddDSROpen} onOpenChange={setIsAddDSROpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create Data Subject Request</DialogTitle>
                      <DialogDescription>
                        Create a new data subject request (DSR)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="userId">User ID *</Label>
                        <Input
                          id="userId"
                          placeholder="Enter user ID"
                          value={dsrForm.userId}
                          onChange={(e) => setDsrForm({ ...dsrForm, userId: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="requestType">Request Type *</Label>
                        <Select 
                          value={dsrForm.requestType}
                          onValueChange={(value: any) => setDsrForm({ ...dsrForm, requestType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="access">Access Request</SelectItem>
                            <SelectItem value="rectification">Rectification</SelectItem>
                            <SelectItem value="erasure">Erasure (Right to be Forgotten)</SelectItem>
                            <SelectItem value="restrict">Restriction of Processing</SelectItem>
                            <SelectItem value="portability">Data Portability</SelectItem>
                            <SelectItem value="object">Object to Processing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dsrDescription">Description *</Label>
                        <Textarea
                          id="dsrDescription"
                          placeholder="Describe the request"
                          rows={3}
                          value={dsrForm.description}
                          onChange={(e) => setDsrForm({ ...dsrForm, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDSROpen(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateDSR} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Request'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Select 
                      value={dsrFilters.status}
                      onValueChange={(value) => handleDSRFilterChange('status', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={dsrFilters.type}
                      onValueChange={(value) => handleDSRFilterChange('type', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Request Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="access">Access</SelectItem>
                        <SelectItem value="rectification">Rectification</SelectItem>
                        <SelectItem value="erasure">Erasure</SelectItem>
                        <SelectItem value="restrict">Restrict</SelectItem>
                        <SelectItem value="portability">Portability</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {!dsrList || dsrList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No data subject requests found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dsrList.map((request) => (
                        <Card key={request._id} className="hover:border-primary/50 transition-colors">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{request.requestId}</h4>
                                  <Badge className={requestTypeColors[request.requestType]}>
                                    {request.requestType.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                  <Badge className={statusColors[request.status]}>
                                    {request.status.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">{request.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>
                                    User: {request.user?.personalInfo?.firstName} {request.user?.personalInfo?.lastName}
                                  </span>
                                  <span>Requested: {formatDate(request.requestDate)}</span>
                                  <span>Due: {formatDate(request.dueDate)}</span>
                                </div>
                                
                                {request.notes && (
                                  <p className="text-sm bg-muted p-2 rounded mt-2">
                                    <span className="font-medium">Notes:</span> {request.notes}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDSR(request);
                                    setIsViewDSROpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDSR(request);
                                    setDsrUpdateForm({
                                      status: request.status,
                                      notes: request.notes || '',
                                    });
                                    setIsEditDSROpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {dsrTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {((dsrFilters.page || 1) - 1) * (dsrFilters.limit || 10) + 1} - {Math.min((dsrFilters.page || 1) * (dsrFilters.limit || 10), dsrTotalCount)} of {dsrTotalCount}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDSRPageChange(1)}
                          disabled={dsrFilters.page === 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDSRPageChange((dsrFilters.page || 1) - 1)}
                          disabled={dsrFilters.page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm px-2">
                          Page {dsrFilters.page} of {dsrTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDSRPageChange((dsrFilters.page || 1) + 1)}
                          disabled={dsrFilters.page === dsrTotalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDSRPageChange(dsrTotalPages)}
                          disabled={dsrFilters.page === dsrTotalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
  
          {/* Privacy Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Privacy Policies</CardTitle>
                  <CardDescription>
                    Manage privacy policy versions
                  </CardDescription>
                </div>
                <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Privacy Policy</DialogTitle>
                      <DialogDescription>
                        Create a new privacy policy version
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="policyVersion">Version *</Label>
                        <Input
                          id="policyVersion"
                          placeholder="e.g., 2.0"
                          value={policyForm.version}
                          onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="effectiveDate">Effective Date *</Label>
                        <Input
                          id="effectiveDate"
                          type="date"
                          value={policyForm.effectiveDate}
                          onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="policyContent">Content *</Label>
                        <Textarea
                          id="policyContent"
                          placeholder="Privacy policy content"
                          rows={8}
                          value={policyForm.content}
                          onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="policyNotes">Notes</Label>
                        <Textarea
                          id="policyNotes"
                          placeholder="Additional notes about this version"
                          rows={2}
                          value={policyForm.notes}
                          onChange={(e) => setPolicyForm({ ...policyForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddPolicyOpen(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePolicy} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Policy'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {!policies || policies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No privacy policies found. Create your first policy.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Version</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Approved By</TableHead>
                        <TableHead>Approved At</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policies.map((policy) => (
                        <TableRow key={policy._id}>
                          <TableCell className="font-medium">v{policy.version}</TableCell>
                          <TableCell>{formatDate(policy.effectiveDate)}</TableCell>
                          <TableCell>
                            {policy.isCurrent ? (
                              <Badge className="bg-green-100 text-green-800">Current</Badge>
                            ) : (
                              <Badge variant="outline">Archived</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {policy.approvedBy?.personalInfo?.firstName} {policy.approvedBy?.personalInfo?.lastName}
                          </TableCell>
                          <TableCell>{formatDate(policy.approvedAt)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPolicy(policy);
                                setIsViewPolicyOpen(true);
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
  
          {/* Data Breaches Tab */}
          <TabsContent value="breaches" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Data Breaches</CardTitle>
                  <CardDescription>
                    Track and manage data breach incidents
                  </CardDescription>
                </div>
                <Dialog open={isReportBreachOpen} onOpenChange={setIsReportBreachOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report Breach
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Report Data Breach</DialogTitle>
                      <DialogDescription>
                        Report a new data breach incident
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="discoveryDate">Discovery Date *</Label>
                        <Input
                          id="discoveryDate"
                          type="date"
                          value={breachForm.discoveryDate}
                          onChange={(e) => setBreachForm({ ...breachForm, discoveryDate: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="breachDescription">Description *</Label>
                        <Textarea
                          id="breachDescription"
                          placeholder="Describe the breach"
                          rows={3}
                          value={breachForm.description}
                          onChange={(e) => setBreachForm({ ...breachForm, description: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Affected Data Types</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., email_addresses"
                            value={newAffectedData}
                            onChange={(e) => setNewAffectedData(e.target.value)}
                          />
                          <Button type="button" onClick={handleAddAffectedData} size="sm">
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {breachForm.affectedData.map((data, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {data}
                              <button
                                onClick={() => handleRemoveAffectedData(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Affected Users</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="User ID"
                            value={newAffectedUser}
                            onChange={(e) => setNewAffectedUser(e.target.value)}
                          />
                          <Button type="button" onClick={handleAddAffectedUser} size="sm">
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {breachForm.affectedUsers.map((userId, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {userId}
                              <button
                                onClick={() => handleRemoveAffectedUser(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="affectedRecords">Number of Affected Records *</Label>
                        <Input
                          id="affectedRecords"
                          type="number"
                          min="0"
                          value={breachForm.affectedRecords}
                          onChange={(e) => setBreachForm({ ...breachForm, affectedRecords: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="riskAssessment">Risk Assessment *</Label>
                        <Textarea
                          id="riskAssessment"
                          placeholder="Assess the risk level and potential impact"
                          rows={2}
                          value={breachForm.riskAssessment}
                          onChange={(e) => setBreachForm({ ...breachForm, riskAssessment: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="actionsTaken">Actions Taken *</Label>
                        <Textarea
                          id="actionsTaken"
                          placeholder="Describe immediate actions taken"
                          rows={2}
                          value={breachForm.actionsTaken}
                          onChange={(e) => setBreachForm({ ...breachForm, actionsTaken: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsReportBreachOpen(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button onClick={handleReportBreach} disabled={isSaving} variant="destructive">
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Reporting...
                          </>
                        ) : (
                          'Report Breach'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {!complianceReport?.recentBreaches || complianceReport.recentBreaches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No data breaches reported.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Breach ID</TableHead>
                        <TableHead>Discovery Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Affected Records</TableHead>
                        <TableHead>Notifications</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complianceReport.recentBreaches.map((breach) => (
                        <TableRow key={breach.breachId}>
                          <TableCell className="font-medium">{breach.breachId}</TableCell>
                          <TableCell>{formatDate(breach.discoveryDate)}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[breach.status]}>
                              {breach.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{breach.affectedRecords}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Badge variant={breach.notifiedAuthority ? "default" : "outline"} size="sm">
                                Authority
                              </Badge>
                              <Badge variant={breach.notifiedAffected ? "default" : "outline"} size="sm">
                                Affected
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Fetch full breach details
                                setSelectedBreach(breach as any);
                                setIsViewBreachOpen(true);
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
  
          {/* GDPR Settings Tab */}
          <TabsContent value="gdpr" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GDPR Settings</CardTitle>
                <CardDescription>
                  Configure GDPR-specific settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Data Protection Officer</h4>
                    {settings?.gdprSettings?.dataProtectionOfficer ? (
                      <div className="bg-muted p-3 rounded">
                        <p className="font-medium">{settings.gdprSettings.dataProtectionOfficer.name}</p>
                        <p className="text-sm text-muted-foreground">{settings.gdprSettings.dataProtectionOfficer.email}</p>
                        <p className="text-xs text-muted-foreground">Member ID: {settings.gdprSettings.dataProtectionOfficer.memberId}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">EU Representative</h4>
                    {settings?.gdprSettings?.representativeInEU ? (
                      <div className="bg-muted p-3 rounded">
                        <p className="font-medium">{settings.gdprSettings.representativeInEU.name}</p>
                        <p className="text-sm text-muted-foreground">{settings.gdprSettings.representativeInEU.email}</p>
                        <p className="text-sm text-muted-foreground">{settings.gdprSettings.representativeInEU.phone}</p>
                        <p className="text-sm text-muted-foreground">{settings.gdprSettings.representativeInEU.address}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Supervisory Authority</h4>
                    {settings?.gdprSettings?.supervisoryAuthority ? (
                      <div className="bg-muted p-3 rounded">
                        <p className="font-medium">{settings.gdprSettings.supervisoryAuthority.name}</p>
                        <p className="text-sm text-muted-foreground">{settings.gdprSettings.supervisoryAuthority.country}</p>
                        <p className="text-sm text-muted-foreground">{settings.gdprSettings.supervisoryAuthority.contactEmail}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Cross-border Transfers</h4>
                      <p className="text-xs text-muted-foreground">
                        Transfer data outside the EU/EEA
                      </p>
                    </div>
                    <Badge variant={settings?.gdprSettings?.crossBorderTransfers ? "default" : "secondary"}>
                      {settings?.gdprSettings?.crossBorderTransfers ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  {settings?.gdprSettings?.adequacyDecisions && settings.gdprSettings.adequacyDecisions.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Adequacy Decisions</h4>
                        <div className="flex flex-wrap gap-2">
                          {settings.gdprSettings.adequacyDecisions.map((decision, index) => (
                            <Badge key={index} variant="outline">{decision}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => {
                      // Open GDPR settings edit dialog
                      toast.info('GDPR settings edit functionality coming soon');
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
  
        {/* Edit Retention Dialog */}
        <Dialog open={isEditRetentionOpen} onOpenChange={setIsEditRetentionOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Retention Policies</DialogTitle>
              <DialogDescription>
                Configure data retention periods
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userDataRetention">User Data (days)</Label>
                <Input
                  id="userDataRetention"
                  type="number"
                  min="1"
                  value={retentionForm.userDataRetentionDays}
                  onChange={(e) => setRetentionForm({ ...retentionForm, userDataRetentionDays: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLogRetention">Activity Logs (days)</Label>
                <Input
                  id="activityLogRetention"
                  type="number"
                  min="1"
                  value={retentionForm.activityLogRetentionDays}
                  onChange={(e) => setRetentionForm({ ...retentionForm, activityLogRetentionDays: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="financialDataRetention">Financial Data (days)</Label>
                <Input
                  id="financialDataRetention"
                  type="number"
                  min="1"
                  value={retentionForm.financialDataRetentionDays}
                  onChange={(e) => setRetentionForm({ ...retentionForm, financialDataRetentionDays: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hrDataRetention">HR Data (days)</Label>
                <Input
                  id="hrDataRetention"
                  type="number"
                  min="1"
                  value={retentionForm.hrDataRetentionDays}
                  onChange={(e) => setRetentionForm({ ...retentionForm, hrDataRetentionDays: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoAnonymize"
                  checked={retentionForm.autoAnonymizeAfterRetention}
                  onCheckedChange={(checked) => setRetentionForm({ ...retentionForm, autoAnonymizeAfterRetention: checked })}
                />
                <Label htmlFor="autoAnonymize">Auto-anonymize after retention period</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRetentionOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRetention} disabled={isSaving}>
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
  
        {/* Edit Consent Dialog */}
        <Dialog open={isEditConsentOpen} onOpenChange={setIsEditConsentOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Consent Settings</DialogTitle>
              <DialogDescription>
                Configure consent requirements and purposes
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireConsent"
                  checked={consentForm.requireConsentForDataProcessing}
                  onCheckedChange={(checked) => setConsentForm({ ...consentForm, requireConsentForDataProcessing: checked })}
                />
                <Label htmlFor="requireConsent">Require consent for data processing</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consentVersion">Consent Version</Label>
                <Input
                  id="consentVersion"
                  value={consentForm.consentVersion}
                  onChange={(e) => setConsentForm({ ...consentForm, consentVersion: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consentText">Consent Text</Label>
                <Textarea
                  id="consentText"
                  rows={4}
                  value={consentForm.consentText}
                  onChange={(e) => setConsentForm({ ...consentForm, consentText: e.target.value })}
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-3">Consent Purposes</h4>
                
                {/* Add new purpose */}
                <div className="space-y-3 p-4 border rounded-lg mb-4">
                  <h5 className="text-sm font-medium">Add New Purpose</h5>
                  <div className="space-y-2">
                    <Input
                      placeholder="Purpose ID (e.g., marketing)"
                      value={newPurpose.purposeId}
                      onChange={(e) => setNewPurpose({ ...newPurpose, purposeId: e.target.value })}
                    />
                    <Input
                      placeholder="Purpose Name"
                      value={newPurpose.purposeName}
                      onChange={(e) => setNewPurpose({ ...newPurpose, purposeName: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={newPurpose.description}
                      onChange={(e) => setNewPurpose({ ...newPurpose, description: e.target.value })}
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="purposeRequired"
                          checked={newPurpose.required}
                          onCheckedChange={(checked) => setNewPurpose({ ...newPurpose, required: checked as boolean })}
                        />
                        <Label htmlFor="purposeRequired">Required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="purposeActive"
                          checked={newPurpose.isActive}
                          onCheckedChange={(checked) => setNewPurpose({ ...newPurpose, isActive: checked as boolean })}
                        />
                        <Label htmlFor="purposeActive">Active</Label>
                      </div>
                    </div>
                    <Button type="button" onClick={handleAddPurpose} size="sm" className="mt-2">
                      Add Purpose
                    </Button>
                  </div>
                </div>
                
                {/* List existing purposes */}
                <div className="space-y-3">
                  {consentForm.purposes.map((purpose, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{purpose.purposeName}</h5>
                          {purpose.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{purpose.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={purpose.isActive ? "default" : "secondary"}>
                          {purpose.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePurpose(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditConsentOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleUpdateConsent} disabled={isSaving}>
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
  
        {/* View DSR Dialog */}
        <Dialog open={isViewDSROpen} onOpenChange={setIsViewDSROpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Data Subject Request Details</DialogTitle>
            </DialogHeader>
            {selectedDSR && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{selectedDSR.requestId}</h3>
                  <Badge className={requestTypeColors[selectedDSR.requestType]}>
                    {requestTypeLabels[selectedDSR.requestType]}
                  </Badge>
                  <Badge className={statusColors[selectedDSR.status]}>
                    {selectedDSR.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">{selectedDSR.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">
                      {selectedDSR.user?.personalInfo?.firstName} {selectedDSR.user?.personalInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-medium">{selectedDSR.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">{formatDate(selectedDSR.requestDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{formatDate(selectedDSR.dueDate)}</p>
                  </div>
                </div>
                
                {selectedDSR.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm bg-muted p-3 rounded">{selectedDSR.notes}</p>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsViewDSROpen(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDSROpen(false);
                      setDsrUpdateForm({
                        status: selectedDSR.status,
                        notes: selectedDSR.notes || '',
                      });
                      setIsEditDSROpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
  
        {/* Edit DSR Dialog */}
        <Dialog open={isEditDSROpen} onOpenChange={setIsEditDSROpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update DSR Status</DialogTitle>
            </DialogHeader>
            {selectedDSR && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={dsrUpdateForm.status}
                    onValueChange={(value: any) => setDsrUpdateForm({ ...dsrUpdateForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dsrNotes">Notes</Label>
                  <Textarea
                    id="dsrNotes"
                    placeholder="Add notes about this request"
                    value={dsrUpdateForm.notes}
                    onChange={(e) => setDsrUpdateForm({ ...dsrUpdateForm, notes: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDSROpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDSR} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
        {/* View Policy Dialog */}
        <Dialog open={isViewPolicyOpen} onOpenChange={setIsViewPolicyOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Privacy Policy</DialogTitle>
            </DialogHeader>
            {selectedPolicy && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Version {selectedPolicy.version}</h3>
                    <p className="text-sm text-muted-foreground">
                      Effective: {formatDate(selectedPolicy.effectiveDate)}
                    </p>
                  </div>
                  {selectedPolicy.isCurrent && (
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                  <p className="whitespace-pre-wrap">{selectedPolicy.content}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Approved By</p>
                    <p className="font-medium">
                      {selectedPolicy.approvedBy?.personalInfo?.firstName} {selectedPolicy.approvedBy?.personalInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Approved At</p>
                    <p className="font-medium">{formatDate(selectedPolicy.approvedAt)}</p>
                  </div>
                </div>
                
                {selectedPolicy.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm bg-muted p-3 rounded">{selectedPolicy.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
  
        {/* View Breach Dialog */}
        <Dialog open={isViewBreachOpen} onOpenChange={setIsViewBreachOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Data Breach Details</DialogTitle>
            </DialogHeader>
            {selectedBreach && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{selectedBreach.breachId}</h3>
                  <Badge className={statusColors[selectedBreach.status]}>
                    {selectedBreach.status}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">{selectedBreach.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Discovery Date</p>
                    <p className="font-medium">{formatDate(selectedBreach.discoveryDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Affected Records</p>
                    <p className="font-medium">{selectedBreach.affectedRecords}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Affected Data Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBreach.affectedData?.map((data, index) => (
                      <Badge key={index} variant="secondary">{data}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Risk Assessment</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedBreach.riskAssessment}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Actions Taken</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedBreach.actionsTaken}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Authority Notified</span>
                      <Badge variant={selectedBreach.notifiedAuthority ? "default" : "secondary"}>
                        {selectedBreach.notifiedAuthority ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {selectedBreach.authorityNotificationDate && (
                      <p className="text-xs text-muted-foreground">
                        Notification Date: {formatDate(selectedBreach.authorityNotificationDate)}
                      </p>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">Affected Users Notified</span>
                      <Badge variant={selectedBreach.notifiedAffected ? "default" : "secondary"}>
                        {selectedBreach.notifiedAffected ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {selectedBreach.affectedNotificationDate && (
                      <p className="text-xs text-muted-foreground">
                        Notification Date: {formatDate(selectedBreach.affectedNotificationDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
  
        {/* Edit Breach Dialog */}
        <Dialog open={isEditBreachOpen} onOpenChange={setIsEditBreachOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Breach Status</DialogTitle>
            </DialogHeader>
            {selectedBreach && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={breachUpdateForm.status}
                    onValueChange={(value: any) => setBreachUpdateForm({ ...breachUpdateForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="mitigated">Mitigated</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifiedAuthority"
                      checked={breachUpdateForm.notifiedAuthority}
                      onCheckedChange={(checked) => setBreachUpdateForm({ ...breachUpdateForm, notifiedAuthority: checked as boolean })}
                    />
                    <Label htmlFor="notifiedAuthority">Authority Notified</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifiedAffected"
                      checked={breachUpdateForm.notifiedAffected}
                      onCheckedChange={(checked) => setBreachUpdateForm({ ...breachUpdateForm, notifiedAffected: checked as boolean })}
                    />
                    <Label htmlFor="notifiedAffected">Affected Users Notified</Label>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditBreachOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBreach} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Breach'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }