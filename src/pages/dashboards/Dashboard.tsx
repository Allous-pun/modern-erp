import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { organizationsApi, DashboardStats } from '@/lib/api/organizations';
import { modulesApi, ActiveModule } from '@/lib/api/modules';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { HRDashboard } from './HRDashboard';
import { SalesDashboard } from './SalesDashboard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { 
  LayoutDashboard, CheckSquare, Clock, FileText, CalendarDays, 
  Bell, Wallet, Users, TrendingUp, DollarSign, Briefcase,
  Package, ShoppingCart, Factory, FolderKanban, Target,
  AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Employee self-service dashboard (default for regular employees)
function EmployeeDashboard({ orgData, stats, userTasks }: { orgData: any; stats: any; userTasks?: any[] }) {
  const { user } = useAuth();
  
  // Use real tasks if available, otherwise fallback to mock data
  const myTasks = userTasks || [
    { id: '1', title: 'Complete project proposal', description: 'Due tomorrow', time: 'High priority', status: 'warning' as const },
    { id: '2', title: 'Review code changes', description: 'PR #234 awaiting review', time: '2 hours left', status: 'info' as const },
    { id: '3', title: 'Team meeting', description: 'Sprint planning session', time: 'Today 3:00 PM', status: 'info' as const },
    { id: '4', title: 'Submit timesheet', description: 'Week ending ' + new Date().toLocaleDateString(), time: 'Due today', status: 'warning' as const },
  ];

  const recentData = [
    { name: 'Mon', value: 8 },
    { name: 'Tue', value: 7.5 },
    { name: 'Wed', value: 8.5 },
    { name: 'Thu', value: 8 },
    { name: 'Fri', value: 7 },
  ];

  // Use real stats if available
  const memberCount = stats?.stats?.totalMembers || stats?.memberCount || 0;
  const maxUsers = stats?.stats?.maxUsers || stats?.maxUsers || 5;
  const daysLeft = stats?.stats?.daysLeft || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName || 'User'}!`}
        description={`${orgData?.name || 'Your company'} - Employee Dashboard`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="My Tasks"
          value={myTasks.length.toString()}
          change={3}
          changeLabel="new today"
          icon={<CheckSquare className="h-5 w-5" />}
        />
        <StatsCard
          title="Hours This Week"
          value="32.5"
          changeLabel="of 40 target"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Leave Balance"
          value="15 days"
          changeLabel="annual leave"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatsCard
          title="Team Members"
          value={memberCount.toString()}
          changeLabel={`of ${maxUsers} total`}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Hours Logged This Week"
          subtitle="Daily breakdown"
          type="bar"
          data={recentData}
          height={250}
          className="lg:col-span-2"
        />
        <ActivityTimeline
          title="My Tasks"
          items={myTasks}
        />
      </div>

      {daysLeft > 0 && daysLeft <= 7 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-600">
            Your trial ends in {daysLeft} days. Please contact support to upgrade your plan.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Portal dashboard for external users (customers/vendors)
function PortalDashboard({ orgData, userRole, stats }: { orgData: any; userRole: string; stats?: any }) {
  const { user } = useAuth();
  
  const activity = [
    { id: '1', title: 'Order #ORD-2024-001 shipped', description: 'Expected delivery: Jan 28', time: '1 hour ago', status: 'success' as const },
    { id: '2', title: 'Invoice #INV-2024-042 created', description: 'Amount: $5,400', time: '3 hours ago', status: 'info' as const },
    { id: '3', title: 'Support ticket resolved', description: 'Ticket #TKT-2024-012', time: '1 day ago', status: 'success' as const },
  ];

  // Use real stats if available
  const memberCount = stats?.stats?.totalMembers || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.firstName || 'User'}!`}
        description={`${userRole === 'customer' ? 'Customer' : 'Vendor'} Portal - ${orgData?.name || 'Your Company'}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title={userRole === 'customer' ? 'Active Orders' : 'Purchase Orders'}
          value="5"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatsCard
          title="Open Invoices"
          value="$12,400"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatsCard
          title="Notifications"
          value="3"
          icon={<Bell className="h-5 w-5" />}
        />
      </div>

      <ActivityTimeline
        title="Recent Activity"
        items={activity}
        maxItems={5}
      />
    </div>
  );
}

// Loading state component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { currentOrganization, organizationData, isLoading: orgLoading } = useOrganization();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [installedModules, setInstalledModules] = useState<ActiveModule[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setError(null);
    
    try {
      // Fetch dashboard stats
      await fetchDashboardStats();
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      // Even if stats fail, we still want to show the dashboard with fallback data
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const stats = await organizationsApi.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback to organization data
      if (organizationData?.stats) {
        setDashboardStats({ stats: organizationData.stats });
      }
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!user) {
    return null;
  }

  if (orgLoading || isLoadingStats) {
    return <DashboardSkeleton />;
  }

  // Get user's primary role from roles array
  const primaryRole = user.roles?.[0]?.name?.toLowerCase() || 'employee';
  
  // Check if user is Super Administrator
  const isSuperAdmin = user.roles?.some(role => 
    role.name?.toLowerCase().includes('super') || 
    role.name?.toLowerCase().includes('administrator')
  );

  // Route to role-specific dashboard based on actual roles
  if (isSuperAdmin || primaryRole.includes('executive') || primaryRole.includes('board') || primaryRole.includes('chairman')) {
    return (
      <ExecutiveDashboard 
        orgData={currentOrganization} 
        stats={dashboardStats} 
        modules={installedModules}
      />
    );
  }
  
  if (primaryRole.includes('finance') || primaryRole.includes('cfo') || primaryRole.includes('account')) {
    return (
      <FinanceDashboard 
        orgData={currentOrganization} 
        stats={dashboardStats} 
        modules={installedModules.filter(m => m.sidebarGroup === 'financial')}
      />
    );
  }
  
  if (primaryRole.includes('hr') || primaryRole.includes('human resources') || primaryRole.includes('people')) {
    return (
      <HRDashboard 
        orgData={currentOrganization} 
        stats={dashboardStats}
        modules={installedModules.filter(m => m.sidebarGroup === 'hr')}
      />
    );
  }
  
  if (primaryRole.includes('sales') || primaryRole.includes('crm') || primaryRole.includes('marketing')) {
    return (
      <SalesDashboard 
        orgData={currentOrganization} 
        stats={dashboardStats}
        modules={installedModules.filter(m => m.sidebarGroup === 'operations')}
      />
    );
  }
  
  if (primaryRole.includes('customer')) {
    return <PortalDashboard orgData={currentOrganization} userRole="customer" stats={dashboardStats} />;
  }
  
  if (primaryRole.includes('vendor') || primaryRole.includes('supplier')) {
    return <PortalDashboard orgData={currentOrganization} userRole="vendor" stats={dashboardStats} />;
  }

  // Default to employee dashboard
  return <EmployeeDashboard orgData={currentOrganization} stats={dashboardStats} />;
}