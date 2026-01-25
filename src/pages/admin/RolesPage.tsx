import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, Shield, Users, Settings, Edit, Trash2, Copy,
  Eye, FileText, CreditCard, UserCog, Package, FolderKanban
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

const modules = [
  { id: 'finance', name: 'Finance', icon: CreditCard },
  { id: 'hr', name: 'HR & Payroll', icon: Users },
  { id: 'sales', name: 'Sales & CRM', icon: FileText },
  { id: 'procurement', name: 'Procurement', icon: Package },
  { id: 'inventory', name: 'Inventory', icon: Package },
  { id: 'projects', name: 'Projects', icon: FolderKanban },
  { id: 'admin', name: 'Administration', icon: Settings },
];

const permissions: Permission[] = [
  // Finance
  { id: 'finance.view', name: 'View Finance', description: 'View financial data and reports', module: 'finance' },
  { id: 'finance.create', name: 'Create Transactions', description: 'Create invoices, payments, expenses', module: 'finance' },
  { id: 'finance.edit', name: 'Edit Transactions', description: 'Modify financial records', module: 'finance' },
  { id: 'finance.delete', name: 'Delete Transactions', description: 'Remove financial records', module: 'finance' },
  { id: 'finance.approve', name: 'Approve Transactions', description: 'Approve financial transactions', module: 'finance' },
  // HR
  { id: 'hr.view', name: 'View HR Data', description: 'View employee information', module: 'hr' },
  { id: 'hr.create', name: 'Create Employees', description: 'Add new employees', module: 'hr' },
  { id: 'hr.edit', name: 'Edit Employees', description: 'Modify employee records', module: 'hr' },
  { id: 'hr.payroll', name: 'Manage Payroll', description: 'Process payroll and benefits', module: 'hr' },
  { id: 'hr.leave', name: 'Approve Leave', description: 'Approve leave requests', module: 'hr' },
  // Sales
  { id: 'sales.view', name: 'View Sales', description: 'View sales data and pipeline', module: 'sales' },
  { id: 'sales.create', name: 'Create Leads', description: 'Add new leads and opportunities', module: 'sales' },
  { id: 'sales.edit', name: 'Edit Sales Data', description: 'Modify sales records', module: 'sales' },
  { id: 'sales.orders', name: 'Manage Orders', description: 'Create and manage sales orders', module: 'sales' },
  // Procurement
  { id: 'procurement.view', name: 'View Procurement', description: 'View purchase orders and suppliers', module: 'procurement' },
  { id: 'procurement.create', name: 'Create POs', description: 'Create purchase orders', module: 'procurement' },
  { id: 'procurement.approve', name: 'Approve POs', description: 'Approve purchase orders', module: 'procurement' },
  // Inventory
  { id: 'inventory.view', name: 'View Inventory', description: 'View stock levels and items', module: 'inventory' },
  { id: 'inventory.manage', name: 'Manage Inventory', description: 'Adjust stock levels', module: 'inventory' },
  // Projects
  { id: 'projects.view', name: 'View Projects', description: 'View project data', module: 'projects' },
  { id: 'projects.manage', name: 'Manage Projects', description: 'Create and edit projects', module: 'projects' },
  { id: 'projects.tasks', name: 'Manage Tasks', description: 'Create and assign tasks', module: 'projects' },
  // Admin
  { id: 'admin.users', name: 'Manage Users', description: 'Create and manage users', module: 'admin' },
  { id: 'admin.roles', name: 'Manage Roles', description: 'Create and manage roles', module: 'admin' },
  { id: 'admin.settings', name: 'System Settings', description: 'Configure system settings', module: 'admin' },
  { id: 'admin.audit', name: 'View Audit Logs', description: 'Access audit trail', module: 'admin' },
];

const mockRoles: Role[] = [
  { 
    id: '1', 
    name: 'Administrator', 
    description: 'Full system access with all permissions',
    usersCount: 2,
    permissions: permissions.map(p => p.id),
    isSystem: true,
    createdAt: '2023-01-01'
  },
  { 
    id: '2', 
    name: 'Executive', 
    description: 'View access to all modules with limited edit capabilities',
    usersCount: 5,
    permissions: ['finance.view', 'hr.view', 'sales.view', 'procurement.view', 'inventory.view', 'projects.view'],
    isSystem: true,
    createdAt: '2023-01-01'
  },
  { 
    id: '3', 
    name: 'Finance Manager', 
    description: 'Full access to finance module',
    usersCount: 3,
    permissions: ['finance.view', 'finance.create', 'finance.edit', 'finance.delete', 'finance.approve'],
    isSystem: false,
    createdAt: '2023-02-15'
  },
  { 
    id: '4', 
    name: 'HR Manager', 
    description: 'Full access to HR and payroll',
    usersCount: 4,
    permissions: ['hr.view', 'hr.create', 'hr.edit', 'hr.payroll', 'hr.leave'],
    isSystem: false,
    createdAt: '2023-02-15'
  },
  { 
    id: '5', 
    name: 'Sales Representative', 
    description: 'Create and manage leads and opportunities',
    usersCount: 12,
    permissions: ['sales.view', 'sales.create', 'sales.edit'],
    isSystem: false,
    createdAt: '2023-03-10'
  },
  { 
    id: '6', 
    name: 'Employee', 
    description: 'Basic self-service access',
    usersCount: 45,
    permissions: ['projects.view', 'projects.tasks'],
    isSystem: true,
    createdAt: '2023-01-01'
  },
];

export function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(mockRoles[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getPermissionsByModule = (moduleId: string) => {
    return permissions.filter(p => p.module === moduleId);
  };

  const hasPermission = (permissionId: string) => {
    return selectedRole?.permissions.includes(permissionId) || false;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and their access permissions"
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input id="roleName" placeholder="e.g., Project Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDesc">Description</Label>
                  <Textarea id="roleDesc" placeholder="Describe the role's purpose and responsibilities" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Roles</CardTitle>
            <CardDescription>{mockRoles.length} roles defined</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-2">
                {mockRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                      selectedRole?.id === role.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      {role.isSystem && (
                        <Badge variant="secondary" className="text-xs">System</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{role.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {role.usersCount} users
                      </span>
                      <span>{role.permissions.length} permissions</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Permissions Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {selectedRole?.name || 'Select a Role'}
                </CardTitle>
                <CardDescription>{selectedRole?.description}</CardDescription>
              </div>
              {selectedRole && !selectedRole.isSystem && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <Tabs defaultValue="finance" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                  {modules.map((module) => (
                    <TabsTrigger key={module.id} value={module.id} className="text-xs">
                      {module.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {modules.map((module) => (
                  <TabsContent key={module.id} value={module.id} className="mt-4">
                    <div className="space-y-4">
                      {getPermissionsByModule(module.id).map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 rounded-lg border p-4">
                          <Checkbox 
                            id={permission.id} 
                            checked={hasPermission(permission.id)}
                            disabled={selectedRole.isSystem}
                          />
                          <div className="space-y-1">
                            <label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                      {getPermissionsByModule(module.id).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No permissions defined for this module
                        </p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Select a Role</h3>
                <p className="text-muted-foreground">Choose a role from the list to view its permissions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
