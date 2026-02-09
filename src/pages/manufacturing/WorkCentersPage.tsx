import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Settings, Activity, Clock, Wrench, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface WorkCenter {
  id: string;
  name: string;
  code: string;
  type: 'assembly' | 'machining' | 'packaging' | 'quality' | 'storage';
  status: 'operational' | 'maintenance' | 'idle' | 'offline';
  capacity: number;
  currentLoad: number;
  efficiency: number;
  operator: string;
  activeOrders: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const mockWorkCenters: WorkCenter[] = [
  { id: '1', name: 'Assembly Line 1', code: 'ASM-001', type: 'assembly', status: 'operational', capacity: 100, currentLoad: 85, efficiency: 94, operator: 'John Smith', activeOrders: 3, lastMaintenance: '2024-01-15', nextMaintenance: '2024-02-15' },
  { id: '2', name: 'Assembly Line 2', code: 'ASM-002', type: 'assembly', status: 'operational', capacity: 100, currentLoad: 72, efficiency: 91, operator: 'Sarah Johnson', activeOrders: 2, lastMaintenance: '2024-01-20', nextMaintenance: '2024-02-20' },
  { id: '3', name: 'CNC Machine 1', code: 'CNC-001', type: 'machining', status: 'operational', capacity: 50, currentLoad: 48, efficiency: 96, operator: 'Mike Chen', activeOrders: 1, lastMaintenance: '2024-02-01', nextMaintenance: '2024-03-01' },
  { id: '4', name: 'CNC Machine 2', code: 'CNC-002', type: 'machining', status: 'maintenance', capacity: 50, currentLoad: 0, efficiency: 0, operator: 'Unassigned', activeOrders: 0, lastMaintenance: '2024-02-06', nextMaintenance: '2024-03-06' },
  { id: '5', name: 'Injection Mold 1', code: 'INJ-001', type: 'machining', status: 'operational', capacity: 200, currentLoad: 180, efficiency: 92, operator: 'Lisa Wang', activeOrders: 4, lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-10' },
  { id: '6', name: 'SMT Line 1', code: 'SMT-001', type: 'assembly', status: 'idle', capacity: 150, currentLoad: 0, efficiency: 0, operator: 'Tom Brown', activeOrders: 0, lastMaintenance: '2024-01-25', nextMaintenance: '2024-02-25' },
  { id: '7', name: 'Packaging Station 1', code: 'PKG-001', type: 'packaging', status: 'operational', capacity: 300, currentLoad: 220, efficiency: 88, operator: 'Emma Davis', activeOrders: 5, lastMaintenance: '2024-01-30', nextMaintenance: '2024-03-01' },
  { id: '8', name: 'Quality Control Bay', code: 'QC-001', type: 'quality', status: 'operational', capacity: 100, currentLoad: 65, efficiency: 97, operator: 'Alex Wilson', activeOrders: 8, lastMaintenance: '2024-02-01', nextMaintenance: '2024-03-01' },
];

const getStatusConfig = (status: string) => {
  const config: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
    operational: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    maintenance: { icon: <Wrench className="h-4 w-4" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    idle: { icon: <Clock className="h-4 w-4" />, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    offline: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  };
  return config[status] || config.offline;
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    assembly: '🔧',
    machining: '⚙️',
    packaging: '📦',
    quality: '✅',
    storage: '🏭',
  };
  return icons[type] || '🏭';
};

export function WorkCentersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredCenters = mockWorkCenters.filter((center) => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || center.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    operational: mockWorkCenters.filter(c => c.status === 'operational').length,
    maintenance: mockWorkCenters.filter(c => c.status === 'maintenance').length,
    idle: mockWorkCenters.filter(c => c.status === 'idle').length,
    avgEfficiency: Math.round(
      mockWorkCenters.filter(c => c.status === 'operational').reduce((acc, c) => acc + c.efficiency, 0) /
      mockWorkCenters.filter(c => c.status === 'operational').length
    ),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Centers"
        description="Monitor and manage production work centers and equipment"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Work Center
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.operational}</div>
                <p className="text-sm text-muted-foreground">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{stats.maintenance}</div>
                <p className="text-sm text-muted-foreground">In Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.idle}</div>
                <p className="text-sm text-muted-foreground">Idle</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.avgEfficiency}%</div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="idle">Idle</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search work centers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Work Center Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCenters.map((center) => {
          const statusConfig = getStatusConfig(center.status);
          return (
            <Card key={center.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(center.type)}</span>
                    <div>
                      <CardTitle className="text-base">{center.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{center.code}</p>
                    </div>
                  </div>
                  <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                    {statusConfig.icon}
                    <span className="ml-1 capitalize">{center.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capacity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity Load</span>
                    <span className="font-medium">{center.currentLoad}%</span>
                  </div>
                  <Progress value={center.currentLoad} className="h-2" />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Efficiency</p>
                    <p className="font-medium">{center.efficiency}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active Orders</p>
                    <p className="font-medium">{center.activeOrders}</p>
                  </div>
                </div>

                {/* Operator */}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Operator</p>
                    <p className="font-medium">{center.operator}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Maintenance Warning */}
                {new Date(center.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && center.status === 'operational' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Maintenance due: {center.nextMaintenance}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
