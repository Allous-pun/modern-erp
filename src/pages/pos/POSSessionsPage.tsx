import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Play, Square } from "lucide-react";

const sessions = [
  { id: "S-001", register: "Register 1", cashier: "Alice Johnson", startTime: "2024-01-15 08:00", endTime: "2024-01-15 16:00", transactions: 47, revenue: 12450.00, status: "closed" },
  { id: "S-002", register: "Register 2", cashier: "Bob Smith", startTime: "2024-01-15 09:00", endTime: "2024-01-15 17:00", transactions: 35, revenue: 8920.50, status: "closed" },
  { id: "S-003", register: "Register 1", cashier: "Carol Davis", startTime: "2024-01-16 08:00", endTime: null, transactions: 22, revenue: 5430.00, status: "active" },
  { id: "S-004", register: "Register 3", cashier: "Dan Wilson", startTime: "2024-01-16 10:00", endTime: null, transactions: 14, revenue: 3210.75, status: "active" },
];

export function POSSessionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="POS Sessions"
        description="Manage register sessions and cashier shifts"
        actions={
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Open New Session
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.filter(s => s.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${sessions.reduce((a, s) => a + s.revenue, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.reduce((a, s) => a + s.transactions, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Register</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell>{session.register}</TableCell>
                  <TableCell>{session.cashier}</TableCell>
                  <TableCell>{session.startTime}</TableCell>
                  <TableCell>{session.endTime || "—"}</TableCell>
                  <TableCell className="text-right">{session.transactions}</TableCell>
                  <TableCell className="text-right font-medium">${session.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === "active" ? "default" : "secondary"}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {session.status === "active" && (
                      <Button variant="outline" size="sm">
                        <Square className="h-3 w-3 mr-1" />
                        Close
                      </Button>
                    )}
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