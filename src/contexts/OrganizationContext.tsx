import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { organizationsApi, Organization, OrganizationResponse } from '@/lib/api/organizations';
import { useAuth } from './AuthContext';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizationData: OrganizationResponse | null;
  isLoading: boolean;
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [organizationData, setOrganizationData] = useState<OrganizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentOrganization = organizationData?.organization || null;

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganization();
    } else {
      setOrganizationData(null);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrganization = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have an organization ID in localStorage
      const orgId = localStorage.getItem('organizationId');
      if (!orgId) {
        console.log('No organization ID found in localStorage');
        setOrganizationData(null);
        setIsLoading(false);
        return;
      }
      
      const org = await organizationsApi.getCurrentOrganization();
      console.log('Organization data from API:', org);
      setOrganizationData(org);
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      setOrganizationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizationData,
        isLoading,
        refreshOrganization: fetchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};