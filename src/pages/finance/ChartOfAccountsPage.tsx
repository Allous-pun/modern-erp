import React, { useState } from 'react';
import { 
  FileSpreadsheet, Plus, Search, Filter, ChevronRight, ChevronDown,
  Folder, FolderOpen, MoreHorizontal, Edit, Trash2, Eye
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  children?: Account[];
  isExpanded?: boolean;
}

const accountsData: Account[] = [
  {
    id: '1',
    code: '1000',
    name: 'Assets',
    type: 'asset',
    balance: 2450000,
    children: [
      {
        id: '1-1',
        code: '1100',
        name: 'Current Assets',
        type: 'asset',
        balance: 1850000,
        children: [
          { id: '1-1-1', code: '1110', name: 'Cash and Cash Equivalents', type: 'asset', balance: 485000 },
          { id: '1-1-2', code: '1120', name: 'Accounts Receivable', type: 'asset', balance: 892000 },
          { id: '1-1-3', code: '1130', name: 'Inventory', type: 'asset', balance: 356000 },
          { id: '1-1-4', code: '1140', name: 'Prepaid Expenses', type: 'asset', balance: 117000 },
        ],
      },
      {
        id: '1-2',
        code: '1200',
        name: 'Fixed Assets',
        type: 'asset',
        balance: 600000,
        children: [
          { id: '1-2-1', code: '1210', name: 'Property & Equipment', type: 'asset', balance: 450000 },
          { id: '1-2-2', code: '1220', name: 'Accumulated Depreciation', type: 'asset', balance: -150000 },
        ],
      },
    ],
  },
  {
    id: '2',
    code: '2000',
    name: 'Liabilities',
    type: 'liability',
    balance: 890000,
    children: [
      {
        id: '2-1',
        code: '2100',
        name: 'Current Liabilities',
        type: 'liability',
        balance: 540000,
        children: [
          { id: '2-1-1', code: '2110', name: 'Accounts Payable', type: 'liability', balance: 234000 },
          { id: '2-1-2', code: '2120', name: 'Accrued Expenses', type: 'liability', balance: 156000 },
          { id: '2-1-3', code: '2130', name: 'Short-term Loans', type: 'liability', balance: 150000 },
        ],
      },
      {
        id: '2-2',
        code: '2200',
        name: 'Long-term Liabilities',
        type: 'liability',
        balance: 350000,
        children: [
          { id: '2-2-1', code: '2210', name: 'Long-term Debt', type: 'liability', balance: 350000 },
        ],
      },
    ],
  },
  {
    id: '3',
    code: '3000',
    name: 'Equity',
    type: 'equity',
    balance: 1560000,
    children: [
      { id: '3-1', code: '3100', name: 'Common Stock', type: 'equity', balance: 500000 },
      { id: '3-2', code: '3200', name: 'Retained Earnings', type: 'equity', balance: 1060000 },
    ],
  },
  {
    id: '4',
    code: '4000',
    name: 'Revenue',
    type: 'revenue',
    balance: 2850000,
    children: [
      { id: '4-1', code: '4100', name: 'Sales Revenue', type: 'revenue', balance: 2650000 },
      { id: '4-2', code: '4200', name: 'Service Revenue', type: 'revenue', balance: 150000 },
      { id: '4-3', code: '4300', name: 'Other Income', type: 'revenue', balance: 50000 },
    ],
  },
  {
    id: '5',
    code: '5000',
    name: 'Expenses',
    type: 'expense',
    balance: 1950000,
    children: [
      { id: '5-1', code: '5100', name: 'Cost of Goods Sold', type: 'expense', balance: 1200000 },
      { id: '5-2', code: '5200', name: 'Operating Expenses', type: 'expense', balance: 550000 },
      { id: '5-3', code: '5300', name: 'Administrative Expenses', type: 'expense', balance: 200000 },
    ],
  },
];

const typeColors: Record<string, string> = {
  asset: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  liability: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  equity: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  revenue: 'bg-green-500/10 text-green-600 dark:text-green-400',
  expense: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function ChartOfAccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedAccounts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatCurrency = (amount: number) => {
    const prefix = amount < 0 ? '-' : '';
    return `${prefix}$${Math.abs(amount).toLocaleString()}`;
  };

  const renderAccountRow = (account: Account, level: number = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedAccounts.has(account.id);
    const paddingLeft = level * 24 + 16;

    return (
      <React.Fragment key={account.id}>
        <div
          className="flex items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors"
          style={{ paddingLeft }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(account.id)}
                className="p-1 rounded hover:bg-muted"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-mono text-sm text-muted-foreground">{account.code}</span>
            <span className={`font-medium truncate ${hasChildren ? 'text-foreground' : 'text-foreground/80'}`}>
              {account.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className={typeColors[account.type]}>
              {account.type}
            </Badge>
            <span className={`font-mono text-sm min-w-[100px] text-right ${account.balance < 0 ? 'text-status-error' : ''}`}>
              {formatCurrency(account.balance)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-status-error">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {hasChildren && isExpanded && account.children!.map(child => renderAccountRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chart of Accounts"
        description="Manage your organization's account structure"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Chart of Accounts' },
        ]}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Code</Label>
                    <Input placeholder="e.g., 1150" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asset">Asset</SelectItem>
                        <SelectItem value="liability">Liability</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input placeholder="Enter account name" />
                </div>
                <div className="space-y-2">
                  <Label>Parent Account</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      <SelectItem value="1100">1100 - Current Assets</SelectItem>
                      <SelectItem value="1200">1200 - Fixed Assets</SelectItem>
                      <SelectItem value="2100">2100 - Current Liabilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Optional description" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create Account</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Assets', value: '$2,450,000', color: 'text-blue-600' },
          { label: 'Total Liabilities', value: '$890,000', color: 'text-orange-600' },
          { label: 'Total Equity', value: '$1,560,000', color: 'text-purple-600' },
          { label: 'Total Revenue', value: '$2,850,000', color: 'text-green-600' },
          { label: 'Total Expenses', value: '$1,950,000', color: 'text-red-600' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accounts Tree */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Account Structure</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-border">
            <div className="flex items-center py-2 px-4 bg-muted/50 text-sm font-medium text-muted-foreground">
              <div className="flex-1">Account</div>
              <div className="w-24 text-center">Type</div>
              <div className="w-28 text-right pr-12">Balance</div>
            </div>
            {accountsData.map(account => renderAccountRow(account))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
