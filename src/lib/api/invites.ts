import { apiClient, handleApiResponse, handleApiError } from './client';

export interface CreateInviteData {
  email: string;
  firstName?: string;
  lastName?: string;
  roleIds: string[];
  jobTitle?: string;
  department?: string;
}

export interface InviteResponse {
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
  status: 'active' | 'pending' | 'inactive';
  tempPassword?: string;
  invitedBy?: {
    name: string;
    email: string;
  };
  joinedAt?: string;
  createdAt?: string;
}

export interface Member {
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
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  invitedBy?: {
    name: string;
    email: string;
  } | null;
  isActive: boolean;
}

export interface MemberDetail {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    gender: string;
  };
  avatar: {
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
    hierarchy?: number;
  }>;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  invitedBy?: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
    };
    _id: string;
    fullName: string;
    initials: string;
    isAdmin: boolean;
    managedBranch: any;
    id: string;
  };
  createdAt: string;
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
}

export interface InviteRegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      displayName: string;
      organizations: Array<{
        _id: string;
        name: string;
        slug: string;
      }>;
      roles: any[];
      createdAt: string;
    };
  };
  token: string;
  refreshToken: string;
}

export const invitesApi = {
  // Create an invite (Admin only)
  createInvite: async (data: CreateInviteData): Promise<InviteResponse> => {
    try {
      const response = await apiClient.post('/organizations/members/invite', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all members (Admin only)
  getMembers: async (): Promise<Member[]> => {
    try {
      const response = await apiClient.get('/organizations/members');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get single member by ID (Admin only)
  getMember: async (memberId: string): Promise<MemberDetail> => {
    try {
      const response = await apiClient.get(`/organizations/members/${memberId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Verify invite token (Public)
  verifyInvite: async (token: string): Promise<InviteVerifyResponse['data']> => {
    try {
      const response = await apiClient.get(`/invites/verify/${token}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Register with Invite
  registerWithInvite: async (data: InviteRegisterData): Promise<InviteRegisterResponse> => {
    try {
      const response = await apiClient.post('/auth/register/invite', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Resend invite (Admin only)
  resendInvite: async (inviteId: string): Promise<void> => {
    try {
      const response = await apiClient.post(`/invites/${inviteId}/resend`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Cancel invite (Admin only)
  cancelInvite: async (inviteId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/invites/${inviteId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};