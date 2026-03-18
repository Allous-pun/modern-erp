// src/lib/api/auth.ts
import { apiClient, handleApiResponse, handleApiError } from './client';
import { organizationsApi } from './organizations';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    member: {
      id: string;
      name: string;
      email: string;
      jobTitle?: string;
      roles: Array<{
        _id: string;
        name: string;
        description?: string;
        category?: string;
        permissions?: string[];
        hierarchy: number;
      }>;
    };
  };
  token: string;
}

export interface InviteVerifyResponse {
  success: boolean;
  data: {
    email: string;
    organization: {
      _id: string;
      name: string;
      slug: string;
    };
    roles: any[];
    jobTitle?: string;
    department?: string;
  };
}

export interface InviteRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteToken: string;
  jobTitle?: string;
  department?: string;
  phoneNumber?: string;
}

export interface InviteRegisterResponse {
  success: boolean;
  message: string;
  data: {
    member: {
      id: string;
      name: string;
      email: string;
      roles: any[];
      organization: {
        id: string;
        name: string;
      };
    };
    token: string;
  };
}

// User interface for auth context
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  jobTitle?: string;
  roles: any[];
  avatar?: string | null;
  organizationId?: string;
  organizationName?: string;
  memberId?: string;
}

export interface ProfileResponse {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    phoneNumber?: string;
  };
  avatar?: {
    url: string | null;
  };
  jobTitle?: string;
  department?: string;
  employeeId?: string;
  roles: Array<{
    _id: string;
    name: string;
    description?: string;
    category?: string;
    hierarchy: number;
  }>;
  status: string;
  joinedAt: string;
  organizationId: string;
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

export const authApi = {
  // ============================================
  // AUTHENTICATION
  // ============================================
  
  /**
   * Login using organization-auth endpoint
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/organization-auth/login', credentials);
      const data = handleApiResponse(response);
      
      // Store token
      localStorage.setItem('token', data.token);
      
      // IMPORTANT: Store the member ID from the response
      if (data.member?.id) {
        localStorage.setItem('memberId', data.member.id);
        console.log('Stored memberId:', data.member.id);
      }
      
      // Try to extract organization ID from member data if available
      if (data.member?.organizationId) {
        localStorage.setItem('organizationId', data.member.organizationId);
      }
      
      console.log('Login response:', data);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Register with invite
   */
  registerWithInvite: async (data: InviteRegisterData): Promise<InviteRegisterResponse> => {
    try {
      const response = await apiClient.post('/organization-auth/register-invite', data);
      const responseData = handleApiResponse(response);
      
      // Store token
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }
      
      // Store member ID if available in response
      if (responseData.data?.member?.id) {
        localStorage.setItem('memberId', responseData.data.member.id);
      }
      
      // Store organization ID if available
      if (responseData.data?.member?.organization?.id) {
        localStorage.setItem('organizationId', responseData.data.member.organization.id);
        localStorage.setItem('organizationName', responseData.data.member.organization.name);
      }
      
      return responseData;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
    }
  },

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  /**
   * Forgot Password - Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Reset Password with token
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Change Password (authenticated)
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    try {
      // Use the dedicated profile endpoint
      const profileData = await organizationsApi.getMyProfile();
      
      // Get organization info if needed
      let organizationName = '';
      try {
        const orgResponse = await organizationsApi.getCurrentOrganization();
        organizationName = orgResponse.organization.name;
        
        // Store organization info
        localStorage.setItem('organizationName', organizationName);
        if (orgResponse.organization.slug) {
          localStorage.setItem('organizationSlug', orgResponse.organization.slug);
        }
      } catch (orgError) {
        console.warn('Could not fetch organization details:', orgError);
      }
      
      // Ensure organizationId is stored
      if (profileData.organizationId) {
        localStorage.setItem('organizationId', profileData.organizationId);
      }
      
      // Ensure memberId is stored
      if (profileData._id) {
        localStorage.setItem('memberId', profileData._id);
      }
      
      return {
        id: profileData._id,
        email: profileData.personalInfo.email,
        firstName: profileData.personalInfo.firstName,
        lastName: profileData.personalInfo.lastName,
        displayName: profileData.personalInfo.displayName,
        jobTitle: profileData.jobTitle,
        roles: profileData.roles || [],
        avatar: profileData.avatar?.url,
        organizationId: profileData.organizationId,
        organizationName,
        memberId: profileData._id
      };
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return handleApiError(error);
    }
  },

  /**
   * Update current user profile using dedicated profile endpoint
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      const updatedProfile = await organizationsApi.updateMyProfile(data);
      
      // Get current user to merge with updated data (for roles, etc.)
      const currentUser = await authApi.getProfile().catch(() => null);
      
      const result = {
        id: updatedProfile._id,
        email: updatedProfile.personalInfo.email,
        firstName: updatedProfile.personalInfo.firstName,
        lastName: updatedProfile.personalInfo.lastName,
        displayName: updatedProfile.personalInfo.displayName,
        jobTitle: updatedProfile.jobTitle,
        roles: updatedProfile.roles || currentUser?.roles || [],
        avatar: updatedProfile.avatar?.url,
        organizationId: updatedProfile.organizationId,
        organizationName: currentUser?.organizationName,
        memberId: updatedProfile._id
      };
      
      // Update localStorage with new info
      localStorage.setItem('memberId', updatedProfile._id);
      if (updatedProfile.organizationId) {
        localStorage.setItem('organizationId', updatedProfile.organizationId);
      }
      
      console.log('Profile updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Update profile failed:', error);
      return handleApiError(error);
    }
  },

  /**
   * Admin: Update any member by ID
   */
  updateMember: async (memberId: string, data: UpdateMemberData): Promise<any> => {
    try {
      const result = await organizationsApi.updateMemberById(memberId, data);
      console.log('Member updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Update member failed:', error);
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
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Clear all auth data from localStorage
   */
  clearAuthData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('memberId');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('organizationName');
    localStorage.removeItem('organizationSlug');
  }
};