 import { useState } from "react";
 import { PageHeader } from "@/components/shared/PageHeader";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Textarea } from "@/components/ui/textarea";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { 
   Plus, 
   Search, 
   MessageSquare,
   Clock,
   AlertCircle,
   CheckCircle,
   User,
   MoreHorizontal,
   ArrowUpRight,
   Tag
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const mockTickets = [
   { id: "1", number: "TKT-001", subject: "Cannot access dashboard", customer: "Tech Corp", contact: "John Smith", priority: "high", status: "open", category: "Technical", assignee: "Sarah Wilson", createdAt: "2024-01-16 10:30", lastUpdate: "2 hours ago" },
   { id: "2", number: "TKT-002", subject: "Billing inquiry for January", customer: "Global Industries", contact: "Emily Davis", priority: "medium", status: "in_progress", category: "Billing", assignee: "Mike Johnson", createdAt: "2024-01-15 14:20", lastUpdate: "1 day ago" },
   { id: "3", number: "TKT-003", subject: "Feature request: Export to PDF", customer: "Innovate LLC", contact: "Robert Chen", priority: "low", status: "open", category: "Feature Request", assignee: null, createdAt: "2024-01-15 09:15", lastUpdate: "1 day ago" },
   { id: "4", number: "TKT-004", subject: "Integration not syncing", customer: "Summit Group", contact: "Lisa Anderson", priority: "high", status: "in_progress", category: "Technical", assignee: "David Brown", createdAt: "2024-01-14 16:45", lastUpdate: "3 hours ago" },
   { id: "5", number: "TKT-005", subject: "Password reset issue", customer: "Apex Solutions", contact: "James Wilson", priority: "medium", status: "resolved", category: "Account", assignee: "Sarah Wilson", createdAt: "2024-01-14 11:00", lastUpdate: "2 days ago" },
   { id: "6", number: "TKT-006", subject: "Training session request", customer: "Prime Tech", contact: "Maria Garcia", priority: "low", status: "closed", category: "Training", assignee: "Mike Johnson", createdAt: "2024-01-13 10:00", lastUpdate: "3 days ago" },
 ];
 
 const priorityConfig: Record<string, { color: string; icon: React.ReactNode }> = {
   high: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: <AlertCircle className="h-3 w-3" /> },
   medium: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: <Clock className="h-3 w-3" /> },
   low: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: <ArrowUpRight className="h-3 w-3" /> },
 };
 
 const statusConfig: Record<string, { color: string; label: string }> = {
   open: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Open" },
   in_progress: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "In Progress" },
   resolved: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Resolved" },
   closed: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", label: "Closed" },
 };
 
 export function SupportTicketsPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
   const [activeTab, setActiveTab] = useState("all");
 
   const getFilteredTickets = () => {
     let filtered = mockTickets;
     if (activeTab !== "all") {
       filtered = filtered.filter(ticket => ticket.status === activeTab);
     }
     return filtered.filter(ticket =>
       ticket.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
       ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
       ticket.customer.toLowerCase().includes(searchQuery.toLowerCase())
     );
   };
 
   const openTickets = mockTickets.filter(t => t.status === "open").length;
   const inProgressTickets = mockTickets.filter(t => t.status === "in_progress").length;
   const highPriorityTickets = mockTickets.filter(t => t.priority === "high" && t.status !== "closed" && t.status !== "resolved").length;
   const avgResponseTime = "2.5 hours";
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Support Tickets"
         description="Manage customer support requests and track resolutions"
       />
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <MessageSquare className="h-4 w-4" />
               <span className="text-sm">Open Tickets</span>
             </div>
             <div className="text-2xl font-bold">{openTickets}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Clock className="h-4 w-4" />
               <span className="text-sm">In Progress</span>
             </div>
             <div className="text-2xl font-bold">{inProgressTickets}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <AlertCircle className="h-4 w-4" />
               <span className="text-sm">High Priority</span>
             </div>
             <div className="text-2xl font-bold text-red-600">{highPriorityTickets}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <CheckCircle className="h-4 w-4" />
               <span className="text-sm">Avg Response</span>
             </div>
             <div className="text-2xl font-bold">{avgResponseTime}</div>
           </CardContent>
         </Card>
       </div>
 
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search tickets..."
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
               New Ticket
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>Create Support Ticket</DialogTitle>
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
               <div className="space-y-2">
                 <Label>Subject</Label>
                 <Input placeholder="Brief description of the issue" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Category</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select category" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="technical">Technical</SelectItem>
                       <SelectItem value="billing">Billing</SelectItem>
                       <SelectItem value="account">Account</SelectItem>
                       <SelectItem value="feature">Feature Request</SelectItem>
                       <SelectItem value="training">Training</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label>Priority</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select priority" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="high">High</SelectItem>
                       <SelectItem value="medium">Medium</SelectItem>
                       <SelectItem value="low">Low</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Description</Label>
                 <Textarea placeholder="Detailed description of the issue..." rows={4} />
               </div>
               <Button className="w-full" onClick={() => setDialogOpen(false)}>
                 Create Ticket
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Tickets with Tabs */}
       <Tabs value={activeTab} onValueChange={setActiveTab}>
         <TabsList>
           <TabsTrigger value="all">All Tickets</TabsTrigger>
           <TabsTrigger value="open">Open</TabsTrigger>
           <TabsTrigger value="in_progress">In Progress</TabsTrigger>
           <TabsTrigger value="resolved">Resolved</TabsTrigger>
           <TabsTrigger value="closed">Closed</TabsTrigger>
         </TabsList>
         <TabsContent value={activeTab} className="mt-4">
           <Card>
             <CardContent className="p-0">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Ticket</TableHead>
                     <TableHead>Customer</TableHead>
                     <TableHead>Category</TableHead>
                     <TableHead>Priority</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Assignee</TableHead>
                     <TableHead>Last Update</TableHead>
                     <TableHead className="w-10"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {getFilteredTickets().map((ticket) => (
                     <TableRow key={ticket.id}>
                       <TableCell>
                         <div>
                           <div className="font-medium">{ticket.number}</div>
                           <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                             {ticket.subject}
                           </div>
                         </div>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                           <Avatar className="h-7 w-7">
                             <AvatarImage src={`https://avatar.vercel.sh/${ticket.customer}`} />
                             <AvatarFallback>{ticket.customer[0]}</AvatarFallback>
                           </Avatar>
                           <div>
                             <div className="text-sm">{ticket.customer}</div>
                             <div className="text-xs text-muted-foreground">{ticket.contact}</div>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell>
                         <Badge variant="outline" className="flex items-center gap-1 w-fit">
                           <Tag className="h-3 w-3" />
                           {ticket.category}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge className={`${priorityConfig[ticket.priority].color} flex items-center gap-1 w-fit`}>
                           {priorityConfig[ticket.priority].icon}
                           {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge className={statusConfig[ticket.status].color}>
                           {statusConfig[ticket.status].label}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         {ticket.assignee ? (
                           <div className="flex items-center gap-2">
                             <User className="h-4 w-4 text-muted-foreground" />
                             {ticket.assignee}
                           </div>
                         ) : (
                           <span className="text-muted-foreground text-sm">Unassigned</span>
                         )}
                       </TableCell>
                       <TableCell className="text-muted-foreground text-sm">
                         {ticket.lastUpdate}
                       </TableCell>
                       <TableCell>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem>View Details</DropdownMenuItem>
                             <DropdownMenuItem>Reply</DropdownMenuItem>
                             <DropdownMenuItem>Assign</DropdownMenuItem>
                             <DropdownMenuItem>Change Status</DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">Close Ticket</DropdownMenuItem>
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