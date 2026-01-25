import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, MapPin, Users, Plus, Edit, Trash2, Globe, Phone, Mail,
  ChevronRight, Building
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  manager: string;
  employeeCount: number;
  parentId?: string;
  location: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  type: 'headquarters' | 'branch' | 'warehouse' | 'remote';
  employeeCount: number;
  phone: string;
}

interface CompanyInfo {
  name: string;
  legalName: string;
  taxId: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}

const companyInfo: CompanyInfo = {
  name: 'TechCorp Solutions',
  legalName: 'TechCorp Solutions Inc.',
  taxId: 'US-12-3456789',
  industry: 'Information Technology',
  website: 'www.techcorp.com',
  email: 'info@techcorp.com',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Avenue, Silicon Valley, CA 94025, USA',
};

const mockDepartments: Department[] = [
  { id: '1', name: 'Executive Office', code: 'EXEC', manager: 'John Smith', employeeCount: 5, location: 'Headquarters' },
  { id: '2', name: 'Information Technology', code: 'IT', manager: 'Sarah Johnson', employeeCount: 25, location: 'Headquarters' },
  { id: '3', name: 'Software Development', code: 'IT-DEV', manager: 'Mike Chen', employeeCount: 18, parentId: '2', location: 'Headquarters' },
  { id: '4', name: 'IT Infrastructure', code: 'IT-INFRA', manager: 'Alex Thompson', employeeCount: 7, parentId: '2', location: 'Headquarters' },
  { id: '5', name: 'Human Resources', code: 'HR', manager: 'Emily Davis', employeeCount: 8, location: 'Headquarters' },
  { id: '6', name: 'Finance', code: 'FIN', manager: 'David Brown', employeeCount: 12, location: 'Headquarters' },
  { id: '7', name: 'Accounting', code: 'FIN-ACC', manager: 'Jennifer Lee', employeeCount: 6, parentId: '6', location: 'Headquarters' },
  { id: '8', name: 'Treasury', code: 'FIN-TRS', manager: 'Lisa Wang', employeeCount: 4, parentId: '6', location: 'Headquarters' },
  { id: '9', name: 'Sales', code: 'SALES', manager: 'Robert Wilson', employeeCount: 20, location: 'Multiple' },
  { id: '10', name: 'Marketing', code: 'MKT', manager: 'Amanda Garcia', employeeCount: 10, location: 'Headquarters' },
  { id: '11', name: 'Operations', code: 'OPS', manager: 'Chris Martinez', employeeCount: 15, location: 'Warehouse A' },
  { id: '12', name: 'Customer Support', code: 'SUPPORT', manager: 'Nancy Taylor', employeeCount: 12, location: 'Remote' },
];

const mockLocations: Location[] = [
  { id: '1', name: 'Headquarters', address: '123 Tech Avenue', city: 'Silicon Valley, CA', country: 'USA', type: 'headquarters', employeeCount: 85, phone: '+1 (555) 123-4567' },
  { id: '2', name: 'New York Office', address: '456 Business Park', city: 'New York, NY', country: 'USA', type: 'branch', employeeCount: 25, phone: '+1 (555) 234-5678' },
  { id: '3', name: 'London Office', address: '789 Corporate Lane', city: 'London', country: 'UK', type: 'branch', employeeCount: 15, phone: '+44 20 1234 5678' },
  { id: '4', name: 'Warehouse A', address: '321 Industrial Blvd', city: 'Los Angeles, CA', country: 'USA', type: 'warehouse', employeeCount: 20, phone: '+1 (555) 345-6789' },
  { id: '5', name: 'Remote Team', address: 'Various Locations', city: 'Remote', country: 'Global', type: 'remote', employeeCount: 12, phone: 'N/A' },
];

export function OrganizationPage() {
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);

  const getLocationBadge = (type: Location['type']) => {
    const variants = {
      headquarters: 'bg-primary/10 text-primary',
      branch: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      warehouse: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      remote: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return <Badge className={variants[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  const parentDepts = mockDepartments.filter(d => !d.parentId);
  const getChildDepts = (parentId: string) => mockDepartments.filter(d => d.parentId === parentId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Structure"
        description="Manage company information, departments, and locations"
      />

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{companyInfo.name}</CardTitle>
                    <CardDescription>{companyInfo.legalName}</CardDescription>
                  </div>
                </div>
                <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Company Information</DialogTitle>
                      <DialogDescription>Update your organization's details</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input defaultValue={companyInfo.name} />
                        </div>
                        <div className="space-y-2">
                          <Label>Legal Name</Label>
                          <Input defaultValue={companyInfo.legalName} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tax ID</Label>
                          <Input defaultValue={companyInfo.taxId} />
                        </div>
                        <div className="space-y-2">
                          <Label>Industry</Label>
                          <Input defaultValue={companyInfo.industry} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Website</Label>
                          <Input defaultValue={companyInfo.website} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input defaultValue={companyInfo.email} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input defaultValue={companyInfo.address} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditCompanyOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsEditCompanyOpen(false)}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tax ID</p>
                  <p className="font-medium">{companyInfo.taxId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{companyInfo.industry}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="font-medium flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {companyInfo.website}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {companyInfo.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {companyInfo.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {companyInfo.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockDepartments.reduce((sum, d) => sum + d.employeeCount, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Employees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockDepartments.length}</p>
                    <p className="text-sm text-muted-foreground">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockLocations.length}</p>
                    <p className="text-sm text-muted-foreground">Locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Department</DialogTitle>
                  <DialogDescription>Create a new department in your organization</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Department Name</Label>
                    <Input placeholder="e.g., Research & Development" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Input placeholder="e.g., R&D" />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="None (Top Level)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Top Level)</SelectItem>
                          {parentDepts.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <Input placeholder="Select department manager" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDeptOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddDeptOpen(false)}>Create Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {parentDepts.map((dept) => (
                  <div key={dept.id}>
                    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{dept.name}</span>
                            <Badge variant="outline">{dept.code}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Manager: {dept.manager} · {dept.employeeCount} employees
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Child Departments */}
                    {getChildDepts(dept.id).map((child) => (
                      <div key={child.id} className="ml-8 mt-1 flex items-center justify-between rounded-lg border border-dashed p-3 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{child.name}</span>
                              <Badge variant="outline" className="text-xs">{child.code}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Manager: {child.manager} · {child.employeeCount} employees
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Location</DialogTitle>
                  <DialogDescription>Add a new office or facility location</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location Name</Label>
                      <Input placeholder="e.g., Chicago Office" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="branch">Branch Office</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input placeholder="Street address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input placeholder="City, State" />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input placeholder="Country" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddLocationOpen(false)}>Add Location</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{getLocationBadge(location.type)}</TableCell>
                      <TableCell>
                        <div>
                          <p>{location.address}</p>
                          <p className="text-sm text-muted-foreground">{location.city}, {location.country}</p>
                        </div>
                      </TableCell>
                      <TableCell>{location.phone}</TableCell>
                      <TableCell>{location.employeeCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
