import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { Download, TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

const profitLossData = [
  { category: 'Revenue', q1: 580000, q2: 620000, q3: 710000, q4: 850000, total: 2760000 },
  { category: 'Cost of Goods Sold', q1: -290000, q2: -310000, q3: -355000, q4: -425000, total: -1380000 },
  { category: 'Gross Profit', q1: 290000, q2: 310000, q3: 355000, q4: 425000, total: 1380000, isSubtotal: true },
  { category: 'Operating Expenses', q1: -145000, q2: -155000, q3: -178000, q4: -212000, total: -690000 },
  { category: 'Marketing', q1: -35000, q2: -40000, q3: -45000, q4: -50000, total: -170000 },
  { category: 'R&D', q1: -25000, q2: -28000, q3: -30000, q4: -35000, total: -118000 },
  { category: 'Net Profit', q1: 85000, q2: 87000, q3: 102000, q4: 128000, total: 402000, isTotal: true },
];

const cashFlowData = [
  { name: 'Jan', inflow: 180000, outflow: 145000 },
  { name: 'Feb', inflow: 195000, outflow: 160000 },
  { name: 'Mar', inflow: 210000, outflow: 175000 },
  { name: 'Apr', inflow: 225000, outflow: 190000 },
  { name: 'May', inflow: 240000, outflow: 195000 },
  { name: 'Jun', inflow: 255000, outflow: 210000 },
];

const arAgingData = [
  { customer: 'Acme Corp', current: 45000, days30: 12000, days60: 5000, days90: 0, total: 62000 },
  { customer: 'TechStart Inc', current: 28000, days30: 8000, days60: 0, days90: 3500, total: 39500 },
  { customer: 'Global Trade', current: 35000, days30: 0, days60: 7500, days90: 0, total: 42500 },
  { customer: 'Metro Systems', current: 52000, days30: 15000, days60: 0, days90: 0, total: 67000 },
  { customer: 'Prime Solutions', current: 18000, days30: 6000, days60: 4000, days90: 2000, total: 30000 },
];

const budgetData = [
  { department: 'Sales', budget: 450000, actual: 425000, variance: 25000 },
  { department: 'Marketing', budget: 180000, actual: 195000, variance: -15000 },
  { department: 'Operations', budget: 320000, actual: 298000, variance: 22000 },
  { department: 'HR', budget: 120000, actual: 118000, variance: 2000 },
  { department: 'IT', budget: 200000, actual: 215000, variance: -15000 },
  { department: 'R&D', budget: 280000, actual: 265000, variance: 15000 },
];

const formatCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  return value < 0 ? `(${formatted})` : formatted;
};

export function FinanceReports() {
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
                <p className="text-2xl font-bold">$2.76M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">$402K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accounts Receivable</p>
                <p className="text-2xl font-bold">$241K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <PiggyBank className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cash Balance</p>
                <p className="text-2xl font-bold">$1.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pnl" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="aging">AR Aging</TabsTrigger>
          <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
        </TabsList>

        {/* Profit & Loss Tab */}
        <TabsContent value="pnl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profit & Loss Statement</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Category</TableHead>
                    <TableHead className="text-right">Q1</TableHead>
                    <TableHead className="text-right">Q2</TableHead>
                    <TableHead className="text-right">Q3</TableHead>
                    <TableHead className="text-right">Q4</TableHead>
                    <TableHead className="text-right font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitLossData.map((row) => (
                    <TableRow key={row.category} className={cn(
                      row.isSubtotal && "bg-muted/50 font-medium",
                      row.isTotal && "bg-primary/5 font-bold"
                    )}>
                      <TableCell className={cn(row.isSubtotal || row.isTotal ? "font-semibold" : "")}>
                        {row.category}
                      </TableCell>
                      <TableCell className={cn("text-right", row.q1 < 0 && "text-red-500")}>
                        {formatCurrency(row.q1)}
                      </TableCell>
                      <TableCell className={cn("text-right", row.q2 < 0 && "text-red-500")}>
                        {formatCurrency(row.q2)}
                      </TableCell>
                      <TableCell className={cn("text-right", row.q3 < 0 && "text-red-500")}>
                        {formatCurrency(row.q3)}
                      </TableCell>
                      <TableCell className={cn("text-right", row.q4 < 0 && "text-red-500")}>
                        {formatCurrency(row.q4)}
                      </TableCell>
                      <TableCell className={cn("text-right font-bold", row.total < 0 && "text-red-500")}>
                        {formatCurrency(row.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Cash Flow Trend"
              subtitle="Monthly inflows and outflows"
              type="bar"
              data={cashFlowData.map(d => ({ name: d.name, value: d.inflow - d.outflow }))}
              height={300}
            />
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Inflow</TableHead>
                      <TableHead className="text-right">Outflow</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-right text-emerald-600">
                          {formatCurrency(row.inflow)}
                        </TableCell>
                        <TableCell className="text-right text-red-500">
                          {formatCurrency(-row.outflow)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(row.inflow - row.outflow)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AR Aging Tab */}
        <TabsContent value="aging">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Accounts Receivable Aging</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">1-30 Days</TableHead>
                    <TableHead className="text-right">31-60 Days</TableHead>
                    <TableHead className="text-right">60+ Days</TableHead>
                    <TableHead className="text-right font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arAgingData.map((row) => (
                    <TableRow key={row.customer}>
                      <TableCell className="font-medium">{row.customer}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.current)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.days30)}</TableCell>
                      <TableCell className={cn("text-right", row.days60 > 0 && "text-orange-500")}>
                        {formatCurrency(row.days60)}
                      </TableCell>
                      <TableCell className={cn("text-right", row.days90 > 0 && "text-red-500")}>
                        {formatCurrency(row.days90)}
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(row.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget vs Actual Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Budget vs Actual</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((row) => (
                    <TableRow key={row.department}>
                      <TableCell className="font-medium">{row.department}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.budget)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.actual)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        row.variance >= 0 ? "text-emerald-600" : "text-red-500"
                      )}>
                        {row.variance >= 0 ? '+' : ''}{formatCurrency(row.variance)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.variance >= 0 ? "default" : "destructive"}>
                          {row.variance >= 0 ? 'Under Budget' : 'Over Budget'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
