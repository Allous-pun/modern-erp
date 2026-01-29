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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Clock, Calendar, ChevronLeft, ChevronRight, Timer,
  Play, Pause, CheckCircle, AlertCircle
} from "lucide-react";

const currentWeekEntries = [
  { 
    id: 1, 
    date: '2024-02-05',
    dayName: 'Monday',
    entries: [
      { project: 'ERP Implementation', task: 'Database schema design', hours: 4, status: 'approved' },
      { project: 'ERP Implementation', task: 'API development', hours: 3, status: 'approved' },
    ]
  },
  { 
    id: 2, 
    date: '2024-02-06',
    dayName: 'Tuesday',
    entries: [
      { project: 'Mobile App Development', task: 'UI wireframes', hours: 5, status: 'pending' },
      { project: 'ERP Implementation', task: 'Code review', hours: 2, status: 'pending' },
    ]
  },
  { 
    id: 3, 
    date: '2024-02-07',
    dayName: 'Wednesday',
    entries: [
      { project: 'Data Migration', task: 'Data validation scripts', hours: 6, status: 'pending' },
      { project: 'Data Migration', task: 'Documentation', hours: 2, status: 'pending' },
    ]
  },
  { 
    id: 4, 
    date: '2024-02-08',
    dayName: 'Thursday',
    entries: [
      { project: 'ERP Implementation', task: 'Testing', hours: 4, status: 'draft' },
      { project: 'Security Audit', task: 'Vulnerability scan', hours: 3, status: 'draft' },
    ]
  },
  { 
    id: 5, 
    date: '2024-02-09',
    dayName: 'Friday',
    entries: []
  },
];

const teamTimesheets = [
  { 
    id: 1, 
    employee: { name: 'John Smith', initials: 'JS' },
    weekOf: '2024-02-05',
    totalHours: 42,
    billableHours: 38,
    status: 'approved',
    projects: ['ERP Implementation', 'Security Audit']
  },
  { 
    id: 2, 
    employee: { name: 'Sarah Johnson', initials: 'SJ' },
    weekOf: '2024-02-05',
    totalHours: 40,
    billableHours: 36,
    status: 'pending',
    projects: ['Mobile App Development', 'ERP Implementation']
  },
  { 
    id: 3, 
    employee: { name: 'Mike Chen', initials: 'MC' },
    weekOf: '2024-02-05',
    totalHours: 38,
    billableHours: 35,
    status: 'pending',
    projects: ['Data Migration']
  },
  { 
    id: 4, 
    employee: { name: 'Emily Brown', initials: 'EB' },
    weekOf: '2024-02-05',
    totalHours: 36,
    billableHours: 32,
    status: 'draft',
    projects: ['Security Audit', 'ERP Implementation']
  },
  { 
    id: 5, 
    employee: { name: 'Tom Wilson', initials: 'TW' },
    weekOf: '2024-02-05',
    totalHours: 44,
    billableHours: 40,
    status: 'approved',
    projects: ['Mobile App Development', 'Website Redesign']
  },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export function TimesheetsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const totalWeekHours = currentWeekEntries.reduce(
    (acc, day) => acc + day.entries.reduce((sum, entry) => sum + entry.hours, 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timesheets"
        description="Track and manage work hours"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Time
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Log Time Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" defaultValue="2024-02-09" />
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
                <div className="grid gap-2">
                  <Label htmlFor="task">Task</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Database schema design</SelectItem>
                      <SelectItem value="api">API development</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="review">Code review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input id="hours" type="number" placeholder="0" min="0" max="24" step="0.5" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billable">Billable</Label>
                    <Select defaultValue="yes">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Description of work done" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Log Time</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Quick Timer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Quick Timer</p>
                <p className="text-sm text-muted-foreground">Track time in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Database schema design</SelectItem>
                  <SelectItem value="api">API development</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-2xl font-mono font-bold w-24 text-center">
                {String(Math.floor(timerSeconds / 3600)).padStart(2, '0')}:
                {String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0')}:
                {String(timerSeconds % 60).padStart(2, '0')}
              </div>
              <Button 
                variant={activeTimer ? "destructive" : "default"}
                size="icon"
                onClick={() => setActiveTimer(activeTimer ? null : 'timer')}
              >
                {activeTimer ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="my-timesheet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-timesheet">My Timesheet</TabsTrigger>
          <TabsTrigger value="team">Team Timesheets</TabsTrigger>
        </TabsList>

        <TabsContent value="my-timesheet" className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 border rounded-md font-medium">
                Feb 5 - Feb 9, 2024
              </div>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Total Hours: </span>
                <span className="font-bold">{totalWeekHours}h</span>
              </div>
              <Button variant="outline">Submit Week</Button>
            </div>
          </div>

          {/* Daily Entries */}
          <div className="space-y-4">
            {currentWeekEntries.map((day) => (
              <Card key={day.id}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {day.dayName}, {day.date}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {day.entries.reduce((sum, e) => sum + e.hours, 0)}h
                      </span>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {day.entries.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {day.entries.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{entry.task}</p>
                            <p className="text-sm text-muted-foreground">{entry.project}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{entry.hours}h</span>
                            </div>
                            <Badge variant={statusConfig[entry.status].variant}>
                              {statusConfig[entry.status].label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
                {day.entries.length === 0 && (
                  <CardContent className="pt-0">
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No time entries
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Timesheets - Week of Feb 5, 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                    <TableHead className="text-right">Billable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamTimesheets.map((timesheet) => (
                    <TableRow key={timesheet.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{timesheet.employee.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{timesheet.employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {timesheet.projects.map((project) => (
                            <Badge key={project} variant="outline" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{timesheet.totalHours}h</TableCell>
                      <TableCell className="text-right">{timesheet.billableHours}h</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[timesheet.status].variant}>
                          {statusConfig[timesheet.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {timesheet.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                        {timesheet.status !== 'pending' && (
                          <Button variant="ghost" size="sm">View</Button>
                        )}
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
