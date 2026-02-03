import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, Download, Send, MoreHorizontal,
  Eye, Edit, Trash2, Mail, Copy, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Checkbox } from '@/components/ui/checkbox';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerEmail: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  items: number;
}

const invoices: Invoice[] = [
  { id: '1', number: 'INV-2024-0238', customer: 'Enterprise Ltd', customerEmail: 'billing@enterprise.com', amount: 18900, dueDate: '2024-02-15', issueDate: '2024-01-25', status: 'pending', items: 5 },
  { id: '2', number: 'INV-2024-0237', customer: 'StartUp Inc', customerEmail: 'finance@startup.io', amount: 5200, dueDate: '2024-02-10', issueDate: '2024-01-24', status: 'draft', items: 2 },
  { id: '3', number: 'INV-2024-0236', customer: 'Global Industries', customerEmail: 'ap@global.com', amount: 24000, dueDate: '2024-02-05', issueDate: '2024-01-23', status: 'pending', items: 8 },
  { id: '4', number: 'INV-2024-0235', customer: 'Tech Solutions', customerEmail: 'payments@techsol.com', amount: 8750, dueDate: '2024-01-30', issueDate: '2024-01-20', status: 'pending', items: 3 },
  { id: '5', number: 'INV-2024-0234', customer: 'Acme Corp', customerEmail: 'accounts@acme.com', amount: 12500, dueDate: '2024-01-28', issueDate: '2024-01-18', status: 'completed', items: 4 },
  { id: '6', number: 'INV-2024-0233', customer: 'Digital Dynamics', customerEmail: 'billing@digitald.com', amount: 15600, dueDate: '2024-01-25', issueDate: '2024-01-15', status: 'completed', items: 6 },
  { id: '7', number: 'INV-2024-0232', customer: 'Cloud Systems', customerEmail: 'finance@cloudsys.com', amount: 9800, dueDate: '2024-01-22', issueDate: '2024-01-12', status: 'completed', items: 3 },
  { id: '8', number: 'INV-2024-0231', customer: 'Metro Services', customerEmail: 'ap@metro.com', amount: 4500, dueDate: '2024-01-20', issueDate: '2024-01-10', status: 'cancelled', items: 2 },
];

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

export function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredInvoices = invoices.filter(inv => {
    if (selectedTab === 'all') return true;
    return inv.status === selectedTab;
  });

  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'pending').length,
    draft: invoices.filter(i => i.status === 'draft').length,
    completed: invoices.filter(i => i.status === 'completed').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Create, manage, and track customer invoices"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Invoices' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Customer</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme">Acme Corp</SelectItem>
                          <SelectItem value="tech">Tech Solutions</SelectItem>
                          <SelectItem value="global">Global Industries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Invoice Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net15">Net 15</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net45">Net 45</SelectItem>
                          <SelectItem value="net60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input placeholder="Additional notes for the invoice" />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button variant="outline">Save as Draft</Button>
                    <Button onClick={() => setIsDialogOpen(false)}>Create & Send</Button>
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
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
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
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <AlertCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="completed">Paid ({stats.completed})</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
          {selectedInvoices.length > 0 && (
            <div className="px-4 py-2 bg-muted/50 border-b flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedInvoices.length} selected</span>
              <Button variant="outline" size="sm">
                <Send className="h-3 w-3 mr-1" />
                Send Selected
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Export Selected
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={() => toggleSelect(invoice.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-primary hover:underline cursor-pointer">
                        {invoice.number}
                      </span>
                      <span className="text-xs text-muted-foreground">{invoice.items} items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.customer}</span>
                      <span className="text-xs text-muted-foreground">{invoice.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{invoice.issueDate}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
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
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
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
