import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartWidget } from "@/components/dashboard/ChartWidget";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderKanban, CheckSquare, Users, Clock, TrendingUp, AlertTriangle } from "lucide-react";

const projectStatusData = [
  { name: 'Planning', value: 3, fill: 'hsl(var(--chart-1))' },
  { name: 'Active', value: 8, fill: 'hsl(var(--chart-2))' },
  { name: 'On Hold', value: 2, fill: 'hsl(var(--chart-3))' },
  { name: 'Completed', value: 12, fill: 'hsl(var(--chart-4))' },
];

const taskTrendData = [
  { name: 'Mon', completed: 12, created: 8 },
  { name: 'Tue', completed: 15, created: 10 },
  { name: 'Wed', completed: 18, created: 14 },
  { name: 'Thu', completed: 14, created: 12 },
  { name: 'Fri', completed: 20, created: 16 },
];

const activeProjects = [
  { id: 1, name: 'ERP Implementation', progress: 65, status: 'active', manager: 'John Smith', dueDate: '2024-03-15', budget: 150000, spent: 97500 },
  { id: 2, name: 'Mobile App Development', progress: 40, status: 'active', manager: 'Sarah Johnson', dueDate: '2024-04-30', budget: 80000, spent: 32000 },
  { id: 3, name: 'Data Migration', progress: 85, status: 'active', manager: 'Mike Chen', dueDate: '2024-02-28', budget: 45000, spent: 38250 },
  { id: 4, name: 'Security Audit', progress: 20, status: 'active', manager: 'Emily Brown', dueDate: '2024-05-15', budget: 30000, spent: 6000 },
];

const upcomingMilestones = [
  { id: 1, name: 'Phase 1 Completion', project: 'ERP Implementation', date: '2024-02-10', status: 'on_track' },
  { id: 2, name: 'Beta Release', project: 'Mobile App Development', date: '2024-02-15', status: 'at_risk' },
  { id: 3, name: 'Data Validation Complete', project: 'Data Migration', date: '2024-02-20', status: 'on_track' },
  { id: 4, name: 'Initial Assessment', project: 'Security Audit', date: '2024-02-25', status: 'on_track' },
];

export function ProjectsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects Overview"
        description="Monitor project progress, tasks, and team performance"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Projects"
          value="8"
          change={2}
          changeLabel="this month"
          icon={<FolderKanban className="h-4 w-4" />}
        />
        <StatsCard
          title="Open Tasks"
          value="156"
          changeLabel="23 due this week"
          icon={<CheckSquare className="h-4 w-4" />}
        />
        <StatsCard
          title="Team Members"
          value="42"
          changeLabel="Across all projects"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Hours Logged"
          value="1,284"
          change={12}
          changeLabel="vs last week"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartWidget
          title="Project Status Distribution"
          type="pie"
          data={projectStatusData}
          dataKey="value"
        />
        <ChartWidget
          title="Task Activity (This Week)"
          type="bar"
          data={taskTrendData}
          dataKey="completed"
        />
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Manager: {project.manager}</span>
                    <span>Due: {project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium w-12">{project.progress}%</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((project.spent / project.budget) * 100)}% utilized
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{milestone.name}</h4>
                  <p className="text-sm text-muted-foreground">{milestone.project}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{milestone.date}</span>
                  <Badge variant={milestone.status === 'on_track' ? 'default' : 'destructive'}>
                    {milestone.status === 'on_track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
