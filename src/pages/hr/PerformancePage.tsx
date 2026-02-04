import React, { useState } from 'react';
import { Target, Star, TrendingUp, Award, Calendar, Plus, Eye, Edit } from 'lucide-react';
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

const reviews = [
  { id: 'REV001', employee: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', department: 'Engineering', reviewer: 'John Smith', period: 'Q4 2023', rating: 4.5, status: 'completed', completedDate: 'Jan 15, 2024' },
  { id: 'REV002', employee: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', department: 'Engineering', reviewer: 'John Smith', period: 'Q4 2023', rating: 4.8, status: 'completed', completedDate: 'Jan 14, 2024' },
  { id: 'REV003', employee: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', department: 'Marketing', reviewer: 'Lisa Park', period: 'Q4 2023', rating: 0, status: 'pending', completedDate: '-' },
  { id: 'REV004', employee: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', department: 'Sales', reviewer: 'David Brown', period: 'Q4 2023', rating: 3.8, status: 'in-progress', completedDate: '-' },
  { id: 'REV005', employee: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', department: 'HR', reviewer: 'Rachel Green', period: 'Q4 2023', rating: 0, status: 'scheduled', completedDate: '-' },
  { id: 'REV006', employee: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', department: 'Marketing', reviewer: 'CEO', period: 'Q4 2023', rating: 4.9, status: 'completed', completedDate: 'Jan 10, 2024' },
];

const goals = [
  { id: 'GOAL001', title: 'Increase sales by 20%', employee: 'James Wilson', category: 'Performance', progress: 75, dueDate: 'Mar 31, 2024', status: 'on-track' },
  { id: 'GOAL002', title: 'Complete AWS certification', employee: 'Sarah Johnson', category: 'Development', progress: 60, dueDate: 'Feb 28, 2024', status: 'on-track' },
  { id: 'GOAL003', title: 'Launch new marketing campaign', employee: 'Emily Davis', category: 'Project', progress: 40, dueDate: 'Feb 15, 2024', status: 'at-risk' },
  { id: 'GOAL004', title: 'Reduce bug count by 50%', employee: 'Mike Chen', category: 'Quality', progress: 90, dueDate: 'Jan 31, 2024', status: 'on-track' },
  { id: 'GOAL005', title: 'Implement new onboarding process', employee: 'Alex Thompson', category: 'Process', progress: 25, dueDate: 'Mar 15, 2024', status: 'behind' },
  { id: 'GOAL006', title: 'Achieve customer satisfaction of 95%', employee: 'David Brown', category: 'Customer', progress: 85, dueDate: 'Apr 30, 2024', status: 'on-track' },
];

const ratingDistribution = [
  { rating: '5.0', count: 18, percentage: 15 },
  { rating: '4.5', count: 42, percentage: 35 },
  { rating: '4.0', count: 36, percentage: 30 },
  { rating: '3.5', count: 15, percentage: 12 },
  { rating: '3.0', count: 8, percentage: 7 },
  { rating: 'Below 3.0', count: 1, percentage: 1 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-status-info/10 text-status-info border-status-info/20">In Progress</Badge>;
    case 'pending':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Pending</Badge>;
    case 'scheduled':
      return <Badge className="bg-muted text-muted-foreground">Scheduled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getGoalStatusBadge = (status: string) => {
  switch (status) {
    case 'on-track':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">On Track</Badge>;
    case 'at-risk':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">At Risk</Badge>;
    case 'behind':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Behind</Badge>;
    case 'completed':
      return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars 
              ? 'fill-yellow-400 text-yellow-400' 
              : i === fullStars && hasHalfStar
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export function PerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Management"
        description="Track employee performance reviews and goals"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Performance' },
        ]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Performance Review</DialogTitle>
                <DialogDescription>
                  Schedule a new performance review for an employee.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {reviews.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.employee}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewer">Reviewer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="lisa">Lisa Park</SelectItem>
                        <SelectItem value="david">David Brown</SelectItem>
                        <SelectItem value="rachel">Rachel Green</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Review Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1-2024">Q1 2024</SelectItem>
                        <SelectItem value="q4-2023">Q4 2023</SelectItem>
                        <SelectItem value="annual-2023">Annual 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Reviews Completed"
          value="42"
          change={12}
          changeLabel="this quarter"
          icon={<Target className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Pending Reviews"
          value="15"
          change={-5}
          changeLabel="vs last week"
          icon={<Calendar className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Average Rating"
          value="4.2"
          change={0.3}
          changeLabel="vs last quarter"
          icon={<Star className="h-5 w-5" />}
          variant="hr"
        />
        <StatsCard
          title="Goals On Track"
          value="78%"
          change={5}
          changeLabel="improvement"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="hr"
        />
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Performance rating breakdown for Q4 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">{item.rating}</div>
                <div className="flex-1">
                  <Progress value={item.percentage} className="h-3" />
                </div>
                <div className="w-20 text-sm text-muted-foreground text-right">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Q4 2023 Reviews</CardTitle>
              <CardDescription>Employee performance review status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.avatar} alt={review.employee} />
                            <AvatarFallback>{review.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.employee}</span>
                        </div>
                      </TableCell>
                      <TableCell>{review.department}</TableCell>
                      <TableCell>{review.reviewer}</TableCell>
                      <TableCell>{review.period}</TableCell>
                      <TableCell>
                        {review.rating > 0 ? renderStars(review.rating) : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {review.status !== 'completed' && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Employee Goals</CardTitle>
                  <CardDescription>Track progress on individual objectives</CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Goal</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium max-w-[250px]">{goal.title}</TableCell>
                      <TableCell>{goal.employee}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{goal.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={goal.progress} className="h-2 flex-1" />
                          <span className="text-sm text-muted-foreground w-10">{goal.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{goal.dueDate}</TableCell>
                      <TableCell>{getGoalStatusBadge(goal.status)}</TableCell>
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
