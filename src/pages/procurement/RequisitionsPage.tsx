import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText,
  ArrowRight, User, Calendar, DollarSign, AlertCircle
} from 'lucide-react';

const mockRequisitions = [
  {
    id: 'REQ-2024-001',
    title: 'Office Supplies - Q1',
    department: 'Administration',
    requestedBy: 'Sarah Johnson',
    requestDate: '2024-01-20',
    requiredDate: '2024-02-01',
    items: 12,
    estimatedCost: 2500,
    status: 'pending',
    priority: 'medium',
    approver: 'Michael Chen',
    notes: 'Monthly office supplies replenishment'
  },
  {
    id: 'REQ-2024-002',
    title: 'IT Equipment - New Hires',
    department: 'IT',
    requestedBy: 'David Park',
    requestDate: '2024-01-18',
    requiredDate: '2024-01-25',
    items: 5,
    estimatedCost: 15000,
    status: 'approved',
    priority: 'high',
    approver: 'Lisa Wong',
    notes: 'Laptops and monitors for 5 new developers'
  },
  {
    id: 'REQ-2024-003',
    title: 'Manufacturing Materials',
    department: 'Production',
    requestedBy: 'James Wilson',
    requestDate: '2024-01-15',
    requiredDate: '2024-01-30',
    items: 8,
    estimatedCost: 45000,
    status: 'converted',
    priority: 'high',
    approver: 'Michael Chen',
    notes: 'Raw materials for February production run',
    poNumber: 'PO-2024-015'
  },
  {
    id: 'REQ-2024-004',
    title: 'Safety Equipment',
    department: 'Operations',
    requestedBy: 'Emily Davis',
    requestDate: '2024-01-22',
    requiredDate: '2024-02-15',
    items: 25,
    estimatedCost: 8500,
    status: 'pending',
    priority: 'medium',
    approver: 'Robert Taylor',
    notes: 'Annual safety equipment replacement'
  },
  {
    id: 'REQ-2024-005',
    title: 'Marketing Collateral',
    department: 'Marketing',
    requestedBy: 'Amanda Lee',
    requestDate: '2024-01-10',
    requiredDate: '2024-01-20',
    items: 3,
    estimatedCost: 12000,
    status: 'rejected',
    priority: 'low',
    approver: 'Lisa Wong',
    notes: 'Trade show materials',
    rejectionReason: 'Budget constraints - resubmit in Q2'
  },
];

const requisitionItems = [
  { id: 1, name: 'Laptop - Dell XPS 15', quantity: 5, unit: 'pcs', unitPrice: 1800, total: 9000 },
  { id: 2, name: 'Monitor - 27" 4K', quantity: 5, unit: 'pcs', unitPrice: 450, total: 2250 },
  { id: 3, name: 'Keyboard & Mouse Combo', quantity: 5, unit: 'sets', unitPrice: 120, total: 600 },
  { id: 4, name: 'USB-C Hub', quantity: 5, unit: 'pcs', unitPrice: 80, total: 400 },
  { id: 5, name: 'Laptop Bag', quantity: 5, unit: 'pcs', unitPrice: 50, total: 250 },
];

export function RequisitionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequisition, setSelectedRequisition] = useState<typeof mockRequisitions[0] | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'converted': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredRequisitions = mockRequisitions.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || req.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    pending: mockRequisitions.filter(r => r.status === 'pending').length,
    approved: mockRequisitions.filter(r => r.status === 'approved').length,
    rejected: mockRequisitions.filter(r => r.status === 'rejected').length,
    converted: mockRequisitions.filter(r => r.status === 'converted').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Requisitions"
        description="Create and manage purchase requisition requests"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.converted}</p>
                <p className="text-sm text-muted-foreground">Converted to PO</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Requisitions</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requisitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Requisition
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Purchase Requisition</DialogTitle>
                    <DialogDescription>
                      Submit a new purchase request for approval.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Requisition Title</Label>
                      <Input id="title" placeholder="Brief description of the request" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="admin">Administration</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="required-date">Required By</Label>
                        <Input id="required-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                        <Input id="estimated-cost" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes / Justification</Label>
                      <Textarea id="notes" placeholder="Explain why this purchase is needed..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Submit Requisition</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="converted">Converted ({stats.converted})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requisition</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequisitions.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{req.title}</p>
                          <p className="text-sm text-muted-foreground">{req.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{req.requestedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>{req.requiredDate}</TableCell>
                      <TableCell className="font-medium">${req.estimatedCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(req.priority)}>
                          {req.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedRequisition(req)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{req.title}</DialogTitle>
                              <DialogDescription>{req.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Requisition Info */}
                              <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Department</p>
                                  <p className="font-medium">{req.department}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Requested By</p>
                                  <p className="font-medium">{req.requestedBy}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Approver</p>
                                  <p className="font-medium">{req.approver}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Request Date</p>
                                  <p className="font-medium">{req.requestDate}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Required Date</p>
                                  <p className="font-medium">{req.requiredDate}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                                </div>
                              </div>

                              {/* Items Table */}
                              <div>
                                <h4 className="font-medium mb-3">Requested Items</h4>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {requisitionItems.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell>{item.quantity} {item.unit}</TableCell>
                                          <TableCell>${item.unitPrice}</TableCell>
                                          <TableCell className="text-right font-medium">${item.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow className="bg-muted/50">
                                        <TableCell colSpan={3} className="text-right font-medium">Total Estimated Cost</TableCell>
                                        <TableCell className="text-right font-bold text-lg">${req.estimatedCost.toLocaleString()}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Notes */}
                              <div>
                                <h4 className="font-medium mb-2">Notes</h4>
                                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{req.notes}</p>
                              </div>

                              {req.status === 'rejected' && req.rejectionReason && (
                                <div className="flex items-start gap-3 bg-red-500/10 rounded-lg p-4">
                                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                                  <div>
                                    <p className="font-medium text-red-600">Rejection Reason</p>
                                    <p className="text-sm text-muted-foreground">{req.rejectionReason}</p>
                                  </div>
                                </div>
                              )}

                              {req.status === 'converted' && req.poNumber && (
                                <div className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-4">
                                  <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                                  <div>
                                    <p className="font-medium text-blue-600">Converted to Purchase Order</p>
                                    <p className="text-sm text-muted-foreground">PO Number: {req.poNumber}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              {req.status === 'pending' && (
                                <>
                                  <Button variant="outline" className="text-red-600">Reject</Button>
                                  <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                                </>
                              )}
                              {req.status === 'approved' && (
                                <Button>
                                  <ArrowRight className="mr-2 h-4 w-4" />
                                  Convert to PO
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
