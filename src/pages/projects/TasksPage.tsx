import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Search, Filter, MoreHorizontal, Calendar, Clock, AlertCircle,
  CheckCircle2, Circle, Timer, ArrowUpCircle
} from "lucide-react";

const tasks = [
  { 
    id: 1, 
    title: 'Complete database schema design',
    description: 'Design and document the complete database schema for the new ERP modules',
    project: 'ERP Implementation',
    status: 'in_progress',
    priority: 'high',
    assignee: { name: 'John Smith', initials: 'JS' },
    dueDate: '2024-02-10',
    estimatedHours: 16,
    loggedHours: 12,
    tags: ['database', 'design']
  },
  { 
    id: 2, 
    title: 'API endpoint development',
    description: 'Develop REST API endpoints for user management module',
    project: 'ERP Implementation',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'Sarah Johnson', initials: 'SJ' },
    dueDate: '2024-02-15',
    estimatedHours: 24,
    loggedHours: 0,
    tags: ['api', 'backend']
  },
  { 
    id: 3, 
    title: 'Mobile UI wireframes',
    description: 'Create wireframes for the mobile app main screens',
    project: 'Mobile App Development',
    status: 'completed',
    priority: 'medium',
    assignee: { name: 'Mike Chen', initials: 'MC' },
    dueDate: '2024-02-05',
    estimatedHours: 8,
    loggedHours: 10,
    tags: ['design', 'mobile']
  },
  { 
    id: 4, 
    title: 'Data validation scripts',
    description: 'Write scripts to validate migrated data integrity',
    project: 'Data Migration',
    status: 'in_progress',
    priority: 'high',
    assignee: { name: 'Emily Brown', initials: 'EB' },
    dueDate: '2024-02-08',
    estimatedHours: 12,
    loggedHours: 8,
    tags: ['migration', 'validation']
  },
  { 
    id: 5, 
    title: 'Security vulnerability scan',
    description: 'Run automated security scans on all production systems',
    project: 'Security Audit',
    status: 'todo',
    priority: 'urgent',
    assignee: { name: 'Tom Wilson', initials: 'TW' },
    dueDate: '2024-02-12',
    estimatedHours: 6,
    loggedHours: 0,
    tags: ['security', 'audit']
  },
  { 
    id: 6, 
    title: 'User acceptance testing',
    description: 'Coordinate UAT sessions with stakeholders',
    project: 'ERP Implementation',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'Lisa Wong', initials: 'LW' },
    dueDate: '2024-02-20',
    estimatedHours: 20,
    loggedHours: 0,
    tags: ['testing', 'uat']
  },
  { 
    id: 7, 
    title: 'Push notification setup',
    description: 'Configure push notifications for iOS and Android',
    project: 'Mobile App Development',
    status: 'in_progress',
    priority: 'medium',
    assignee: { name: 'Sarah Johnson', initials: 'SJ' },
    dueDate: '2024-02-18',
    estimatedHours: 8,
    loggedHours: 3,
    tags: ['mobile', 'notifications']
  },
  { 
    id: 8, 
    title: 'Legacy system backup',
    description: 'Create complete backup of legacy system before final migration',
    project: 'Data Migration',
    status: 'completed',
    priority: 'high',
    assignee: { name: 'Mike Chen', initials: 'MC' },
    dueDate: '2024-02-01',
    estimatedHours: 4,
    loggedHours: 4,
    tags: ['backup', 'migration']
  },
];

const statusConfig: Record<string, { label: string; icon: React.ReactNode; class: string }> = {
  todo: { label: 'To Do', icon: <Circle className="h-4 w-4" />, class: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'In Progress', icon: <Timer className="h-4 w-4" />, class: 'bg-primary/20 text-primary' },
  completed: { label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" />, class: 'bg-green-500/20 text-green-600' },
};

const priorityConfig: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  low: { label: 'Low', class: 'text-muted-foreground', icon: <ArrowUpCircle className="h-4 w-4 rotate-180" /> },
  medium: { label: 'Medium', class: 'text-yellow-600', icon: <ArrowUpCircle className="h-4 w-4 -rotate-90" /> },
  high: { label: 'High', class: 'text-orange-600', icon: <ArrowUpCircle className="h-4 w-4" /> },
  urgent: { label: 'Urgent', class: 'text-destructive', icon: <AlertCircle className="h-4 w-4" /> },
};

export function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage and track project tasks"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="Enter task title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Task description" />
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
                    <Label htmlFor="assignee">Assignee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours">Estimated Hours</Label>
                  <Input id="hours" type="number" placeholder="Enter estimated hours" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create Task</Button>
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
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <Card key={status} className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {statusConfig[status].icon}
                {statusConfig[status].label}
                <Badge variant="secondary" className="ml-auto">{statusTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusTasks.map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                      <span className={priorityConfig[task.priority].class}>
                        {priorityConfig[task.priority].icon}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{task.project}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.loggedHours}/{task.estimatedHours}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No tasks
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
