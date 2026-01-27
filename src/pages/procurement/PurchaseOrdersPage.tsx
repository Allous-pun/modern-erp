import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Progress } from '@/components/ui/progress';
import { 
  Plus, Search, Eye, FileText, Truck, Package, DollarSign, Clock,
  CheckCircle, XCircle, AlertTriangle, Printer, Download, Send
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const mockPurchaseOrders = [
  {
    id: 'PO-2024-001',
    supplier: 'Acme Industrial Supplies',
    supplierId: 'SUP-001',
    items: 15,
    total: 45000,
    status: 'pending',
    orderDate: '2024-01-20',
    expectedDate: '2024-02-05',
    deliveredItems: 0,
    requisitionId: 'REQ-2024-003',
    paymentTerms: 'Net 30',
    shippingMethod: 'Ground Freight'
  },
  {
    id: 'PO-2024-002',
    supplier: 'TechParts Global',
    supplierId: 'SUP-002',
    items: 8,
    total: 28500,
    status: 'confirmed',
    orderDate: '2024-01-18',
    expectedDate: '2024-01-28',
    deliveredItems: 0,
    requisitionId: 'REQ-2024-002',
    paymentTerms: 'Net 45',
    shippingMethod: 'Express'
  },
  {
    id: 'PO-2024-003',
    supplier: 'Office Essentials Co',
    supplierId: 'SUP-003',
    items: 25,
    total: 3200,
    status: 'partial',
    orderDate: '2024-01-15',
    expectedDate: '2024-01-22',
    deliveredItems: 18,
    requisitionId: 'REQ-2024-001',
    paymentTerms: 'Net 15',
    shippingMethod: 'Standard'
  },
  {
    id: 'PO-2024-004',
    supplier: 'Premium Metals Inc',
    supplierId: 'SUP-005',
    items: 5,
    total: 125000,
    status: 'received',
    orderDate: '2024-01-10',
    expectedDate: '2024-01-18',
    deliveredItems: 5,
    requisitionId: null,
    paymentTerms: 'Net 60',
    shippingMethod: 'Freight'
  },
  {
    id: 'PO-2024-005',
    supplier: 'GreenPack Solutions',
    supplierId: 'SUP-004',
    items: 100,
    total: 15000,
    status: 'cancelled',
    orderDate: '2024-01-08',
    expectedDate: '2024-01-20',
    deliveredItems: 0,
    requisitionId: null,
    paymentTerms: 'Net 30',
    shippingMethod: 'Ground'
  },
];

const poLineItems = [
  { id: 1, sku: 'MAT-001', name: 'Steel Sheet 4x8 ft', quantity: 50, received: 50, unit: 'sheet', unitPrice: 85, total: 4250 },
  { id: 2, sku: 'MAT-002', name: 'Aluminum Rod 1"', quantity: 100, received: 100, unit: 'pcs', unitPrice: 12, total: 1200 },
  { id: 3, sku: 'MAT-003', name: 'Copper Wire 12 AWG', quantity: 500, received: 500, unit: 'ft', unitPrice: 2.5, total: 1250 },
  { id: 4, sku: 'MAT-004', name: 'Stainless Fasteners Kit', quantity: 25, received: 25, unit: 'kit', unitPrice: 45, total: 1125 },
  { id: 5, sku: 'MAT-005', name: 'Industrial Lubricant', quantity: 10, received: 10, unit: 'gal', unitPrice: 35, total: 350 },
];

export function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPO, setSelectedPO] = useState<typeof mockPurchaseOrders[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'partial': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'received': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <AlertTriangle className="h-4 w-4" />;
      case 'received': return <Package className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredOrders = mockPurchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || po.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    pending: mockPurchaseOrders.filter(po => po.status === 'pending').length,
    confirmed: mockPurchaseOrders.filter(po => po.status === 'confirmed').length,
    partial: mockPurchaseOrders.filter(po => po.status === 'partial').length,
    received: mockPurchaseOrders.filter(po => po.status === 'received').length,
    totalValue: mockPurchaseOrders.reduce((acc, po) => acc + po.total, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Manage and track all purchase orders"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.partial}</p>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.received}</p>
                <p className="text-sm text-muted-foreground">Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Purchase Orders</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create PO
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{po.id}</p>
                          {po.requisitionId && (
                            <p className="text-xs text-muted-foreground">From: {po.requisitionId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{po.supplier}</p>
                          <p className="text-xs text-muted-foreground">{po.supplierId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{po.items} items</TableCell>
                      <TableCell className="font-medium">${po.total.toLocaleString()}</TableCell>
                      <TableCell>{po.orderDate}</TableCell>
                      <TableCell>{po.expectedDate}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(po.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(po.status)}
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{po.deliveredItems}/{po.items}</span>
                            <span>{Math.round((po.deliveredItems / po.items) * 100)}%</span>
                          </div>
                          <Progress value={(po.deliveredItems / po.items) * 100} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => { setSelectedPO(po); setIsDetailOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" /> Print PO
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" /> Send to Supplier
                            </DropdownMenuItem>
                            {po.status === 'confirmed' && (
                              <DropdownMenuItem>
                                <Package className="mr-2 h-4 w-4" /> Record Receipt
                              </DropdownMenuItem>
                            )}
                            {po.status === 'pending' && (
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" /> Cancel Order
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

      {/* PO Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPO && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedPO.id}</DialogTitle>
                    <DialogDescription>Purchase Order Details</DialogDescription>
                  </div>
                  <Badge className={`${getStatusColor(selectedPO.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedPO.status)}
                    {selectedPO.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Supplier</p>
                    <p className="font-medium">{selectedPO.supplier}</p>
                    <p className="text-xs text-muted-foreground">{selectedPO.supplierId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{selectedPO.orderDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Expected Delivery</p>
                    <p className="font-medium">{selectedPO.expectedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Terms</p>
                    <p className="font-medium">{selectedPO.paymentTerms}</p>
                  </div>
                </div>

                {/* Delivery Progress */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Delivery Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedPO.deliveredItems} of {selectedPO.items} items received
                    </span>
                  </div>
                  <Progress value={(selectedPO.deliveredItems / selectedPO.items) * 100} className="h-3" />
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poLineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>
                              <span className={item.received === item.quantity ? 'text-green-600' : 'text-orange-600'}>
                                {item.received} {item.unit}
                              </span>
                            </TableCell>
                            <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">${item.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(selectedPO.total * 0.9).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${(selectedPO.total * 0.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-lg">${selectedPO.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                {selectedPO.status === 'confirmed' && (
                  <Button>
                    <Package className="mr-2 h-4 w-4" /> Record Receipt
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
