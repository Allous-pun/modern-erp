import React, { useState } from 'react';
import { 
  BookOpen, Search, Filter, Download, Calendar, ArrowUpDown,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LedgerEntry {
  id: string;
  date: string;
  journalId: string;
  description: string;
  account: string;
  accountCode: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
}

const ledgerEntries: LedgerEntry[] = [
  { id: '1', date: '2024-01-25', journalId: 'JE-2024-0156', description: 'Sales revenue - Acme Corp', account: 'Accounts Receivable', accountCode: '1120', debit: 15000, credit: 0, balance: 907000, reference: 'INV-2024-0234' },
  { id: '2', date: '2024-01-25', journalId: 'JE-2024-0156', description: 'Sales revenue - Acme Corp', account: 'Sales Revenue', accountCode: '4100', debit: 0, credit: 15000, balance: 2665000, reference: 'INV-2024-0234' },
  { id: '3', date: '2024-01-24', journalId: 'JE-2024-0155', description: 'Payroll processing - January', account: 'Salaries Expense', accountCode: '5210', debit: 45000, credit: 0, balance: 245000, reference: 'PAY-2024-01' },
  { id: '4', date: '2024-01-24', journalId: 'JE-2024-0155', description: 'Payroll processing - January', account: 'Cash', accountCode: '1110', debit: 0, credit: 45000, balance: 440000, reference: 'PAY-2024-01' },
  { id: '5', date: '2024-01-23', journalId: 'JE-2024-0154', description: 'Office supplies purchase', account: 'Office Supplies', accountCode: '5220', debit: 1250, credit: 0, balance: 18750, reference: 'PO-2024-0089' },
  { id: '6', date: '2024-01-23', journalId: 'JE-2024-0154', description: 'Office supplies purchase', account: 'Accounts Payable', accountCode: '2110', debit: 0, credit: 1250, balance: 235250, reference: 'PO-2024-0089' },
  { id: '7', date: '2024-01-22', journalId: 'JE-2024-0153', description: 'Payment received - Tech Solutions', account: 'Cash', accountCode: '1110', debit: 8500, credit: 0, balance: 485000, reference: 'REC-2024-0123' },
  { id: '8', date: '2024-01-22', journalId: 'JE-2024-0153', description: 'Payment received - Tech Solutions', account: 'Accounts Receivable', accountCode: '1120', debit: 0, credit: 8500, balance: 892000, reference: 'REC-2024-0123' },
  { id: '9', date: '2024-01-21', journalId: 'JE-2024-0152', description: 'Software license renewal', account: 'Software Expense', accountCode: '5230', debit: 2400, credit: 0, balance: 24000, reference: 'BILL-2024-0056' },
  { id: '10', date: '2024-01-21', journalId: 'JE-2024-0152', description: 'Software license renewal', account: 'Cash', accountCode: '1110', debit: 0, credit: 2400, balance: 476500, reference: 'BILL-2024-0056' },
  { id: '11', date: '2024-01-20', journalId: 'JE-2024-0151', description: 'Inventory purchase - Raw materials', account: 'Inventory', accountCode: '1130', debit: 28000, credit: 0, balance: 384000, reference: 'PO-2024-0088' },
  { id: '12', date: '2024-01-20', journalId: 'JE-2024-0151', description: 'Inventory purchase - Raw materials', account: 'Accounts Payable', accountCode: '2110', debit: 0, credit: 28000, balance: 234000, reference: 'PO-2024-0088' },
];

const formatCurrency = (amount: number) => {
  if (amount === 0) return '-';
  return `$${amount.toLocaleString()}`;
};

export function GeneralLedgerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  const totalDebits = ledgerEntries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = ledgerEntries.reduce((sum, entry) => sum + entry.credit, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Ledger"
        description="View and manage journal entries and account transactions"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'General Ledger' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              New Journal Entry
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDebits)}</p>
            <p className="text-xs text-muted-foreground mt-1">This period</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCredits)}</p>
            <p className="text-xs text-muted-foreground mt-1">This period</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Journal Entries</p>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Unposted Entries</p>
            <p className="text-2xl font-bold text-status-warning">8</p>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="1110">1110 - Cash</SelectItem>
                <SelectItem value="1120">1120 - Accounts Receivable</SelectItem>
                <SelectItem value="2110">2110 - Accounts Payable</SelectItem>
                <SelectItem value="4100">4100 - Sales Revenue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="current-quarter">Current Quarter</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Journal Entries</span>
            <Badge variant="secondary">{ledgerEntries.length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">
                    <Button variant="ghost" className="h-8 p-0 font-medium">
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-32">Journal ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-40">Account</TableHead>
                  <TableHead className="w-24 text-right">Debit</TableHead>
                  <TableHead className="w-24 text-right">Credit</TableHead>
                  <TableHead className="w-28 text-right">Balance</TableHead>
                  <TableHead className="w-32">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                    <TableCell>
                      <span className="text-primary hover:underline cursor-pointer font-medium">
                        {entry.journalId}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{entry.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{entry.account}</span>
                        <span className="text-xs text-muted-foreground">{entry.accountCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${entry.debit > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatCurrency(entry.debit)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${entry.credit > 0 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                      {formatCurrency(entry.credit)}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(entry.balance)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {entry.reference}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              Showing 1-12 of 156 entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="ghost" size="sm">
                2
              </Button>
              <Button variant="ghost" size="sm">
                3
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="ghost" size="sm">
                13
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
