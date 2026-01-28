import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, Warehouse, MapPin, Package, Users, Settings, 
  TrendingUp, TrendingDown, MoreHorizontal, Edit, Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  manager: string;
  capacity: number;
  usedCapacity: number;
  itemCount: number;
  status: 'active' | 'maintenance' | 'inactive';
  zones: number;
  employees: number;
  lastActivity: string;
}

const mockWarehouses: WarehouseData[] = [
  { 
    id: '1', 
    name: 'Main Distribution Center', 
    code: 'WH-MAIN', 
    address: '123 Industrial Blvd', 
    city: 'Chicago, IL', 
    country: 'USA',
    manager: 'John Smith',
    capacity: 50000,
    usedCapacity: 35000,
    itemCount: 4520,
    status: 'active',
    zones: 12,
    employees: 45,
    lastActivity: '5 mins ago'
  },
  { 
    id: '2', 
    name: 'East Coast Warehouse', 
    code: 'WH-EAST', 
    address: '456 Harbor Drive', 
    city: 'New York, NY', 
    country: 'USA',
    manager: 'Sarah Johnson',
    capacity: 30000,
    usedCapacity: 28500,
    itemCount: 2890,
    status: 'active',
    zones: 8,
    employees: 28,
    lastActivity: '12 mins ago'
  },
  { 
    id: '3', 
    name: 'West Coast Facility', 
    code: 'WH-WEST', 
    address: '789 Pacific Way', 
    city: 'Los Angeles, CA', 
    country: 'USA',
    manager: 'Mike Chen',
    capacity: 40000,
    usedCapacity: 22000,
    itemCount: 3150,
    status: 'active',
    zones: 10,
    employees: 35,
    lastActivity: '2 hours ago'
  },
  { 
    id: '4', 
    name: 'Northern Storage', 
    code: 'WH-NORTH', 
    address: '321 Lake Street', 
    city: 'Minneapolis, MN', 
    country: 'USA',
    manager: 'Emily Davis',
    capacity: 25000,
    usedCapacity: 8000,
    itemCount: 1240,
    status: 'maintenance',
    zones: 6,
    employees: 18,
    lastActivity: '1 day ago'
  },
  { 
    id: '5', 
    name: 'Southern Hub', 
    code: 'WH-SOUTH', 
    address: '654 Commerce Park', 
    city: 'Houston, TX', 
    country: 'USA',
    manager: 'Robert Wilson',
    capacity: 35000,
    usedCapacity: 31000,
    itemCount: 2680,
    status: 'active',
    zones: 9,
    employees: 32,
    lastActivity: '30 mins ago'
  },
];

export function WarehousesPage() {
  const [warehouses] = useState<WarehouseData[]>(mockWarehouses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const totalCapacity = warehouses.reduce((sum, wh) => sum + wh.capacity, 0);
  const totalUsed = warehouses.reduce((sum, wh) => sum + wh.usedCapacity, 0);
  const totalItems = warehouses.reduce((sum, wh) => sum + wh.itemCount, 0);
  const activeWarehouses = warehouses.filter(wh => wh.status === 'active').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/10 text-yellow-600">Maintenance</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500/10 text-red-600">Inactive</Badge>;
      default:
        return null;
    }
  };

  const getCapacityColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations and capacity"
        actions={
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Warehouses</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
                <p className="text-xs text-muted-foreground">{activeWarehouses} active</p>
              </div>
              <Warehouse className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">{(totalCapacity / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">storage units</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Space Utilization</p>
                <p className="text-2xl font-bold">{Math.round((totalUsed / totalCapacity) * 100)}%</p>
                <Progress value={(totalUsed / totalCapacity) * 100} className="mt-2 h-2" />
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">across all locations</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Warehouse className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{warehouse.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{warehouse.code}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelectedWarehouse(warehouse); setIsViewDialogOpen(true); }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{warehouse.city}, {warehouse.country}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Capacity Usage</span>
                  <span className="font-medium">
                    {Math.round((warehouse.usedCapacity / warehouse.capacity) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(warehouse.usedCapacity / warehouse.capacity) * 100} 
                  className={`h-2 [&>div]:${getCapacityColor(warehouse.usedCapacity, warehouse.capacity)}`}
                />
                <p className="text-xs text-muted-foreground">
                  {warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-lg font-semibold">{warehouse.itemCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Items</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{warehouse.zones}</p>
                  <p className="text-xs text-muted-foreground">Zones</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{warehouse.employees}</p>
                  <p className="text-xs text-muted-foreground">Staff</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                {getStatusBadge(warehouse.status)}
                <span className="text-xs text-muted-foreground">
                  Last activity: {warehouse.lastActivity}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Warehouse Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Warehouse</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Warehouse Name</Label>
                <Input id="name" placeholder="Enter warehouse name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Warehouse Code</Label>
                <Input id="code" placeholder="WH-XXX" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Street address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City, State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Country" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input id="manager" placeholder="Warehouse manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity</Label>
                <Input id="capacity" type="number" placeholder="Storage units" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zones">Number of Zones</Label>
                <Input id="zones" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Add Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Warehouse Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Warehouse Details</DialogTitle>
          </DialogHeader>
          {selectedWarehouse && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Warehouse className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedWarehouse.name}</h3>
                  <p className="text-muted-foreground font-mono">{selectedWarehouse.code}</p>
                </div>
                {getStatusBadge(selectedWarehouse.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedWarehouse.address}</p>
                  <p className="text-sm">{selectedWarehouse.city}, {selectedWarehouse.country}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Manager</p>
                  <p className="font-medium">{selectedWarehouse.manager}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity Utilization</span>
                  <span className="font-medium">
                    {selectedWarehouse.usedCapacity.toLocaleString()} / {selectedWarehouse.capacity.toLocaleString()} units
                  </span>
                </div>
                <Progress 
                  value={(selectedWarehouse.usedCapacity / selectedWarehouse.capacity) * 100} 
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{selectedWarehouse.itemCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{selectedWarehouse.zones}</p>
                  <p className="text-xs text-muted-foreground">Zones</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{selectedWarehouse.employees}</p>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{Math.round((selectedWarehouse.usedCapacity / selectedWarehouse.capacity) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Utilization</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button>Edit Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
