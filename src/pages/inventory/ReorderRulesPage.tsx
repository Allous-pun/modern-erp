import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { 
  Plus, Search, Filter, RefreshCcw, AlertTriangle, 
  Settings, Edit, Trash2, MoreHorizontal, Bell, BellOff,
  Package, TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReorderRule {
  id: string;
  sku: string;
  itemName: string;
  category: string;
  warehouse: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  leadTimeDays: number;
  preferredSupplier: string;
  autoReorder: boolean;
  notifyOnLow: boolean;
  status: 'active' | 'inactive' | 'triggered';
  lastTriggered?: string;
}

const mockRules: ReorderRule[] = [
  { id: '1', sku: 'SKU-001', itemName: 'Microprocessor Unit A1', category: 'Electronics', warehouse: 'Main', currentStock: 250, minStock: 50, maxStock: 500, reorderPoint: 100, reorderQuantity: 200, leadTimeDays: 7, preferredSupplier: 'TechParts Inc', autoReorder: true, notifyOnLow: true, status: 'active' },
  { id: '2', sku: 'SKU-002', itemName: 'LED Display Panel 15"', category: 'Electronics', warehouse: 'East', currentStock: 8, minStock: 25, maxStock: 200, reorderPoint: 50, reorderQuantity: 100, leadTimeDays: 14, preferredSupplier: 'DisplayWorld', autoReorder: true, notifyOnLow: true, status: 'triggered', lastTriggered: '2024-01-15' },
  { id: '3', sku: 'SKU-003', itemName: 'Power Supply 500W', category: 'Components', warehouse: 'Main', currentStock: 22, minStock: 40, maxStock: 300, reorderPoint: 80, reorderQuantity: 150, leadTimeDays: 5, preferredSupplier: 'PowerTech', autoReorder: false, notifyOnLow: true, status: 'triggered', lastTriggered: '2024-01-14' },
  { id: '4', sku: 'SKU-004', itemName: 'Aluminum Sheet 2mm', category: 'Raw Materials', warehouse: 'West', currentStock: 500, minStock: 100, maxStock: 400, reorderPoint: 150, reorderQuantity: 200, leadTimeDays: 10, preferredSupplier: 'MetalWorks', autoReorder: true, notifyOnLow: false, status: 'active' },
  { id: '5', sku: 'SKU-005', itemName: 'USB-C Connector Cable', category: 'Components', warehouse: 'Main', currentStock: 45, minStock: 100, maxStock: 800, reorderPoint: 200, reorderQuantity: 400, leadTimeDays: 3, preferredSupplier: 'ConnectorPro', autoReorder: true, notifyOnLow: true, status: 'triggered', lastTriggered: '2024-01-13' },
  { id: '6', sku: 'SKU-006', itemName: 'Cardboard Box Medium', category: 'Packaging', warehouse: 'Main', currentStock: 2500, minStock: 500, maxStock: 3000, reorderPoint: 1000, reorderQuantity: 1500, leadTimeDays: 2, preferredSupplier: 'PackageCo', autoReorder: true, notifyOnLow: true, status: 'active' },
  { id: '7', sku: 'SKU-007', itemName: 'Thermal Paste 10g', category: 'Consumables', warehouse: 'East', currentStock: 180, minStock: 50, maxStock: 250, reorderPoint: 80, reorderQuantity: 100, leadTimeDays: 7, preferredSupplier: 'ThermalSolutions', autoReorder: false, notifyOnLow: true, status: 'inactive' },
  { id: '8', sku: 'SKU-008', itemName: 'Copper Wire 2mm', category: 'Raw Materials', warehouse: 'West', currentStock: 320, minStock: 200, maxStock: 600, reorderPoint: 250, reorderQuantity: 300, leadTimeDays: 8, preferredSupplier: 'WireWorks', autoReorder: true, notifyOnLow: true, status: 'active' },
];

const categories = ['All Categories', 'Electronics', 'Components', 'Raw Materials', 'Packaging', 'Consumables'];
const warehouses = ['All Warehouses', 'Main', 'East', 'West'];

export function ReorderRulesPage() {
  const [rules, setRules] = useState<ReorderRule[]>(mockRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [warehouseFilter, setWarehouseFilter] = useState('All Warehouses');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ReorderRule | null>(null);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || rule.category === categoryFilter;
    const matchesWarehouse = warehouseFilter === 'All Warehouses' || rule.warehouse === warehouseFilter;
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  const triggeredRules = rules.filter(r => r.status === 'triggered').length;
  const autoReorderEnabled = rules.filter(r => r.autoReorder).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/10 text-gray-600">Inactive</Badge>;
      case 'triggered':
        return <Badge className="bg-red-500/10 text-red-600">Triggered</Badge>;
      default:
        return null;
    }
  };

  const handleToggleAutoReorder = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, autoReorder: !rule.autoReorder } : rule
    ));
  };

  const handleToggleNotify = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, notifyOnLow: !rule.notifyOnLow } : rule
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reorder Rules"
        description="Configure automatic reorder points and quantities"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Run All Rules
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{rules.length}</p>
              </div>
              <Settings className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Triggered</p>
                <p className="text-2xl font-bold">{triggeredRules}</p>
                <p className="text-xs text-muted-foreground">Need reorder</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Reorder</p>
                <p className="text-2xl font-bold">{autoReorderEnabled}</p>
                <p className="text-xs text-muted-foreground">Rules enabled</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.status === 'active').length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Triggered Alerts */}
      {triggeredRules > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Reorder Alerts ({triggeredRules})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rules.filter(r => r.status === 'triggered').map(rule => (
                <div key={rule.id} className="flex items-center justify-between rounded-lg bg-white dark:bg-background p-3 border">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">{rule.itemName}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {rule.currentStock} | Reorder Point: {rule.reorderPoint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      Create PO
                    </Button>
                    <Button size="sm">
                      Reorder {rule.reorderQuantity} units
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map(wh => (
                  <SelectItem key={wh} value={wh}>{wh}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Reorder Point</TableHead>
                <TableHead className="text-right">Reorder Qty</TableHead>
                <TableHead className="text-center">Lead Time</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-center">Auto</TableHead>
                <TableHead className="text-center">Notify</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id} className={rule.status === 'triggered' ? 'bg-red-50 dark:bg-red-950/10' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.itemName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{rule.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>{rule.warehouse}</TableCell>
                  <TableCell className="text-right">
                    <span className={rule.currentStock <= rule.reorderPoint ? 'text-red-600 font-medium' : ''}>
                      {rule.currentStock.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{rule.reorderPoint.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{rule.reorderQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{rule.leadTimeDays} days</TableCell>
                  <TableCell className="max-w-[120px] truncate" title={rule.preferredSupplier}>
                    {rule.preferredSupplier}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={rule.autoReorder}
                      onCheckedChange={() => handleToggleAutoReorder(rule.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleToggleNotify(rule.id)}
                    >
                      {rule.notifyOnLow ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{getStatusBadge(rule.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedRule(rule); setIsEditDialogOpen(true); }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Run Now
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

      {/* Add Rule Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Reorder Rule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                <Label>Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="east">East Warehouse</SelectItem>
                    <SelectItem value="west">West Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Minimum Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Reorder Point</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Maximum Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reorder Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Lead Time (days)</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techparts">TechParts Inc</SelectItem>
                  <SelectItem value="displayworld">DisplayWorld</SelectItem>
                  <SelectItem value="powertech">PowerTech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Enable Auto-Reorder</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create purchase orders when stock falls below reorder point
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Low Stock Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send alerts when stock reaches reorder point
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Add Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Reorder Rule</DialogTitle>
          </DialogHeader>
          {selectedRule && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">{selectedRule.itemName}</p>
                <p className="text-sm text-muted-foreground font-mono">{selectedRule.sku}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Stock</Label>
                  <Input type="number" defaultValue={selectedRule.minStock} />
                </div>
                <div className="space-y-2">
                  <Label>Reorder Point</Label>
                  <Input type="number" defaultValue={selectedRule.reorderPoint} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Stock</Label>
                  <Input type="number" defaultValue={selectedRule.maxStock} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reorder Quantity</Label>
                  <Input type="number" defaultValue={selectedRule.reorderQuantity} />
                </div>
                <div className="space-y-2">
                  <Label>Lead Time (days)</Label>
                  <Input type="number" defaultValue={selectedRule.leadTimeDays} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Enable Auto-Reorder</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create purchase orders
                  </p>
                </div>
                <Switch defaultChecked={selectedRule.autoReorder} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Low Stock Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts when stock is low
                  </p>
                </div>
                <Switch defaultChecked={selectedRule.notifyOnLow} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
