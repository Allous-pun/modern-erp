import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Download, TrendingUp, Target, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const salesTrendData = [
  { name: 'Jan', value: 125000 },
  { name: 'Feb', value: 145000 },
  { name: 'Mar', value: 168000 },
  { name: 'Apr', value: 152000 },
  { name: 'May', value: 189000 },
  { name: 'Jun', value: 210000 },
];

const pipelineData = [
  { name: 'Qualified', value: 850000 },
  { name: 'Proposal', value: 620000 },
  { name: 'Negotiation', value: 380000 },
  { name: 'Closed Won', value: 290000 },
];

const regionData = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 28 },
  { name: 'Asia Pacific', value: 18 },
  { name: 'Other', value: 9 },
];

const salesRepPerformance = [
  { rep: 'Alex Thompson', region: 'North America', target: 250000, actual: 285000, deals: 28, winRate: 68 },
  { rep: 'Maria Garcia', region: 'Europe', target: 220000, actual: 198000, deals: 22, winRate: 55 },
  { rep: 'James Wilson', region: 'North America', target: 200000, actual: 215000, deals: 25, winRate: 72 },
  { rep: 'Sarah Chen', region: 'Asia Pacific', target: 180000, actual: 192000, deals: 19, winRate: 63 },
  { rep: 'Michael Brown', region: 'Europe', target: 200000, actual: 175000, deals: 18, winRate: 50 },
];

const topDeals = [
  { opportunity: 'Enterprise License - TechCorp', value: 125000, stage: 'Negotiation', probability: 75, closeDate: '2024-02-15' },
  { opportunity: 'Annual Contract - GlobalTrade', value: 98000, stage: 'Proposal', probability: 60, closeDate: '2024-02-28' },
  { opportunity: 'Premium Package - StartupXYZ', value: 85000, stage: 'Qualified', probability: 40, closeDate: '2024-03-15' },
  { opportunity: 'Expansion - MegaCorp', value: 75000, stage: 'Closed Won', probability: 100, closeDate: '2024-01-30' },
  { opportunity: 'New Business - InnovateTech', value: 68000, stage: 'Proposal', probability: 55, closeDate: '2024-02-20' },
];

const productPerformance = [
  { product: 'Enterprise Suite', revenue: 450000, units: 85, growth: 15.2 },
  { product: 'Professional Plan', revenue: 320000, units: 245, growth: 8.5 },
  { product: 'Starter Package', revenue: 180000, units: 520, growth: 22.1 },
  { product: 'Add-on Services', revenue: 95000, units: 180, growth: -5.2 },
  { product: 'Training & Support', revenue: 65000, units: 95, growth: 12.8 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function SalesReports() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$989K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">$2.14M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deals Closed</p>
                <p className="text-2xl font-bold">112</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">62%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="reps">Sales Reps</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Sales Trend"
              subtitle="Monthly revenue"
              type="area"
              data={salesTrendData}
              height={300}
            />
            <ChartWidget
              title="Revenue by Region"
              subtitle="Geographic distribution"
              type="pie"
              data={regionData}
              showLegend
              height={300}
            />
          </div>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Pipeline by Stage"
              subtitle="Deal values by stage"
              type="bar"
              data={pipelineData}
              height={300}
            />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Opportunities</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opportunity</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Prob.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topDeals.map((deal) => (
                      <TableRow key={deal.opportunity}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {deal.opportunity}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(deal.value)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            deal.stage === 'Closed Won' ? 'default' :
                            deal.stage === 'Negotiation' ? 'secondary' : 'outline'
                          }>
                            {deal.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{deal.probability}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Reps Tab */}
        <TabsContent value="reps">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales Representative Performance</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sales Rep</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Deals</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="w-[150px]">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesRepPerformance.map((rep) => {
                    const progress = (rep.actual / rep.target) * 100;
                    return (
                      <TableRow key={rep.rep}>
                        <TableCell className="font-medium">{rep.rep}</TableCell>
                        <TableCell>{rep.region}</TableCell>
                        <TableCell className="text-right">{formatCurrency(rep.target)}</TableCell>
                        <TableCell className={cn(
                          "text-right font-medium",
                          rep.actual >= rep.target ? "text-emerald-600" : "text-orange-500"
                        )}>
                          {formatCurrency(rep.actual)}
                        </TableCell>
                        <TableCell className="text-right">{rep.deals}</TableCell>
                        <TableCell className="text-right">{rep.winRate}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(progress, 100)} className="h-2" />
                            <span className="text-sm text-muted-foreground w-12">
                              {progress.toFixed(0)}%
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

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Performance</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                    <TableHead className="w-[150px]">Revenue Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product) => {
                    const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue, 0);
                    const share = (product.revenue / totalRevenue) * 100;
                    return (
                      <TableRow key={product.product}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                        <TableCell className="text-right">{product.units}</TableCell>
                        <TableCell className={cn(
                          "text-right font-medium",
                          product.growth >= 0 ? "text-emerald-600" : "text-red-500"
                        )}>
                          {product.growth >= 0 ? '+' : ''}{product.growth}%
                        </TableCell>
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
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
