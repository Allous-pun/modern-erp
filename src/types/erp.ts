export interface User {
  id: string;
  _id?: string;
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

// Remove the mock UserRole type since roles come from backend
export type UserRole = string; // This will be deprecated