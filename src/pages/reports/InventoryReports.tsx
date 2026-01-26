import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Download, Package, AlertTriangle, TrendingUp, Warehouse, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const stockTrendData = [
  { name: 'Jan', value: 12500 },
  { name: 'Feb', value: 11800 },
  { name: 'Mar', value: 13200 },
  { name: 'Apr', value: 12900 },
  { name: 'May', value: 14100 },
  { name: 'Jun', value: 13600 },
];

const categoryDistribution = [
  { name: 'Electronics', value: 35 },
  { name: 'Raw Materials', value: 28 },
  { name: 'Packaging', value: 18 },
  { name: 'Spare Parts', value: 12 },
  { name: 'Consumables', value: 7 },
];

const warehouseUtilization = [
  { warehouse: 'Main Warehouse', capacity: 10000, used: 8500, location: 'New York' },
  { warehouse: 'Distribution Center A', capacity: 5000, used: 3800, location: 'Los Angeles' },
  { warehouse: 'Distribution Center B', capacity: 5000, used: 4200, location: 'Chicago' },
  { warehouse: 'Regional Store', capacity: 2000, used: 1650, location: 'Miami' },
];

const lowStockItems = [
  { sku: 'SKU-001', name: 'Widget A', category: 'Electronics', current: 25, reorder: 50, status: 'critical' },
  { sku: 'SKU-015', name: 'Component X', category: 'Spare Parts', current: 42, reorder: 75, status: 'low' },
  { sku: 'SKU-023', name: 'Material Y', category: 'Raw Materials', current: 180, reorder: 250, status: 'low' },
  { sku: 'SKU-045', name: 'Packaging Box', category: 'Packaging', current: 320, reorder: 500, status: 'low' },
  { sku: 'SKU-067', name: 'Connector Z', category: 'Electronics', current: 15, reorder: 100, status: 'critical' },
];

const stockMovements = [
  { date: '2024-01-28', type: 'in', sku: 'SKU-001', name: 'Widget A', quantity: 500, source: 'PO-2024-001' },
  { date: '2024-01-28', type: 'out', sku: 'SKU-015', name: 'Component X', quantity: 120, source: 'SO-2024-025' },
  { date: '2024-01-27', type: 'in', sku: 'SKU-023', name: 'Material Y', quantity: 1000, source: 'PO-2024-002' },
  { date: '2024-01-27', type: 'out', sku: 'SKU-045', name: 'Packaging Box', quantity: 250, source: 'SO-2024-024' },
  { date: '2024-01-26', type: 'transfer', sku: 'SKU-067', name: 'Connector Z', quantity: 50, source: 'WH-A to WH-B' },
];

const inventoryValuation = [
  { category: 'Electronics', items: 245, quantity: 12500, value: 385000, avgCost: 30.8 },
  { category: 'Raw Materials', items: 180, quantity: 45000, value: 225000, avgCost: 5.0 },
  { category: 'Packaging', items: 95, quantity: 28000, value: 84000, avgCost: 3.0 },
  { category: 'Spare Parts', items: 320, quantity: 8500, value: 127500, avgCost: 15.0 },
  { category: 'Consumables', items: 85, quantity: 15000, value: 45000, avgCost: 3.0 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function InventoryReports() {
  const totalValue = inventoryValuation.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">925</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">$866K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <RotateCcw className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Turnover Rate</p>
                <p className="text-2xl font-bold">4.2x</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouses</TabsTrigger>
          <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Stock Levels Trend"
              subtitle="Total units in inventory"
              type="line"
              data={stockTrendData}
              height={300}
            />
            <ChartWidget
              title="Category Distribution"
              subtitle="Items by category"
              type="pie"
              data={categoryDistribution}
              showLegend
              height={300}
            />
          </div>
        </TabsContent>

        {/* Warehouse Tab */}
        <TabsContent value="warehouse">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Warehouse Utilization</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Used</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="w-[200px]">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouseUtilization.map((wh) => {
                    const utilization = (wh.used / wh.capacity) * 100;
                    return (
                      <TableRow key={wh.warehouse}>
                        <TableCell className="font-medium">{wh.warehouse}</TableCell>
                        <TableCell>{wh.location}</TableCell>
                        <TableCell className="text-right">{wh.capacity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{wh.used.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{(wh.capacity - wh.used).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={utilization} 
                              className={cn(
                                "h-2",
                                utilization > 90 && "[&>div]:bg-red-500",
                                utilization > 75 && utilization <= 90 && "[&>div]:bg-orange-500"
                              )}
                            />
                            <span className="text-sm text-muted-foreground w-12">
                              {utilization.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="lowstock">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        item.status === 'critical' ? "text-red-500" : "text-orange-500"
                      )}>
                        {item.current}
                      </TableCell>
                      <TableCell className="text-right">{item.reorder}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.status === 'critical' ? 'destructive' : 'secondary'}>
                          {item.status === 'critical' ? 'Critical' : 'Low'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Stock Movements</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement, index) => (
                    <TableRow key={index}>
                      <TableCell>{movement.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          movement.type === 'in' ? 'default' :
                          movement.type === 'out' ? 'secondary' : 'outline'
                        }>
                          {movement.type === 'in' ? 'Inbound' :
                           movement.type === 'out' ? 'Outbound' : 'Transfer'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{movement.sku}</TableCell>
                      <TableCell className="font-medium">{movement.name}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        movement.type === 'in' ? "text-emerald-600" : 
                        movement.type === 'out' ? "text-red-500" : ""
                      )}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}{movement.quantity}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{movement.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Valuation Tab */}
        <TabsContent value="valuation">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inventory Valuation by Category</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total Qty</TableHead>
                    <TableHead className="text-right">Avg Cost</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="w-[150px]">Value Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryValuation.map((cat) => {
                    const share = (cat.value / totalValue) * 100;
                    return (
                      <TableRow key={cat.category}>
                        <TableCell className="font-medium">{cat.category}</TableCell>
                        <TableCell className="text-right">{cat.items}</TableCell>
                        <TableCell className="text-right">{cat.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(cat.avgCost)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(cat.value)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={share} className="h-2" />
                            <span className="text-sm text-muted-foreground w-12">
                              {share.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">925</TableCell>
                    <TableCell className="text-right">109,000</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
