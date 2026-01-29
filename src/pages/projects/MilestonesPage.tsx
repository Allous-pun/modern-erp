import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Search, Flag, Calendar, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Target
} from "lucide-react";

const milestones = [
  { 
    id: 1, 
    name: 'Phase 1 - Foundation Complete',
    description: 'Core infrastructure and database setup completed',
    project: 'ERP Implementation',
    dueDate: '2024-02-15',
    status: 'on_track',
    progress: 85,
    tasks: { total: 12, completed: 10 },
    dependencies: [],
    deliverables: ['Database schema', 'Core APIs', 'Authentication module']
  },
  { 
    id: 2, 
    name: 'Beta Release',
    description: 'First beta version available for internal testing',
    project: 'Mobile App Development',
    dueDate: '2024-02-20',
    status: 'at_risk',
    progress: 60,
    tasks: { total: 18, completed: 11 },
    dependencies: ['UI Design Complete', 'API Integration'],
    deliverables: ['iOS Beta', 'Android Beta', 'Test documentation']
  },
  { 
    id: 3, 
    name: 'Data Validation Complete',
    description: 'All migrated data validated and verified',
    project: 'Data Migration',
    dueDate: '2024-02-10',
    status: 'completed',
    progress: 100,
    tasks: { total: 8, completed: 8 },
    dependencies: ['Data Extraction'],
    deliverables: ['Validation report', 'Data quality metrics']
  },
  { 
    id: 4, 
    name: 'Initial Security Assessment',
    description: 'First round of security testing completed',
    project: 'Security Audit',
    dueDate: '2024-02-28',
    status: 'on_track',
    progress: 35,
    tasks: { total: 10, completed: 4 },
    dependencies: [],
    deliverables: ['Vulnerability report', 'Risk assessment']
  },
  { 
    id: 5, 
    name: 'Phase 2 - Module Development',
    description: 'All core business modules developed and tested',
    project: 'ERP Implementation',
    dueDate: '2024-03-31',
    status: 'on_track',
    progress: 25,
    tasks: { total: 35, completed: 9 },
    dependencies: ['Phase 1 - Foundation Complete'],
    deliverables: ['Finance module', 'HR module', 'Inventory module']
  },
  { 
    id: 6, 
    name: 'Production Go-Live',
    description: 'Full production deployment',
    project: 'Data Migration',
    dueDate: '2024-03-15',
    status: 'not_started',
    progress: 0,
    tasks: { total: 15, completed: 0 },
    dependencies: ['Data Validation Complete'],
    deliverables: ['Production deployment', 'Rollback plan', 'Support documentation']
  },
  { 
    id: 7, 
    name: 'App Store Submission',
    description: 'Submit apps to Apple App Store and Google Play',
    project: 'Mobile App Development',
    dueDate: '2024-04-15',
    status: 'not_started',
    progress: 0,
    tasks: { total: 8, completed: 0 },
    dependencies: ['Beta Release', 'UAT Complete'],
    deliverables: ['App Store listing', 'Play Store listing', 'Marketing assets']
  },
];

const statusConfig: Record<string, { label: string; icon: React.ReactNode; class: string }> = {
  not_started: { label: 'Not Started', icon: <Clock className="h-4 w-4" />, class: 'bg-muted text-muted-foreground' },
  on_track: { label: 'On Track', icon: <CheckCircle2 className="h-4 w-4" />, class: 'bg-green-500/20 text-green-600' },
  at_risk: { label: 'At Risk', icon: <AlertTriangle className="h-4 w-4" />, class: 'bg-yellow-500/20 text-yellow-600' },
  delayed: { label: 'Delayed', icon: <AlertTriangle className="h-4 w-4" />, class: 'bg-destructive/20 text-destructive' },
  completed: { label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" />, class: 'bg-primary/20 text-primary' },
};

export function MilestonesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = milestone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = projectFilter === 'all' || milestone.project === projectFilter;
    const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
    return matchesSearch && matchesProject && matchesStatus;
  });

  const upcomingCount = milestones.filter(m => m.status === 'on_track' || m.status === 'at_risk').length;
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const atRiskCount = milestones.filter(m => m.status === 'at_risk').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Milestones"
        description="Track project milestones and deliverables"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Milestone</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Milestone Name</Label>
                  <Input id="name" placeholder="Enter milestone name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Milestone description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erp">ERP Implementation</SelectItem>
                        <SelectItem value="mobile">Mobile App Development</SelectItem>
                        <SelectItem value="migration">Data Migration</SelectItem>
                        <SelectItem value="security">Security Audit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deliverables">Deliverables (comma-separated)</Label>
                  <Input id="deliverables" placeholder="e.g., Report, Documentation, Demo" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create Milestone</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Flag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{milestones.length}</p>
                <p className="text-sm text-muted-foreground">Total Milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingCount}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{atRiskCount}</p>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search milestones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="ERP Implementation">ERP Implementation</SelectItem>
            <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
            <SelectItem value="Data Migration">Data Migration</SelectItem>
            <SelectItem value="Security Audit">Security Audit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="on_track">On Track</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {filteredMilestones.map((milestone, index) => (
          <Card key={milestone.id} className="relative overflow-hidden">
            {index < filteredMilestones.length - 1 && (
              <div className="absolute left-8 top-full w-0.5 h-4 bg-border z-10" />
            )}
            <CardContent className="py-6">
              <div className="flex items-start gap-6">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${statusConfig[milestone.status].class}`}>
                  <Flag className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{milestone.name}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <Badge className={statusConfig[milestone.status].class}>
                      {statusConfig[milestone.status].icon}
                      <span className="ml-1">{statusConfig[milestone.status].label}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due: {milestone.dueDate}</span>
                    </div>
                    <Badge variant="outline">{milestone.project}</Badge>
                    <span className="text-muted-foreground">
                      Tasks: {milestone.tasks.completed}/{milestone.tasks.total}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>

                  {milestone.dependencies.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Dependencies:</span>
                      {milestone.dependencies.map((dep, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Deliverables:</span>
                    <div className="flex flex-wrap gap-1">
                      {milestone.deliverables.map((deliverable, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
