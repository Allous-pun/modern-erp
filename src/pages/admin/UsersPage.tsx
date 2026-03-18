import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, UserCheck, UserX,
  Users, UserPlus, Shield, Activity, Loader2, RefreshCw
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { organizationsApi, OrganizationMember, InviteMemberData } from '@/lib/api/organizations';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';

// Role options (you might want to fetch these from your roles API later)
const roleOptions = [
  { id: '69a7289d19b7cd1bf83b48f7', name: 'Super Administrator' },
  { id: '69a7289d19b7cd1bf83b4901', name: 'Board Member' },
  { id: '69a7289d19b7cd1bf83b4902', name: 'Chairman' },
  { id: '69a7289d19b7cd1bf83b4903', name: 'Chief Executive Officer (CEO)' },
  { id: '69a7289d19b7cd1bf83b4905', name: 'Chief Financial Officer (CFO)' },
  { id: '69a7289d19b7cd1bf83b4904', name: 'Chief Operating Officer (COO)' },
  { id: '69a7289d19b7cd1bf83b4907', name: 'Chief Information Officer (CIO)' },
  { id: '69a7289d19b7cd1bf83b4906', name: 'Chief Technology Officer (CTO)' },
  { id: '69a7289d19b7cd1bf83b4909', name: 'Chief Human Resources Officer (CHRO)' },
  { id: '69a7289d19b7cd1bf83b4908', name: 'Chief Risk Officer (CRO)' },
  { id: '69a7289d19b7cd1bf83b490a', name: 'Strategy Director' },
  { id: '69a7289d19b7cd1bf83b490b', name: 'Finance Director' },
  { id: '69a7289d19b7cd1bf83b4919', name: 'HR Director' },
  { id: '69a7289d19b7cd1bf83b493c', name: 'Manufacturing Director' },
  { id: '69a7289d19b7cd1bf83b4930', name: 'Procurement Director' },
  { id: '69a7289d19b7cd1bf83b4924', name: 'Sales Director' },
  { id: '69a7289d19b7cd1bf83b491a', name: 'HR Manager' },
  { id: '69a7289d19b7cd1bf83b492a', name: 'Marketing Director' },
  { id: '69a7289d19b7cd1bf83b4946', name: 'Project Director' },
  { id: '69a7289d19b7cd1bf83b4911', name: 'Payroll Manager' },
  { id: '69a7289d19b7cd1bf83b4931', name: 'Procurement Manager' },
  { id: '69a7289d19b7cd1bf83b493d', name: 'Production Manager' },
  { id: '69a7289d19b7cd1bf83b4925', name: 'Sales Manager' },
  { id: '69a7289d19b7cd1bf83b492b', name: 'Marketing Manager' },
  { id: '69a7289d19b7cd1bf83b4937', name: 'Logistics Manager' },
  { id: '69a7289d19b7cd1bf83b4941', name: 'Maintenance Manager' },
  { id: '69a7289d19b7cd1bf83b491f', name: 'Performance Manager' },
  { id: '69a7289d19b7cd1bf83b4934', name: 'Inventory Manager' },
  { id: '69a7289d19b7cd1bf83b4949', name: 'Operations Manager' },
  { id: '69a7289d19b7cd1bf83b4947', name: 'Project Manager' },
  { id: '69a7289d19b7cd1bf83b491c', name: 'Recruitment Manager' },
  { id: '69a7289d19b7cd1bf83b4928', name: 'Business Development Manager' },
  { id: '69a7289d19b7cd1bf83b4923', name: 'Employee Self-Service User' },
  { id: '69a7289d19b7cd1bf83b4966', name: 'Customer Portal User' },
  { id: '69a7289d19b7cd1bf83b4967', name: 'Vendor Portal User' },
];

// Department options (customize based on your organization)
const departments = ['IT', 'Finance', 'Human Resources', 'Sales', 'Operations', 'Marketing', 'Engineering', 'Procurement', 'Manufacturing', 'Projects'];

export function UsersPage() {
  const { organizationData } = useOrganization();
  const [users, setUsers] = useState<OrganizationMember[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<OrganizationMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OrganizationMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleIds: [] as string[],
    jobTitle: '',
    department: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters when users, searchQuery, or statusFilter changes
    let filtered = [...users];
    
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const members = await organizationsApi.getOrganizationMembers();
      setUsers(members);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || newUser.roleIds.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const inviteData: InviteMemberData = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roleIds: newUser.roleIds,
        jobTitle: newUser.jobTitle || undefined,
        department: newUser.department || undefined,
      };
      
      const response = await organizationsApi.inviteMember(inviteData);
      
      toast.success(`User invited successfully!${response.tempPassword ? ` Temporary password: ${response.tempPassword}` : ''}`);
      
      // Refresh user list
      await fetchUsers();
      
      // Reset form and close dialog
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        roleIds: [],
        jobTitle: '',
        department: '',
      });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to invite user:', error);
      toast.error(error.message || 'Failed to invite user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await organizationsApi.removeMember(selectedUser._id);
      
      toast.success('User removed successfully');
      
      // Refresh user list
      await fetchUsers();
      
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Failed to remove user:', error);
      toast.error(error.message || 'Failed to remove user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (user: OrganizationMember) => {
    try {
      if (user.status === 'active') {
        await organizationsApi.removeMember(user._id);
        toast.success('User deactivated successfully');
      } else if (user.status === 'inactive') {
        await organizationsApi.reactivateMember(user._id);
        toast.success('User activated successfully');
      }
      
      // Refresh user list
      await fetchUsers();
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      on_leave: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };
    const statusText = status === 'on_leave' ? 'On Leave' : status.charAt(0).toUpperCase() + status.slice(1);
    return <Badge className={variants[status as keyof typeof variants] || variants.inactive}>{statusText}</Badge>;
  };

  const getInitials = (name: string, firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };

  const formatLastLogin = (lastActive?: string) => {
    if (!lastActive) return 'Never';
    
    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const maxUsers = organizationData?.subscription?.maxUsers || 5;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users, roles, and access permissions"
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Invite a new user to your organization. They will receive an email to set their password.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="lastName" 
                      placeholder="Smith" 
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.smith@company.com" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
                    <Select 
                      value={newUser.roleIds[0] || ''} 
                      onValueChange={(value) => setNewUser({ ...newUser, roleIds: [value] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={newUser.department} 
                      onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    placeholder="Software Engineer" 
                    value={newUser.jobTitle}
                    onChange={(e) => setNewUser({ ...newUser, jobTitle: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Users"
          value={activeUsers.toString()}
          icon={<UserCheck className="h-5 w-5" />}
          change={activeUsers}
          changeLabel={`of ${maxUsers} total`}
        />
        <StatsCard
          title="Pending Invites"
          value={pendingUsers.toString()}
          icon={<UserPlus className="h-5 w-5" />}
        />
        <StatsCard
          title="Departments"
          value={departments.length.toString()}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchUsers} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar?.url || ''} />
                            <AvatarFallback>
                              {getInitials(user.name, user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name || `${user.firstName} ${user.lastName}`}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.roles?.map(r => r.name).join(', ') || 'No role'}
                      </TableCell>
                      <TableCell>{user.department || user.jobTitle || '-'}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatLastLogin(user.lastActive)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              View Activity
                            </DropdownMenuItem>
                            {user.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : user.status === 'inactive' ? (
                              <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` "${selectedUser.name || selectedUser.email}"`} from your organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}