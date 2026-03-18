import { apiClient, handleApiResponse, handleApiError } from './client';

export interface ModuleFeature {
  name: string;
  key: string;
  description?: string;
  isEnabled: boolean;
  _id?: string;
}

export interface Module {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  version: string;
  isStable: boolean;
  isDeprecated: boolean;
  isCore: boolean;
  isSystem?: boolean;
  dependencies: string[];
  permissionPrefix: string;
  icon: string;
  color: string;
  displayOrder: number;
  routeBase: string;
  sidebarGroup: string;
  tier: string;
  isPaid: boolean;
  trialAvailable: boolean;
  trialDays: number;
  features: ModuleFeature[];
  isActive: boolean;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  isInstalled?: boolean;
}

export interface ActiveModule {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  routeBase: string;
  sidebarGroup: string;
  displayOrder: number;
  status: 'active' | 'trial' | 'inactive' | 'suspended';
  enabledFeatures: string[];
  settings: Record<string, any>;
}

export interface InstalledModule {
  _id: string;
  organization: string;
  module: Module;
  moduleSlug: string;
  status: 'active' | 'trial' | 'inactive' | 'suspended';
  settings: Record<string, any>;
  enabledFeatures: string[];
  installedBy: {
    id: string;
    name: string;
    email: string;
    type: string;
  };
  installedByModel: string;
  installedAt: string;
  subscription: {
    plan: string;
    renewalDate?: string;
    billingCycle: string;
    currency: string;
    price?: number;
  };
  usage?: {
    accessCount: number;
    usersCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InstallModuleData {
  settings?: Record<string, any>;
}

export interface UpdateModuleSettingsData {
  settings?: Record<string, any>;
  enabledFeatures?: string[];
}

// Custom error class for organization not active
export class OrganizationNotActiveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrganizationNotActiveError';
  }
}

export const modulesApi = {
  // 1. GET ALL AVAILABLE MODULES
  // Endpoint: GET /api/modules/available
  // Returns: List of all modules with installation status
  getAvailableModules: async (params?: { category?: string; isCore?: boolean; isPaid?: boolean }): Promise<Module[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.isCore !== undefined) queryParams.append('isCore', String(params.isCore));
      if (params?.isPaid !== undefined) queryParams.append('isPaid', String(params.isPaid));
      
      const url = `/modules/available${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return handleApiResponse(response);
    } catch (error: any) {
      // Check if it's the organization not active error
      if (error.message?.includes('Organization account is not active')) {
        throw new OrganizationNotActiveError(error.message);
      }
      return handleApiError(error);
    }
  },

  // 2. GET MODULE BY SLUG
  // Endpoint: GET /api/modules/available/:slug
  getModuleBySlug: async (slug: string): Promise<Module> => {
    try {
      const response = await apiClient.get(`/modules/available/${slug}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 3. GET INSTALLED MODULES
  // Endpoint: GET /api/modules/installed
  // Returns: Modules installed for current organization
  getInstalledModules: async (): Promise<InstalledModule[]> => {
    try {
      const response = await apiClient.get('/modules/installed');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 4. INSTALL A MODULE
  // Endpoint: POST /api/modules/install/:slug
  installModule: async (slug: string, data?: InstallModuleData): Promise<InstalledModule> => {
    try {
      const response = await apiClient.post(`/modules/install/${slug}`, data || {});
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 5. INSTALL MULTIPLE MODULES (batch install helper)
  installModules: async (modules: { slug: string; settings?: Record<string, any> }[]): Promise<InstalledModule[]> => {
    try {
      const results = [];
      for (const module of modules) {
        try {
          const result = await modulesApi.installModule(module.slug, { settings: module.settings });
          results.push(result);
        } catch (error) {
          console.error(`Failed to install ${module.slug}:`, error);
        }
      }
      return results;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 6. UNINSTALL A MODULE
  // Endpoint: DELETE /api/modules/uninstall/:slug
  uninstallModule: async (slug: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/modules/uninstall/${slug}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 7. UPDATE MODULE SETTINGS
  // Endpoint: PUT /api/modules/installed/:id/settings
  updateModuleSettings: async (id: string, data: UpdateModuleSettingsData): Promise<InstalledModule> => {
    try {
      const response = await apiClient.put(`/modules/installed/${id}/settings`, data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 8. CHECK IF MODULE IS INSTALLED
  // Endpoint: GET /api/modules/check/:slug
  checkModuleInstalled: async (slug: string): Promise<{
    isInstalled: boolean;
    module: string;
    settings: Record<string, any> | null;
    enabledFeatures: string[];
    status: string | null;
  }> => {
    try {
      const response = await apiClient.get(`/modules/check/${slug}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 9. GET ACTIVE MODULES FOR SIDEBAR
  // Endpoint: GET /api/modules/active
  // Returns: Simplified module list perfect for sidebar navigation
  getActiveModules: async (): Promise<ActiveModule[]> => {
    try {
      const response = await apiClient.get('/modules/active');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};