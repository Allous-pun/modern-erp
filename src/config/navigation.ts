import { NavItem, UserRole } from '@/types/erp';

export const navigationConfig: NavItem[] = [
  // Dashboard - All users
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  
  // Finance Module
  {
    id: 'finance',
    label: 'Finance',
    icon: 'DollarSign',
    module: 'finance',
    roles: ['admin', 'executive', 'finance'],
    children: [
      { id: 'finance-overview', label: 'Overview', icon: 'BarChart3', path: '/finance' },
      { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: 'FileSpreadsheet', path: '/finance/accounts' },
      { id: 'general-ledger', label: 'General Ledger', icon: 'BookOpen', path: '/finance/ledger' },
      { id: 'invoices', label: 'Invoices', icon: 'FileText', path: '/finance/invoices', badge: 5 },
      { id: 'payments', label: 'Payments', icon: 'CreditCard', path: '/finance/payments' },
      { id: 'expenses', label: 'Expenses', icon: 'Receipt', path: '/finance/expenses' },
      { id: 'budgets', label: 'Budgets', icon: 'PiggyBank', path: '/finance/budgets' },
      { id: 'reports-finance', label: 'Reports', icon: 'FileBarChart', path: '/finance/reports' },
    ],
  },
  
  // HR Module
  {
    id: 'hr',
    label: 'HR & Payroll',
    icon: 'Users',
    module: 'hr',
    roles: ['admin', 'executive', 'hr'],
    children: [
      { id: 'hr-overview', label: 'Overview', icon: 'BarChart3', path: '/hr' },
      { id: 'employees', label: 'Employees', icon: 'UserCircle', path: '/hr/employees' },
      { id: 'recruitment', label: 'Recruitment', icon: 'UserPlus', path: '/hr/recruitment', badge: 3 },
      { id: 'attendance', label: 'Attendance', icon: 'Clock', path: '/hr/attendance' },
      { id: 'leave', label: 'Leave Management', icon: 'CalendarOff', path: '/hr/leave', badge: 8 },
      { id: 'payroll', label: 'Payroll', icon: 'Wallet', path: '/hr/payroll' },
      { id: 'performance', label: 'Performance', icon: 'TrendingUp', path: '/hr/performance' },
      { id: 'training', label: 'Training', icon: 'GraduationCap', path: '/hr/training' },
    ],
  },
  
  // Sales & CRM Module
  {
    id: 'sales',
    label: 'Sales & CRM',
    icon: 'Target',
    module: 'sales',
    roles: ['admin', 'executive', 'sales'],
    children: [
      { id: 'sales-overview', label: 'Overview', icon: 'BarChart3', path: '/sales' },
      { id: 'leads', label: 'Leads', icon: 'Magnet', path: '/sales/leads', badge: 12 },
      { id: 'opportunities', label: 'Opportunities', icon: 'Briefcase', path: '/sales/opportunities' },
      { id: 'customers', label: 'Customers', icon: 'Building2', path: '/sales/customers' },
      { id: 'quotations', label: 'Quotations', icon: 'FileEdit', path: '/sales/quotations' },
      { id: 'sales-orders', label: 'Sales Orders', icon: 'ShoppingCart', path: '/sales/orders' },
      { id: 'campaigns', label: 'Campaigns', icon: 'Megaphone', path: '/sales/campaigns' },
      { id: 'support', label: 'Support Tickets', icon: 'MessageSquare', path: '/sales/support', badge: 4 },
    ],
  },
  
  // Procurement Module
  {
    id: 'procurement',
    label: 'Procurement',
    icon: 'ShoppingBag',
    module: 'procurement',
    roles: ['admin', 'executive', 'procurement', 'inventory'],
    children: [
      { id: 'procurement-overview', label: 'Overview', icon: 'BarChart3', path: '/procurement' },
      { id: 'suppliers', label: 'Suppliers', icon: 'Truck', path: '/procurement/suppliers' },
      { id: 'requisitions', label: 'Requisitions', icon: 'FileQuestion', path: '/procurement/requisitions', badge: 6 },
      { id: 'purchase-orders', label: 'Purchase Orders', icon: 'ClipboardList', path: '/procurement/orders' },
      { id: 'grn', label: 'Goods Received', icon: 'PackageCheck', path: '/procurement/grn' },
      { id: 'quality', label: 'Quality Inspection', icon: 'CheckSquare', path: '/procurement/quality' },
    ],
  },
  
  // Inventory Module
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'Package',
    module: 'inventory',
    roles: ['admin', 'executive', 'inventory', 'procurement', 'manufacturing'],
    children: [
      { id: 'inventory-overview', label: 'Overview', icon: 'BarChart3', path: '/inventory' },
      { id: 'items', label: 'Items', icon: 'Box', path: '/inventory/items' },
      { id: 'stock', label: 'Stock Levels', icon: 'Layers', path: '/inventory/stock' },
      { id: 'warehouses', label: 'Warehouses', icon: 'Warehouse', path: '/inventory/warehouses' },
      { id: 'movements', label: 'Stock Movements', icon: 'ArrowLeftRight', path: '/inventory/movements' },
      { id: 'reorder', label: 'Reorder Rules', icon: 'RefreshCcw', path: '/inventory/reorder' },
    ],
  },
  
  // Manufacturing Module
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    icon: 'Factory',
    module: 'manufacturing',
    roles: ['admin', 'executive', 'manufacturing'],
    children: [
      { id: 'manufacturing-overview', label: 'Overview', icon: 'BarChart3', path: '/manufacturing' },
      { id: 'work-orders', label: 'Work Orders', icon: 'ClipboardList', path: '/manufacturing/orders', badge: 5 },
      { id: 'bom', label: 'Bill of Materials', icon: 'Layers', path: '/manufacturing/bom' },
      { id: 'production-planning', label: 'Production Planning', icon: 'Calendar', path: '/manufacturing/planning' },
      { id: 'work-centers', label: 'Work Centers', icon: 'Settings', path: '/manufacturing/centers' },
      { id: 'quality-control', label: 'Quality Control', icon: 'CheckSquare', path: '/manufacturing/quality' },
    ],
  },
  
  // Projects Module
  {
    id: 'projects',
    label: 'Projects',
    icon: 'FolderKanban',
    module: 'projects',
    roles: ['admin', 'executive', 'project', 'employee'],
    children: [
      { id: 'projects-overview', label: 'Overview', icon: 'BarChart3', path: '/projects' },
      { id: 'project-list', label: 'All Projects', icon: 'List', path: '/projects/list' },
      { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', path: '/projects/tasks', badge: 15 },
      { id: 'timesheets', label: 'Timesheets', icon: 'Timer', path: '/projects/timesheets' },
      { id: 'resources', label: 'Resources', icon: 'Users', path: '/projects/resources' },
      { id: 'milestones', label: 'Milestones', icon: 'Flag', path: '/projects/milestones' },
    ],
  },
  
  // Reports
  {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart3',
    path: '/reports',
    roles: ['admin', 'executive', 'finance', 'hr', 'sales'],
  },
  
  // Admin Section
  {
    id: 'admin',
    label: 'Administration',
    icon: 'Settings',
    module: 'admin',
    roles: ['admin'],
    children: [
      { id: 'users', label: 'Users', icon: 'UserCog', path: '/admin/users' },
      { id: 'roles', label: 'Roles & Permissions', icon: 'Shield', path: '/admin/roles' },
      { id: 'organization', label: 'Organization', icon: 'Building', path: '/admin/organization' },
      { id: 'modules', label: 'Modules', icon: 'Puzzle', path: '/admin/modules' },
      { id: 'workflows', label: 'Workflows', icon: 'GitBranch', path: '/admin/workflows' },
      { id: 'languages', label: 'Languages', icon: 'Globe', path: '/admin/languages' },
      { id: 'audit-logs', label: 'Audit Logs', icon: 'FileSearch', path: '/admin/audit' },
      { id: 'settings', label: 'Settings', icon: 'Cog', path: '/admin/settings' },
    ],
  },
];

// Employee Self-Service Menu (Limited)
export const employeeNavigation: NavItem[] = [
  {
    id: 'my-dashboard',
    label: 'My Dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    id: 'my-profile',
    label: 'My Profile',
    icon: 'UserCircle',
    path: '/profile',
  },
  {
    id: 'my-leave',
    label: 'Leave Requests',
    icon: 'CalendarOff',
    path: '/my-leave',
  },
  {
    id: 'my-timesheet',
    label: 'Timesheet',
    icon: 'Clock',
    path: '/my-timesheet',
  },
  {
    id: 'my-tasks',
    label: 'My Tasks',
    icon: 'CheckSquare',
    path: '/my-tasks',
    badge: 5,
  },
  {
    id: 'my-payslips',
    label: 'Payslips',
    icon: 'FileText',
    path: '/my-payslips',
  },
];

// External Portal Navigation
export const portalNavigation: Record<string, NavItem[]> = {
  customer: [
    { id: 'portal-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/portal/dashboard' },
    { id: 'my-orders', label: 'My Orders', icon: 'ShoppingCart', path: '/portal/orders' },
    { id: 'my-invoices', label: 'Invoices', icon: 'FileText', path: '/portal/invoices' },
    { id: 'support-tickets', label: 'Support', icon: 'MessageSquare', path: '/portal/support' },
    { id: 'my-account', label: 'Account', icon: 'UserCircle', path: '/portal/account' },
  ],
  vendor: [
    { id: 'portal-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/portal/dashboard' },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: 'ClipboardList', path: '/portal/orders' },
    { id: 'deliveries', label: 'Deliveries', icon: 'Truck', path: '/portal/deliveries' },
    { id: 'vendor-invoices', label: 'Invoices', icon: 'FileText', path: '/portal/invoices' },
    { id: 'vendor-account', label: 'Account', icon: 'UserCircle', path: '/portal/account' },
  ],
};

// Filter navigation based on user role
export function getNavigationForRole(role: UserRole): NavItem[] {
  if (role === 'employee') {
    return employeeNavigation;
  }
  
  if (role === 'customer' || role === 'vendor') {
    return portalNavigation[role] || [];
  }
  
  return navigationConfig.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });
}
