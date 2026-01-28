import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Search, Filter, Download, ArrowRightLeft, 
  TrendingUp, TrendingDown, Package, Eye, ArrowRight,
  Calendar
} from 'lucide-react';

interface StockMovement {
  id: string;
  reference: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  item: string;
  sku: string;
  quantity: number;
  unit: string;
  from: string;
  to: string;
  reason: string;
  createdBy: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const mockMovements: StockMovement[] = [
  { id: '1', reference: 'MOV-2024-001', type: 'inbound', item: 'Microprocessor Unit A1', sku: 'SKU-001', quantity: 500, unit: 'pcs', from: 'Supplier: TechParts Inc', to: 'Main Warehouse', reason: 'Purchase Order PO-2024-045', createdBy: 'John Smith', createdAt: '2024-01-15 10:30', status: 'completed' },
  { id: '2', reference: 'MOV-2024-002', type: 'outbound', item: 'LED Display Panel 15"', sku: 'SKU-002', quantity: 50, unit: 'pcs', from: 'East Warehouse', to: 'Customer: ABC Corp', reason: 'Sales Order SO-2024-112', createdBy: 'Sarah Johnson', createdAt: '2024-01-15 11:45', status: 'completed' },
  { id: '3', reference: 'MOV-2024-003', type: 'transfer', item: 'Power Supply 500W', sku: 'SKU-003', quantity: 100, unit: 'pcs', from: 'West Warehouse', to: 'Main Warehouse', reason: 'Stock rebalancing', createdBy: 'Mike Chen', createdAt: '2024-01-15 14:00', status: 'pending' },
  { id: '4', reference: 'MOV-2024-004', type: 'adjustment', item: 'USB-C Connector Cable', sku: 'SKU-005', quantity: -15, unit: 'pcs', from: 'Main Warehouse', to: 'N/A', reason: 'Inventory count adjustment', createdBy: 'Emily Davis', createdAt: '2024-01-15 09:15', status: 'completed' },
  { id: '5', reference: 'MOV-2024-005', type: 'inbound', item: 'Cardboard Box Medium', sku: 'SKU-006', quantity: 2000, unit: 'pcs', from: 'Supplier: PackageCo', to: 'Main Warehouse', reason: 'Purchase Order PO-2024-048', createdBy: 'John Smith', createdAt: '2024-01-14 16:30', status: 'completed' },
  { id: '6', reference: 'MOV-2024-006', type: 'outbound', item: 'Thermal Paste 10g', sku: 'SKU-007', quantity: 25, unit: 'tubes', from: 'East Warehouse', to: 'Manufacturing Floor', reason: 'Production requisition PR-2024-089', createdBy: 'Robert Wilson', createdAt: '2024-01-14 13:20', status: 'completed' },
  { id: '7', reference: 'MOV-2024-007', type: 'transfer', item: 'Aluminum Sheet 2mm', sku: 'SKU-004', quantity: 200, unit: 'kg', from: 'Main Warehouse', to: 'West Warehouse', reason: 'Regional demand', createdBy: 'Mike Chen', createdAt: '2024-01-14 10:00', status: 'cancelled' },
  { id: '8', reference: 'MOV-2024-008', type: 'inbound', item: 'Copper Wire 2mm', sku: 'SKU-008', quantity: 500, unit: 'm', from: 'Supplier: MetalWorks', to: 'West Warehouse', reason: 'Purchase Order PO-2024-042', createdBy: 'Sarah Johnson', createdAt: '2024-01-13 15:45', status: 'completed' },
];

const movementTypes = ['All Types', 'Inbound', 'Outbound', 'Transfer', 'Adjustment'];

export function StockMovementsPage() {
  const [movements] = useState<StockMovement[]>(mockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All Types' || 
                       movement.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesTab = activeTab === 'all' || movement.type === activeTab;
    return matchesSearch && matchesType && matchesTab;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'inbound':
        return <Badge className="bg-green-500/10 text-green-600">Inbound</Badge>;
      case 'outbound':
        return <Badge className="bg-blue-500/10 text-blue-600">Outbound</Badge>;
      case 'transfer':
        return <Badge className="bg-purple-500/10 text-purple-600">Transfer</Badge>;
      case 'adjustment':
        return <Badge className="bg-orange-500/10 text-orange-600">Adjustment</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-600">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-600">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inbound':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'outbound':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-purple-600" />;
      case 'adjustment':
        return <Package className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const movementCounts = {
    all: movements.length,
    inbound: movements.filter(m => m.type === 'inbound').length,
    outbound: movements.filter(m => m.type === 'outbound').length,
    transfer: movements.filter(m => m.type === 'transfer').length,
    adjustment: movements.filter(m => m.type === 'adjustment').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements"
        description="Track all inventory transactions and transfers"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Movement
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inbound</p>
                <p className="text-2xl font-bold">{movementCounts.inbound}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outbound</p>
                <p className="text-2xl font-bold">{movementCounts.outbound}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transfers</p>
                <p className="text-2xl font-bold">{movementCounts.transfer}</p>
              </div>
              <ArrowRightLeft className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Adjustments</p>
                <p className="text-2xl font-bold">{movementCounts.adjustment}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by reference, item, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {movementTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table with Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({movementCounts.all})</TabsTrigger>
              <TabsTrigger value="inbound">Inbound ({movementCounts.inbound})</TabsTrigger>
              <TabsTrigger value="outbound">Outbound ({movementCounts.outbound})</TabsTrigger>
              <TabsTrigger value="transfer">Transfer ({movementCounts.transfer})</TabsTrigger>
              <TabsTrigger value="adjustment">Adjustment ({movementCounts.adjustment})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(movement.type)}
                      {getTypeBadge(movement.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{movement.item}</p>
                      <p className="text-sm text-muted-foreground font-mono">{movement.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={movement.quantity < 0 ? 'text-red-600' : 'text-green-600'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity.toLocaleString()} {movement.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="truncate max-w-[100px]" title={movement.from}>{movement.from}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[100px]" title={movement.to}>{movement.to}</span>
                    </div>
                  </TableCell>
                  <TableCell>{movement.createdBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{movement.createdAt}</TableCell>
                  <TableCell>{getStatusBadge(movement.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => { setSelectedMovement(movement); setIsViewDialogOpen(true); }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Movement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbound">Inbound (Receiving)</SelectItem>
                  <SelectItem value="outbound">Outbound (Shipping)</SelectItem>
                  <SelectItem value="transfer">Transfer (Between Locations)</SelectItem>
                  <SelectItem value="adjustment">Adjustment (Correction)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SKU-001">SKU-001 - Microprocessor Unit A1</SelectItem>
                    <SelectItem value="SKU-002">SKU-002 - LED Display Panel 15"</SelectItem>
                    <SelectItem value="SKU-003">SKU-003 - Power Supply 500W</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="Enter quantity" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="east">East Warehouse</SelectItem>
                    <SelectItem value="west">West Warehouse</SelectItem>
                    <SelectItem value="supplier">External Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="east">East Warehouse</SelectItem>
                    <SelectItem value="west">West Warehouse</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason / Reference</Label>
              <Textarea placeholder="Enter reason or reference document..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Record Movement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Movement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Movement Details</DialogTitle>
          </DialogHeader>
          {selectedMovement && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg">{selectedMovement.reference}</span>
                <div className="flex gap-2">
                  {getTypeBadge(selectedMovement.type)}
                  {getStatusBadge(selectedMovement.status)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item</span>
                  <span className="font-medium">{selectedMovement.item}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono">{selectedMovement.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className={`font-medium ${selectedMovement.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedMovement.quantity > 0 ? '+' : ''}{selectedMovement.quantity} {selectedMovement.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From</span>
                  <span>{selectedMovement.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span>{selectedMovement.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason</span>
                  <span className="text-right max-w-[200px]">{selectedMovement.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By</span>
                  <span>{selectedMovement.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span>{selectedMovement.createdAt}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
