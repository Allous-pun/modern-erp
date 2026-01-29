import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Users, Briefcase, Clock, TrendingUp, AlertTriangle,
  UserPlus, Calendar
} from "lucide-react";

const teamMembers = [
  { 
    id: 1, 
    name: 'John Smith', 
    initials: 'JS',
    role: 'Senior Developer',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    availability: 85,
    allocatedHours: 34,
    totalHours: 40,
    projects: [
      { name: 'ERP Implementation', allocation: 60 },
      { name: 'Security Audit', allocation: 25 }
    ],
    status: 'available'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    initials: 'SJ',
    role: 'UI/UX Designer',
    department: 'Design',
    skills: ['Figma', 'UI Design', 'User Research'],
    availability: 100,
    allocatedHours: 40,
    totalHours: 40,
    projects: [
      { name: 'Mobile App Development', allocation: 70 },
      { name: 'ERP Implementation', allocation: 30 }
    ],
    status: 'fully_allocated'
  },
  { 
    id: 3, 
    name: 'Mike Chen', 
    initials: 'MC',
    role: 'Data Engineer',
    department: 'Engineering',
    skills: ['Python', 'SQL', 'ETL', 'Data Modeling'],
    availability: 75,
    allocatedHours: 30,
    totalHours: 40,
    projects: [
      { name: 'Data Migration', allocation: 75 }
    ],
    status: 'available'
  },
  { 
    id: 4, 
    name: 'Emily Brown', 
    initials: 'EB',
    role: 'Security Analyst',
    department: 'Security',
    skills: ['Penetration Testing', 'Compliance', 'Risk Assessment'],
    availability: 50,
    allocatedHours: 20,
    totalHours: 40,
    projects: [
      { name: 'Security Audit', allocation: 50 }
    ],
    status: 'available'
  },
  { 
    id: 5, 
    name: 'Tom Wilson', 
    initials: 'TW',
    role: 'Full Stack Developer',
    department: 'Engineering',
    skills: ['React', 'Python', 'AWS'],
    availability: 110,
    allocatedHours: 44,
    totalHours: 40,
    projects: [
      { name: 'Mobile App Development', allocation: 60 },
      { name: 'Website Redesign', allocation: 50 }
    ],
    status: 'overallocated'
  },
  { 
    id: 6, 
    name: 'Lisa Wong', 
    initials: 'LW',
    role: 'Project Manager',
    department: 'PMO',
    skills: ['Agile', 'Scrum', 'Risk Management'],
    availability: 90,
    allocatedHours: 36,
    totalHours: 40,
    projects: [
      { name: 'ERP Implementation', allocation: 40 },
      { name: 'Mobile App Development', allocation: 30 },
      { name: 'Data Migration', allocation: 20 }
    ],
    status: 'available'
  },
];

const projectAllocations = [
  { 
    project: 'ERP Implementation',
    status: 'active',
    requiredHours: 160,
    allocatedHours: 130,
    members: ['JS', 'SJ', 'LW'],
    skills: ['React', 'Node.js', 'PostgreSQL']
  },
  { 
    project: 'Mobile App Development',
    status: 'active',
    requiredHours: 120,
    allocatedHours: 108,
    members: ['SJ', 'TW', 'LW'],
    skills: ['React Native', 'UI Design']
  },
  { 
    project: 'Data Migration',
    status: 'active',
    requiredHours: 80,
    allocatedHours: 68,
    members: ['MC', 'LW'],
    skills: ['Python', 'SQL', 'ETL']
  },
  { 
    project: 'Security Audit',
    status: 'planning',
    requiredHours: 60,
    allocatedHours: 30,
    members: ['EB', 'JS'],
    skills: ['Security', 'Compliance']
  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  available: { label: 'Available', class: 'bg-green-500/20 text-green-600' },
  fully_allocated: { label: 'Fully Allocated', class: 'bg-yellow-500/20 text-yellow-600' },
  overallocated: { label: 'Over Allocated', class: 'bg-destructive/20 text-destructive' },
  on_leave: { label: 'On Leave', class: 'bg-muted text-muted-foreground' },
};

export function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const overallocatedCount = teamMembers.filter(m => m.status === 'overallocated').length;
  const availableCount = teamMembers.filter(m => m.status === 'available').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="Manage team allocation and capacity"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Assign Resource to Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="resource">Team Member</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="allocation">Allocation %</Label>
                    <Input id="allocation" type="number" placeholder="50" min="0" max="100" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role in Project</Label>
                    <Input id="role" placeholder="e.g., Lead Developer" />
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Assign</Button>
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
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableCount}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallocatedCount}</p>
                <p className="text-sm text-muted-foreground">Over Allocated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projectAllocations.length}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="team" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="projects">Project Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="PMO">PMO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge className={statusConfig[member.status].class}>
                      {statusConfig[member.status].label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocation</span>
                      <span className="font-medium">{member.allocatedHours}/{member.totalHours}h ({member.availability}%)</span>
                    </div>
                    <Progress 
                      value={Math.min(member.availability, 100)} 
                      className={`h-2 ${member.availability > 100 ? '[&>div]:bg-destructive' : ''}`} 
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Active Projects</p>
                    {member.projects.map((project) => (
                      <div key={project.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{project.name}</span>
                        <span>{project.allocation}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Resource Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Required Skills</TableHead>
                    <TableHead className="text-right">Hours (Allocated/Required)</TableHead>
                    <TableHead>Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectAllocations.map((allocation) => (
                    <TableRow key={allocation.project}>
                      <TableCell className="font-medium">{allocation.project}</TableCell>
                      <TableCell>
                        <Badge variant={allocation.status === 'active' ? 'default' : 'outline'}>
                          {allocation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {allocation.members.map((member, i) => (
                            <Avatar key={i} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">{member}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {allocation.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {allocation.allocatedHours}h / {allocation.requiredHours}h
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-32">
                          <Progress 
                            value={(allocation.allocatedHours / allocation.requiredHours) * 100} 
                            className="h-2"
                          />
                          <span className="text-xs w-10">
                            {Math.round((allocation.allocatedHours / allocation.requiredHours) * 100)}%
                          </span>
                        </div>
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
