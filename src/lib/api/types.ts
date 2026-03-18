export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string | null;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  roles: Role[];
  organizations: Organization[];
  isSuperAdmin?: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  department?: string;
  jobTitle?: string;
  employeeId?: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  hierarchy?: number;
  permissions?: Permission[];
}

export interface Permission {
  _id: string;
  module: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
}

export interface InviteRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface InviteData {
  email: string;
  organization: Organization;
  roles: Role[];
  jobTitle?: string;
  department?: string;
}

export interface CreateInviteData {
  email: string;
  jobTitle?: string;
  department?: string;
}

export interface InviteResponse {
  email: string;
  organization: Organization;
  invitedBy: User;
  jobTitle?: string;
  department?: string;
  token: string;
  status: string;
  expiresAt: string;
  inviteLink: string;
}