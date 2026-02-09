import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, MoreHorizontal, Play, Pause, CheckCircle, Eye } from 'lucide-react';

interface WorkOrder {
  id: string;
  product: string;
  bom: string;
  quantity: number;
  completed: number;
  workCenter: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  dueDate: string;
  assignee: string;
}

const mockWorkOrders: WorkOrder[] = [
  { id: 'WO-2024-001', product: 'Widget Assembly A', bom: 'BOM-001', quantity: 500, completed: 375, workCenter: 'Assembly Line 1', priority: 'high', status: 'in_progress', startDate: '2024-02-01', dueDate: '2024-02-10', assignee: 'John Smith' },
  { id: 'WO-2024-002', product: 'Component X-42', bom: 'BOM-002', quantity: 1000, completed: 450, workCenter: 'CNC Machine 3', priority: 'medium', status: 'in_progress', startDate: '2024-02-03', dueDate: '2024-02-12', assignee: 'Sarah Johnson' },
  { id: 'WO-2024-003', product: 'Module B-Series', bom: 'BOM-003', quantity: 250, completed: 225, workCenter: 'Assembly Line 2', priority: 'urgent', status: 'in_progress', startDate: '2024-02-05', dueDate: '2024-02-08', assignee: 'Mike Chen' },
  { id: 'WO-2024-004', product: 'Assembly Kit Pro', bom: 'BOM-004', quantity: 150, completed: 30, workCenter: 'Packaging Station', priority: 'low', status: 'pending', startDate: '2024-02-10', dueDate: '2024-02-15', assignee: 'Lisa Wang' },
  { id: 'WO-2024-005', product: 'Circuit Board Alpha', bom: 'BOM-005', quantity: 800, completed: 800, workCenter: 'SMT Line 1', priority: 'high', status: 'completed', startDate: '2024-01-25', dueDate: '2024-02-05', assignee: 'Tom Brown' },
  { id: 'WO-2024-006', product: 'Housing Unit C', bom: 'BOM-006', quantity: 300, completed: 0, workCenter: 'Injection Mold 2', priority: 'medium', status: 'draft', startDate: '2024-02-12', dueDate: '2024-02-20', assignee: 'Unassigned' },
];

const getStatusBadge = (status: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    draft: { variant: 'outline' },
    pending: { variant: 'secondary' },
    in_progress: { variant: 'default' },
    completed: { variant: 'outline', className: 'bg-primary/10 text-primary border-primary/20' },
    cancelled: { variant: 'destructive' },
  };
  const { variant, className } = config[status] || { variant: 'secondary' };
  return <Badge variant={variant} className={className}>{status.replace('_', ' ')}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const colors: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return <Badge variant="outline" className={colors[priority]}>{priority}</Badge>;
};

export function WorkOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = mockWorkOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: mockWorkOrders.length,
    inProgress: mockWorkOrders.filter(o => o.status === 'in_progress').length,
    pending: mockWorkOrders.filter(o => o.status === 'pending').length,
    completed: mockWorkOrders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Orders"
        description="Manage production work orders and track progress"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Work Order
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Work Center</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{order.bom}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.workCenter}</TableCell>
                  <TableCell>
                    <div className="w-24 space-y-1">
                      <Progress value={(order.completed / order.quantity) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {order.completed} / {order.quantity}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.dueDate}</TableCell>
                  <TableCell>{order.assignee}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" /> Start Production
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" /> Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
