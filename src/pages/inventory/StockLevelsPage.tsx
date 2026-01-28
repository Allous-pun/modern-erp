import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Download, AlertTriangle, Package, 
  TrendingUp, TrendingDown, Minus, RefreshCcw
} from 'lucide-react';

interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  unit: string;
  status: 'optimal' | 'low' | 'critical' | 'overstock';
  trend: 'up' | 'down' | 'stable';
  lastMovement: string;
}

const mockStockItems: StockItem[] = [
  { id: '1', sku: 'SKU-001', name: 'Microprocessor Unit A1', category: 'Electronics', warehouse: 'Main', currentStock: 250, minStock: 50, maxStock: 500, reorderLevel: 100, unit: 'pcs', status: 'optimal', trend: 'stable', lastMovement: '2 hours ago' },
  { id: '2', sku: 'SKU-002', name: 'LED Display Panel 15"', category: 'Electronics', warehouse: 'East', currentStock: 8, minStock: 25, maxStock: 200, reorderLevel: 50, unit: 'pcs', status: 'critical', trend: 'down', lastMovement: '1 day ago' },
  { id: '3', sku: 'SKU-003', name: 'Power Supply 500W', category: 'Components', warehouse: 'Main', currentStock: 22, minStock: 40, maxStock: 300, reorderLevel: 80, unit: 'pcs', status: 'low', trend: 'down', lastMovement: '5 hours ago' },
  { id: '4', sku: 'SKU-004', name: 'Aluminum Sheet 2mm', category: 'Raw Materials', warehouse: 'West', currentStock: 500, minStock: 100, maxStock: 400, reorderLevel: 150, unit: 'kg', status: 'overstock', trend: 'up', lastMovement: '3 hours ago' },
  { id: '5', sku: 'SKU-005', name: 'USB-C Connector Cable', category: 'Components', warehouse: 'Main', currentStock: 45, minStock: 100, maxStock: 800, reorderLevel: 200, unit: 'pcs', status: 'critical', trend: 'down', lastMovement: '6 hours ago' },
  { id: '6', sku: 'SKU-006', name: 'Cardboard Box Medium', category: 'Packaging', warehouse: 'Main', currentStock: 2500, minStock: 500, maxStock: 3000, reorderLevel: 1000, unit: 'pcs', status: 'optimal', trend: 'stable', lastMovement: '30 mins ago' },
  { id: '7', sku: 'SKU-007', name: 'Thermal Paste 10g', category: 'Consumables', warehouse: 'East', currentStock: 180, minStock: 50, maxStock: 250, reorderLevel: 80, unit: 'tubes', status: 'optimal', trend: 'up', lastMovement: '1 hour ago' },
  { id: '8', sku: 'SKU-008', name: 'Copper Wire 2mm', category: 'Raw Materials', warehouse: 'West', currentStock: 320, minStock: 200, maxStock: 600, reorderLevel: 250, unit: 'm', status: 'optimal', trend: 'stable', lastMovement: '4 hours ago' },
];

const warehouses = ['All Warehouses', 'Main', 'East', 'West', 'North', 'South'];
const categories = ['All Categories', 'Electronics', 'Components', 'Raw Materials', 'Packaging', 'Consumables'];

export function StockLevelsPage() {
  const [stockItems] = useState<StockItem[]>(mockStockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('All Warehouses');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusTab, setStatusTab] = useState('all');

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'All Warehouses' || item.warehouse === warehouseFilter;
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    const matchesStatus = statusTab === 'all' || item.status === statusTab;
    return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus;
  });

  const statusCounts = {
    all: stockItems.length,
    optimal: stockItems.filter(i => i.status === 'optimal').length,
    low: stockItems.filter(i => i.status === 'low').length,
    critical: stockItems.filter(i => i.status === 'critical').length,
    overstock: stockItems.filter(i => i.status === 'overstock').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return <Badge className="bg-green-500/10 text-green-600">Optimal</Badge>;
      case 'low':
        return <Badge className="bg-yellow-500/10 text-yellow-600">Low</Badge>;
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-600">Critical</Badge>;
      case 'overstock':
        return <Badge className="bg-blue-500/10 text-blue-600">Overstock</Badge>;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500';
      case 'low':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      case 'overstock':
        return 'bg-blue-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Levels"
        description="Monitor inventory levels across all warehouses"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
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
                <p className="text-sm text-muted-foreground">Optimal Stock</p>
                <p className="text-2xl font-bold">{statusCounts.optimal}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{statusCounts.low}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{statusCounts.critical}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overstock</p>
                <p className="text-2xl font-bold">{statusCounts.overstock}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
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
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Stock Levels Table with Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={statusTab} onValueChange={setStatusTab}>
            <TabsList>
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="optimal">Optimal ({statusCounts.optimal})</TabsTrigger>
              <TabsTrigger value="low">Low ({statusCounts.low})</TabsTrigger>
              <TabsTrigger value="critical">Critical ({statusCounts.critical})</TabsTrigger>
              <TabsTrigger value="overstock">Overstock ({statusCounts.overstock})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead className="text-center">Current / Max</TableHead>
                <TableHead className="text-center">Reorder Point</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Movement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{item.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.warehouse}</TableCell>
                  <TableCell className="w-48">
                    <div className="space-y-1">
                      <Progress 
                        value={getStockPercentage(item.currentStock, item.maxStock)} 
                        className={`h-2 [&>div]:${getProgressColor(item.status)}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(getStockPercentage(item.currentStock, item.maxStock))}% capacity
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{item.currentStock.toLocaleString()}</span>
                    <span className="text-muted-foreground"> / {item.maxStock.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={item.currentStock <= item.reorderLevel ? 'text-destructive font-medium' : ''}>
                      {item.reorderLevel.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(item.trend)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.lastMovement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
