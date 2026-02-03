import React, { useState } from 'react';
import { 
  CreditCard, Plus, Search, Filter, Download, ArrowDownLeft, ArrowUpRight,
  MoreHorizontal, Eye, RefreshCcw, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Payment {
  id: string;
  transactionId: string;
  type: 'incoming' | 'outgoing';
  party: string;
  method: 'bank_transfer' | 'credit_card' | 'check' | 'cash' | 'wire';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  reference: string;
}

const payments: Payment[] = [
  { id: '1', transactionId: 'PAY-2024-0156', type: 'incoming', party: 'Acme Corp', method: 'bank_transfer', amount: 15000, date: '2024-01-25', status: 'completed', reference: 'INV-2024-0234' },
  { id: '2', transactionId: 'PAY-2024-0155', type: 'outgoing', party: 'Office Supplies Co', method: 'credit_card', amount: 1250, date: '2024-01-24', status: 'completed', reference: 'PO-2024-0089' },
  { id: '3', transactionId: 'PAY-2024-0154', type: 'incoming', party: 'Tech Solutions', method: 'wire', amount: 8500, date: '2024-01-23', status: 'completed', reference: 'INV-2024-0233' },
  { id: '4', transactionId: 'PAY-2024-0153', type: 'outgoing', party: 'Cloud Services Inc', method: 'bank_transfer', amount: 2400, date: '2024-01-22', status: 'completed', reference: 'BILL-2024-0056' },
  { id: '5', transactionId: 'PAY-2024-0152', type: 'incoming', party: 'Global Industries', method: 'check', amount: 24000, date: '2024-01-21', status: 'pending', reference: 'INV-2024-0232' },
  { id: '6', transactionId: 'PAY-2024-0151', type: 'outgoing', party: 'Payroll - January', method: 'bank_transfer', amount: 45000, date: '2024-01-20', status: 'completed', reference: 'PAY-JAN-2024' },
  { id: '7', transactionId: 'PAY-2024-0150', type: 'incoming', party: 'Digital Dynamics', method: 'credit_card', amount: 5600, date: '2024-01-19', status: 'failed', reference: 'INV-2024-0230' },
  { id: '8', transactionId: 'PAY-2024-0149', type: 'outgoing', party: 'Marketing Agency', method: 'wire', amount: 12000, date: '2024-01-18', status: 'completed', reference: 'BILL-2024-0055' },
];

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const methodLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  check: 'Check',
  cash: 'Cash',
  wire: 'Wire Transfer',
};

const statusStyles: Record<string, { icon: React.ElementType; className: string }> = {
  completed: { icon: CheckCircle, className: 'text-status-success' },
  pending: { icon: Clock, className: 'text-status-warning' },
  failed: { icon: XCircle, className: 'text-status-error' },
  refunded: { icon: RefreshCcw, className: 'text-blue-500' },
};

export function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPayments = payments.filter(p => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'incoming') return p.type === 'incoming';
    if (selectedTab === 'outgoing') return p.type === 'outgoing';
    return p.status === selectedTab;
  });

  const stats = {
    totalIncoming: payments.filter(p => p.type === 'incoming' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalOutgoing: payments.filter(p => p.type === 'outgoing' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track incoming and outgoing payments"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Payments' },
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
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="incoming">Incoming (Received)</SelectItem>
                          <SelectItem value="outgoing">Outgoing (Paid)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Party</Label>
                    <Input placeholder="Customer or vendor name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="wire">Wire Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input placeholder="Invoice or PO number" />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsDialogOpen(false)}>Record Payment</Button>
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
              <div className="p-2 rounded-lg bg-green-500/10">
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncoming)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ArrowUpRight className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalOutgoing)}</p>
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
              <div className="p-2 rounded-lg bg-status-error/10">
                <XCircle className="h-5 w-5 text-status-error" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="incoming">Received</TabsTrigger>
                <TabsTrigger value="outgoing">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
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
                <TableHead className="w-12"></TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const StatusIcon = statusStyles[payment.status].icon;
                return (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell>
                      {payment.type === 'incoming' ? (
                        <div className="p-1.5 rounded bg-green-500/10">
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded bg-red-500/10">
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-primary hover:underline cursor-pointer">
                        {payment.transactionId}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{payment.party}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{methodLabels[payment.method]}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-mono font-medium ${payment.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.type === 'incoming' ? '+' : '-'}{formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {payment.reference}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`h-4 w-4 ${statusStyles[payment.status].className}`} />
                        <span className={`text-sm capitalize ${statusStyles[payment.status].className}`}>
                          {payment.status}
                        </span>
                      </div>
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </DropdownMenuItem>
                          {payment.status === 'completed' && (
                            <DropdownMenuItem>
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Refund
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
