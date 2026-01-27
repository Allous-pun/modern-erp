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
  Plus, Search, Eye, Package, PackageCheck, AlertTriangle, XCircle,
  Truck, Calendar, ClipboardCheck, FileText, CheckCircle2, Camera, MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const mockGRNs = [
  {
    id: 'GRN-2024-001',
    poNumber: 'PO-2024-004',
    supplier: 'Premium Metals Inc',
    receivedDate: '2024-01-18',
    receivedBy: 'John Smith',
    totalItems: 5,
    acceptedItems: 5,
    rejectedItems: 0,
    status: 'completed',
    warehouse: 'Main Warehouse',
    notes: 'All items received in good condition'
  },
  {
    id: 'GRN-2024-002',
    poNumber: 'PO-2024-003',
    supplier: 'Office Essentials Co',
    receivedDate: '2024-01-20',
    receivedBy: 'Mary Johnson',
    totalItems: 18,
    acceptedItems: 18,
    rejectedItems: 0,
    status: 'completed',
    warehouse: 'Main Warehouse',
    notes: 'Partial delivery - 7 items pending'
  },
  {
    id: 'GRN-2024-003',
    poNumber: 'PO-2024-002',
    supplier: 'TechParts Global',
    receivedDate: '2024-01-22',
    receivedBy: 'David Lee',
    totalItems: 8,
    acceptedItems: 6,
    rejectedItems: 2,
    status: 'partial_reject',
    warehouse: 'Tech Storage',
    notes: '2 units damaged during shipping'
  },
  {
    id: 'GRN-2024-004',
    poNumber: 'PO-2024-006',
    supplier: 'Acme Industrial Supplies',
    receivedDate: '2024-01-23',
    receivedBy: 'Sarah Wilson',
    totalItems: 12,
    acceptedItems: 0,
    rejectedItems: 0,
    status: 'pending_inspection',
    warehouse: 'Main Warehouse',
    notes: 'Awaiting quality inspection'
  },
];

const grnLineItems = [
  { id: 1, sku: 'TECH-001', name: 'Laptop - Dell XPS 15', ordered: 5, received: 5, accepted: 5, rejected: 0, reason: '' },
  { id: 2, sku: 'TECH-002', name: 'Monitor - 27" 4K', ordered: 5, received: 5, accepted: 3, rejected: 2, reason: 'Screen damage' },
  { id: 3, sku: 'TECH-003', name: 'Keyboard Wireless', ordered: 5, received: 5, accepted: 5, rejected: 0, reason: '' },
  { id: 4, sku: 'TECH-004', name: 'Mouse Ergonomic', ordered: 5, received: 5, accepted: 5, rejected: 0, reason: '' },
  { id: 5, sku: 'TECH-005', name: 'USB-C Hub', ordered: 5, received: 5, accepted: 5, rejected: 0, reason: '' },
];

const pendingDeliveries = [
  { poNumber: 'PO-2024-001', supplier: 'Acme Industrial', expectedDate: '2024-02-05', items: 15 },
  { poNumber: 'PO-2024-007', supplier: 'TechParts Global', expectedDate: '2024-02-08', items: 10 },
  { poNumber: 'PO-2024-008', supplier: 'Office Essentials', expectedDate: '2024-02-10', items: 50 },
];

export function GoodsReceivedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGRN, setSelectedGRN] = useState<typeof mockGRNs[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'partial_reject': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'pending_inspection': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'partial_reject': return 'Partial Reject';
      case 'pending_inspection': return 'Pending Inspection';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const filteredGRNs = mockGRNs.filter(grn => {
    const matchesSearch = grn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || grn.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    completed: mockGRNs.filter(g => g.status === 'completed').length,
    pendingInspection: mockGRNs.filter(g => g.status === 'pending_inspection').length,
    partialReject: mockGRNs.filter(g => g.status === 'partial_reject').length,
    totalReceived: mockGRNs.reduce((acc, g) => acc + g.acceptedItems, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Received"
        description="Record and manage incoming deliveries and quality inspections"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <PackageCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingInspection}</p>
                <p className="text-sm text-muted-foreground">Pending Inspection</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.partialReject}</p>
                <p className="text-sm text-muted-foreground">With Rejections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalReceived}</p>
                <p className="text-sm text-muted-foreground">Items Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main GRN List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Goods Received Notes</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search GRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Record Receipt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Record Goods Receipt</DialogTitle>
                      <DialogDescription>
                        Record delivery against a purchase order
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Purchase Order</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select PO" />
                            </SelectTrigger>
                            <SelectContent>
                              {pendingDeliveries.map(po => (
                                <SelectItem key={po.poNumber} value={po.poNumber}>
                                  {po.poNumber} - {po.supplier}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Warehouse</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">Main Warehouse</SelectItem>
                              <SelectItem value="tech">Tech Storage</SelectItem>
                              <SelectItem value="overflow">Overflow Storage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Delivery Note / Packing Slip Number</Label>
                        <Input placeholder="Enter supplier's delivery note number" />
                      </div>

                      {/* Items to receive */}
                      <div>
                        <Label className="mb-3 block">Items to Receive</Label>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Ordered</TableHead>
                                <TableHead>Previously Received</TableHead>
                                <TableHead>Receiving Now</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {grnLineItems.slice(0, 3).map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <Checkbox defaultChecked />
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{item.ordered}</TableCell>
                                  <TableCell>0</TableCell>
                                  <TableCell>
                                    <Input type="number" className="w-20" defaultValue={item.ordered} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Any observations or comments about the delivery..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsReceiveOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsReceiveOpen(false)}>
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Record Receipt
                      </Button>
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
                <TabsTrigger value="pending_inspection">Pending Inspection</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="partial_reject">With Issues</TabsTrigger>
              </TabsList>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>GRN #</TableHead>
                      <TableHead>PO #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGRNs.map((grn) => (
                      <TableRow key={grn.id}>
                        <TableCell className="font-medium">{grn.id}</TableCell>
                        <TableCell>
                          <span className="text-primary hover:underline cursor-pointer">{grn.poNumber}</span>
                        </TableCell>
                        <TableCell>{grn.supplier}</TableCell>
                        <TableCell>
                          <div>
                            <p>{grn.receivedDate}</p>
                            <p className="text-xs text-muted-foreground">by {grn.receivedBy}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">{grn.acceptedItems}</span>
                            {grn.rejectedItems > 0 && (
                              <>
                                <span className="text-muted-foreground">/</span>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">{grn.rejectedItems}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(grn.status)}>
                            {getStatusLabel(grn.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => { setSelectedGRN(grn); setIsDetailOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" /> Print GRN
                              </DropdownMenuItem>
                              {grn.status === 'pending_inspection' && (
                                <DropdownMenuItem>
                                  <ClipboardCheck className="mr-2 h-4 w-4" /> Complete Inspection
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Expected Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Expected Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDeliveries.map((delivery) => (
                <div
                  key={delivery.poNumber}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-primary">{delivery.poNumber}</p>
                    <p className="text-sm text-muted-foreground">{delivery.supplier}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{delivery.expectedDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{delivery.items} items</Badge>
                    <Button size="sm" className="mt-2 w-full" variant="outline">
                      Receive
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRN Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGRN && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedGRN.id}</DialogTitle>
                    <DialogDescription>Goods Received Note Details</DialogDescription>
                  </div>
                  <Badge className={getStatusColor(selectedGRN.status)}>
                    {getStatusLabel(selectedGRN.status)}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Purchase Order</p>
                    <p className="font-medium text-primary">{selectedGRN.poNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Supplier</p>
                    <p className="font-medium">{selectedGRN.supplier}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Received Date</p>
                    <p className="font-medium">{selectedGRN.receivedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Received By</p>
                    <p className="font-medium">{selectedGRN.receivedBy}</p>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-2xl font-bold">{selectedGRN.totalItems}</p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-4 text-center">
                    <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{selectedGRN.acceptedItems}</p>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-4 text-center">
                    <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                    <p className="text-2xl font-bold text-red-600">{selectedGRN.rejectedItems}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="font-medium mb-3">Received Items</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Accepted</TableHead>
                          <TableHead>Rejected</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grnLineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.ordered}</TableCell>
                            <TableCell>{item.received}</TableCell>
                            <TableCell className="text-green-600">{item.accepted}</TableCell>
                            <TableCell className={item.rejected > 0 ? 'text-red-600' : ''}>
                              {item.rejected}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.reason || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {selectedGRN.notes}
                  </p>
                </div>

                {/* Warehouse Info */}
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Stored at:</span>
                  <span className="font-medium">{selectedGRN.warehouse}</span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Print GRN
                </Button>
                {selectedGRN.status === 'pending_inspection' && (
                  <Button>
                    <ClipboardCheck className="mr-2 h-4 w-4" /> Complete Inspection
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
