import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Factory, Users, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ScheduledJob {
  id: string;
  workOrder: string;
  product: string;
  workCenter: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  operator: string;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mockSchedule: Record<string, ScheduledJob[]> = {
  'Monday': [
    { id: '1', workOrder: 'WO-001', product: 'Widget A', workCenter: 'Assembly 1', startTime: '08:00', endTime: '12:00', status: 'completed', operator: 'John S.' },
    { id: '2', workOrder: 'WO-002', product: 'Component X', workCenter: 'CNC-001', startTime: '08:00', endTime: '16:00', status: 'in_progress', operator: 'Sarah J.' },
    { id: '3', workOrder: 'WO-003', product: 'Module B', workCenter: 'Assembly 2', startTime: '13:00', endTime: '17:00', status: 'scheduled', operator: 'Mike C.' },
  ],
  'Tuesday': [
    { id: '4', workOrder: 'WO-001', product: 'Widget A', workCenter: 'Assembly 1', startTime: '08:00', endTime: '12:00', status: 'scheduled', operator: 'John S.' },
    { id: '5', workOrder: 'WO-004', product: 'Kit Pro', workCenter: 'Packaging', startTime: '09:00', endTime: '15:00', status: 'scheduled', operator: 'Lisa W.' },
  ],
  'Wednesday': [
    { id: '6', workOrder: 'WO-002', product: 'Component X', workCenter: 'CNC-001', startTime: '08:00', endTime: '16:00', status: 'scheduled', operator: 'Sarah J.' },
    { id: '7', workOrder: 'WO-005', product: 'Circuit Alpha', workCenter: 'SMT-001', startTime: '06:00', endTime: '14:00', status: 'scheduled', operator: 'Tom B.' },
  ],
  'Thursday': [
    { id: '8', workOrder: 'WO-003', product: 'Module B', workCenter: 'Assembly 2', startTime: '08:00', endTime: '16:00', status: 'scheduled', operator: 'Mike C.' },
  ],
  'Friday': [
    { id: '9', workOrder: 'WO-004', product: 'Kit Pro', workCenter: 'Packaging', startTime: '08:00', endTime: '12:00', status: 'scheduled', operator: 'Lisa W.' },
    { id: '10', workOrder: 'WO-005', product: 'Circuit Alpha', workCenter: 'QC-001', startTime: '13:00', endTime: '17:00', status: 'scheduled', operator: 'Alex W.' },
  ],
  'Saturday': [],
  'Sunday': [],
};

const capacityData = [
  { name: 'Assembly Line 1', capacity: 100, allocated: 85, color: 'bg-blue-500' },
  { name: 'Assembly Line 2', capacity: 100, allocated: 72, color: 'bg-green-500' },
  { name: 'CNC Machine 1', capacity: 50, allocated: 48, color: 'bg-purple-500' },
  { name: 'SMT Line 1', capacity: 150, allocated: 90, color: 'bg-orange-500' },
  { name: 'Packaging Station', capacity: 300, allocated: 220, color: 'bg-pink-500' },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-muted border-muted-foreground/20 text-muted-foreground',
    delayed: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || colors.scheduled;
};

export function ProductionPlanningPage() {
  const [currentWeek, setCurrentWeek] = useState('Feb 5 - Feb 11, 2024');
  const [viewType, setViewType] = useState('week');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Planning"
        description="Schedule and manage production capacity"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Job
          </Button>
        }
      />

      {/* Capacity Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-sm text-muted-foreground">Overall Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">Scheduled This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">156h</div>
                <p className="text-sm text-muted-foreground">Planned Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">Operators Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schedule Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Production Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-40 text-center">{currentWeek}</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Select value={viewType} onValueChange={setViewType}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="min-h-48">
                  <div className="text-sm font-medium text-center p-2 bg-muted rounded-t-lg">
                    {day.slice(0, 3)}
                  </div>
                  <div className="border rounded-b-lg p-2 space-y-2 min-h-40">
                    {mockSchedule[day]?.map((job) => (
                      <div
                        key={job.id}
                        className={`p-2 rounded border text-xs ${getStatusColor(job.status)}`}
                      >
                        <p className="font-medium truncate">{job.product}</p>
                        <p className="text-[10px] opacity-80">{job.startTime} - {job.endTime}</p>
                        <p className="text-[10px] opacity-80 truncate">{job.workCenter}</p>
                      </div>
                    ))}
                    {(!mockSchedule[day] || mockSchedule[day].length === 0) && (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                        No jobs
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 justify-center">
              {['scheduled', 'in_progress', 'completed', 'delayed'].map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${getStatusColor(status).split(' ')[0]}`} />
                  <span className="text-xs capitalize">{status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Capacity Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacity Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {capacityData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.allocated}/{item.capacity}h
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all`}
                    style={{ width: `${(item.allocated / item.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-3">Upcoming Bottlenecks</h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">CNC Machine 1</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500">96% capacity on Thursday</p>
                </div>
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-sm">
                  <p className="font-medium text-red-800 dark:text-red-400">Packaging Station</p>
                  <p className="text-xs text-red-700 dark:text-red-500">Over capacity on Friday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
