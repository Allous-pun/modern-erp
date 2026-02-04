import React, { useState } from 'react';
import { Briefcase, Plus, Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const jobPostings = [
  { id: 'JOB001', title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', applicants: 45, status: 'active', posted: 'Jan 10, 2024', salary: '$120k - $150k' },
  { id: 'JOB002', title: 'Product Manager', department: 'Product', location: 'New York', type: 'Full-time', applicants: 32, status: 'active', posted: 'Jan 15, 2024', salary: '$130k - $160k' },
  { id: 'JOB003', title: 'UX Designer', department: 'Design', location: 'San Francisco', type: 'Full-time', applicants: 28, status: 'active', posted: 'Jan 18, 2024', salary: '$100k - $130k' },
  { id: 'JOB004', title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', applicants: 18, status: 'paused', posted: 'Dec 20, 2023', salary: '$115k - $145k' },
  { id: 'JOB005', title: 'Marketing Coordinator', department: 'Marketing', location: 'Chicago', type: 'Full-time', applicants: 56, status: 'closed', posted: 'Dec 1, 2023', salary: '$55k - $70k' },
];

const candidates = [
  { id: 'CAN001', name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', email: 'john.smith@email.com', position: 'Senior Frontend Developer', stage: 'Interview', appliedDate: 'Jan 12, 2024', rating: 4.5, experience: '7 years' },
  { id: 'CAN002', name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', email: 'emma.wilson@email.com', position: 'Product Manager', stage: 'Screening', appliedDate: 'Jan 16, 2024', rating: 4.2, experience: '5 years' },
  { id: 'CAN003', name: 'Michael Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael', email: 'michael.brown@email.com', position: 'UX Designer', stage: 'Offer', appliedDate: 'Jan 19, 2024', rating: 4.8, experience: '6 years' },
  { id: 'CAN004', name: 'Sophie Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie', email: 'sophie.lee@email.com', position: 'Senior Frontend Developer', stage: 'Technical', appliedDate: 'Jan 14, 2024', rating: 4.0, experience: '4 years' },
  { id: 'CAN005', name: 'Daniel Garcia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel', email: 'daniel.garcia@email.com', position: 'DevOps Engineer', stage: 'Rejected', appliedDate: 'Jan 8, 2024', rating: 3.2, experience: '3 years' },
  { id: 'CAN006', name: 'Olivia Martinez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia', email: 'olivia.martinez@email.com', position: 'Product Manager', stage: 'Hired', appliedDate: 'Jan 5, 2024', rating: 4.9, experience: '8 years' },
];

const pipelineStages = [
  { name: 'Applied', count: 89, color: 'bg-muted' },
  { name: 'Screening', count: 34, color: 'bg-status-info' },
  { name: 'Interview', count: 18, color: 'bg-status-warning' },
  { name: 'Technical', count: 8, color: 'bg-module-hr' },
  { name: 'Offer', count: 4, color: 'bg-status-success' },
  { name: 'Hired', count: 6, color: 'bg-primary' },
];

const getStageBadge = (stage: string) => {
  switch (stage) {
    case 'Applied':
      return <Badge variant="secondary">Applied</Badge>;
    case 'Screening':
      return <Badge className="bg-status-info/10 text-status-info border-status-info/20">Screening</Badge>;
    case 'Interview':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Interview</Badge>;
    case 'Technical':
      return <Badge className="bg-module-hr/10 text-module-hr border-module-hr/20">Technical</Badge>;
    case 'Offer':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Offer</Badge>;
    case 'Hired':
      return <Badge className="bg-primary/10 text-primary border-primary/20">Hired</Badge>;
    case 'Rejected':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{stage}</Badge>;
  }
};

const getJobStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Active</Badge>;
    case 'paused':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">Paused</Badge>;
    case 'closed':
      return <Badge className="bg-muted text-muted-foreground">Closed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function RecruitmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment"
        description="Manage job postings and track candidates"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Recruitment' },
        ]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Job Posting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription>
                  Create a new job posting to attract candidates.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" placeholder="e.g., Senior Software Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Remote, New York" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Employment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input id="salary" placeholder="e.g., $100k - $130k" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea id="description" placeholder="Enter job description..." rows={4} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Posting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
          <CardDescription>Current candidate distribution across stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {pipelineStages.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <div className="flex-1 text-center">
              <div className={`h-12 rounded-lg ${stage.color} flex items-center justify-center font-semibold ${stage.color === 'bg-muted' ? 'text-foreground' : 'text-primary-foreground'}`}>
                {stage.count}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stage.name}</p>
                </div>
                {index < pipelineStages.length - 1 && (
                  <div className="text-muted-foreground">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.salary}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{job.applicants}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{job.posted}</TableCell>
                    <TableCell>{getJobStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell>{getStageBadge(candidate.stage)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-status-warning">★</span>
                        <span>{candidate.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{candidate.appliedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-status-success">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-status-error">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
