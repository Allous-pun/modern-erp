import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, Box, Warehouse, ArrowLeftRight, AlertTriangle, 
  TrendingUp, TrendingDown, RefreshCcw, Eye
} from 'lucide-react';

const stockLevelData = [
  { name: 'Jan', inStock: 4500, lowStock: 120, outOfStock: 25 },
  { name: 'Feb', inStock: 4800, lowStock: 95, outOfStock: 18 },
  { name: 'Mar', inStock: 5200, lowStock: 85, outOfStock: 12 },
  { name: 'Apr', inStock: 4900, lowStock: 110, outOfStock: 22 },
  { name: 'May', inStock: 5400, lowStock: 75, outOfStock: 8 },
  { name: 'Jun', inStock: 5600, lowStock: 68, outOfStock: 5 },
];

const movementData = [
  { name: 'Mon', inbound: 450, outbound: 380 },
  { name: 'Tue', inbound: 520, outbound: 420 },
  { name: 'Wed', inbound: 380, outbound: 510 },
  { name: 'Thu', inbound: 620, outbound: 480 },
  { name: 'Fri', inbound: 480, outbound: 550 },
  { name: 'Sat', inbound: 150, outbound: 120 },
  { name: 'Sun', inbound: 80, outbound: 60 },
];

const categoryData = [
  { name: 'Electronics', value: 2450, fill: 'hsl(var(--chart-1))' },
  { name: 'Raw Materials', value: 1850, fill: 'hsl(var(--chart-2))' },
  { name: 'Packaging', value: 920, fill: 'hsl(var(--chart-3))' },
  { name: 'Components', value: 1280, fill: 'hsl(var(--chart-4))' },
  { name: 'Finished Goods', value: 680, fill: 'hsl(var(--chart-5))' },
];

const lowStockItems = [
  { id: 1, sku: 'SKU-001', name: 'Microprocessor Unit A1', quantity: 15, reorderLevel: 50, warehouse: 'Main' },
  { id: 2, sku: 'SKU-042', name: 'LED Display Panel 15"', quantity: 8, reorderLevel: 25, warehouse: 'East' },
  { id: 3, sku: 'SKU-089', name: 'Power Supply 500W', quantity: 22, reorderLevel: 40, warehouse: 'Main' },
  { id: 4, sku: 'SKU-156', name: 'USB-C Connector Cable', quantity: 45, reorderLevel: 100, warehouse: 'West' },
  { id: 5, sku: 'SKU-203', name: 'Aluminum Casing XL', quantity: 12, reorderLevel: 30, warehouse: 'Main' },
];

const recentMovements = [
  { id: 1, type: 'inbound', item: 'Circuit Board PCB-X1', quantity: 500, from: 'Supplier A', to: 'Main Warehouse', time: '10 mins ago' },
  { id: 2, type: 'outbound', item: 'Finished Product FP-100', quantity: 150, from: 'Main Warehouse', to: 'Customer Order #4521', time: '25 mins ago' },
  { id: 3, type: 'transfer', item: 'Raw Material RM-55', quantity: 200, from: 'East Warehouse', to: 'Main Warehouse', time: '1 hour ago' },
  { id: 4, type: 'inbound', item: 'Packaging Box PB-M', quantity: 1000, from: 'Supplier C', to: 'West Warehouse', time: '2 hours ago' },
  { id: 5, type: 'outbound', item: 'Component CP-220', quantity: 75, from: 'Main Warehouse', to: 'Manufacturing', time: '3 hours ago' },
];

export function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Overview"
        description="Monitor stock levels, movements, and warehouse operations"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Items"
          value="7,180"
          change={5.2}
          changeLabel="vs last month"
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Low Stock Alerts"
          value="68"
          change={-12}
          changeLabel="vs last month"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatsCard
          title="Warehouses"
          value="5"
          changeLabel="Active locations"
          icon={<Warehouse className="h-5 w-5" />}
        />
        <StatsCard
          title="Today's Movements"
          value="156"
          change={8.5}
          changeLabel="vs yesterday"
          icon={<ArrowLeftRight className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget
          title="Stock Level Trends"
          type="area"
          data={stockLevelData}
          dataKey="inStock"
        />
        <ChartWidget
          title="Daily Stock Movements"
          type="bar"
          data={movementData}
          dataKey="inbound"
        />
      </div>

      {/* Category Distribution & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartWidget
          title="Inventory by Category"
          type="pie"
          data={categoryData}
          dataKey="value"
        />
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reorder All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sku} • {item.warehouse} Warehouse</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-destructive">{item.quantity} units</p>
                      <p className="text-xs text-muted-foreground">Reorder at {item.reorderLevel}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Stock Movements</CardTitle>
          <Button variant="ghost" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    movement.type === 'inbound' 
                      ? 'bg-green-500/10' 
                      : movement.type === 'outbound'
                      ? 'bg-blue-500/10'
                      : 'bg-orange-500/10'
                  }`}>
                    {movement.type === 'inbound' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : movement.type === 'outbound' ? (
                      <TrendingDown className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ArrowLeftRight className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{movement.item}</p>
                    <p className="text-sm text-muted-foreground">
                      {movement.from} → {movement.to}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    movement.type === 'inbound' ? 'default' :
                    movement.type === 'outbound' ? 'secondary' : 'outline'
                  }>
                    {movement.type === 'inbound' ? '+' : movement.type === 'outbound' ? '-' : '↔'} {movement.quantity}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{movement.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
