import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { modulesApi } from '@/lib/api/modules';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { currentOrganization, organizationData, isLoading: orgLoading } = useOrganization();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);

  useEffect(() => {
    const checkSetupStatus = async () => {
      console.log('=== ProtectedRoute Debug ===');
      console.log('authLoading:', authLoading);
      console.log('orgLoading:', orgLoading);
      console.log('isAuthenticated:', isAuthenticated);
      console.log('currentOrganization:', currentOrganization);
      console.log('organizationData:', organizationData);
      console.log('location.pathname:', location.pathname);
      console.log('user roles:', user?.roles);

      // Wait for auth to load
      if (authLoading) {
        console.log('Still loading auth...');
        return;
      }

      // If not authenticated, stop checking
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        setIsChecking(false);
        return;
      }

      // Wait for organization to load
      if (orgLoading) {
        console.log('Still loading organization...');
        return;
      }

      // Check if we're already on the setup page to avoid loops
      if (location.pathname === '/setup') {
        console.log('Already on setup page, allowing access');
        setIsChecking(false);
        return;
      }

      // MULTIPLE WAYS TO DETECT IF SETUP IS COMPLETE
      
      // 1. Check localStorage flag
      const setupCompleted = localStorage.getItem('setupCompleted') === 'true';
      console.log('Setup completed flag:', setupCompleted);
      
      // 2. Check if user has a role that indicates setup is complete (Super Admin)
      const hasSuperAdminRole = user?.roles?.some((role: any) => 
        role.name?.toLowerCase().includes('super') || 
        role.name?.toLowerCase().includes('administrator')
      );
      console.log('Has Super Admin role:', hasSuperAdminRole);
      
      // 3. Check if organization data has any indication of modules
      // Sometimes stats might have module count in a different field
      const hasModulesFromStats = organizationData?.stats && 
        (organizationData.stats as any).modulesCount !== undefined;
      console.log('Has modules from stats:', hasModulesFromStats);
      
      // 4. Try to fetch active modules (optional - could add extra request)
      let hasActiveModules = false;
      try {
        const activeModules = await modulesApi.getActiveModules();
        hasActiveModules = activeModules.length > 0;
        console.log('Has active modules from API:', hasActiveModules);
      } catch (error) {
        console.log('Could not fetch active modules:', error);
      }
      
      // If ANY of these conditions are true, setup is complete
      const isSetupComplete = setupCompleted || hasSuperAdminRole || hasActiveModules;
      
      if (isSetupComplete) {
        console.log('Setup is complete! Allowing access to dashboard');
        setShouldRedirectToSetup(false);
        
        // Ensure flag is set for future checks
        if (!setupCompleted) {
          localStorage.setItem('setupCompleted', 'true');
        }
      } else {
        console.log('Setup not complete, redirecting to setup');
        setShouldRedirectToSetup(true);
      }

      setIsChecking(false);
    };

    checkSetupStatus();
  }, [authLoading, orgLoading, isAuthenticated, currentOrganization, organizationData, location.pathname, user]);

  // Show loading spinner while checking
  if (authLoading || orgLoading || isChecking) {
    console.log('Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirect to setup if needed (and not already on setup)
  if (shouldRedirectToSetup && location.pathname !== '/setup') {
    console.log('Redirecting to setup');
    return <Navigate to="/setup" replace />;
  }

  console.log('Rendering protected content');
  return <>{children}</>;
}