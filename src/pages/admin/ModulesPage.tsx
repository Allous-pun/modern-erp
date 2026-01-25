import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  DollarSign, Users, Target, ShoppingBag, Package, FolderKanban,
  Settings, CheckCircle, XCircle, AlertCircle, Zap, Database,
  Clock, TrendingUp
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'inactive' | 'coming_soon';
  version: string;
  lastUpdated: string;
  features: string[];
  usage: {
    users: number;
    transactions: number;
    storage: string;
  };
}

const mockModules: Module[] = [
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Complete financial management including GL, AP/AR, budgeting, and financial reporting',
    icon: DollarSign,
    status: 'active',
    version: '2.5.0',
    lastUpdated: '2024-01-15',
    features: ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Budgeting', 'Financial Reports'],
    usage: { users: 15, transactions: 12450, storage: '2.3 GB' },
  },
  {
    id: 'hr',
    name: 'HR & Payroll',
    description: 'Human resource management, employee records, payroll processing, and attendance tracking',
    icon: Users,
    status: 'active',
    version: '2.3.1',
    lastUpdated: '2024-01-10',
    features: ['Employee Management', 'Payroll', 'Leave Management', 'Performance Reviews', 'Recruitment'],
    usage: { users: 8, transactions: 5620, storage: '1.8 GB' },
  },
  {
    id: 'sales',
    name: 'Sales & CRM',
    description: 'Customer relationship management, sales pipeline, quotations, and order management',
    icon: Target,
    status: 'active',
    version: '2.4.2',
    lastUpdated: '2024-01-20',
    features: ['Lead Management', 'Opportunity Tracking', 'Quotations', 'Sales Orders', 'Customer Portal'],
    usage: { users: 20, transactions: 8920, storage: '3.1 GB' },
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Purchase management, supplier relationships, requisitions, and goods receiving',
    icon: ShoppingBag,
    status: 'active',
    version: '2.2.0',
    lastUpdated: '2024-01-05',
    features: ['Supplier Management', 'Purchase Requisitions', 'Purchase Orders', 'GRN', 'Quality Control'],
    usage: { users: 6, transactions: 3450, storage: '1.2 GB' },
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    description: 'Stock control, warehouse management, inventory tracking, and reorder automation',
    icon: Package,
    status: 'active',
    version: '2.1.3',
    lastUpdated: '2024-01-08',
    features: ['Item Management', 'Stock Tracking', 'Warehouse Management', 'Stock Movements', 'Reorder Rules'],
    usage: { users: 10, transactions: 15680, storage: '4.5 GB' },
  },
  {
    id: 'projects',
    name: 'Project Management',
    description: 'Project planning, task management, resource allocation, and time tracking',
    icon: FolderKanban,
    status: 'active',
    version: '2.0.5',
    lastUpdated: '2024-01-12',
    features: ['Project Planning', 'Task Management', 'Timesheets', 'Resource Planning', 'Milestones'],
    usage: { users: 35, transactions: 22340, storage: '2.8 GB' },
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production planning, BOM management, work orders, and quality control',
    icon: Settings,
    status: 'inactive',
    version: '1.8.0',
    lastUpdated: '2023-11-20',
    features: ['BOM Management', 'Work Orders', 'Production Planning', 'Quality Control', 'Cost Tracking'],
    usage: { users: 0, transactions: 0, storage: '0 GB' },
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Business intelligence, custom dashboards, predictive analytics, and data visualization',
    icon: TrendingUp,
    status: 'coming_soon',
    version: '0.0.0',
    lastUpdated: 'Coming Q2 2024',
    features: ['Custom Dashboards', 'Predictive Analytics', 'Data Visualization', 'Report Builder', 'AI Insights'],
    usage: { users: 0, transactions: 0, storage: '0 GB' },
  },
];

export function ModulesPage() {
  const [modules, setModules] = useState(mockModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleToggleModule = (moduleId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId && m.status !== 'coming_soon') {
        return { ...m, status: m.status === 'active' ? 'inactive' : 'active' };
      }
      return m;
    }));
  };

  const openConfig = (module: Module) => {
    setSelectedModule(module);
    setIsConfigDialogOpen(true);
  };

  const getStatusBadge = (status: Module['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="mr-1 h-3 w-3" />Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"><XCircle className="mr-1 h-3 w-3" />Inactive</Badge>;
      case 'coming_soon':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="mr-1 h-3 w-3" />Coming Soon</Badge>;
    }
  };

  const activeModules = modules.filter(m => m.status === 'active').length;
  const totalUsers = modules.reduce((sum, m) => sum + m.usage.users, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modules"
        description="Manage and configure ERP modules for your organization"
      />

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeModules}/{modules.length}</p>
                <p className="text-sm text-muted-foreground">Active Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Module Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">15.7 GB</p>
                <p className="text-sm text-muted-foreground">Total Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">68.5K</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className={module.status === 'coming_soon' ? 'opacity-75' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      module.status === 'active' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${module.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(module.status)}
                        {module.status !== 'coming_soon' && (
                          <span className="text-xs text-muted-foreground">v{module.version}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {module.status !== 'coming_soon' && (
                    <Switch
                      checked={module.status === 'active'}
                      onCheckedChange={() => handleToggleModule(module.id)}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{module.description}</p>
                
                {module.status !== 'coming_soon' && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Features</span>
                        <span>{module.features.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {module.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                        {module.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{module.features.length - 3} more</Badge>
                        )}
                      </div>
                    </div>

                    {module.status === 'active' && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active Users</span>
                          <span className="font-medium">{module.usage.users}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Storage Used</span>
                          <span className="font-medium">{module.usage.storage}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-2 pt-2">
                  {module.status !== 'coming_soon' ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openConfig(module)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedModule && <selectedModule.icon className="h-5 w-5" />}
              {selectedModule?.name} Configuration
            </DialogTitle>
            <DialogDescription>
              Manage settings and features for this module
            </DialogDescription>
          </DialogHeader>
          {selectedModule && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Module Features</h4>
                <div className="space-y-2">
                  {selectedModule.features.map((feature) => (
                    <div key={feature} className="flex items-center justify-between rounded-lg border p-3">
                      <span>{feature}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Usage Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selectedModule.usage.users}</p>
                    <p className="text-xs text-muted-foreground">Active Users</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selectedModule.usage.transactions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selectedModule.usage.storage}</p>
                    <p className="text-xs text-muted-foreground">Storage</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Version Info</h4>
                <div className="rounded-lg border p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Version</span>
                    <span className="font-medium">v{selectedModule.version}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{selectedModule.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>Close</Button>
            <Button onClick={() => setIsConfigDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
