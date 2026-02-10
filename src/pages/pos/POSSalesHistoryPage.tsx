import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const salesHistory = [
  { id: "TXN-001", date: "2024-01-16 14:32", cashier: "Carol Davis", customer: "Walk-in", items: 3, total: 278.97, payment: "Card", status: "completed" },
  { id: "TXN-002", date: "2024-01-16 14:15", cashier: "Dan Wilson", customer: "John Doe", items: 1, total: 1299.00, payment: "Card", status: "completed" },
  { id: "TXN-003", date: "2024-01-16 13:48", cashier: "Carol Davis", customer: "Walk-in", items: 2, total: 129.98, payment: "Cash", status: "completed" },
  { id: "TXN-004", date: "2024-01-16 12:20", cashier: "Dan Wilson", customer: "Walk-in", items: 5, total: 456.95, payment: "QR Pay", status: "completed" },
  { id: "TXN-005", date: "2024-01-16 11:05", cashier: "Carol Davis", customer: "Jane Smith", items: 2, total: 348.00, payment: "Card", status: "refunded" },
  { id: "TXN-006", date: "2024-01-15 16:45", cashier: "Alice Johnson", customer: "Walk-in", items: 1, total: 49.99, payment: "Cash", status: "completed" },
  { id: "TXN-007", date: "2024-01-15 15:30", cashier: "Bob Smith", customer: "Walk-in", items: 4, total: 567.96, payment: "Card", status: "completed" },
  { id: "TXN-008", date: "2024-01-15 14:10", cashier: "Alice Johnson", customer: "Mike Brown", items: 2, total: 198.00, payment: "Gift Card", status: "completed" },
];

export function POSSalesHistoryPage() {
  const [search, setSearch] = useState("");

  const filtered = salesHistory.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase()) ||
    s.cashier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales History"
        description="View past POS transactions and receipts"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transactions
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.cashier}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell className="text-right">{sale.items}</TableCell>
                  <TableCell className="text-right font-medium">${sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sale.payment}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sale.status === "completed" ? "default" : "destructive"}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}