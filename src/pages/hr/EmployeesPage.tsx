import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, MapPin, Building } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const employees = [
  { id: 'EMP001', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', email: 'sarah.johnson@company.com', phone: '+1 234 567 890', department: 'Engineering', position: 'Senior Developer', location: 'New York', status: 'active', joinDate: 'Jan 15, 2022', manager: 'John Smith' },
  { id: 'EMP002', name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', email: 'mike.chen@company.com', phone: '+1 234 567 891', department: 'Engineering', position: 'Tech Lead', location: 'San Francisco', status: 'active', joinDate: 'Mar 22, 2021', manager: 'John Smith' },
  { id: 'EMP003', name: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', email: 'emily.davis@company.com', phone: '+1 234 567 892', department: 'Marketing', position: 'Marketing Manager', location: 'Chicago', status: 'active', joinDate: 'Jun 10, 2023', manager: 'Lisa Park' },
  { id: 'EMP004', name: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', email: 'james.wilson@company.com', phone: '+1 234 567 893', department: 'Sales', position: 'Account Executive', location: 'Boston', status: 'on-leave', joinDate: 'Sep 5, 2022', manager: 'David Brown' },
  { id: 'EMP005', name: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', email: 'alex.thompson@company.com', phone: '+1 234 567 894', department: 'HR', position: 'HR Specialist', location: 'New York', status: 'active', joinDate: 'Jan 8, 2024', manager: 'Rachel Green' },
  { id: 'EMP006', name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', email: 'lisa.park@company.com', phone: '+1 234 567 895', department: 'Marketing', position: 'VP Marketing', location: 'Los Angeles', status: 'active', joinDate: 'Feb 14, 2020', manager: 'CEO' },
  { id: 'EMP007', name: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', email: 'david.brown@company.com', phone: '+1 234 567 896', department: 'Sales', position: 'Sales Director', location: 'Miami', status: 'active', joinDate: 'Apr 20, 2021', manager: 'CEO' },
  { id: 'EMP008', name: 'Rachel Green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel', email: 'rachel.green@company.com', phone: '+1 234 567 897', department: 'HR', position: 'HR Director', location: 'New York', status: 'active', joinDate: 'Aug 1, 2019', manager: 'CEO' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-status-success/10 text-status-success border-status-success/20">Active</Badge>;
    case 'on-leave':
      return <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20">On Leave</Badge>;
    case 'terminated':
      return <Badge className="bg-status-error/10 text-status-error border-status-error/20">Terminated</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function EmployeesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        description="Manage and view all employee information"
        breadcrumbs={[
          { label: 'HR & Payroll', path: '/hr' },
          { label: 'Employees' },
        ]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the details for the new employee.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1 234 567 890" />
                  </div>
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
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" placeholder="Software Engineer" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter(e => e.position.includes('Director') || e.position.includes('VP') || e.position.includes('Lead')).map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add Employee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')}>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                  <div className="mt-2">{getStatusBadge(employee.status)}</div>
                  <div className="mt-4 w-full space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{employee.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{employee.id}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.location}</TableCell>
                  <TableCell>{employee.manager}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
