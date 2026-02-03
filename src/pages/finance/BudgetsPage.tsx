import React, { useState } from 'react';
import { 
  PiggyBank, Plus, Search, Filter, TrendingUp, TrendingDown,
  MoreHorizontal, Eye, Edit, Copy, AlertTriangle, CheckCircle
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Budget {
  id: string;
  name: string;
  department: string;
  period: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: 'on_track' | 'at_risk' | 'over_budget' | 'under_utilized';
}

const budgets: Budget[] = [
  { id: '1', name: 'Marketing Campaign Q1', department: 'Marketing', period: 'Q1 2024', allocated: 50000, spent: 42500, remaining: 7500, status: 'at_risk' },
  { id: '2', name: 'IT Infrastructure', department: 'IT', period: 'FY 2024', allocated: 150000, spent: 45000, remaining: 105000, status: 'on_track' },
  { id: '3', name: 'R&D Projects', department: 'Engineering', period: 'FY 2024', allocated: 200000, spent: 78000, remaining: 122000, status: 'on_track' },
  { id: '4', name: 'HR & Training', department: 'Human Resources', period: 'FY 2024', allocated: 75000, spent: 32000, remaining: 43000, status: 'under_utilized' },
  { id: '5', name: 'Sales Initiatives', department: 'Sales', period: 'Q1 2024', allocated: 100000, spent: 105000, remaining: -5000, status: 'over_budget' },
  { id: '6', name: 'Operations', department: 'Operations', period: 'FY 2024', allocated: 180000, spent: 89000, remaining: 91000, status: 'on_track' },
  { id: '7', name: 'Customer Support', department: 'Support', period: 'FY 2024', allocated: 60000, spent: 28000, remaining: 32000, status: 'on_track' },
  { id: '8', name: 'Office Expenses', department: 'Admin', period: 'FY 2024', allocated: 40000, spent: 38500, remaining: 1500, status: 'at_risk' },
];

const monthlyTrend = [
  { name: 'Oct', allocated: 85000, spent: 72000 },
  { name: 'Nov', allocated: 85000, spent: 78000 },
  { name: 'Dec', allocated: 90000, spent: 95000 },
  { name: 'Jan', allocated: 95000, spent: 88000 },
];

const departmentAllocation = [
  { name: 'Engineering', value: 25 },
  { name: 'Marketing', value: 18 },
  { name: 'Sales', value: 15 },
  { name: 'Operations', value: 20 },
  { name: 'IT', value: 12 },
  { name: 'Other', value: 10 },
];

const formatCurrency = (amount: number) => {
  const prefix = amount < 0 ? '-' : '';
  return `${prefix}$${Math.abs(amount).toLocaleString()}`;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  on_track: { label: 'On Track', color: 'text-status-success bg-status-success/10', icon: CheckCircle },
  at_risk: { label: 'At Risk', color: 'text-status-warning bg-status-warning/10', icon: AlertTriangle },
  over_budget: { label: 'Over Budget', color: 'text-status-error bg-status-error/10', icon: TrendingUp },
  under_utilized: { label: 'Under Utilized', color: 'text-blue-500 bg-blue-500/10', icon: TrendingDown },
};

export function BudgetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const stats = {
    totalAllocated: budgets.reduce((sum, b) => sum + b.allocated, 0),
    totalSpent: budgets.reduce((sum, b) => sum + b.spent, 0),
    atRisk: budgets.filter(b => b.status === 'at_risk').length,
    overBudget: budgets.filter(b => b.status === 'over_budget').length,
  };

  const overallUtilization = Math.round((stats.totalSpent / stats.totalAllocated) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Plan, allocate, and track departmental budgets"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Budgets' },
        ]}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Budget Name</Label>
                  <Input placeholder="e.g., Marketing Q2 2024" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1-2024">Q1 2024</SelectItem>
                        <SelectItem value="q2-2024">Q2 2024</SelectItem>
                        <SelectItem value="h1-2024">H1 2024</SelectItem>
                        <SelectItem value="fy-2024">FY 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Allocated Amount</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Budget purpose and goals" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create Budget</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Allocated</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalAllocated)}</p>
            <p className="text-xs text-muted-foreground mt-1">FY 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Utilization</span>
                <span className="font-medium">{overallUtilization}%</span>
              </div>
              <Progress value={overallUtilization} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold">{stats.atRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-error/10">
                <TrendingUp className="h-5 w-5 text-status-error" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Over Budget</p>
                <p className="text-2xl font-bold">{stats.overBudget}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Budget vs Actual Spending"
          subtitle="Last 4 months"
          type="bar"
          data={monthlyTrend}
          className="lg:col-span-2"
          colors={['hsl(var(--primary))', 'hsl(var(--muted-foreground))']}
        />
        <ChartWidget
          title="Allocation by Department"
          type="pie"
          data={departmentAllocation}
          showLegend
          height={250}
        />
      </div>

      {/* Budget List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Budgets</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search budgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {budgets.map((budget) => {
              const StatusIcon = statusConfig[budget.status].icon;
              const utilization = Math.round((budget.spent / budget.allocated) * 100);
              
              return (
                <Card key={budget.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{budget.name}</h3>
                        <p className="text-sm text-muted-foreground">{budget.department} • {budget.period}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Spent</span>
                        <span className="font-mono font-medium">{formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}</span>
                      </div>
                      
                      <div>
                        <Progress 
                          value={Math.min(utilization, 100)} 
                          className={`h-2 ${budget.status === 'over_budget' ? '[&>div]:bg-status-error' : budget.status === 'at_risk' ? '[&>div]:bg-status-warning' : ''}`}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={statusConfig[budget.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[budget.status].label}
                        </Badge>
                        <span className={`text-sm font-medium ${budget.remaining < 0 ? 'text-status-error' : 'text-muted-foreground'}`}>
                          {formatCurrency(budget.remaining)} remaining
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
