import React, { useState, useEffect } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Shield, Users, Settings, Edit, Trash2, Copy,
  Eye, FileText, CreditCard, UserCog, Package, FolderKanban,
  Loader2, RefreshCw, Save
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface Permission {
  _id: string;
  name: string;
  description: string;
  module: string;
  resource: string;
  action: string;
}

interface Role {
  _id: string;
  name: string;
  description: string;
  category: 'system' | 'executive' | 'finance' | 'hr' | 'sales' | 'procurement' | 'manufacturing' | 'projects' | 'operations' | 'external';
  permissions: Permission[];
  isDefault: boolean;
  isActive: boolean;
  hierarchy: number;
  usersCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  name: string;
  icon: any;
  color?: string;
}

const modules: Module[] = [
  { id: 'system', name: 'System', icon: Settings },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'executive', name: 'Executive', icon: Users },
  { id: 'finance', name: 'Finance', icon: CreditCard },
  { id: 'hr', name: 'HR & Payroll', icon: Users },
  { id: 'sales', name: 'Sales & CRM', icon: FileText },
  { id: 'crm', name: 'CRM', icon: Users },
  { id: 'marketing', name: 'Marketing', icon: FileText },
  { id: 'support', name: 'Support', icon: Eye },
  { id: 'procurement', name: 'Procurement', icon: Package },
  { id: 'inventory', name: 'Inventory', icon: Package },
  { id: 'manufacturing', name: 'Manufacturing', icon: Settings },
  { id: 'projects', name: 'Projects', icon: FolderKanban },
  { id: 'operations', name: 'Operations', icon: Settings },
  { id: 'pos', name: 'Point of Sale', icon: CreditCard },
  { id: 'analytics', name: 'Analytics', icon: FileText },
  { id: 'external', name: 'External', icon: Users },
];

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<Set<string>>(new Set());
  
  // New role form state
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    category: 'custom' as string,
  });

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  useEffect(() => {
    if (permissions.length > 0) {
      // Group permissions by module
      const grouped = permissions.reduce((acc, permission) => {
        const module = permission.module || 'other';
        if (!acc[module]) {
          acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
      }, {} as Record<string, Permission[]>);
      
      setGroupedPermissions(grouped);
    }
  }, [permissions]);

  const fetchRolesAndPermissions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch roles
      const rolesResponse = await apiClient.get('/roles');
      const rolesData = rolesResponse.data.data;
      setRoles(rolesData);
      
      // Get all permissions from roles
      const allPermissions = rolesData.flatMap((role: Role) => role.permissions || []);
      // Deduplicate permissions by _id
      const uniquePermissions = Array.from(
        new Map(allPermissions.map((p: Permission) => [p._id, p])).values()
      );
      setPermissions(uniquePermissions);
      
      if (rolesData.length > 0) {
        setSelectedRole(rolesData[0]);
        setEditedPermissions(new Set(rolesData[0].permissions.map((p: Permission) => p._id)));
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return;
    
    const newPermissions = new Set(editedPermissions);
    if (newPermissions.has(permissionId)) {
      newPermissions.delete(permissionId);
    } else {
      newPermissions.add(permissionId);
    }
    setEditedPermissions(newPermissions);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    
    try {
      setIsSaving(true);
      
      // Convert Set to Array of permission IDs
      const permissionIds = Array.from(editedPermissions);
      
      // Update role permissions via API
      await apiClient.put(`/roles/${selectedRole._id}`, {
        permissions: permissionIds
      });
      
      toast.success('Role permissions updated successfully');
      
      // Refresh roles
      await fetchRolesAndPermissions();
    } catch (error) {
      console.error('Failed to update role permissions:', error);
      toast.error('Failed to update role permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name) {
      toast.error('Role name is required');
      return;
    }
    
    try {
      setIsSaving(true);
      
      await apiClient.post('/roles', {
        name: newRole.name,
        description: newRole.description || undefined,
        category: newRole.category,
        permissions: []
      });
      
      toast.success('Role created successfully');
      
      // Reset form and close dialog
      setNewRole({ name: '', description: '', category: 'custom' });
      setIsAddDialogOpen(false);
      
      // Refresh roles
      await fetchRolesAndPermissions();
    } catch (error: any) {
      console.error('Failed to create role:', error);
      toast.error(error.response?.data?.message || 'Failed to create role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    try {
      setIsSaving(true);
      
      await apiClient.delete(`/roles/${selectedRole._id}`);
      
      toast.success('Role deleted successfully');
      
      // Refresh roles
      await fetchRolesAndPermissions();
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to delete role:', error);
      toast.error(error.response?.data?.message || 'Failed to delete role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicateRole = async () => {
    if (!selectedRole) return;
    
    try {
      setIsSaving(true);
      
      await apiClient.post('/roles', {
        name: `${selectedRole.name} (Copy)`,
        description: selectedRole.description,
        category: selectedRole.category,
        permissions: selectedRole.permissions.map(p => p._id)
      });
      
      toast.success('Role duplicated successfully');
      
      // Refresh roles
      await fetchRolesAndPermissions();
    } catch (error: any) {
      console.error('Failed to duplicate role:', error);
      toast.error(error.response?.data?.message || 'Failed to duplicate role');
    } finally {
      setIsSaving(false);
    }
  };

  const getModuleIcon = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.icon || Shield;
  };

  const getModuleName = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.name || moduleId;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      system: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      executive: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      finance: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      hr: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      sales: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      procurement: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      manufacturing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      projects: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      operations: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
      external: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and their access permissions"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchRolesAndPermissions} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
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
                    <Label htmlFor="roleName">Role Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="roleName" 
                      placeholder="e.g., Project Manager" 
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleDesc">Description</Label>
                    <Textarea 
                      id="roleDesc" 
                      placeholder="Describe the role's purpose and responsibilities"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newRole.category}
                      onChange={(e) => setNewRole({ ...newRole, category: e.target.value })}
                    >
                      <option value="custom">Custom</option>
                      <option value="system">System</option>
                      <option value="executive">Executive</option>
                      <option value="finance">Finance</option>
                      <option value="hr">Human Resources</option>
                      <option value="sales">Sales</option>
                      <option value="procurement">Procurement</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="projects">Projects</option>
                      <option value="operations">Operations</option>
                      <option value="external">External</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Role'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Roles</CardTitle>
            <CardDescription>{roles.length} roles defined</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-2">
                  {roles.map((role) => (
                    <button
                      key={role._id}
                      onClick={() => {
                        setSelectedRole(role);
                        setEditedPermissions(new Set(role.permissions.map(p => p._id)));
                      }}
                      className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                        selectedRole?._id === role._id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <Badge className={getCategoryColor(role.category)}>
                          {role.category}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{role.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {role.usersCount || 0} users
                        </span>
                        <span>{role.permissions?.length || 0} permissions</span>
                        {role.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
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
              {selectedRole && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDuplicateRole}
                    disabled={isSaving}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSavePermissions}
                    disabled={isSaving || editedPermissions.size === selectedRole.permissions.length}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                  {!selectedRole.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={isSaving}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : selectedRole ? (
              <Tabs defaultValue={Object.keys(groupedPermissions)[0] || 'system'} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                  {Object.keys(groupedPermissions).slice(0, 6).map((moduleId) => (
                    <TabsTrigger key={moduleId} value={moduleId} className="text-xs">
                      {getModuleName(moduleId)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(groupedPermissions).map(([moduleId, modulePermissions]) => (
                  <TabsContent key={moduleId} value={moduleId} className="mt-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {modulePermissions.map((permission) => (
                          <div key={permission._id} className="flex items-start space-x-3 rounded-lg border p-4">
                            <Checkbox 
                              id={permission._id} 
                              checked={editedPermissions.has(permission._id)}
                              onCheckedChange={() => handlePermissionToggle(permission._id)}
                            />
                            <div className="space-y-1">
                              <label
                                htmlFor={permission._id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.name}
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {permission.description || `${permission.resource}_${permission.action}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              "{selectedRole?.name}" and remove it from all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole}
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}