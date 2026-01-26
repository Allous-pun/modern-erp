import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { 
  Download, FileSpreadsheet, FileText, Printer, Calendar as CalendarIcon,
  TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package,
  BarChart3, PieChart, LineChart, Table2, Filter, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FinanceReports } from './FinanceReports';
import { HRReports } from './HRReports';
import { SalesReports } from './SalesReports';
import { InventoryReports } from './InventoryReports';

const overviewStats = [
  { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500' },
  { label: 'Active Employees', value: '248', change: '+3.2%', trend: 'up', icon: Users, color: 'text-blue-500' },
  { label: 'Sales Orders', value: '1,847', change: '+8.1%', trend: 'up', icon: ShoppingCart, color: 'text-purple-500' },
  { label: 'Inventory Value', value: '$890K', change: '-2.3%', trend: 'down', icon: Package, color: 'text-orange-500' },
];

const revenueData = [
  { name: 'Jan', value: 186000 },
  { name: 'Feb', value: 205000 },
  { name: 'Mar', value: 237000 },
  { name: 'Apr', value: 198000 },
  { name: 'May', value: 256000 },
  { name: 'Jun', value: 289000 },
  { name: 'Jul', value: 312000 },
  { name: 'Aug', value: 278000 },
  { name: 'Sep', value: 301000 },
  { name: 'Oct', value: 345000 },
  { name: 'Nov', value: 378000 },
  { name: 'Dec', value: 412000 },
];

const departmentData = [
  { name: 'Sales', value: 35 },
  { name: 'Engineering', value: 28 },
  { name: 'Marketing', value: 15 },
  { name: 'HR', value: 12 },
  { name: 'Operations', value: 10 },
];

const expenseBreakdown = [
  { name: 'Salaries', value: 450000 },
  { name: 'Operations', value: 180000 },
  { name: 'Marketing', value: 120000 },
  { name: 'Infrastructure', value: 95000 },
  { name: 'R&D', value: 85000 },
  { name: 'Other', value: 45000 },
];

export function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [period, setPeriod] = useState('year');

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting as ${type}...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive business intelligence and reporting"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        }
      />

      {/* Filters Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Finance
          </TabsTrigger>
          <TabsTrigger value="hr" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            HR
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className={cn(
                        "flex items-center text-sm mt-1",
                        stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                      )}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stat.change} from last period
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-full bg-muted", stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Revenue Trend"
              subtitle="Monthly revenue over the year"
              type="area"
              data={revenueData}
              height={300}
            />
            <ChartWidget
              title="Department Distribution"
              subtitle="Employee count by department"
              type="pie"
              data={departmentData}
              showLegend
              height={300}
            />
          </div>

          {/* More Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartWidget
              title="Expense Breakdown"
              subtitle="Expenses by category"
              type="bar"
              data={expenseBreakdown}
              height={300}
            />
            <ChartWidget
              title="Monthly Performance"
              subtitle="Revenue vs Target"
              type="line"
              data={revenueData.map((item, i) => ({
                ...item,
                target: 200000 + i * 15000,
              }))}
              height={300}
            />
          </div>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="h-5 w-5" />
                Quick Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Profit & Loss Statement', module: 'Finance', icon: DollarSign },
                  { name: 'Balance Sheet', module: 'Finance', icon: FileSpreadsheet },
                  { name: 'Employee Headcount', module: 'HR', icon: Users },
                  { name: 'Sales Pipeline', module: 'Sales', icon: TrendingUp },
                  { name: 'Stock Valuation', module: 'Inventory', icon: Package },
                  { name: 'Accounts Receivable Aging', module: 'Finance', icon: FileText },
                ].map((report) => (
                  <Button
                    key={report.name}
                    variant="outline"
                    className="h-auto p-4 justify-start"
                  >
                    <report.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.module}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance">
          <FinanceReports />
        </TabsContent>

        {/* HR Tab */}
        <TabsContent value="hr">
          <HRReports />
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <SalesReports />
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <InventoryReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
