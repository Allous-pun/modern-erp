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
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { 
   Plus, 
   Search, 
   ShoppingCart,
   DollarSign,
   Package,
   Truck,
   CheckCircle,
   Clock,
   MoreHorizontal,
   Eye,
   Printer
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const mockOrders = [
   { id: "1", number: "SO-2024-001", customer: "Tech Corp", items: 5, total: 75000, status: "delivered", paymentStatus: "paid", orderDate: "2024-01-15", deliveryDate: "2024-01-20" },
   { id: "2", number: "SO-2024-002", customer: "Global Industries", items: 3, total: 125000, status: "shipped", paymentStatus: "paid", orderDate: "2024-01-14", deliveryDate: "2024-01-25" },
   { id: "3", number: "SO-2024-003", customer: "Innovate LLC", items: 8, total: 45000, status: "processing", paymentStatus: "pending", orderDate: "2024-01-13", deliveryDate: "2024-02-01" },
   { id: "4", number: "SO-2024-004", customer: "Summit Group", items: 2, total: 200000, status: "confirmed", paymentStatus: "partial", orderDate: "2024-01-12", deliveryDate: "2024-02-05" },
   { id: "5", number: "SO-2024-005", customer: "Apex Solutions", items: 4, total: 85000, status: "pending", paymentStatus: "pending", orderDate: "2024-01-16", deliveryDate: "2024-02-10" },
   { id: "6", number: "SO-2024-006", customer: "Prime Tech", items: 6, total: 155000, status: "delivered", paymentStatus: "paid", orderDate: "2024-01-10", deliveryDate: "2024-01-18" },
 ];
 
 const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
   pending: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: <Clock className="h-3 w-3" /> },
   confirmed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: <CheckCircle className="h-3 w-3" /> },
   processing: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: <Package className="h-3 w-3" /> },
   shipped: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: <Truck className="h-3 w-3" /> },
   delivered: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: <CheckCircle className="h-3 w-3" /> },
 };
 
 const paymentConfig: Record<string, string> = {
   paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
   pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
   partial: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
 };
 
 export function SalesOrdersPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
   const [activeTab, setActiveTab] = useState("all");
 
   const getFilteredOrders = () => {
     let filtered = mockOrders;
     if (activeTab !== "all") {
       filtered = filtered.filter(order => order.status === activeTab);
     }
     return filtered.filter(order =>
       order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.customer.toLowerCase().includes(searchQuery.toLowerCase())
     );
   };
 
   const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
   const paidRevenue = mockOrders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);
   const pendingOrders = mockOrders.filter(o => o.status === "pending" || o.status === "confirmed").length;
   const inTransit = mockOrders.filter(o => o.status === "shipped").length;
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Sales Orders"
         description="Track and manage customer orders from confirmation to delivery"
       />
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <ShoppingCart className="h-4 w-4" />
               <span className="text-sm">Total Orders</span>
             </div>
             <div className="text-2xl font-bold">{mockOrders.length}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <DollarSign className="h-4 w-4" />
               <span className="text-sm">Total Revenue</span>
             </div>
             <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
             <div className="text-xs text-green-600">${paidRevenue.toLocaleString()} collected</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Clock className="h-4 w-4" />
               <span className="text-sm">Pending Orders</span>
             </div>
             <div className="text-2xl font-bold">{pendingOrders}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Truck className="h-4 w-4" />
               <span className="text-sm">In Transit</span>
             </div>
             <div className="text-2xl font-bold">{inTransit}</div>
           </CardContent>
         </Card>
       </div>
 
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search orders..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
             />
           </div>
         </div>
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               New Order
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-lg">
             <DialogHeader>
               <DialogTitle>Create Sales Order</DialogTitle>
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
                   <Label>Delivery Date</Label>
                   <Input type="date" />
                 </div>
                 <div className="space-y-2">
                   <Label>Payment Terms</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select terms" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="net30">Net 30</SelectItem>
                       <SelectItem value="net60">Net 60</SelectItem>
                       <SelectItem value="immediate">Immediate</SelectItem>
                     </SelectContent>
                   </Select>
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
               <Button className="w-full" onClick={() => setDialogOpen(false)}>
                 Create Order
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Orders with Tabs */}
       <Tabs value={activeTab} onValueChange={setActiveTab}>
         <TabsList>
           <TabsTrigger value="all">All Orders</TabsTrigger>
           <TabsTrigger value="pending">Pending</TabsTrigger>
           <TabsTrigger value="processing">Processing</TabsTrigger>
           <TabsTrigger value="shipped">Shipped</TabsTrigger>
           <TabsTrigger value="delivered">Delivered</TabsTrigger>
         </TabsList>
         <TabsContent value={activeTab} className="mt-4">
           <Card>
             <CardContent className="p-0">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Order #</TableHead>
                     <TableHead>Customer</TableHead>
                     <TableHead>Items</TableHead>
                     <TableHead>Total</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Payment</TableHead>
                     <TableHead>Delivery Date</TableHead>
                     <TableHead className="w-10"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {getFilteredOrders().map((order) => (
                     <TableRow key={order.id}>
                       <TableCell className="font-medium">{order.number}</TableCell>
                       <TableCell>{order.customer}</TableCell>
                       <TableCell>{order.items} items</TableCell>
                       <TableCell className="font-semibold">${order.total.toLocaleString()}</TableCell>
                       <TableCell>
                         <Badge className={`${statusConfig[order.status].color} flex items-center gap-1 w-fit`}>
                           {statusConfig[order.status].icon}
                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge className={paymentConfig[order.paymentStatus]}>
                           {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                         </Badge>
                       </TableCell>
                       <TableCell>{order.deliveryDate}</TableCell>
                       <TableCell>
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
                               <Printer className="h-4 w-4 mr-2" />
                               Print Order
                             </DropdownMenuItem>
                             <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                             <DropdownMenuItem>Update Status</DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
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