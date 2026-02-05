 import { useState } from "react";
 import { PageHeader } from "@/components/shared/PageHeader";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { 
   Plus, 
   Search, 
   Filter,
   Building2,
   Mail,
   Phone,
   MapPin,
   DollarSign,
   Star,
   LayoutGrid,
   List,
   MoreHorizontal
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const mockCustomers = [
   { id: "1", name: "Tech Corp", contact: "John Smith", email: "john@techcorp.com", phone: "+1 555-0123", address: "123 Tech Blvd, San Francisco, CA", totalRevenue: 450000, orders: 12, status: "active", tier: "Enterprise", rating: 5 },
   { id: "2", name: "Global Industries", contact: "Emily Davis", email: "emily@global.com", phone: "+1 555-0124", address: "456 Global Ave, New York, NY", totalRevenue: 280000, orders: 8, status: "active", tier: "Business", rating: 4 },
   { id: "3", name: "Innovate LLC", contact: "Robert Chen", email: "robert@innovate.com", phone: "+1 555-0125", address: "789 Innovation Dr, Austin, TX", totalRevenue: 175000, orders: 6, status: "active", tier: "Business", rating: 5 },
   { id: "4", name: "Summit Group", contact: "Lisa Anderson", email: "lisa@summit.com", phone: "+1 555-0126", address: "321 Summit Rd, Seattle, WA", totalRevenue: 520000, orders: 15, status: "active", tier: "Enterprise", rating: 4 },
   { id: "5", name: "Apex Solutions", contact: "James Wilson", email: "james@apex.com", phone: "+1 555-0127", address: "654 Apex St, Denver, CO", totalRevenue: 95000, orders: 4, status: "inactive", tier: "Starter", rating: 3 },
   { id: "6", name: "Prime Tech", contact: "Maria Garcia", email: "maria@primetech.com", phone: "+1 555-0128", address: "987 Prime Way, Chicago, IL", totalRevenue: 210000, orders: 7, status: "active", tier: "Business", rating: 5 },
 ];
 
 const tierColors: Record<string, string> = {
   "Enterprise": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
   "Business": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
   "Starter": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
 };
 
 export function CustomersPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [viewMode, setViewMode] = useState<"grid" | "table">("table");
   const [dialogOpen, setDialogOpen] = useState(false);
 
   const filteredCustomers = mockCustomers.filter(customer =>
     customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     customer.contact.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const totalCustomers = mockCustomers.length;
   const activeCustomers = mockCustomers.filter(c => c.status === "active").length;
   const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Customer Management"
         description="Manage your customer relationships and account details"
       />
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Building2 className="h-4 w-4" />
               <span className="text-sm">Total Customers</span>
             </div>
             <div className="text-2xl font-bold">{totalCustomers}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Star className="h-4 w-4" />
               <span className="text-sm">Active Accounts</span>
             </div>
             <div className="text-2xl font-bold">{activeCustomers}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <DollarSign className="h-4 w-4" />
               <span className="text-sm">Lifetime Revenue</span>
             </div>
             <div className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(2)}M</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Building2 className="h-4 w-4" />
               <span className="text-sm">Enterprise Tier</span>
             </div>
             <div className="text-2xl font-bold">{mockCustomers.filter(c => c.tier === "Enterprise").length}</div>
           </CardContent>
         </Card>
       </div>
 
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search customers..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
             />
           </div>
           <Button variant="outline" size="icon">
             <Filter className="h-4 w-4" />
           </Button>
           <div className="flex border rounded-md">
             <Button
               variant={viewMode === "table" ? "secondary" : "ghost"}
               size="icon"
               onClick={() => setViewMode("table")}
             >
               <List className="h-4 w-4" />
             </Button>
             <Button
               variant={viewMode === "grid" ? "secondary" : "ghost"}
               size="icon"
               onClick={() => setViewMode("grid")}
             >
               <LayoutGrid className="h-4 w-4" />
             </Button>
           </div>
         </div>
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               Add Customer
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>Add New Customer</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label>Company Name</Label>
                 <Input placeholder="Acme Corporation" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Contact Person</Label>
                   <Input placeholder="John Doe" />
                 </div>
                 <div className="space-y-2">
                   <Label>Tier</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select tier" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="starter">Starter</SelectItem>
                       <SelectItem value="business">Business</SelectItem>
                       <SelectItem value="enterprise">Enterprise</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Email</Label>
                   <Input type="email" placeholder="contact@company.com" />
                 </div>
                 <div className="space-y-2">
                   <Label>Phone</Label>
                   <Input placeholder="+1 555-0100" />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Address</Label>
                 <Input placeholder="123 Business Ave, City, State" />
               </div>
               <Button className="w-full" onClick={() => setDialogOpen(false)}>
                 Create Customer
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Customer List */}
       {viewMode === "table" ? (
         <Card>
           <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Company</TableHead>
                   <TableHead>Contact</TableHead>
                   <TableHead>Tier</TableHead>
                   <TableHead>Revenue</TableHead>
                   <TableHead>Orders</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="w-10"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredCustomers.map((customer) => (
                   <TableRow key={customer.id}>
                     <TableCell>
                       <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                           <AvatarImage src={`https://avatar.vercel.sh/${customer.name}`} />
                           <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                         </Avatar>
                         <div>
                           <div className="font-medium">{customer.name}</div>
                           <div className="text-xs text-muted-foreground">{customer.email}</div>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div>{customer.contact}</div>
                       <div className="text-xs text-muted-foreground">{customer.phone}</div>
                     </TableCell>
                     <TableCell>
                       <Badge className={tierColors[customer.tier]}>{customer.tier}</Badge>
                     </TableCell>
                     <TableCell className="font-semibold">${customer.totalRevenue.toLocaleString()}</TableCell>
                     <TableCell>{customer.orders}</TableCell>
                     <TableCell>
                       <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                         {customer.status}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem>View Profile</DropdownMenuItem>
                           <DropdownMenuItem>Edit</DropdownMenuItem>
                           <DropdownMenuItem>Create Order</DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       ) : (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {filteredCustomers.map((customer) => (
             <Card key={customer.id} className="hover:shadow-md transition-shadow">
               <CardContent className="p-4">
                 <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <Avatar className="h-12 w-12">
                       <AvatarImage src={`https://avatar.vercel.sh/${customer.name}`} />
                       <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                     </Avatar>
                     <div>
                       <div className="font-semibold">{customer.name}</div>
                       <Badge className={tierColors[customer.tier]}>{customer.tier}</Badge>
                     </div>
                   </div>
                   <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                     {customer.status}
                   </Badge>
                 </div>
                 <div className="space-y-2 text-sm text-muted-foreground mb-4">
                   <div className="flex items-center gap-2">
                     <Mail className="h-4 w-4" />
                     {customer.email}
                   </div>
                   <div className="flex items-center gap-2">
                     <Phone className="h-4 w-4" />
                     {customer.phone}
                   </div>
                   <div className="flex items-center gap-2">
                     <MapPin className="h-4 w-4" />
                     <span className="truncate">{customer.address}</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between pt-4 border-t">
                   <div>
                     <div className="text-xs text-muted-foreground">Revenue</div>
                     <div className="font-semibold">${customer.totalRevenue.toLocaleString()}</div>
                   </div>
                   <div>
                     <div className="text-xs text-muted-foreground">Orders</div>
                     <div className="font-semibold">{customer.orders}</div>
                   </div>
                   <div className="flex items-center gap-1">
                     {[...Array(5)].map((_, i) => (
                       <Star
                         key={i}
                         className={`h-4 w-4 ${i < customer.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                       />
                     ))}
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}
     </div>
   );
 }