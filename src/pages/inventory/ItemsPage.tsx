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
import { 
  Plus, Search, Filter, Download, Upload, Edit, Trash2, 
  Eye, Package, MoreHorizontal, Barcode
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  reorderLevel: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

const mockItems: InventoryItem[] = [
  { id: '1', sku: 'SKU-001', name: 'Microprocessor Unit A1', category: 'Electronics', quantity: 250, unit: 'pcs', unitCost: 45.00, totalValue: 11250, reorderLevel: 50, location: 'A-01-01', status: 'in_stock', lastUpdated: '2024-01-15' },
  { id: '2', sku: 'SKU-002', name: 'LED Display Panel 15"', category: 'Electronics', quantity: 8, unit: 'pcs', unitCost: 120.00, totalValue: 960, reorderLevel: 25, location: 'A-02-03', status: 'low_stock', lastUpdated: '2024-01-14' },
  { id: '3', sku: 'SKU-003', name: 'Power Supply 500W', category: 'Components', quantity: 0, unit: 'pcs', unitCost: 65.00, totalValue: 0, reorderLevel: 40, location: 'B-01-02', status: 'out_of_stock', lastUpdated: '2024-01-13' },
  { id: '4', sku: 'SKU-004', name: 'Aluminum Sheet 2mm', category: 'Raw Materials', quantity: 500, unit: 'kg', unitCost: 8.50, totalValue: 4250, reorderLevel: 100, location: 'C-03-01', status: 'in_stock', lastUpdated: '2024-01-15' },
  { id: '5', sku: 'SKU-005', name: 'USB-C Connector Cable', category: 'Components', quantity: 45, unit: 'pcs', unitCost: 3.20, totalValue: 144, reorderLevel: 100, location: 'A-04-02', status: 'low_stock', lastUpdated: '2024-01-12' },
  { id: '6', sku: 'SKU-006', name: 'Cardboard Box Medium', category: 'Packaging', quantity: 2500, unit: 'pcs', unitCost: 0.85, totalValue: 2125, reorderLevel: 500, location: 'D-01-01', status: 'in_stock', lastUpdated: '2024-01-15' },
  { id: '7', sku: 'SKU-007', name: 'Thermal Paste 10g', category: 'Consumables', quantity: 180, unit: 'tubes', unitCost: 12.00, totalValue: 2160, reorderLevel: 50, location: 'A-05-01', status: 'in_stock', lastUpdated: '2024-01-14' },
  { id: '8', sku: 'SKU-008', name: 'Copper Wire 2mm', category: 'Raw Materials', quantity: 320, unit: 'm', unitCost: 2.50, totalValue: 800, reorderLevel: 200, location: 'C-02-01', status: 'in_stock', lastUpdated: '2024-01-11' },
];

const categories = ['All', 'Electronics', 'Components', 'Raw Materials', 'Packaging', 'Consumables'];
const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

export function ItemsPage() {
  const [items] = useState<InventoryItem[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'In Stock' && item.status === 'in_stock') ||
                         (statusFilter === 'Low Stock' && item.status === 'low_stock') ||
                         (statusFilter === 'Out of Stock' && item.status === 'out_of_stock');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">In Stock</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Items"
        description="Manage your product catalog and stock items"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {items.length} items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                        <Package className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    {item.quantity.toLocaleString()} {item.unit}
                  </TableCell>
                  <TableCell className="text-right">${item.unitCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${item.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.location}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsViewDialogOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Item
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Barcode className="mr-2 h-4 w-4" />
                          Print Label
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
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

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="SKU-XXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" placeholder="Enter item name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measure</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                    <SelectItem value="l">Liters (l)</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost ($)</Label>
                <Input id="unitCost" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input id="reorderLevel" type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input id="location" placeholder="e.g., A-01-01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Item description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{selectedItem.sku}</p>
                </div>
                {getStatusBadge(selectedItem.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedItem.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Storage Location</p>
                  <p className="font-medium font-mono">{selectedItem.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Quantity</p>
                  <p className="font-medium">{selectedItem.quantity.toLocaleString()} {selectedItem.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reorder Level</p>
                  <p className="font-medium">{selectedItem.reorderLevel} {selectedItem.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unit Cost</p>
                  <p className="font-medium">${selectedItem.unitCost.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-medium">${selectedItem.totalValue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{selectedItem.lastUpdated}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button>Edit Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
