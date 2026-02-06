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
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Megaphone,
  Target,
  TrendingUp,
  DollarSign,
  Mail,
  Users,
  MoreHorizontal,
  Calendar,
  BarChart3,
  MousePointerClick
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCampaigns = [
  { 
    id: "1", 
    name: "Summer Sale 2024", 
    type: "Email", 
    status: "active", 
    startDate: "2024-01-15", 
    endDate: "2024-02-15", 
    budget: 5000, 
    spent: 3200,
    leads: 245,
    conversions: 32,
    conversionRate: 13.1,
    revenue: 15600
  },
  { 
    id: "2", 
    name: "Product Launch - Enterprise", 
    type: "Multi-channel", 
    status: "active", 
    startDate: "2024-01-10", 
    endDate: "2024-03-10", 
    budget: 15000, 
    spent: 8500,
    leads: 520,
    conversions: 48,
    conversionRate: 9.2,
    revenue: 72000
  },
  { 
    id: "3", 
    name: "Webinar Series Q1", 
    type: "Event", 
    status: "scheduled", 
    startDate: "2024-02-01", 
    endDate: "2024-03-31", 
    budget: 3000, 
    spent: 0,
    leads: 0,
    conversions: 0,
    conversionRate: 0,
    revenue: 0
  },
  { 
    id: "4", 
    name: "Holiday Promotion", 
    type: "Social Media", 
    status: "completed", 
    startDate: "2023-12-01", 
    endDate: "2023-12-31", 
    budget: 8000, 
    spent: 7800,
    leads: 890,
    conversions: 156,
    conversionRate: 17.5,
    revenue: 45000
  },
  { 
    id: "5", 
    name: "Referral Program", 
    type: "Referral", 
    status: "active", 
    startDate: "2024-01-01", 
    endDate: "2024-12-31", 
    budget: 12000, 
    spent: 1200,
    leads: 78,
    conversions: 23,
    conversionRate: 29.5,
    revenue: 18400
  },
  { 
    id: "6", 
    name: "Google Ads - Brand", 
    type: "PPC", 
    status: "paused", 
    startDate: "2024-01-05", 
    endDate: "2024-06-30", 
    budget: 10000, 
    spent: 4500,
    leads: 312,
    conversions: 28,
    conversionRate: 9.0,
    revenue: 22400
  },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Active" },
  scheduled: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Scheduled" },
  paused: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Paused" },
  completed: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", label: "Completed" },
};

const typeConfig: Record<string, { icon: React.ReactNode }> = {
  Email: { icon: <Mail className="h-3 w-3" /> },
  "Multi-channel": { icon: <Megaphone className="h-3 w-3" /> },
  Event: { icon: <Calendar className="h-3 w-3" /> },
  "Social Media": { icon: <Users className="h-3 w-3" /> },
  Referral: { icon: <Users className="h-3 w-3" /> },
  PPC: { icon: <MousePointerClick className="h-3 w-3" /> },
};

export function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredCampaigns = () => {
    let filtered = mockCampaigns;
    if (activeTab !== "all") {
      filtered = filtered.filter(campaign => campaign.status === activeTab);
    }
    return filtered.filter(campaign =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const activeCampaigns = mockCampaigns.filter(c => c.status === "active").length;
  const totalBudget = mockCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = mockCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = mockCampaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgConversionRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Campaigns"
        description="Plan, execute, and track marketing campaigns across channels"
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Megaphone className="h-4 w-4" />
              <span className="text-sm">Active Campaigns</span>
            </div>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Budget Utilization</span>
            </div>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-1 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">of ${totalBudget.toLocaleString()} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm">Total Leads</span>
            </div>
            <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Avg Conversion</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{avgConversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
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
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input placeholder="Enter campaign name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="ppc">PPC</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="multi">Multi-channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Campaign objectives and strategy..." rows={3} />
              </div>
              <Button className="w-full" onClick={() => setDialogOpen(false)}>
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCampaigns().map((campaign) => {
                    const roi = campaign.spent > 0 
                      ? (((campaign.revenue - campaign.spent) / campaign.spent) * 100).toFixed(0)
                      : 0;
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div className="font-medium">{campaign.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {typeConfig[campaign.type]?.icon}
                            {campaign.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[campaign.status].color}>
                            {statusConfig[campaign.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{campaign.startDate}</div>
                            <div className="text-muted-foreground">to {campaign.endDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">${campaign.spent.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              of ${campaign.budget.toLocaleString()}
                            </div>
                            <Progress 
                              value={(campaign.spent / campaign.budget) * 100} 
                              className="h-1 mt-1 w-20" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            {campaign.leads}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.conversions}</div>
                            <div className="text-xs text-muted-foreground">
                              {campaign.conversionRate}% rate
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={Number(roi) > 0 ? "text-green-600 border-green-600" : "text-muted-foreground"}
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {roi}%
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
                              <DropdownMenuItem>View Analytics</DropdownMenuItem>
                              <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem>
                                {campaign.status === "active" ? "Pause" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
