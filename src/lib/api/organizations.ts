// src/lib/api/organizations.ts
import { apiClient, handleApiResponse, handleApiError } from './client';

export interface CreateOrganizationData {
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  industry?: string;
  organizationSize?: string;
}

export interface OrganizationRegisterData {
  // Organization fields
  name: string;
  legalName?: string;
  registrationNumber?: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  industry?: string;
  organizationSize?: string;
  
  // Admin fields
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminJobTitle?: string;
  adminPhone?: string;
  
  // Settings
  timezone?: string;
  baseCurrency?: string;
  language?: string;
}

export interface OrganizationRegisterResponse {
  success: boolean;
  message: string;
  data: {
    organization: {
      _id: string;
      name: string;
      slug: string;
      email?: string;
      status: string;
    };
    admin: {
      _id: string;
      name: string;
      email: string;
      jobTitle?: string;
      roles: Array<{
        id: string;
        name: string;
        hierarchy: number;
      }>;
    };
  };
  token: string;
  expiresIn?: string;
}

export interface Organization {
  _id: string;
  name: string;
  legalName?: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  organizationSize?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  status: 'active' | 'suspended' | 'trial' | 'inactive' | 'pending';
  isVerified: boolean;
  logo?: string | null;
  favicon?: string | null;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    maxUsers: number;
    maxStorage: number;
  };
}

export interface OrganizationSettings {
  _id: string;
  organization: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  baseCurrency: string;
  multiCurrencyEnabled: boolean;
  acceptedCurrencies: string[];
  taxSystem: string;
  taxRates: any[];
  defaultLanguage: string;
  languages: Array<{ code: string; name: string; isActive: boolean }>;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  sessionTimeout: number;
  maxLoginAttempts: number;
  emailNotifications: boolean;
  notificationChannels: string[];
  features: {
    twoFactorAuth: boolean;
    ssoEnabled: boolean;
    apiAccess: boolean;
    webhooks: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
  };
}

export interface OrganizationSubscription {
  _id: string;
  organization: string;
  planName: 'trial' | 'basic' | 'professional' | 'enterprise' | 'custom';
  planCode?: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual' | 'one-time';
  billingCurrency: string;
  price: number;
  maxUsers: number;
  maxStorage: number;
  maxModules: number;
  allowedModules: string[];
  restrictedModules: string[];
  features: {
    apiAccess: boolean;
    customReports: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
  };
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  renewalDate?: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended';
  autoRenew: boolean;
  paymentMethod: string;
}

export interface OrganizationResponse {
  organization: Organization;
  settings: OrganizationSettings;
  subscription: OrganizationSubscription;
  stats: {
    memberCount: number;
    maxUsers: number;
    storageUsed: number;
    maxStorage: number;
  };
}

export interface OrganizationMember {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: {
    url: string | null;
    publicId: string | null;
  };
  jobTitle?: string;
  department?: string;
  roles: Array<{
    id: string;
    name: string;
    description?: string;
    category?: string;
    hierarchy?: number;
  }>;
  status: 'active' | 'inactive' | 'pending' | 'on_leave';
  joinedAt: string;
  invitedBy?: {
    name: string;
    email: string;
  } | null;
  isActive: boolean;
}

export interface MemberProfile extends OrganizationMember {
  reportsTo?: {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      jobTitle?: string;
    };
  } | null;
  employeeId?: string;
  lastActive?: string;
  createdAt: string;
  organizationId: string;
}

export interface InviteMemberData {
  email: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
  jobTitle?: string;
  department?: string;
}

export interface InviteMemberResponse {
  _id: string;
  name: string;
  email: string;
  jobTitle?: string;
  department?: string;
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  status: string;
  tempPassword?: string;
}

export interface DashboardStats {
  organization: {
    id: string;
    name: string;
    status: string;
  };
  stats: {
    totalMembers: number;
    maxUsers: number;
    membersPercent: number;
    subscriptionStatus: string;
    planName: string;
    trialEndsAt?: string;
    daysLeft: number;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  phoneNumber?: string;
}

export interface UpdateMemberData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  department?: string;
  employeeId?: string;
  roleIds?: string[];
  reportsTo?: string;
}

export const organizationsApi = {
  // ============================================
  // PUBLIC REGISTRATION
  // ============================================
  /**
   * Register a new organization with admin user
   */
  register: async (data: OrganizationRegisterData): Promise<OrganizationRegisterResponse> => {
    try {
      const response = await apiClient.post('/organizations/register', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // ORGANIZATION CRUD
  // ============================================
  /**
   * Get current organization details
   */
  getCurrentOrganization: async (): Promise<OrganizationResponse> => {
    try {
      const response = await apiClient.get('/organizations');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update organization (admin only)
   */
  updateOrganization: async (data: Partial<CreateOrganizationData>): Promise<Organization> => {
    try {
      const response = await apiClient.put('/organizations', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // ORGANIZATION SETTINGS
  // ============================================
  /**
   * Get organization settings
   */
  getSettings: async (): Promise<OrganizationSettings> => {
    try {
      const response = await apiClient.get('/organizations/settings');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update organization settings (admin only)
   */
  updateSettings: async (data: Partial<OrganizationSettings>): Promise<OrganizationSettings> => {
    try {
      const response = await apiClient.put('/organizations/settings', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // ORGANIZATION SUBSCRIPTION
  // ============================================
  /**
   * Get organization subscription details
   */
  getSubscription: async (): Promise<OrganizationSubscription> => {
    try {
      const response = await apiClient.get('/organizations/subscription');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // DASHBOARD & STATS
  // ============================================
  /**
   * Get organization dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get('/organizations/dashboard');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // PROFILE MANAGEMENT (Self)
  // ============================================
  
  /**
   * Get current user's own profile
   * GET /api/organizations/members/profile
   */
  getMyProfile: async (): Promise<MemberProfile> => {
    try {
      const response = await apiClient.get('/organizations/members/profile');
      const profileData = handleApiResponse(response);
      
      // Store IDs from profile
      if (profileData.organizationId) {
        localStorage.setItem('organizationId', profileData.organizationId);
        console.log('Stored organizationId from profile:', profileData.organizationId);
      }
      if (profileData._id) {
        localStorage.setItem('memberId', profileData._id);
        console.log('Stored memberId from profile:', profileData._id);
      }
      
      return profileData;
    } catch (error) {
      console.error('Get my profile error:', error);
      return handleApiError(error);
    }
  },

  /**
   * Update current user's own profile
   * PUT /api/organizations/members/profile
   */
  updateMyProfile: async (data: UpdateProfileData): Promise<MemberProfile> => {
    try {
      const payload: any = {};
      
      // Only include fields that are provided
      if (data.firstName || data.lastName || data.phoneNumber) {
        payload.personalInfo = {
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName }),
          ...(data.phoneNumber && { phoneNumber: data.phoneNumber })
        };
      }
      
      if (data.jobTitle) {
        payload.jobTitle = data.jobTitle;
      }
      
      console.log('Updating profile with payload:', payload);
      const response = await apiClient.put('/organizations/members/profile', payload);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update my profile error:', error);
      return handleApiError(error);
    }
  },

  // ============================================
  // MEMBER MANAGEMENT (Admin)
  // ============================================
  /**
   * Get all organization members
   */
  getOrganizationMembers: async (): Promise<OrganizationMember[]> => {
    try {
      const response = await apiClient.get('/organizations/members');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get single member by ID
   */
  getOrganizationMember: async (memberId: string): Promise<MemberProfile> => {
    try {
      const response = await apiClient.get(`/organizations/members/${memberId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update any member by ID (admin only)
   * PUT /api/organizations/members/:memberId
   */
  updateMemberById: async (memberId: string, data: UpdateMemberData): Promise<MemberProfile> => {
    try {
      const payload: any = {};
      
      // Handle personalInfo
      if (data.firstName || data.lastName) {
        payload.personalInfo = {
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName })
        };
      }
      
      // Direct fields
      if (data.jobTitle) payload.jobTitle = data.jobTitle;
      if (data.department) payload.department = data.department;
      if (data.employeeId) payload.employeeId = data.employeeId;
      if (data.roleIds) payload.roleIds = data.roleIds;
      if (data.reportsTo) payload.reportsTo = data.reportsTo;
      
      console.log('Updating member with payload:', payload);
      const response = await apiClient.put(`/organizations/members/${memberId}`, payload);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Update member by ID error:', error);
      return handleApiError(error);
    }
  },

  /**
   * Invite a new member (admin only)
   */
  inviteMember: async (data: InviteMemberData): Promise<InviteMemberResponse> => {
    try {
      const response = await apiClient.post('/organizations/members/invite', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update member roles (admin only)
   * PUT /api/organizations/members/:memberId/roles
   */
  updateMemberRoles: async (memberId: string, roleIds: string[]): Promise<any> => {
    try {
      const response = await apiClient.put(`/organizations/members/${memberId}/roles`, { roleIds });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Remove member from organization (admin only)
   */
  removeMember: async (memberId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/organizations/members/${memberId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Reactivate a removed member (admin only)
   */
  reactivateMember: async (memberId: string): Promise<void> => {
    try {
      const response = await apiClient.put(`/organizations/members/${memberId}/reactivate`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // UTILITY METHODS
  // ============================================
  /**
   * Get current member ID from localStorage
   */
  getMemberId: (): string | null => {
    return localStorage.getItem('memberId');
  },

  /**
   * Clear member data from localStorage (useful for logout)
   */
  clearMemberData: (): void => {
    localStorage.removeItem('memberId');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('organizationName');
    localStorage.removeItem('organizationSlug');
  }
};