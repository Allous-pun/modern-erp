import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Filter, MoreHorizontal, Calendar, Users, DollarSign,
  FolderKanban, LayoutGrid, List, Clock
} from "lucide-react";

const projects = [
  { 
    id: 1, 
    name: 'ERP Implementation', 
    description: 'Complete enterprise resource planning system rollout',
    status: 'active', 
    priority: 'high',
    progress: 65, 
    manager: { name: 'John Smith', avatar: '' },
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    budget: 150000,
    spent: 97500,
    team: ['JS', 'SJ', 'MC', 'EB'],
    tasks: { total: 45, completed: 29 }
  },
  { 
    id: 2, 
    name: 'Mobile App Development', 
    description: 'Native iOS and Android application for customer portal',
    status: 'active', 
    priority: 'high',
    progress: 40, 
    manager: { name: 'Sarah Johnson', avatar: '' },
    startDate: '2024-02-01',
    endDate: '2024-07-31',
    budget: 80000,
    spent: 32000,
    team: ['SJ', 'TW', 'LK'],
    tasks: { total: 32, completed: 13 }
  },
  { 
    id: 3, 
    name: 'Data Migration', 
    description: 'Legacy system data migration to new platform',
    status: 'active', 
    priority: 'medium',
    progress: 85, 
    manager: { name: 'Mike Chen', avatar: '' },
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    budget: 45000,
    spent: 38250,
    team: ['MC', 'RD'],
    tasks: { total: 20, completed: 17 }
  },
  { 
    id: 4, 
    name: 'Security Audit', 
    description: 'Comprehensive security assessment and compliance review',
    status: 'planning', 
    priority: 'high',
    progress: 20, 
    manager: { name: 'Emily Brown', avatar: '' },
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    budget: 30000,
    spent: 6000,
    team: ['EB', 'JS'],
    tasks: { total: 15, completed: 3 }
  },
  { 
    id: 5, 
    name: 'Website Redesign', 
    description: 'Complete overhaul of company website with new branding',
    status: 'on_hold', 
    priority: 'low',
    progress: 30, 
    manager: { name: 'Lisa Wong', avatar: '' },
    startDate: '2024-01-20',
    endDate: '2024-04-30',
    budget: 25000,
    spent: 7500,
    team: ['LW', 'TW'],
    tasks: { total: 18, completed: 5 }
  },
  { 
    id: 6, 
    name: 'CRM Integration', 
    description: 'Integration of new CRM system with existing tools',
    status: 'completed', 
    priority: 'medium',
    progress: 100, 
    manager: { name: 'Tom Wilson', avatar: '' },
    startDate: '2023-10-01',
    endDate: '2024-01-15',
    budget: 35000,
    spent: 33000,
    team: ['TW', 'MC', 'SJ'],
    tasks: { total: 28, completed: 28 }
  },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  planning: { label: 'Planning', variant: 'outline' },
  active: { label: 'Active', variant: 'default' },
  on_hold: { label: 'On Hold', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
};

const priorityConfig: Record<string, { label: string; class: string }> = {
  low: { label: 'Low', class: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', class: 'bg-warning/20 text-warning-foreground' },
  high: { label: 'High', class: 'bg-destructive/20 text-destructive' },
};

export function ProjectListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Projects"
        description="Manage and track all organizational projects"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" placeholder="Enter project name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Project description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="manager">Project Manager</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" type="number" placeholder="Enter budget amount" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={statusConfig[project.status].variant}>
                    {statusConfig[project.status].label}
                  </Badge>
                  <Badge className={priorityConfig[project.priority].class}>
                    {priorityConfig[project.priority].label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{project.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${(project.budget / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{project.manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{project.manager.name}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{member}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusConfig[project.status].variant}>
                        {statusConfig[project.status].label}
                      </Badge>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-sm w-10">{project.progress}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-24">
                      <Calendar className="h-4 w-4" />
                      <span>{project.endDate}</span>
                    </div>
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">{member}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
