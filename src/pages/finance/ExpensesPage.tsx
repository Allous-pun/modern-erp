import React, { useState } from 'react';
import { 
  Receipt, Plus, Search, Filter, Download, Upload, MoreHorizontal,
  Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Camera
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  submittedBy: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  receipt: boolean;
  notes?: string;
}

const expenses: Expense[] = [
  { id: '1', date: '2024-01-25', description: 'Client dinner - Acme Corp', category: 'Meals & Entertainment', amount: 285, submittedBy: 'John Smith', status: 'pending', receipt: true },
  { id: '2', date: '2024-01-24', description: 'Office supplies - Q1 stock', category: 'Office Supplies', amount: 1250, submittedBy: 'Sarah Johnson', status: 'approved', receipt: true },
  { id: '3', date: '2024-01-23', description: 'Software license - Adobe CC', category: 'Software', amount: 599, submittedBy: 'Mike Brown', status: 'approved', receipt: true },
  { id: '4', date: '2024-01-22', description: 'Travel - NYC conference', category: 'Travel', amount: 1850, submittedBy: 'Emily Davis', status: 'pending', receipt: true },
  { id: '5', date: '2024-01-21', description: 'Team building event', category: 'Team Events', amount: 450, submittedBy: 'John Smith', status: 'draft', receipt: false },
  { id: '6', date: '2024-01-20', description: 'Marketing materials', category: 'Marketing', amount: 780, submittedBy: 'Lisa Wilson', status: 'rejected', receipt: true, notes: 'Missing approval' },
  { id: '7', date: '2024-01-19', description: 'Equipment - New monitors', category: 'Equipment', amount: 1200, submittedBy: 'Tom Clark', status: 'approved', receipt: true },
  { id: '8', date: '2024-01-18', description: 'Parking - Client meeting', category: 'Transportation', amount: 45, submittedBy: 'Sarah Johnson', status: 'approved', receipt: true },
];

const categoryBreakdown = [
  { name: 'Travel', value: 35 },
  { name: 'Office Supplies', value: 20 },
  { name: 'Software', value: 18 },
  { name: 'Meals', value: 12 },
  { name: 'Equipment', value: 10 },
  { name: 'Other', value: 5 },
];

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

export function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredExpenses = expenses.filter(e => {
    if (selectedTab === 'all') return true;
    return e.status === selectedTab;
  });

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0),
    pendingCount: expenses.filter(e => e.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Track, submit, and approve expense reports"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Expenses' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Submit Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="meals">Meals & Entertainment</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="Brief description of expense" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional details (optional)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Receipt</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button variant="outline">Save Draft</Button>
                    <Button onClick={() => setIsDialogOpen(false)}>Submit</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <Clock className="h-5 w-5 text-status-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.pending)}</p>
                <p className="text-xs text-muted-foreground">{stats.pendingCount} expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-success/10">
                <CheckCircle className="h-5 w-5 text-status-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved (MTD)</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.approved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <ChartWidget
              title=""
              type="pie"
              data={categoryBreakdown}
              height={100}
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{expense.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{expense.description}</span>
                      {expense.notes && (
                        <span className="text-xs text-muted-foreground">{expense.notes}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {expense.submittedBy.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{expense.submittedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    {expense.receipt ? (
                      <Badge variant="secondary" className="text-status-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Attached
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">
                        <XCircle className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={expense.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {expense.status === 'draft' && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {expense.status === 'pending' && (
                          <>
                            <DropdownMenuItem className="text-status-success">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-status-error">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-status-error">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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
