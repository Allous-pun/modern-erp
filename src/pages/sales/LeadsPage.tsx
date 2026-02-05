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
 import { 
   Plus, 
   Search, 
   Filter,
   Phone,
   Mail,
   Building2,
   DollarSign,
   Calendar,
   MoreHorizontal,
   ArrowRight
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const leadStages = [
   { id: "new", label: "New", color: "bg-blue-500" },
   { id: "contacted", label: "Contacted", color: "bg-yellow-500" },
   { id: "qualified", label: "Qualified", color: "bg-purple-500" },
   { id: "proposal", label: "Proposal", color: "bg-orange-500" },
   { id: "negotiation", label: "Negotiation", color: "bg-pink-500" },
 ];
 
 const mockLeads = [
   { id: "1", name: "John Smith", company: "Tech Corp", email: "john@techcorp.com", phone: "+1 555-0123", value: 50000, stage: "new", source: "Website", assignee: "Sarah Wilson", createdAt: "2024-01-15" },
   { id: "2", name: "Emily Davis", company: "Global Industries", email: "emily@global.com", phone: "+1 555-0124", value: 125000, stage: "contacted", source: "Referral", assignee: "Mike Johnson", createdAt: "2024-01-14" },
   { id: "3", name: "Robert Chen", company: "Innovate LLC", email: "robert@innovate.com", phone: "+1 555-0125", value: 75000, stage: "qualified", source: "Trade Show", assignee: "Sarah Wilson", createdAt: "2024-01-13" },
   { id: "4", name: "Lisa Anderson", company: "Summit Group", email: "lisa@summit.com", phone: "+1 555-0126", value: 200000, stage: "proposal", source: "LinkedIn", assignee: "David Brown", createdAt: "2024-01-12" },
   { id: "5", name: "James Wilson", company: "Apex Solutions", email: "james@apex.com", phone: "+1 555-0127", value: 95000, stage: "negotiation", source: "Cold Call", assignee: "Mike Johnson", createdAt: "2024-01-11" },
   { id: "6", name: "Maria Garcia", company: "Prime Tech", email: "maria@primetech.com", phone: "+1 555-0128", value: 45000, stage: "new", source: "Website", assignee: "Sarah Wilson", createdAt: "2024-01-10" },
   { id: "7", name: "David Kim", company: "NextGen Corp", email: "david@nextgen.com", phone: "+1 555-0129", value: 180000, stage: "qualified", source: "Referral", assignee: "David Brown", createdAt: "2024-01-09" },
 ];
 
 export function LeadsPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
 
   const getLeadsByStage = (stageId: string) => {
     return mockLeads.filter(lead => 
       lead.stage === stageId && 
       (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()))
     );
   };
 
   const getTotalValueByStage = (stageId: string) => {
     return getLeadsByStage(stageId).reduce((sum, lead) => sum + lead.value, 0);
   };
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Lead Management"
         description="Track and nurture potential customers through your sales pipeline"
       />
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-5">
         {leadStages.map((stage) => (
           <Card key={stage.id}>
             <CardContent className="p-4">
               <div className="flex items-center gap-2 mb-2">
                 <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                 <span className="text-sm font-medium">{stage.label}</span>
               </div>
               <div className="text-2xl font-bold">{getLeadsByStage(stage.id).length}</div>
               <div className="text-xs text-muted-foreground">
                 ${getTotalValueByStage(stage.id).toLocaleString()}
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
 
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search leads..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
             />
           </div>
           <Button variant="outline" size="icon">
             <Filter className="h-4 w-4" />
           </Button>
         </div>
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               Add Lead
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>Add New Lead</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Contact Name</Label>
                   <Input placeholder="John Smith" />
                 </div>
                 <div className="space-y-2">
                   <Label>Company</Label>
                   <Input placeholder="Acme Corp" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Email</Label>
                   <Input type="email" placeholder="john@acme.com" />
                 </div>
                 <div className="space-y-2">
                   <Label>Phone</Label>
                   <Input placeholder="+1 555-0100" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Estimated Value</Label>
                   <Input type="number" placeholder="50000" />
                 </div>
                 <div className="space-y-2">
                   <Label>Source</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select source" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="website">Website</SelectItem>
                       <SelectItem value="referral">Referral</SelectItem>
                       <SelectItem value="linkedin">LinkedIn</SelectItem>
                       <SelectItem value="trade-show">Trade Show</SelectItem>
                       <SelectItem value="cold-call">Cold Call</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Notes</Label>
                 <Textarea placeholder="Additional notes about this lead..." />
               </div>
               <Button className="w-full" onClick={() => setDialogOpen(false)}>
                 Create Lead
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Kanban Pipeline */}
       <div className="flex gap-4 overflow-x-auto pb-4">
         {leadStages.map((stage) => (
           <div key={stage.id} className="flex-shrink-0 w-80">
             <div className="flex items-center gap-2 mb-3">
               <div className={`w-3 h-3 rounded-full ${stage.color}`} />
               <h3 className="font-semibold">{stage.label}</h3>
               <Badge variant="secondary" className="ml-auto">
                 {getLeadsByStage(stage.id).length}
               </Badge>
             </div>
             <div className="space-y-3">
               {getLeadsByStage(stage.id).map((lead) => (
                 <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                   <CardContent className="p-4">
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://avatar.vercel.sh/${lead.name}`} />
                           <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                         </Avatar>
                         <div>
                           <div className="font-medium text-sm">{lead.name}</div>
                           <div className="text-xs text-muted-foreground flex items-center gap-1">
                             <Building2 className="h-3 w-3" />
                             {lead.company}
                           </div>
                         </div>
                       </div>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-6 w-6">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                           <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                           <DropdownMenuItem>Convert to Opportunity</DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </div>
                     <div className="space-y-2 text-xs text-muted-foreground">
                       <div className="flex items-center gap-2">
                         <Mail className="h-3 w-3" />
                         {lead.email}
                       </div>
                       <div className="flex items-center gap-2">
                         <Phone className="h-3 w-3" />
                         {lead.phone}
                       </div>
                     </div>
                     <div className="flex items-center justify-between mt-3 pt-3 border-t">
                       <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                         <DollarSign className="h-4 w-4" />
                         {lead.value.toLocaleString()}
                       </div>
                       <div className="flex items-center gap-1 text-xs text-muted-foreground">
                         <Calendar className="h-3 w-3" />
                         {lead.createdAt}
                       </div>
                     </div>
                     <div className="flex items-center justify-between mt-2">
                       <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                       <Button variant="ghost" size="sm" className="h-6 text-xs">
                         <ArrowRight className="h-3 w-3 mr-1" />
                         Move
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
         ))}
       </div>
     </div>
   );
 }