import React, { useState } from 'react';
import { GraduationCap, Plus, Play, CheckCircle, Clock, Users, Calendar, Award, BookOpen, Video } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const courses = [
  { id: 'CRS001', title: 'Leadership Fundamentals', type: 'Workshop', duration: '8 hours', instructor: 'External', enrolled: 45, completed: 32, status: 'active', startDate: 'Feb 15, 2024' },
  { id: 'CRS002', title: 'Advanced React Development', type: 'Online', duration: '20 hours', instructor: 'Tech Team', enrolled: 28, completed: 15, status: 'active', startDate: 'Jan 10, 2024' },
  { id: 'CRS003', title: 'Effective Communication', type: 'Workshop', duration: '4 hours', instructor: 'HR Team', enrolled: 60, completed: 60, status: 'completed', startDate: 'Dec 5, 2023' },
  { id: 'CRS004', title: 'Data Privacy & Security', type: 'Online', duration: '3 hours', instructor: 'Compliance', enrolled: 248, completed: 210, status: 'mandatory', startDate: 'Jan 1, 2024' },
  { id: 'CRS005', title: 'Project Management Basics', type: 'Hybrid', duration: '16 hours', instructor: 'External', enrolled: 35, completed: 0, status: 'upcoming', startDate: 'Mar 1, 2024' },
  { id: 'CRS006', title: 'Customer Service Excellence', type: 'Online', duration: '6 hours', instructor: 'Sales Team', enrolled: 42, completed: 28, status: 'active', startDate: 'Jan 20, 2024' },
];

const enrollments = [
  { id: 'ENR001', employee: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', course: 'Advanced React Development', progress: 75, startedDate: 'Jan 12, 2024', status: 'in-progress' },
  { id: 'ENR002', employee: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', course: 'Leadership Fundamentals', progress: 100, startedDate: 'Feb 15, 2024', status: 'completed' },
  { id: 'ENR003', employee: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', course: 'Data Privacy & Security', progress: 50, startedDate: 'Jan 5, 2024', status: 'in-progress' },
  { id: 'ENR004', employee: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', course: 'Customer Service Excellence', progress: 100, startedDate: 'Jan 22, 2024', status: 'completed' },
  { id: 'ENR005', employee: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', course: 'Data Privacy & Security', progress: 0, startedDate: '-', status: 'not-started' },
  { id: 'ENR006', employee: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', course: 'Leadership Fundamentals', progress: 60, startedDate: 'Feb 16, 2024', status: 'in-progress' },
];

const certifications = [
  { id: 'CERT001', name: 'AWS Solutions Architect', employee: 'Mike Chen', issuer: 'Amazon', earnedDate: 'Jan 20, 2024', expiryDate: 'Jan 20, 2027', status: 'active' },
  { id: 'CERT002', name: 'PMP Certification', employee: 'Sarah Johnson', issuer: 'PMI', earnedDate: 'Jun 15, 2023', expiryDate: 'Jun 15, 2026', status: 'active' },
  { id: 'CERT003', name: 'Google Analytics', employee: 'Emily Davis', issuer: 'Google', earnedDate: 'Mar 10, 2023', expiryDate: 'Mar 10, 2025', status: 'expiring-soon' },
  { id: 'CERT004', name: 'Salesforce Admin', employee: 'James Wilson', issuer: 'Salesforce', earnedDate: 'Nov 5, 2022', expiryDate: 'Nov 5, 2024', status: 'expiring-soon' },
  { id: 'CERT005', name: 'SHRM-CP', employee: 'Rachel Green', issuer: 'SHRM', earnedDate: 'Aug 20, 2023', expiryDate: 'Aug 20, 2026', status: 'active' },
];

const getCourseStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Active</Badge>;
    case 'completed':
      return <Badge className="bg-muted text-muted-foreground">Completed</Badge>;
    case 'mandatory':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Mandatory</Badge>;
    case 'upcoming':
      return <Badge className="bg-status-info/10 text-status-info border-status-info/20">Upcoming</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getEnrollmentStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-status-info/10 text-status-info border-status-info/20">In Progress</Badge>;
    case 'not-started':
      return <Badge className="bg-muted text-muted-foreground">Not Started</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getCertStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Active</Badge>;
    case 'expiring-soon':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Expiring Soon</Badge>;
    case 'expired':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Expired</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getCourseTypeIcon = (type: string) => {
  switch (type) {
    case 'Online':
      return <Video className="h-4 w-4" />;
    case 'Workshop':
      return <Users className="h-4 w-4" />;
    case 'Hybrid':
      return <BookOpen className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

export function TrainingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & Development"
        description="Manage employee training programs and certifications"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Training' },
        ]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Training Course</DialogTitle>
                <DialogDescription>
                  Set up a new training program for employees.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="courseTitle">Course Title</Label>
                  <Input id="courseTitle" placeholder="e.g., Leadership Fundamentals" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 8 hours" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input id="instructor" placeholder="e.g., HR Team" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Course description..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Course</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Courses"
          value="6"
          change={2}
          changeLabel="new this month"
          icon={<GraduationCap className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Total Enrollments"
          value="458"
          change={45}
          changeLabel="this month"
          icon={<Users className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Completion Rate"
          value="72%"
          change={8}
          changeLabel="improvement"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Certifications"
          value="28"
          change={5}
          changeLabel="earned this quarter"
          icon={<Award className="h-5 w-5" />}
          variant="hr"
        />
      </div>

      {/* Featured Courses */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getCourseTypeIcon(course.type)}
                  <span className="text-sm">{course.type}</span>
                </div>
                {getCourseStatusBadge(course.status)}
              </div>
              <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
              <CardDescription>{course.duration} • {course.instructor}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{course.completed}/{course.enrolled} completed</span>
                </div>
                <Progress value={(course.completed / course.enrolled) * 100} className="h-2" />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{course.startDate}</span>
                  </div>
                  <Button size="sm">
                    <Play className="mr-1 h-3 w-3" />
                    Start
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCourseTypeIcon(course.type)}
                        <span>{course.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.enrolled}</TableCell>
                    <TableCell>{course.completed}</TableCell>
                    <TableCell>{course.startDate}</TableCell>
                    <TableCell>{getCourseStatusBadge(course.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.avatar} alt={enrollment.employee} />
                          <AvatarFallback>{enrollment.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{enrollment.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{enrollment.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={enrollment.progress} className="h-2 flex-1" />
                        <span className="text-sm text-muted-foreground w-10">{enrollment.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className={enrollment.startedDate === '-' ? 'text-muted-foreground' : ''}>
                      {enrollment.startedDate}
                    </TableCell>
                    <TableCell>{getEnrollmentStatusBadge(enrollment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certification</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Earned Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-module-hr" />
                        <span className="font-medium">{cert.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{cert.employee}</TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>{cert.earnedDate}</TableCell>
                    <TableCell>{cert.expiryDate}</TableCell>
                    <TableCell>{getCertStatusBadge(cert.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
