import { apiClient, handleApiResponse, handleApiError } from './client';

// ============================================
// TYPES
// ============================================

export interface User {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
    gender?: string;
  };
  avatar?: {
    url: string | null;
    publicId: string | null;
  };
  jobTitle?: string;
  department?: string;
  roles: Array<{
    _id: string;
    name: string;
    description?: string;
    category?: string;
    hierarchy: number;
  }>;
  status: 'active' | 'inactive' | 'pending' | 'on_leave';
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
  isBranchManager: boolean;
  joinedAt: string;
  invitedBy?: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  createdAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  jobTitle?: string;
  department?: string;
  roleIds: string[];
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  department?: string;
  roleIds?: string[];
  status?: 'active' | 'inactive';
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
}

export interface BulkStatusUpdateData {
  userIds: string[];
  status: 'active' | 'inactive';
}

export interface Backup {
  _id: string;
  organization: string;
  filename: string;
  fileSize: number;
  filePath: string;
  type: 'manual' | 'scheduled' | 'automatic';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  includes: string[];
  createdBy: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  restoreCount: number;
  isArchived: boolean;
  notes?: string;
  isEncrypted: boolean;
  encryptionMethod?: string;
  completedAt?: string;
  errorMessage?: string;
  errorStack?: string;
  formattedSize: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBackupData {
  includes?: string[];
  notes?: string;
}

export interface BackupStats {
  totalBackups: number;
  totalSize: number;
  completedBackups: number;
  failedBackups: number;
  avgBackupSize: number;
  totalSizeFormatted: string;
  avgBackupSizeFormatted: string;
}

export interface SecurityPolicies {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  ssoEnabled: boolean;
}

export interface UpdateSecurityPoliciesData {
  passwordPolicy?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    expiryDays?: number;
  };
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  twoFactorAuth?: boolean;
  ssoEnabled?: boolean;
}

export interface ComplianceFramework {
  _id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant';
  assignedTo: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  notes?: string;
}

export interface CreateFrameworkData {
  name: string;
  assignedTo: string;
  notes?: string;
}

export interface UpdateFrameworkData {
  status?: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant';
  notes?: string;
}

export interface ComplianceChecklistItem {
  _id: string;
  requirement: string;
  description: string;
  status: 'pending' | 'in_progress' | 'compliant' | 'non_compliant';
  assignedTo: string;
  dueDate: string;
  evidence: any[];
  completedAt?: string;
  notes?: string;
}

export interface ComplianceChecklist {
  _id: string;
  framework: string;
  category: string;
  items: ComplianceChecklistItem[];
  overallProgress: number;
  lastReviewed: string;
  reviewedBy?: string;
}

export interface CreateChecklistData {
  framework: string;
  category: string;
  items: Array<{
    requirement: string;
    description: string;
    assignedTo: string;
    dueDate: string;
  }>;
}

export interface UpdateChecklistItemData {
  status: 'pending' | 'in_progress' | 'compliant' | 'non_compliant';
  notes?: string;
  evidence?: any[];
}

export interface ComplianceAudit {
  _id: string;
  title: string;
  type: 'internal' | 'external';
  framework: string;
  auditor: string;
  auditDate: string;
  reportDate: string;
  scope: string;
  findings: Array<{
    _id: string;
    finding: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'closed';
  }>;
  overallStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdBy: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateAuditData {
  title: string;
  type: 'internal' | 'external';
  framework: string;
  auditor: string;
  auditDate: string;
  scope: string;
  findings?: Array<{
    finding: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface UpdateFindingData {
  status: 'open' | 'in_progress' | 'closed';
  notes?: string;
}

export interface ComplianceReport {
  summary: {
    totalFrameworks: number;
    compliantFrameworks: number;
    totalAudits: number;
    passedAudits: number;
    failedAudits: number;
    overallScore: number;
  };
  frameworks: Array<{
    name: string;
    status: string;
  }>;
  recentAudits: Array<{
    title: string;
    type: string;
    auditDate: string;
    overallStatus: string;
    findingsCount: number;
    openFindings: number;
  }>;
  generatedAt: string;
  generatedBy: string;
}

export interface Risk {
  _id: string;
  organization: string;
  riskId: string;
  title: string;
  description: string;
  category: 'cybersecurity' | 'operational' | 'financial' | 'compliance' | 'reputational' | 'hr' | 'strategic';
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy: 'avoid' | 'reduce' | 'transfer' | 'accept';
  mitigationPlan: string;
  contingencyPlan?: string;
  owner: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  stakeholders: string[];
  identifiedDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  status: 'identified' | 'assessed' | 'mitigating' | 'monitoring' | 'closed' | 'archived';
  financialImpact?: {
    currency: string;
    minAmount?: number;
    maxAmount?: number;
    expectedAmount?: number;
  };
  history: Array<{
    action: string;
    performedBy: {
      _id: string;
      personalInfo: {
        firstName: string;
        lastName: string;
      };
    };
    performedAt: string;
    changes?: any;
    notes?: string;
  }>;
  createdBy: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiskData {
  title: string;
  description: string;
  category: 'cybersecurity' | 'operational' | 'financial' | 'compliance' | 'reputational' | 'hr' | 'strategic';
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  mitigationStrategy: 'avoid' | 'reduce' | 'transfer' | 'accept';
  mitigationPlan: string;
  contingencyPlan?: string;
  owner: string;
  stakeholders?: string[];
  financialImpact?: {
    currency?: string;
    minAmount?: number;
    maxAmount?: number;
    expectedAmount?: number;
  };
  notes?: string;
}

export interface UpdateRiskData {
  title?: string;
  description?: string;
  category?: 'cybersecurity' | 'operational' | 'financial' | 'compliance' | 'reputational' | 'hr' | 'strategic';
  impact?: 'low' | 'medium' | 'high' | 'critical';
  probability?: 'low' | 'medium' | 'high';
  mitigationStrategy?: 'avoid' | 'reduce' | 'transfer' | 'accept';
  mitigationPlan?: string;
  contingencyPlan?: string;
  owner?: string;
  stakeholders?: string[];
  financialImpact?: {
    currency?: string;
    minAmount?: number;
    maxAmount?: number;
    expectedAmount?: number;
  };
  notes?: string;
  historyNotes?: string;
}

export interface UpdateRiskStatusData {
  status: 'identified' | 'assessed' | 'mitigating' | 'monitoring' | 'closed' | 'archived';
  notes?: string;
}

export interface RiskAssessment {
  _id: string;
  organization: string;
  title: string;
  description: string;
  assessmentDate: string;
  assessor: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  scope: string;
  methodology: string;
  summary: {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
  };
  findings: Array<{
    riskId: string | {
      _id: string;
      riskId: string;
      title: string;
      category: string;
      riskLevel: string;
    };
    previousScore: number;
    observations: string;
  }>;
  recommendations: Array<{
    recommendation: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: {
      _id: string;
      personalInfo: {
        firstName: string;
        lastName: string;
      };
    };
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiskAssessmentData {
  title: string;
  description: string;
  scope: string;
  methodology: string;
  findings: Array<{
    riskId: string;
    observations: string;
  }>;
  recommendations: Array<{
    recommendation: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string;
    dueDate: string;
  }>;
}

export interface RiskDashboard {
  metrics: {
    totalRisks: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    byLevel: Record<string, number>;
    averageScore: number;
    topRisks: string[];
    lastUpdated: string;
  };
  recentRisks: Array<{
    _id: string;
    title: string;
    riskLevel: string;
    riskScore: number;
    category: string;
    status: string;
    owner: {
      name: string;
    };
  }>;
  upcomingReviews: Array<{
    _id: string;
    title: string;
    nextReviewDate: string;
    owner: {
      name: string;
    };
  }>;
  recentAssessments: RiskAssessment[];
  heatMap: any[][];
}

export interface PrivacySettings {
  organization: string;
  dataRetention: {
    userDataRetentionDays: number;
    activityLogRetentionDays: number;
    financialDataRetentionDays: number;
    hrDataRetentionDays: number;
    autoAnonymizeAfterRetention: boolean;
  };
  consentSettings: {
    requireConsentForDataProcessing: boolean;
    consentVersion: string;
    consentLastUpdated: string;
    consentText?: string;
    purposes: Array<{
      purposeId: string;
      purposeName: string;
      description: string;
      required: boolean;
      isActive: boolean;
    }>;
  };
  gdprSettings: {
    dataProtectionOfficer?: {
      name: string;
      email: string;
      memberId: string;
    };
    representativeInEU?: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    supervisoryAuthority?: {
      name: string;
      country: string;
      contactEmail: string;
    };
    bindingCorporateRules: {
      documentFile?: any;
      hasBCR: boolean;
    };
    crossBorderTransfers: boolean;
    adequacyDecisions: string[];
  };
  complianceScore: number;
  userConsents?: Array<{
    userId: string;
    consentedAt: string;
    consentedPurposes: string[];
  }>;
  dataSubjectRequests?: Array<{
    requestId: string;
    requestType: string;
    status: string;
    requestDate: string;
  }>;
  dataBreaches?: Array<{
    breachId: string;
    discoveryDate: string;
    status: string;
    affectedRecords: number;
  }>;
}

export interface UpdateRetentionData {
  userDataRetentionDays?: number;
  activityLogRetentionDays?: number;
  financialDataRetentionDays?: number;
  hrDataRetentionDays?: number;
  autoAnonymizeAfterRetention?: boolean;
}

export interface UpdateConsentSettingsData {
  requireConsentForDataProcessing?: boolean;
  consentVersion?: string;
  consentText?: string;
  purposes?: Array<{
    purposeId: string;
    purposeName: string;
    description: string;
    required: boolean;
    isActive: boolean;
  }>;
}

export interface RecordConsentData {
  userId: string;
  consentedPurposes: string[];
}

export interface DataSubjectRequest {
  _id: string;
  requestId: string;
  userId: string;
  user?: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  requestType: 'access' | 'rectification' | 'erasure' | 'restrict' | 'portability' | 'object';
  requestDate: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  dueDate: string;
  notes?: string;
  responseFile?: any;
  completedAt?: string;
}

export interface CreateDSRData {
  userId: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'restrict' | 'portability' | 'object';
  description: string;
}

export interface UpdateDSRData {
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
  notes?: string;
}

export interface PrivacyPolicy {
  _id: string;
  version: string;
  effectiveDate: string;
  content: string;
  isCurrent: boolean;
  approvedBy: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  approvedAt: string;
  notes?: string;
}

export interface CreatePrivacyPolicyData {
  version: string;
  effectiveDate: string;
  content: string;
  notes?: string;
}

export interface DataBreach {
  _id: string;
  breachId: string;
  discoveryDate: string;
  description: string;
  affectedData: string[];
  affectedUsers: string[];
  affectedRecords: number;
  riskAssessment: string;
  actionsTaken: string;
  notifiedAuthority: boolean;
  notifiedAffected: boolean;
  authorityNotificationDate?: string;
  affectedNotificationDate?: string;
  status: 'investigating' | 'mitigated' | 'resolved' | 'closed';
  createdBy: string;
  createdAt: string;
}

export interface ReportBreachData {
  discoveryDate: string;
  description: string;
  affectedData: string[];
  affectedUsers: string[];
  affectedRecords: number;
  riskAssessment: string;
  actionsTaken: string;
}

export interface UpdateBreachData {
  status?: 'investigating' | 'mitigated' | 'resolved' | 'closed';
  notifiedAuthority?: boolean;
  notifiedAffected?: boolean;
}

export interface GDPRReport {
  organization: string;
  generatedAt: string;
  generatedBy: string;
  complianceScore: number;
  summary: {
    totalUsersWithConsent: number;
    totalConsentsWithdrawn: number;
    pendingDSR: number;
    activeDPAs: number;
    dataBreaches: number;
  };
  dataRetention: {
    userDataRetentionDays: number;
    activityLogRetentionDays: number;
    financialDataRetentionDays: number;
    hrDataRetentionDays: number;
    autoAnonymizeAfterRetention: boolean;
  };
  consentPurposes: Array<{
    purposeId: string;
    purposeName: string;
    description: string;
    required: boolean;
    isActive: boolean;
  }>;
  gdprSettings: PrivacySettings['gdprSettings'];
  recentDSR: Array<{
    requestId: string;
    requestType: string;
    status: string;
    requestDate: string;
    dueDate: string;
  }>;
  recentBreaches: Array<{
    breachId: string;
    discoveryDate: string;
    status: string;
    affectedRecords: number;
  }>;
}

export interface AuditLog {
  _id: string;
  organization: string;
  actor: string;
  actorModel: string;
  actorEmail: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  targetName?: string;
  changes?: any;
  metadata: {
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    requestId: string;
    responseTime: number;
    statusCode: number;
  };
  description: string;
  context: {
    module: string;
    source: string;
  };
  success: boolean;
  expiresAt: string;
  createdAt: string;
  timeAgo: string;
}

export interface AuditStats {
  totals: {
    totalLogs: number;
    logsInLast30Days: number;
    successfulLogs: number;
    failedLogs: number;
  };
  byAction: Array<{ _id: string; count: number }>;
  byTargetType: Array<{ _id: string; count: number }>;
  byActor: Array<{ _id: string; count: number }>;
  timeline: Array<{ _id: { year: number; month: number; day: number }; count: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface UserFilterParams extends PaginationParams {
  status?: string;
  department?: string;
  role?: string;
  search?: string;
}

export interface RiskFilterParams extends PaginationParams {
  category?: string;
  status?: string;
  level?: string;
  owner?: string;
}

// ============================================
// API CLIENT
// ============================================

export const systemApi = {
  // ============================================
  // USER MANAGEMENT
  // ============================================
  users: {
    /**
     * Get all users with optional filtering
     * GET /api/system/users
     */
    list: async (params?: UserFilterParams): Promise<ApiResponse<User[]>> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.department) queryParams.append('department', params.department);
        if (params?.role) queryParams.append('role', params.role);
        if (params?.search) queryParams.append('search', params.search);
        
        const url = `/system/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get(url);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get single user by ID
     * GET /api/system/users/:id
     */
    get: async (id: string): Promise<User> => {
      try {
        const response = await apiClient.get(`/system/users/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Create a new user
     * POST /api/system/users
     */
    create: async (data: CreateUserData): Promise<User> => {
      try {
        const response = await apiClient.post('/system/users', data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Update a user
     * PUT /api/system/users/:id
     */
    update: async (id: string, data: UpdateUserData): Promise<User> => {
      try {
        const response = await apiClient.put(`/system/users/${id}`, data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Delete a user
     * DELETE /api/system/users/:id
     */
    delete: async (id: string): Promise<void> => {
      try {
        const response = await apiClient.delete(`/system/users/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Bulk update user status
     * PATCH /api/system/users/bulk/status
     */
    bulkUpdateStatus: async (data: BulkStatusUpdateData): Promise<void> => {
      try {
        const response = await apiClient.patch('/system/users/bulk/status', data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },
  },

  // ============================================
  // BACKUP MANAGEMENT
  // ============================================
  backups: {
    /**
     * List all backups
     * GET /api/system/backups
     */
    list: async (params?: PaginationParams): Promise<ApiResponse<Backup[]>> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        
        const url = `/system/backups${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get(url);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get backup statistics
     * GET /api/system/backups/stats
     */
    getStats: async (): Promise<BackupStats> => {
      try {
        const response = await apiClient.get('/system/backups/stats');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Create a new backup
     * POST /api/system/backups
     */
    create: async (data?: CreateBackupData): Promise<Backup> => {
      try {
        const response = await apiClient.post('/system/backups', data || {});
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get single backup by ID
     * GET /api/system/backups/:id
     */
    get: async (id: string): Promise<Backup> => {
      try {
        const response = await apiClient.get(`/system/backups/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Download a backup file
     * GET /api/system/backups/:id/download
     */
    download: async (id: string): Promise<Blob> => {
      try {
        const response = await apiClient.get(`/system/backups/${id}/download`, {
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Restore from a backup
     * POST /api/system/backups/:id/restore
     */
    restore: async (id: string): Promise<void> => {
      try {
        const response = await apiClient.post(`/system/backups/${id}/restore`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Delete a backup
     * DELETE /api/system/backups/:id
     */
    delete: async (id: string): Promise<void> => {
      try {
        const response = await apiClient.delete(`/system/backups/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },
  },

  // ============================================
  // SECURITY POLICIES
  // ============================================
  security: {
    /**
     * Get security policies
     * GET /api/system/security
     */
    get: async (): Promise<SecurityPolicies> => {
      try {
        const response = await apiClient.get('/system/security');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Update security policies
     * PUT /api/system/security
     */
    update: async (data: UpdateSecurityPoliciesData): Promise<SecurityPolicies> => {
      try {
        const response = await apiClient.put('/system/security', data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },
  },

  // ============================================
  // COMPLIANCE MANAGEMENT
  // ============================================
  compliance: {
    /**
     * Get compliance overview
     * GET /api/system/compliance
     */
    getOverview: async (): Promise<any> => {
      try {
        const response = await apiClient.get('/system/compliance');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    // Frameworks
    frameworks: {
      /**
       * Add a compliance framework
       * POST /api/system/compliance/frameworks
       */
      create: async (data: CreateFrameworkData): Promise<ComplianceFramework> => {
        try {
          const response = await apiClient.post('/system/compliance/frameworks', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Update a framework
       * PUT /api/system/compliance/frameworks/:id
       */
      update: async (id: string, data: UpdateFrameworkData): Promise<ComplianceFramework> => {
        try {
          const response = await apiClient.put(`/system/compliance/frameworks/${id}`, data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    // Checklists
    checklists: {
      /**
       * Create a compliance checklist
       * POST /api/system/compliance/checklists
       */
      create: async (data: CreateChecklistData): Promise<ComplianceChecklist> => {
        try {
          const response = await apiClient.post('/system/compliance/checklists', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Update a checklist item
       * PUT /api/system/compliance/checklists/:id/items/:itemId
       */
      updateItem: async (checklistId: string, itemId: string, data: UpdateChecklistItemData): Promise<ComplianceChecklistItem> => {
        try {
          const response = await apiClient.put(`/system/compliance/checklists/${checklistId}/items/${itemId}`, data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    // Audits
    audits: {
      /**
       * Create a compliance audit
       * POST /api/system/compliance/audits
       */
      create: async (data: CreateAuditData): Promise<ComplianceAudit> => {
        try {
          const response = await apiClient.post('/system/compliance/audits', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Update an audit finding
       * PUT /api/system/compliance/audits/:id/findings/:findingId
       */
      updateFinding: async (auditId: string, findingId: string, data: UpdateFindingData): Promise<any> => {
        try {
          const response = await apiClient.put(`/system/compliance/audits/${auditId}/findings/${findingId}`, data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    /**
     * Get compliance reports
     * GET /api/system/compliance/reports
     */
    getReports: async (params?: { framework?: string }): Promise<ComplianceReport> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.framework) queryParams.append('framework', params.framework);
        
        const url = `/system/compliance/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get(url);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Export all compliance data
     * GET /api/system/compliance/export
     */
    export: async (): Promise<any> => {
      try {
        const response = await apiClient.get('/system/compliance/export');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },
  },

  // ============================================
  // RISK MANAGEMENT
  // ============================================
  risks: {
    /**
     * Get risk dashboard
     * GET /api/system/risks/dashboard
     */
    getDashboard: async (): Promise<RiskDashboard> => {
      try {
        const response = await apiClient.get('/system/risks/dashboard');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * List all risks with filtering
     * GET /api/system/risks
     */
    list: async (params?: RiskFilterParams): Promise<ApiResponse<Risk[]>> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.category) queryParams.append('category', params.category);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.level) queryParams.append('level', params.level);
        if (params?.owner) queryParams.append('owner', params.owner);
        
        const url = `/system/risks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get(url);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Create a new risk
     * POST /api/system/risks
     */
    create: async (data: CreateRiskData): Promise<Risk> => {
      try {
        const response = await apiClient.post('/system/risks', data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get single risk by ID
     * GET /api/system/risks/:id
     */
    get: async (id: string): Promise<Risk> => {
      try {
        const response = await apiClient.get(`/system/risks/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get risk by risk ID (e.g., RISK-2026-0001)
     * GET /api/system/risks/RISK-{year}-{number}
     */
    getByRiskId: async (riskId: string): Promise<Risk> => {
      try {
        const response = await apiClient.get(`/system/risks/${riskId}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Update a risk
     * PUT /api/system/risks/:id
     */
    update: async (id: string, data: UpdateRiskData): Promise<Risk> => {
      try {
        const response = await apiClient.put(`/system/risks/${id}`, data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Update risk status
     * PATCH /api/system/risks/:id/status
     */
    updateStatus: async (id: string, data: UpdateRiskStatusData): Promise<Risk> => {
      try {
        const response = await apiClient.patch(`/system/risks/${id}/status`, data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Archive a risk (soft delete)
     * DELETE /api/system/risks/:id
     */
    archive: async (id: string): Promise<void> => {
      try {
        const response = await apiClient.delete(`/system/risks/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Export all risks
     * GET /api/system/risks/export
     */
    export: async (): Promise<any> => {
      try {
        const response = await apiClient.get('/system/risks/export');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    // Risk Assessments
    assessments: {
      /**
       * List all risk assessments
       * GET /api/system/risks/assessments
       */
      list: async (params?: PaginationParams): Promise<ApiResponse<RiskAssessment[]>> => {
        try {
          const queryParams = new URLSearchParams();
          if (params?.page) queryParams.append('page', params.page.toString());
          if (params?.limit) queryParams.append('limit', params.limit.toString());
          
          const url = `/system/risks/assessments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          const response = await apiClient.get(url);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Create a risk assessment
       * POST /api/system/risks/assessments
       */
      create: async (data: CreateRiskAssessmentData): Promise<RiskAssessment> => {
        try {
          const response = await apiClient.post('/system/risks/assessments', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },

  // ============================================
  // DATA PRIVACY (GDPR)
  // ============================================
  privacy: {
    /**
     * Get privacy settings
     * GET /api/system/privacy
     */
    getSettings: async (): Promise<PrivacySettings> => {
      try {
        const response = await apiClient.get('/system/privacy');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Update retention policies
     * PUT /api/system/privacy/retention
     */
    updateRetention: async (data: UpdateRetentionData): Promise<PrivacySettings['dataRetention']> => {
      try {
        const response = await apiClient.put('/system/privacy/retention', data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    // Consent Management
    consent: {
      /**
       * Get consent settings
       * GET /api/system/privacy/consent/settings
       */
      getSettings: async (): Promise<PrivacySettings['consentSettings']> => {
        try {
          const response = await apiClient.get('/system/privacy/consent/settings');
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Update consent settings
       * PUT /api/system/privacy/consent/settings
       */
      updateSettings: async (data: UpdateConsentSettingsData): Promise<PrivacySettings['consentSettings']> => {
        try {
          const response = await apiClient.put('/system/privacy/consent/settings', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Record user consent
       * POST /api/system/privacy/consent/record
       */
      recordConsent: async (data: RecordConsentData): Promise<void> => {
        try {
          const response = await apiClient.post('/system/privacy/consent/record', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Withdraw user consent
       * POST /api/system/privacy/consent/withdraw/:userId
       */
      withdrawConsent: async (userId: string): Promise<void> => {
        try {
          const response = await apiClient.post(`/system/privacy/consent/withdraw/${userId}`);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    // Data Subject Requests (DSR)
    dsr: {
      /**
       * List all DSRs
       * GET /api/system/privacy/dsr
       */
      list: async (params?: PaginationParams): Promise<ApiResponse<DataSubjectRequest[]>> => {
        try {
          const queryParams = new URLSearchParams();
          if (params?.page) queryParams.append('page', params.page.toString());
          if (params?.limit) queryParams.append('limit', params.limit.toString());
          
          const url = `/system/privacy/dsr${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          const response = await apiClient.get(url);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Create a DSR
       * POST /api/system/privacy/dsr
       */
      create: async (data: CreateDSRData): Promise<DataSubjectRequest> => {
        try {
          const response = await apiClient.post('/system/privacy/dsr', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Update a DSR
       * PUT /api/system/privacy/dsr/:requestId
       */
      update: async (requestId: string, data: UpdateDSRData): Promise<DataSubjectRequest> => {
        try {
          const response = await apiClient.put(`/system/privacy/dsr/${requestId}`, data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Upload DSR response
       * POST /api/system/privacy/dsr/:requestId/response
       */
      uploadResponse: async (requestId: string, file: File): Promise<void> => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await apiClient.post(`/system/privacy/dsr/${requestId}/response`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    // Privacy Policies
    policies: {
      /**
       * List all privacy policies
       * GET /api/system/privacy/policies
       */
      list: async (): Promise<PrivacyPolicy[]> => {
        try {
          const response = await apiClient.get('/system/privacy/policies');
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Create a privacy policy
       * POST /api/system/privacy/policies
       */
      create: async (data: CreatePrivacyPolicyData): Promise<PrivacyPolicy> => {
        try {
          const response = await apiClient.post('/system/privacy/policies', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    /**
     * Upload Data Processing Agreement (DPA)
     * POST /api/system/privacy/dpa
     */
    uploadDPA: async (data: FormData): Promise<any> => {
      try {
        const response = await apiClient.post('/system/privacy/dpa', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    // Data Breaches
    breaches: {
      /**
       * Report a data breach
       * POST /api/system/privacy/breaches
       */
      report: async (data: ReportBreachData): Promise<DataBreach> => {
        try {
          const response = await apiClient.post('/system/privacy/breaches', data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },

      /**
       * Update a data breach
       * PUT /api/system/privacy/breaches/:breachId
       */
      update: async (breachId: string, data: UpdateBreachData): Promise<DataBreach> => {
        try {
          const response = await apiClient.put(`/system/privacy/breaches/${breachId}`, data);
          return handleApiResponse(response);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },

    /**
     * Update GDPR settings
     * PUT /api/system/privacy/gdpr
     */
    updateGDPR: async (data: Partial<PrivacySettings['gdprSettings']>): Promise<PrivacySettings['gdprSettings']> => {
      try {
        const response = await apiClient.put('/system/privacy/gdpr', data);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get GDPR compliance report
     * GET /api/system/privacy/reports/compliance
     */
    getComplianceReport: async (): Promise<GDPRReport> => {
      try {
        const response = await apiClient.get('/system/privacy/reports/compliance');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Export all privacy data
     * GET /api/system/privacy/export
     */
    export: async (): Promise<any> => {
      try {
        const response = await apiClient.get('/system/privacy/export');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },
  },

  // ============================================
  // AUDIT LOGS
  // ============================================
  auditLogs: {
    /**
     * List audit logs with filtering
     * GET /api/system/audit-logs
     */
    list: async (params?: {
      page?: number;
      limit?: number;
      action?: string;
      targetType?: string;
      targetId?: string;
      actor?: string;
      from?: string;
      to?: string;
    }): Promise<AuditLog[]> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.action) queryParams.append('action', params.action);
        if (params?.targetType) queryParams.append('targetType', params.targetType);
        if (params?.targetId) queryParams.append('targetId', params.targetId);
        if (params?.actor) queryParams.append('actor', params.actor);
        if (params?.from) queryParams.append('from', params.from);
        if (params?.to) queryParams.append('to', params.to);
        
        const url = `/system/audit-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get(url);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get audit statistics
     * GET /api/system/audit-logs/stats
     */
    getStats: async (): Promise<AuditStats> => {
      try {
        const response = await apiClient.get('/system/audit-logs/stats');
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Export audit logs
     * GET /api/system/audit-logs/export
     */
    export: async (format: 'json' | 'csv' = 'json'): Promise<any> => {
      try {
        const response = await apiClient.get(`/system/audit-logs/export?format=${format}`);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get logs by target
     * GET /api/system/audit-logs/target/:type/:id
     */
    getByTarget: async (targetType: string, targetId: string): Promise<AuditLog[]> => {
      try {
        const response = await apiClient.get(`/system/audit-logs/target/${targetType}/${targetId}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get single audit log by ID
     * GET /api/system/audit-logs/:id
     */
    get: async (id: string): Promise<AuditLog> => {
      try {
        const response = await apiClient.get(`/system/audit-logs/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Cleanup old audit logs
     * DELETE /api/system/audit-logs/cleanup
     */
    cleanup: async (days?: number): Promise<void> => {
      try {
        const queryParams = days ? `?days=${days}` : '';
        const response = await apiClient.delete(`/system/audit-logs/cleanup${queryParams}`);
        return handleApiResponse(response);
      } catch (error) {
        return handleApiError(error);
      }
    },
  },
};