// User and Role Types
export type UserRole = 
  | 'admin'
  | 'executive'
  | 'finance'
  | 'hr'
  | 'sales'
  | 'procurement'
  | 'inventory'
  | 'manufacturing'
  | 'project'
  | 'employee'
  | 'customer'
  | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  title?: string;
  lastLogin?: Date;
  isActive: boolean;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  badge?: number;
  children?: NavItem[];
  roles?: UserRole[];
  module?: ModuleType;
}

export type ModuleType = 
  | 'finance'
  | 'hr'
  | 'sales'
  | 'procurement'
  | 'inventory'
  | 'manufacturing'
  | 'projects'
  | 'admin';

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'table' | 'list' | 'calendar' | 'timeline';
  size: 'small' | 'medium' | 'large' | 'full';
  data?: any;
  module?: ModuleType;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
  module?: ModuleType;
}

// Status Types
export type StatusType = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'draft' | 'cancelled';

// Finance Types
export interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  currency: string;
  status: StatusType;
  dueDate: Date;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  date: Date;
  account: string;
}

// HR Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  title: string;
  hireDate: Date;
  status: 'active' | 'on_leave' | 'terminated';
  manager?: string;
  phone?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: Date;
  endDate: Date;
  status: StatusType;
  reason?: string;
}

// Sales Types
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  value: number;
  source: string;
  createdAt: Date;
}

export interface SalesOrder {
  id: string;
  number: string;
  customer: string;
  items: number;
  total: number;
  status: StatusType;
  createdAt: Date;
}

// Procurement Types
export interface PurchaseOrder {
  id: string;
  number: string;
  vendor: string;
  items: number;
  total: number;
  status: StatusType;
  expectedDate: Date;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
}

// Inventory Types
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  location: string;
  lastUpdated: Date;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  progress: number;
  startDate: Date;
  endDate: Date;
  manager: string;
  budget: number;
  team: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: StatusType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate: Date;
}
