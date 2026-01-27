import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  ShoppingBag, Truck, FileText, Package, DollarSign, TrendingUp,
  TrendingDown, Clock, AlertTriangle, CheckCircle, ArrowRight,
  Calendar, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const spendingData = [
  { month: 'Aug', spend: 125000 },
  { month: 'Sep', spend: 145000 },
  { month: 'Oct', spend: 138000 },
  { month: 'Nov', spend: 162000 },
  { month: 'Dec', spend: 155000 },
  { month: 'Jan', spend: 178000 },
];

const categoryData = [
  { name: 'Raw Materials', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Electronics', value: 25, color: 'hsl(210, 70%, 50%)' },
  { name: 'Office Supplies', value: 15, color: 'hsl(150, 70%, 45%)' },
  { name: 'Services', value: 10, color: 'hsl(45, 90%, 50%)' },
  { name: 'Other', value: 5, color: 'hsl(0, 0%, 60%)' },
];

const recentPOs = [
  { id: 'PO-2024-001', supplier: 'Acme Industrial', total: 45000, status: 'pending', date: '2024-01-20' },
  { id: 'PO-2024-002', supplier: 'TechParts Global', total: 28500, status: 'confirmed', date: '2024-01-18' },
  { id: 'PO-2024-003', supplier: 'Office Essentials', total: 3200, status: 'partial', date: '2024-01-15' },
  { id: 'PO-2024-004', supplier: 'Premium Metals', total: 125000, status: 'received', date: '2024-01-10' },
];

const topSuppliers = [
  { name: 'Premium Metals Inc', spend: 2100000, orders: 45, rating: 4.6 },
  { name: 'Acme Industrial', spend: 1250000, orders: 156, rating: 4.5 },
  { name: 'TechParts Global', spend: 890000, orders: 89, rating: 4.8 },
];

const pendingActions = [
  { type: 'approval', title: '6 Requisitions pending approval', link: '/procurement/requisitions' },
  { type: 'delivery', title: '3 Expected deliveries this week', link: '/procurement/grn' },
  { type: 'inspection', title: '1 Pending quality inspection', link: '/procurement/quality' },
];

export function ProcurementDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'partial': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'received': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement Overview"
        description="Monitor purchasing activities, supplier performance, and spending"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">$178K</p>
              <p className="text-sm text-muted-foreground">Monthly Spend</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="outline">+8 new</Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Active POs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">94% on-time</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Deliveries This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <TrendingDown className="h-4 w-4" />
                <span>-3.2%</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">Active Suppliers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {pendingActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Button variant="outline" className="gap-2">
                  {action.type === 'approval' && <Clock className="h-4 w-4 text-yellow-600" />}
                  {action.type === 'delivery' && <Truck className="h-4 w-4 text-blue-600" />}
                  {action.type === 'inspection' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                  {action.title}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Spending Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    className="text-xs" 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#spendGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Spend by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Purchase Orders</CardTitle>
            <Link to="/procurement/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>${po.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(po.status)}>
                          {po.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Suppliers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Suppliers</CardTitle>
            <Link to="/procurement/suppliers">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">{supplier.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(supplier.spend / 1000000).toFixed(1)}M</p>
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star className="h-3 w-3 fill-yellow-400" />
                      <span>{supplier.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
