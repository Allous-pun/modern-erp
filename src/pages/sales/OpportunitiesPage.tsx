 import { useState } from "react";
 import { PageHeader } from "@/components/shared/PageHeader";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { 
   Plus, 
   Search, 
   Filter,
   TrendingUp,
   DollarSign,
   Calendar,
   User,
   Target,
   MoreHorizontal
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const mockOpportunities = [
   { id: "1", name: "Enterprise Software License", customer: "Tech Corp", value: 150000, probability: 80, stage: "Negotiation", owner: "Sarah Wilson", closeDate: "2024-02-15", createdAt: "2024-01-01" },
   { id: "2", name: "Cloud Migration Project", customer: "Global Industries", value: 280000, probability: 60, stage: "Proposal", owner: "Mike Johnson", closeDate: "2024-03-01", createdAt: "2024-01-05" },
   { id: "3", name: "Annual Support Contract", customer: "Innovate LLC", value: 45000, probability: 90, stage: "Closing", owner: "David Brown", closeDate: "2024-02-01", createdAt: "2024-01-08" },
   { id: "4", name: "Custom Development", customer: "Summit Group", value: 320000, probability: 40, stage: "Qualification", owner: "Sarah Wilson", closeDate: "2024-04-15", createdAt: "2024-01-10" },
   { id: "5", name: "Hardware Upgrade", customer: "Apex Solutions", value: 85000, probability: 70, stage: "Proposal", owner: "Mike Johnson", closeDate: "2024-02-28", createdAt: "2024-01-12" },
   { id: "6", name: "Security Audit Services", customer: "Prime Tech", value: 55000, probability: 85, stage: "Negotiation", owner: "David Brown", closeDate: "2024-02-10", createdAt: "2024-01-14" },
 ];
 
 const stageColors: Record<string, string> = {
   "Qualification": "bg-blue-500",
   "Proposal": "bg-yellow-500",
   "Negotiation": "bg-purple-500",
   "Closing": "bg-green-500",
 };
 
 export function OpportunitiesPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
 
   const filteredOpportunities = mockOpportunities.filter(opp =>
     opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     opp.customer.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const totalPipelineValue = mockOpportunities.reduce((sum, opp) => sum + opp.value, 0);
   const weightedValue = mockOpportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
   const avgProbability = mockOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / mockOpportunities.length;
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Sales Opportunities"
         description="Track and manage your sales pipeline opportunities"
       />
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Target className="h-4 w-4" />
               <span className="text-sm">Total Pipeline</span>
             </div>
             <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
             <div className="text-xs text-muted-foreground">{mockOpportunities.length} opportunities</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <DollarSign className="h-4 w-4" />
               <span className="text-sm">Weighted Value</span>
             </div>
             <div className="text-2xl font-bold">${weightedValue.toLocaleString()}</div>
             <div className="text-xs text-muted-foreground">Expected revenue</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <TrendingUp className="h-4 w-4" />
               <span className="text-sm">Avg Probability</span>
             </div>
             <div className="text-2xl font-bold">{avgProbability.toFixed(0)}%</div>
             <Progress value={avgProbability} className="mt-2" />
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-2 text-muted-foreground mb-1">
               <Calendar className="h-4 w-4" />
               <span className="text-sm">Closing This Month</span>
             </div>
             <div className="text-2xl font-bold">4</div>
             <div className="text-xs text-muted-foreground">$335,000 potential</div>
           </CardContent>
         </Card>
       </div>
 
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search opportunities..."
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
               New Opportunity
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>Create Opportunity</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label>Opportunity Name</Label>
                 <Input placeholder="Enterprise Software License" />
               </div>
               <div className="grid grid-cols-2 gap-4">
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
                   <Label>Value ($)</Label>
                   <Input type="number" placeholder="50000" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Stage</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select stage" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="qualification">Qualification</SelectItem>
                       <SelectItem value="proposal">Proposal</SelectItem>
                       <SelectItem value="negotiation">Negotiation</SelectItem>
                       <SelectItem value="closing">Closing</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label>Probability (%)</Label>
                   <Input type="number" placeholder="50" min="0" max="100" />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Expected Close Date</Label>
                 <Input type="date" />
               </div>
               <Button className="w-full" onClick={() => setDialogOpen(false)}>
                 Create Opportunity
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Opportunities Table */}
       <Card>
         <CardContent className="p-0">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Opportunity</TableHead>
                 <TableHead>Customer</TableHead>
                 <TableHead>Value</TableHead>
                 <TableHead>Probability</TableHead>
                 <TableHead>Stage</TableHead>
                 <TableHead>Close Date</TableHead>
                 <TableHead>Owner</TableHead>
                 <TableHead className="w-10"></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredOpportunities.map((opp) => (
                 <TableRow key={opp.id}>
                   <TableCell className="font-medium">{opp.name}</TableCell>
                   <TableCell>{opp.customer}</TableCell>
                   <TableCell className="font-semibold">${opp.value.toLocaleString()}</TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <Progress value={opp.probability} className="w-16 h-2" />
                       <span className="text-sm">{opp.probability}%</span>
                     </div>
                   </TableCell>
                   <TableCell>
                     <Badge className={`${stageColors[opp.stage]} text-white`}>
                       {opp.stage}
                     </Badge>
                   </TableCell>
                   <TableCell>{opp.closeDate}</TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <User className="h-4 w-4 text-muted-foreground" />
                       {opp.owner}
                     </div>
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
                         <DropdownMenuItem>Edit</DropdownMenuItem>
                         <DropdownMenuItem>Create Quote</DropdownMenuItem>
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