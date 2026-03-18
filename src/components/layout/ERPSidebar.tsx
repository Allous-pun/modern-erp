import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, DollarSign, Users, Target, ShoppingBag, Package, 
  FolderKanban, BarChart3, Settings, ChevronDown, ChevronRight,
  FileSpreadsheet, BookOpen, FileText, CreditCard, Receipt, PiggyBank,
  FileBarChart, UserCircle, UserPlus, Clock, CalendarOff, Wallet,
  TrendingUp, GraduationCap, Magnet, Briefcase, Building2, FileEdit,
  ShoppingCart, Megaphone, MessageSquare, Truck, FileQuestion, ClipboardList,
  PackageCheck, CheckSquare, Box, Layers, Warehouse, ArrowLeftRight,
  RefreshCcw, List, Timer, Flag, UserCog, Shield, Building, Puzzle,
  GitBranch, FileSearch, Cog, X, Factory, Calendar, Crown, Gavel,
  Activity, Cpu, Globe, Loader2, Lock, KeyRound, Eye, Fingerprint, 
  FileCheck, Scale, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/erp';
import { getNavigationForRole } from '@/config/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { modulesApi, ActiveModule } from '@/lib/api/modules';

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard, DollarSign, Users, Target, ShoppingBag, Package,
  FolderKanban, BarChart3, Settings, FileSpreadsheet, BookOpen, FileText,
  CreditCard, Receipt, PiggyBank, FileBarChart, UserCircle, UserPlus,
  Clock, CalendarOff, Wallet, TrendingUp, GraduationCap, Magnet, Briefcase,
  Building2, FileEdit, ShoppingCart, Megaphone, MessageSquare, Truck,
  FileQuestion, ClipboardList, PackageCheck, CheckSquare, Box, Layers,
  Warehouse, ArrowLeftRight, RefreshCcw, List, Timer, Flag, UserCog, Shield,
  Building, Puzzle, GitBranch, FileSearch, Cog, Factory, Calendar, Crown, 
  Gavel, Activity, Cpu, Globe, Loader2, Lock, KeyRound, Eye, Fingerprint, 
  FileCheck, Scale, AlertCircle,
  
  // String-based mappings for backward compatibility
  'layout-dashboard': LayoutDashboard,
  'dollar-sign': DollarSign,
  'users': Users,
  'target': Target,
  'shopping-bag': ShoppingBag,
  'package': Package,
  'folder-kanban': FolderKanban,
  'bar-chart-3': BarChart3,
  'settings': Settings,
  'file-spreadsheet': FileSpreadsheet,
  'book-open': BookOpen,
  'file-text': FileText,
  'credit-card': CreditCard,
  'receipt': Receipt,
  'piggy-bank': PiggyBank,
  'file-bar-chart': FileBarChart,
  'user-circle': UserCircle,
  'user-plus': UserPlus,
  'clock': Clock,
  'calendar-off': CalendarOff,
  'wallet': Wallet,
  'trending-up': TrendingUp,
  'graduation-cap': GraduationCap,
  'magnet': Magnet,
  'briefcase': Briefcase,
  'building-2': Building2,
  'file-edit': FileEdit,
  'shopping-cart': ShoppingCart,
  'megaphone': Megaphone,
  'message-square': MessageSquare,
  'truck': Truck,
  'file-question': FileQuestion,
  'clipboard-list': ClipboardList,
  'package-check': PackageCheck,
  'check-square': CheckSquare,
  'box': Box,
  'layers': Layers,
  'warehouse': Warehouse,
  'arrow-left-right': ArrowLeftRight,
  'refresh-ccw': RefreshCcw,
  'list': List,
  'timer': Timer,
  'flag': Flag,
  'user-cog': UserCog,
  'shield': Shield,
  'building': Building,
  'puzzle': Puzzle,
  'git-branch': GitBranch,
  'file-search': FileSearch,
  'cog': Cog,
  'factory': Factory,
  'calendar': Calendar,
  'lock': Lock,
  'key-round': KeyRound,
  'eye': Eye,
  'fingerprint': Fingerprint,
  'file-check': FileCheck,
  'scale': Scale,
  'gavel': Gavel,
  'alert-circle': AlertCircle,
};

// Default icon for modules without a mapped icon
const DefaultIcon = Package;

// Module colors based on module slug or category
const moduleColors: Record<string, string> = {
  finance: 'bg-module-finance/10 text-module-finance border-module-finance/20',
  hr: 'bg-module-hr/10 text-module-hr border-module-hr/20',
  sales: 'bg-module-sales/10 text-module-sales border-module-sales/20',
  pos: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  procurement: 'bg-module-procurement/10 text-module-procurement border-module-procurement/20',
  inventory: 'bg-module-inventory/10 text-module-inventory border-module-inventory/20',
  manufacturing: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  projects: 'bg-module-projects/10 text-module-projects border-module-projects/20',
  admin: 'bg-primary/10 text-primary border-primary/20',
  system: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  core: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  reporting: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  executive: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  security: 'bg-red-500/10 text-red-600 border-red-500/20',
};

// Define feature-to-route mappings for each module
const moduleFeatureRoutes: Record<string, Array<{ feature: string; label: string; path: string }>> = {
  system: [
    { feature: 'users', label: 'User Management', path: '/system/users' },
    { feature: 'roles', label: 'Role Management', path: '/system/roles' },
    { feature: 'permissions', label: 'Permissions', path: '/system/permissions' },
    { feature: 'audit', label: 'Audit Logs', path: '/system/audit-logs' },
    { feature: 'modules', label: 'Modules', path: '/system/modules' },
    { feature: 'organization', label: 'Organization', path: '/system/organization' },
    { feature: 'workflows', label: 'Workflows', path: '/system/workflows' },
    { feature: 'languages', label: 'Languages', path: '/system/languages' },
    { feature: 'backups', label: 'Backup Management', path: '/system/backups' },
    { feature: 'config', label: 'System Configuration', path: '/system/config' },
    { feature: 'logs', label: 'System Logs', path: '/system/logs' },
    { feature: 'maintenance', label: 'Maintenance', path: '/system/maintenance' },
  ],
  security: [
    { feature: 'policies', label: 'Security Policies', path: '/system/security' },
    { feature: 'compliance', label: 'Compliance', path: '/system/compliance' },
    { feature: 'risk', label: 'Risk Management', path: '/system/risks' },
    { feature: 'privacy', label: 'Data Privacy', path: '/system/privacy' },
    //{ feature: 'encryption', label: 'Encryption', path: '/system/encryption' },
    { feature: 'access', label: 'Access Control', path: '/system/access' },
    { feature: 'audit', label: 'Security Audit', path: '/system/audit-logs' },
  ],
  finance: [
    { feature: 'dashboard', label: 'Dashboard', path: '/finance/dashboard' },
    { feature: 'accounts', label: 'Chart of Accounts', path: '/finance/accounts' },
    { feature: 'ledger', label: 'General Ledger', path: '/finance/ledger' },
    { feature: 'invoices', label: 'Invoices', path: '/finance/invoices' },
    { feature: 'payments', label: 'Payments', path: '/finance/payments' },
    { feature: 'expenses', label: 'Expenses', path: '/finance/expenses' },
    { feature: 'budgets', label: 'Budgets', path: '/finance/budgets' },
    { feature: 'reports', label: 'Financial Reports', path: '/finance/reports' },
    { feature: 'tax', label: 'Tax Management', path: '/finance/tax' },
    { feature: 'assets', label: 'Asset Management', path: '/finance/assets' },
  ],
  hr: [
    { feature: 'dashboard', label: 'Dashboard', path: '/hr/dashboard' },
    { feature: 'employees', label: 'Employees', path: '/hr/employees' },
    { feature: 'attendance', label: 'Attendance', path: '/hr/attendance' },
    { feature: 'leave', label: 'Leave Management', path: '/hr/leave' },
    { feature: 'payroll', label: 'Payroll', path: '/hr/payroll' },
    { feature: 'performance', label: 'Performance', path: '/hr/performance' },
    { feature: 'training', label: 'Training', path: '/hr/training' },
    { feature: 'recruitment', label: 'Recruitment', path: '/hr/recruitment' },
    { feature: 'documents', label: 'Documents', path: '/hr/documents' },
    { feature: 'reports', label: 'HR Reports', path: '/hr/reports' },
  ],
  sales: [
    { feature: 'dashboard', label: 'Dashboard', path: '/sales/dashboard' },
    { feature: 'leads', label: 'Leads', path: '/sales/leads' },
    { feature: 'opportunities', label: 'Opportunities', path: '/sales/opportunities' },
    { feature: 'customers', label: 'Customers', path: '/sales/customers' },
    { feature: 'quotes', label: 'Quotes', path: '/sales/quotes' },
    { feature: 'orders', label: 'Orders', path: '/sales/orders' },
    { feature: 'invoices', label: 'Invoices', path: '/sales/invoices' },
    { feature: 'products', label: 'Products', path: '/sales/products' },
    { feature: 'targets', label: 'Targets', path: '/sales/targets' },
    { feature: 'reports', label: 'Sales Reports', path: '/sales/reports' },
  ],
  inventory: [
    { feature: 'dashboard', label: 'Dashboard', path: '/inventory/dashboard' },
    { feature: 'items', label: 'Items', path: '/inventory/items' },
    { feature: 'categories', label: 'Categories', path: '/inventory/categories' },
    { feature: 'warehouses', label: 'Warehouses', path: '/inventory/warehouses' },
    { feature: 'stock', label: 'Stock Levels', path: '/inventory/stock' },
    { feature: 'movements', label: 'Stock Movements', path: '/inventory/movements' },
    { feature: 'adjustments', label: 'Adjustments', path: '/inventory/adjustments' },
    { feature: 'transfers', label: 'Transfers', path: '/inventory/transfers' },
    { feature: 'reports', label: 'Inventory Reports', path: '/inventory/reports' },
  ],
  procurement: [
    { feature: 'dashboard', label: 'Dashboard', path: '/procurement/dashboard' },
    { feature: 'vendors', label: 'Vendors', path: '/procurement/vendors' },
    { feature: 'purchases', label: 'Purchase Orders', path: '/procurement/purchases' },
    { feature: 'requests', label: 'Purchase Requests', path: '/procurement/requests' },
    { feature: 'quotations', label: 'Quotations', path: '/procurement/quotations' },
    { feature: 'contracts', label: 'Contracts', path: '/procurement/contracts' },
    { feature: 'receiving', label: 'Receiving', path: '/procurement/receiving' },
    { feature: 'returns', label: 'Returns', path: '/procurement/returns' },
    { feature: 'reports', label: 'Procurement Reports', path: '/procurement/reports' },
  ],
  manufacturing: [
    { feature: 'dashboard', label: 'Dashboard', path: '/manufacturing/dashboard' },
    { feature: 'bom', label: 'Bill of Materials', path: '/manufacturing/bom' },
    { feature: 'routing', label: 'Routings', path: '/manufacturing/routing' },
    { feature: 'work-orders', label: 'Work Orders', path: '/manufacturing/work-orders' },
    { feature: 'production', label: 'Production', path: '/manufacturing/production' },
    { feature: 'quality', label: 'Quality Control', path: '/manufacturing/quality' },
    { feature: 'maintenance', label: 'Maintenance', path: '/manufacturing/maintenance' },
    { feature: 'reports', label: 'Manufacturing Reports', path: '/manufacturing/reports' },
  ],
  projects: [
    { feature: 'dashboard', label: 'Dashboard', path: '/projects/dashboard' },
    { feature: 'projects', label: 'Projects', path: '/projects/projects' },
    { feature: 'tasks', label: 'Tasks', path: '/projects/tasks' },
    { feature: 'milestones', label: 'Milestones', path: '/projects/milestones' },
    { feature: 'resources', label: 'Resources', path: '/projects/resources' },
    { feature: 'budget', label: 'Budget', path: '/projects/budget' },
    { feature: 'timesheets', label: 'Timesheets', path: '/projects/timesheets' },
    { feature: 'reports', label: 'Project Reports', path: '/projects/reports' },
  ],
  crm: [
    { feature: 'dashboard', label: 'Dashboard', path: '/crm/dashboard' },
    { feature: 'contacts', label: 'Contacts', path: '/crm/contacts' },
    { feature: 'companies', label: 'Companies', path: '/crm/companies' },
    { feature: 'interactions', label: 'Interactions', path: '/crm/interactions' },
    { feature: 'campaigns', label: 'Campaigns', path: '/crm/campaigns' },
    { feature: 'tickets', label: 'Support Tickets', path: '/crm/tickets' },
    { feature: 'reports', label: 'CRM Reports', path: '/crm/reports' },
  ],
  executive: [
    { feature: 'dashboard', label: 'Executive Dashboard', path: '/executive/dashboard' },
    { feature: 'kpis', label: 'KPIs', path: '/executive/kpis' },
    { feature: 'reports', label: 'Executive Reports', path: '/executive/reports' },
    { feature: 'forecasts', label: 'Forecasts', path: '/executive/forecasts' },
    { feature: 'analytics', label: 'Analytics', path: '/executive/analytics' },
  ],
  reporting: [
    { feature: 'reports', label: 'Reports', path: '/reporting/reports' },
    { feature: 'dashboards', label: 'Dashboards', path: '/reporting/dashboards' },
    { feature: 'analytics', label: 'Analytics', path: '/reporting/analytics' },
    { feature: 'scheduled', label: 'Scheduled Reports', path: '/reporting/scheduled' },
    { feature: 'templates', label: 'Report Templates', path: '/reporting/templates' },
  ],
  pos: [
    { feature: 'dashboard', label: 'Dashboard', path: '/pos/dashboard' },
    { feature: 'sales', label: 'POS Sales', path: '/pos/sales' },
    { feature: 'products', label: 'Products', path: '/pos/products' },
    { feature: 'customers', label: 'Customers', path: '/pos/customers' },
    { feature: 'returns', label: 'Returns', path: '/pos/returns' },
    { feature: 'reports', label: 'POS Reports', path: '/pos/reports' },
  ],
};

interface NavItemProps {
  item: NavItem;
  level?: number;
}

function NavItemComponent({ item, level = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isCollapsed, closeMobile } = useSidebarContext();
  
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;
  const isChildActive = item.children?.some(child => child.path === location.pathname);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      closeMobile();
    }
  };

  const content = (
    <>
      <Icon className={cn(
        "h-5 w-5 shrink-0",
        isCollapsed && level === 0 ? "mx-auto" : ""
      )} />
      {(!isCollapsed || level > 0) && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span className="ml-1">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </>
      )}
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    level > 0 && "ml-4 pl-6 text-xs",
    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
    isChildActive && !isActive && "text-sidebar-primary",
    isCollapsed && level === 0 && "justify-center px-2"
  );

  return (
    <div>
      {item.path ? (
        <Link
          to={item.path}
          className={baseClasses}
          onClick={handleClick}
        >
          {content}
        </Link>
      ) : (
        <button
          className={cn(baseClasses, "w-full")}
          onClick={handleClick}
        >
          {content}
        </button>
      )}
      
      {hasChildren && isOpen && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarModuleGroupProps {
  item: NavItem;
}

function SidebarModuleGroup({ item }: SidebarModuleGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isCollapsed } = useSidebarContext();
  
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const isChildActive = item.children?.some(child => child.path === location.pathname);
  const moduleColor = item.module ? moduleColors[item.module] : '';

  if (isCollapsed) {
    return (
      <div className="relative group">
        <button
          className={cn(
            "flex items-center justify-center w-full rounded-lg p-2.5 transition-all duration-200",
            "hover:bg-sidebar-accent",
            isChildActive && "bg-sidebar-accent"
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
        {/* Tooltip for collapsed state */}
        <div className="absolute left-full ml-2 top-0 z-50 hidden group-hover:block">
          <div className="rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg border whitespace-nowrap">
            {item.label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isChildActive && "text-sidebar-primary"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border",
          moduleColor
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="flex-1 text-left">{item.label}</span>
        {item.children && item.children.some(c => c.badge) && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
            {item.children.reduce((acc, c) => acc + (c.badge || 0), 0)}
          </span>
        )}
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="ml-4 space-y-0.5 border-l border-sidebar-border pl-4">
          {item.children?.map((child) => (
            <NavItemComponent key={child.id} item={child} level={1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced ModuleNavItem with dropdown support and multiple matching strategies
function ModuleNavItem({ module }: { module: ActiveModule }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isCollapsed, closeMobile } = useSidebarContext();
  
  const Icon = iconMap[module.icon] || DefaultIcon;
  const basePath = `/app${module.routeBase}`;
  const isActive = location.pathname.startsWith(basePath);
  const moduleColor = moduleColors[module.slug] || moduleColors[module.sidebarGroup] || '';

  // Debug: log the module to see what we're getting from the backend
  console.log('Module from backend:', module);

  // Get feature routes for this module - try multiple matching strategies
  let featureRoutes = [];
  
  // Strategy 1: Direct match by slug
  if (moduleFeatureRoutes[module.slug]) {
    featureRoutes = moduleFeatureRoutes[module.slug];
    console.log(`Found routes for slug ${module.slug}:`, featureRoutes.length);
  }
  // Strategy 2: Try lowercase slug
  else if (moduleFeatureRoutes[module.slug.toLowerCase()]) {
    featureRoutes = moduleFeatureRoutes[module.slug.toLowerCase()];
    console.log(`Found routes for lowercase slug ${module.slug.toLowerCase()}:`, featureRoutes.length);
  }
  // Strategy 3: Check if it's a core/system module
  else if (module.slug.includes('core') || module.slug.includes('system')) {
    featureRoutes = moduleFeatureRoutes['system'] || [];
    console.log('Using system routes for core module');
  }
  // Strategy 4: Check by sidebarGroup
  else if (moduleFeatureRoutes[module.sidebarGroup]) {
    featureRoutes = moduleFeatureRoutes[module.sidebarGroup];
    console.log(`Found routes for sidebarGroup ${module.sidebarGroup}:`, featureRoutes.length);
  }
  // Strategy 5: Try to match based on module category
  else {
    // Check common mappings
    const categoryMap: Record<string, string> = {
      'crm': 'crm',
      'customer': 'crm',
      'contact': 'crm',
      'financial': 'finance',
      'accounting': 'finance',
      'people': 'hr',
      'human-resources': 'hr',
      'staff': 'hr',
      'selling': 'sales',
      'pipeline': 'sales',
      'stock': 'inventory',
      'warehouse': 'inventory',
      'product': 'inventory',
      'purchasing': 'procurement',
      'supplier': 'procurement',
      'production': 'manufacturing',
      'workshop': 'manufacturing',
      'project': 'projects',
      'task': 'projects',
      'report': 'reporting',
      'analytics': 'reporting',
      'point-of-sale': 'pos',
      'retail': 'pos',
      'executive': 'executive',
      'dashboard': 'executive',
      'security': 'security',
      'permission': 'security',
    };
    
    const matchedCategory = categoryMap[module.slug] || categoryMap[module.sidebarGroup];
    if (matchedCategory && moduleFeatureRoutes[matchedCategory]) {
      featureRoutes = moduleFeatureRoutes[matchedCategory];
      console.log(`Found routes via category mapping for ${module.slug} -> ${matchedCategory}:`, featureRoutes.length);
    }
  }
  
  // Filter features based on enabledFeatures from backend (if available)
  const availableRoutes = module.enabledFeatures?.length 
    ? featureRoutes.filter(route => module.enabledFeatures?.includes(route.feature))
    : featureRoutes;

  const hasDropdown = availableRoutes.length > 0;
  console.log(`Module ${module.name} (${module.slug}) has ${availableRoutes.length} dropdown items`);

  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown && !isCollapsed) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      closeMobile();
    }
  };

  if (isCollapsed) {
    return (
      <div className="relative group">
        <Link
          to={basePath}
          onClick={closeMobile}
          className={cn(
            "flex items-center justify-center w-full rounded-lg p-2.5 transition-all duration-200",
            "hover:bg-sidebar-accent",
            isActive && "bg-sidebar-accent"
          )}
        >
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isActive ? moduleColor : ''
          )}>
            <Icon className="h-4 w-4" />
          </div>
        </Link>
        {/* Tooltip for collapsed state */}
        <div className="absolute left-full ml-2 top-0 z-50 hidden group-hover:block">
          <div className="rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg border whitespace-nowrap">
            {module.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Link
        to={basePath}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border",
          moduleColor,
          isActive && 'border-transparent'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="flex-1 truncate">{module.name}</span>
        {module.status === 'trial' && (
          <span className="text-xs text-amber-500">Trial</span>
        )}
        {hasDropdown && (
          <span className="ml-1">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </Link>
      
      {/* Dropdown items */}
      {hasDropdown && isOpen && (
        <div className="ml-4 space-y-0.5 border-l border-sidebar-border pl-4">
          {availableRoutes.map((route) => {
            const fullPath = `/app${route.path}`;
            const isChildActive = location.pathname === fullPath;
            
            return (
              <Link
                key={route.feature}
                to={fullPath}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isChildActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <span className="truncate">{route.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ERPSidebar() {
  const { user } = useAuth();
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarContext();
  const [activeModules, setActiveModules] = useState<ActiveModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const staticNavigation = user ? getNavigationForRole(user.roles?.[0]?.name || 'user') : [];

  useEffect(() => {
    loadActiveModules();
  }, []);

  const loadActiveModules = async () => {
    try {
      setIsLoading(true);
      const modules = await modulesApi.getActiveModules();
      // Sort modules by displayOrder
      const sortedModules = [...modules].sort((a, b) => a.displayOrder - b.displayOrder);
      setActiveModules(sortedModules);
    } catch (error) {
      console.error('Failed to load active modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group modules by sidebarGroup
  const groupedModules = activeModules.reduce((acc, module) => {
    const group = module.sidebarGroup || 'main';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(module);
    return acc;
  }, {} as Record<string, ActiveModule[]>);

  // Define group order and labels
  const groupOrder = ['main', 'financial', 'hr', 'sales', 'operations', 'security', 'admin', 'reports'];
  const groupLabels: Record<string, string> = {
    main: 'Main',
    financial: 'Financial',
    hr: 'Human Resources',
    sales: 'Sales & CRM',
    operations: 'Operations',
    security: 'Security & Compliance',
    admin: 'Administration',
    reports: 'Reports & Analytics',
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          isCollapsed && "justify-center px-2"
        )}>
          {isCollapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">E</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-accent-foreground">EnterprisePro</h1>
                <p className="text-xs text-sidebar-foreground/60">ERP System</p>
              </div>
            </div>
          )}
          
          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            className="ml-auto lg:hidden p-2 hover:bg-sidebar-accent rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          <div className="space-y-4">
            {/* Static navigation items (Dashboard, Reports, Settings, etc.) */}
            {staticNavigation.length > 0 && (
              <div className="space-y-1">
                {staticNavigation.map((item) => (
                  item.children && item.children.length > 0 ? (
                    <SidebarModuleGroup key={item.id} item={item} />
                  ) : (
                    <NavItemComponent key={item.id} item={item} />
                  )
                ))}
              </div>
            )}

            {/* Loading state for modules */}
            {isLoading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground/50" />
              </div>
            )}

            {/* Dynamic modules from backend */}
            {!isLoading && activeModules.length > 0 && (
              <div className="space-y-3">
                {groupOrder.map(group => {
                  const modules = groupedModules[group];
                  if (!modules || modules.length === 0) return null;
                  
                  return (
                    <div key={group} className="space-y-1">
                      {!isCollapsed && (
                        <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                          {groupLabels[group] || group}
                        </h4>
                      )}
                      {modules.map(module => (
                        <ModuleNavItem key={module.id} module={module} />
                      ))}
                    </div>
                  );
                })}

                {/* Show modules in groups not in order */}
                {Object.entries(groupedModules)
                  .filter(([group]) => !groupOrder.includes(group))
                  .map(([group, modules]) => (
                    <div key={group} className="space-y-1">
                      {!isCollapsed && (
                        <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                          {groupLabels[group] || group}
                        </h4>
                      )}
                      {modules.map(module => (
                        <ModuleNavItem key={module.id} module={module} />
                      ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </nav>
        
        {/* User info at bottom (collapsed shows only avatar) */}
        {user && (
          <div className={cn(
            "border-t border-sidebar-border p-3",
            isCollapsed && "flex justify-center"
          )}>
            {isCollapsed ? (
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt={user.displayName || user.firstName}
                className="h-9 w-9 rounded-full ring-2 ring-sidebar-border"
              />
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-sidebar-muted px-3 py-2">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.displayName || user.firstName}
                  className="h-9 w-9 rounded-full ring-2 ring-sidebar-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                    {user.displayName || `${user.firstName} ${user.lastName}`}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize truncate">
                    {user.roles?.[0]?.name || 'User'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}