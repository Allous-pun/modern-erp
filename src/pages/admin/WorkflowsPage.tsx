import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, GitBranch, Play, Pause, Edit, Trash2, Copy, ChevronRight,
  FileText, DollarSign, Users, ShoppingBag, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action' | 'condition';
  assignee?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  trigger: string;
  status: 'active' | 'inactive' | 'draft';
  steps: WorkflowStep[];
  executions: number;
  lastRun: string;
  createdAt: string;
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Purchase Order Approval',
    description: 'Multi-level approval workflow for purchase orders based on amount',
    module: 'Procurement',
    trigger: 'PO Created',
    status: 'active',
    steps: [
      { id: 's1', name: 'Manager Approval', type: 'approval', assignee: 'Department Manager' },
      { id: 's2', name: 'Finance Review', type: 'approval', assignee: 'Finance Manager' },
      { id: 's3', name: 'Send Notification', type: 'notification' },
    ],
    executions: 245,
    lastRun: '2 hours ago',
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    name: 'Leave Request Approval',
    description: 'Automated leave request approval with manager notification',
    module: 'HR',
    trigger: 'Leave Request Submitted',
    status: 'active',
    steps: [
      { id: 's1', name: 'Check Leave Balance', type: 'condition' },
      { id: 's2', name: 'Manager Approval', type: 'approval', assignee: 'Direct Manager' },
      { id: 's3', name: 'Update Calendar', type: 'action' },
      { id: 's4', name: 'Notify HR', type: 'notification' },
    ],
    executions: 892,
    lastRun: '30 minutes ago',
    createdAt: '2023-04-20',
  },
  {
    id: '3',
    name: 'Invoice Approval',
    description: 'Invoice approval with amount-based routing',
    module: 'Finance',
    trigger: 'Invoice Created',
    status: 'active',
    steps: [
      { id: 's1', name: 'Amount Check', type: 'condition' },
      { id: 's2', name: 'Finance Approval', type: 'approval', assignee: 'Finance Team' },
      { id: 's3', name: 'Send to Customer', type: 'action' },
    ],
    executions: 1523,
    lastRun: '1 hour ago',
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    name: 'Expense Reimbursement',
    description: 'Employee expense claim approval workflow',
    module: 'Finance',
    trigger: 'Expense Submitted',
    status: 'active',
    steps: [
      { id: 's1', name: 'Receipt Validation', type: 'condition' },
      { id: 's2', name: 'Manager Approval', type: 'approval', assignee: 'Direct Manager' },
      { id: 's3', name: 'Finance Processing', type: 'action' },
    ],
    executions: 456,
    lastRun: '4 hours ago',
    createdAt: '2023-05-22',
  },
  {
    id: '5',
    name: 'New Employee Onboarding',
    description: 'Automated onboarding workflow for new hires',
    module: 'HR',
    trigger: 'Employee Created',
    status: 'inactive',
    steps: [
      { id: 's1', name: 'Create Accounts', type: 'action' },
      { id: 's2', name: 'Assign Equipment', type: 'action' },
      { id: 's3', name: 'Schedule Orientation', type: 'action' },
      { id: 's4', name: 'Notify Team', type: 'notification' },
    ],
    executions: 34,
    lastRun: '1 week ago',
    createdAt: '2023-07-01',
  },
  {
    id: '6',
    name: 'Sales Quote Approval',
    description: 'Discount approval workflow for sales quotations',
    module: 'Sales',
    trigger: 'Quote with Discount',
    status: 'draft',
    steps: [
      { id: 's1', name: 'Check Discount Level', type: 'condition' },
      { id: 's2', name: 'Sales Manager Approval', type: 'approval', assignee: 'Sales Manager' },
    ],
    executions: 0,
    lastRun: 'Never',
    createdAt: '2024-01-10',
  },
];

const modules = ['All', 'Finance', 'HR', 'Sales', 'Procurement', 'Inventory'];

export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [filterModule, setFilterModule] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredWorkflows = filterModule === 'All' 
    ? workflows 
    : workflows.filter(w => w.module === filterModule);

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        const newStatus = w.status === 'active' ? 'inactive' : 'active';
        return { ...w, status: newStatus };
      }
      return w;
    }));
  };

  const getStatusBadge = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="mr-1 h-3 w-3" />Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"><Pause className="mr-1 h-3 w-3" />Inactive</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="mr-1 h-3 w-3" />Draft</Badge>;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Finance': return DollarSign;
      case 'HR': return Users;
      case 'Procurement': return ShoppingBag;
      case 'Sales': return FileText;
      default: return GitBranch;
    }
  };

  const getStepTypeBadge = (type: WorkflowStep['type']) => {
    const styles = {
      approval: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      notification: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      action: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      condition: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return <Badge className={styles[type]} variant="outline">{type}</Badge>;
  };

  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Design and manage automated business workflows"
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>Design an automated workflow for your business processes</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Workflow Name</Label>
                  <Input placeholder="e.g., Contract Approval" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what this workflow does" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Module</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.filter(m => m !== 'All').map(m => (
                          <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created">Record Created</SelectItem>
                        <SelectItem value="updated">Record Updated</SelectItem>
                        <SelectItem value="status_change">Status Changed</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Create Workflow</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workflows.length}</p>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeWorkflows}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExecutions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Executions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'draft').length}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {modules.map(module => (
          <Button
            key={module}
            variant={filterModule === module ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterModule(module)}
          >
            {module}
          </Button>
        ))}
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => {
          const ModuleIcon = getModuleIcon(workflow.module);
          return (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <ModuleIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        {getStatusBadge(workflow.status)}
                      </div>
                      <CardDescription className="mt-1">{workflow.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Module: {workflow.module}</span>
                        <span>Trigger: {workflow.trigger}</span>
                        <span>Last run: {workflow.lastRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.status === 'active'}
                      onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                      disabled={workflow.status === 'draft'}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Workflow Steps */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Workflow Steps</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {workflow.steps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step.name}</span>
                          {getStepTypeBadge(step.type)}
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {workflow.executions.toLocaleString()} executions
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
