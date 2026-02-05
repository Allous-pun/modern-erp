 import { useState } from "react";
 import { PageHeader } from "@/components/shared/PageHeader";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { 
   Plus, 
   Search, 
   Filter,
   FileText,
   DollarSign,
   Calendar,
   Clock,
   CheckCircle,
   XCircle,
   MoreHorizontal,
   Send,
   Copy,
   Download
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const mockQuotations = [
   { id: "1", number: "QT-2024-001", customer: "Tech Corp", items: 5, total: 75000, status: "sent", validUntil: "2024-02-15", createdAt: "2024-01-15", createdBy: "Sarah Wilson" },
   { id: "2", number: "QT-2024-002", customer: "Global Industries", items: 3, total: 125000, status: "accepted", validUntil: "2024-02-20", createdAt: "2024-01-14", createdBy: "Mike Johnson" },
   { id: "3", number: "QT-2024-003", customer: "Innovate LLC", items: 8, total: 45000, status: "draft", validUntil: "2024-02-25", createdAt: "2024-01-13", createdBy: "David Brown" },
   { id: "4", number: "QT-2024-004", customer: "Summit Group", items: 2, total: 200000, status: "expired", validUntil: "2024-01-10", createdAt: "2024-01-01", createdBy: "Sarah Wilson" },
   { id: "5", number: "QT-2024-005", customer: "Apex Solutions", items: 4, total: 85000, status: "rejected", validUntil: "2024-01-20", createdAt: "2024-01-05", createdBy: "Mike Johnson" },
   { id: "6", number: "QT-2024-006", customer: "Prime Tech", items: 6, total: 155000, status: "sent", validUntil: "2024-02-28", createdAt: "2024-01-16", createdBy: "David Brown" },
 ];
 
 const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
   draft: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: <FileText className="h-3 w-3" /> },
   sent: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: <Send className="h-3 w-3" /> },
   accepted: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: <CheckCircle className="h-3 w-3" /> },
   rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: <XCircle className="h-3 w-3" /> },
   expired: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: <Clock className="h-3 w-3" /> },
 };
 
 export function QuotationsPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
   const [statusFilter, setStatusFilter] = useState("all");
 
   const filteredQuotations = mockQuotations.filter(quote => {
     const matchesSearch = quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
       quote.customer.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
     return matchesSearch && matchesStatus;
   });
 
   const totalValue = mockQuotations.reduce((sum, q) => sum + q.total, 0);
   const acceptedValue = mockQuotations.filter(q => q.status === "accepted").reduce((sum, q) => sum + q.total, 0);
   const pendingQuotes = mockQuotations.filter(q => q.status === "sent").length;
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Quotations"
         description="Create and manage sales quotations for your customers"
       />
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <FileText className="h-4 w-4" />
               <span className="text-sm">Total Quotes</span>
             </div>
             <div className="text-2xl font-bold">{mockQuotations.length}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <DollarSign className="h-4 w-4" />
               <span className="text-sm">Total Value</span>
             </div>
             <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <CheckCircle className="h-4 w-4" />
               <span className="text-sm">Accepted Value</span>
             </div>
             <div className="text-2xl font-bold text-green-600">${acceptedValue.toLocaleString()}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Clock className="h-4 w-4" />
               <span className="text-sm">Pending Response</span>
             </div>
             <div className="text-2xl font-bold">{pendingQuotes}</div>
           </CardContent>
         </Card>
       </div>
 
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search quotations..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
             />
           </div>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-40">
               <SelectValue placeholder="Filter by status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="draft">Draft</SelectItem>
               <SelectItem value="sent">Sent</SelectItem>
               <SelectItem value="accepted">Accepted</SelectItem>
               <SelectItem value="rejected">Rejected</SelectItem>
               <SelectItem value="expired">Expired</SelectItem>
             </SelectContent>
           </Select>
         </div>
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               New Quotation
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-lg">
             <DialogHeader>
               <DialogTitle>Create Quotation</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label>Customer</Label>
                 <Select>
                   <SelectTrigger>
                     <SelectValue placeholder="Select customer" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="tech-corp">Tech Corp</SelectItem>
                     <SelectItem value="global">Global Industries</SelectItem>
                     <SelectItem value="innovate">Innovate LLC</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Valid Until</Label>
                   <Input type="date" />
                 </div>
                 <div className="space-y-2">
                   <Label>Discount (%)</Label>
                   <Input type="number" placeholder="0" min="0" max="100" />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Line Items</Label>
                 <div className="border rounded-md p-4 space-y-2">
                   <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                     <div className="col-span-5">Product</div>
                     <div className="col-span-2">Qty</div>
                     <div className="col-span-2">Price</div>
                     <div className="col-span-3">Total</div>
                   </div>
                   <div className="grid grid-cols-12 gap-2 items-center">
                     <Input className="col-span-5" placeholder="Product name" />
                     <Input className="col-span-2" type="number" placeholder="1" />
                     <Input className="col-span-2" type="number" placeholder="0" />
                     <div className="col-span-3 text-sm font-medium">$0.00</div>
                   </div>
                   <Button variant="outline" size="sm" className="w-full">
                     <Plus className="h-4 w-4 mr-2" />
                     Add Item
                   </Button>
                 </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                   Save as Draft
                 </Button>
                 <Button className="flex-1" onClick={() => setDialogOpen(false)}>
                   <Send className="h-4 w-4 mr-2" />
                   Send Quote
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Quotations Table */}
       <Card>
         <CardContent className="p-0">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Quote #</TableHead>
                 <TableHead>Customer</TableHead>
                 <TableHead>Items</TableHead>
                 <TableHead>Total</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Valid Until</TableHead>
                 <TableHead>Created By</TableHead>
                 <TableHead className="w-10"></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredQuotations.map((quote) => (
                 <TableRow key={quote.id}>
                   <TableCell className="font-medium">{quote.number}</TableCell>
                   <TableCell>{quote.customer}</TableCell>
                   <TableCell>{quote.items} items</TableCell>
                   <TableCell className="font-semibold">${quote.total.toLocaleString()}</TableCell>
                   <TableCell>
                     <Badge className={`${statusConfig[quote.status].color} flex items-center gap-1 w-fit`}>
                       {statusConfig[quote.status].icon}
                       {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                     </Badge>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-1">
                       <Calendar className="h-4 w-4 text-muted-foreground" />
                       {quote.validUntil}
                     </div>
                   </TableCell>
                   <TableCell>{quote.createdBy}</TableCell>
                   <TableCell>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <MoreHorizontal className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem>
                           <FileText className="h-4 w-4 mr-2" />
                           View Details
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                           <Copy className="h-4 w-4 mr-2" />
                           Duplicate
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                           <Download className="h-4 w-4 mr-2" />
                           Download PDF
                         </DropdownMenuItem>
                         {quote.status === "accepted" && (
                           <DropdownMenuItem>Convert to Order</DropdownMenuItem>
                         )}
                         <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
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