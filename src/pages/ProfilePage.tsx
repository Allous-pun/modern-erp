import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { organizationsApi, MemberProfile } from '@/lib/api/organizations';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  MapPin, 
  Calendar,
  Shield,
  Bell,
  Lock,
  Camera,
  Save,
  Edit2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { currentOrganization } = useOrganization();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<MemberProfile | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    department: '',
    location: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    mentionAlerts: true,
    taskReminders: true,
    systemUpdates: false,
  });

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Update form data when profile loads or user changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.personalInfo?.firstName || '',
        lastName: profileData.personalInfo?.lastName || '',
        email: profileData.personalInfo?.email || '',
        phoneNumber: profileData.personalInfo?.phoneNumber || '',
        jobTitle: profileData.jobTitle || '',
        department: profileData.department || '',
        location: profileData.location || 'Nairobi, Kenya',
      });
    } else if (user) {
      // Fallback to user data from auth
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: '',
        jobTitle: user.jobTitle || '',
        department: '',
        location: 'Nairobi, Kenya',
      });
    }
  }, [profileData, user]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await organizationsApi.getMyProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Prepare update data
      const updateData: any = {};
      
      if (formData.firstName !== profileData?.personalInfo?.firstName || 
          formData.lastName !== profileData?.personalInfo?.lastName ||
          formData.phoneNumber !== profileData?.personalInfo?.phoneNumber) {
        updateData.personalInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber || undefined
        };
      }
      
      if (formData.jobTitle !== profileData?.jobTitle) {
        updateData.jobTitle = formData.jobTitle;
      }
      
      // Only call API if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedProfile = await organizationsApi.updateMyProfile(updateData);
        
        // Update profile data
        setProfileData(updatedProfile);
        
        // Update auth context user
        if (user) {
          setUser({
            ...user,
            firstName: updatedProfile.personalInfo?.firstName || user.firstName,
            lastName: updatedProfile.personalInfo?.lastName || user.lastName,
            displayName: updatedProfile.personalInfo?.displayName || user.displayName,
            jobTitle: updatedProfile.jobTitle || user.jobTitle,
          });
        }
        
        toast.success('Profile updated successfully');
      } else {
        toast.info('No changes to save');
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    if (formData.firstName) {
      return formData.firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    }
    if (formData.firstName) {
      return formData.firstName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getRoleDisplay = () => {
    if (profileData?.roles && profileData.roles.length > 0) {
      return profileData.roles[0].name;
    }
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0].name;
    }
    return 'User';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and preferences"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar || ''} alt={getDisplayName()} />
                    <AvatarFallback className="text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    disabled
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl font-bold">{getDisplayName()}</h2>
                    <Badge variant="secondary" className="capitalize">
                      {getRoleDisplay()}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{formData.jobTitle || 'No job title'}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentOrganization?.name || 'Organization'} • Member since {profileData?.joinedAt ? new Date(profileData.joinedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing || isSaving}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={true} // Email cannot be changed
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={!isEditing || isSaving}
                    className="pl-10"
                    placeholder="+254 712 345 678"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing || isSaving}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Information
              </CardTitle>
              <CardDescription>
                Your role and department details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    disabled={!isEditing || isSaving}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={!isEditing || isSaving}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profileData?.employeeId || `EMP-${user?.id?.slice(-6) || '000000'}`}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profileData?.joinedAt ? new Date(profileData.joinedAt).toLocaleDateString() : 'N/A'}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed {profileData?.lastActive ? 'recently' : 'N/A'}
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-muted-foreground">
                    Manage devices where you're logged in
                  </p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of activity' },
                { key: 'mentionAlerts', label: 'Mention Alerts', description: 'Get notified when someone mentions you' },
                { key: 'taskReminders', label: 'Task Reminders', description: 'Receive reminders for upcoming tasks' },
                { key: 'systemUpdates', label: 'System Updates', description: 'Get notified about system updates' },
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                    />
                  </div>
                  {index < 5 && <Separator />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Logged in from Chrome on Windows', time: '2 hours ago', icon: '🖥️' },
                  { action: 'Profile updated', time: '1 day ago', icon: '📝' },
                  { action: 'Logged in from Safari on iPhone', time: '3 days ago', icon: '📱' },
                  { action: 'Password changed successfully', time: '1 week ago', icon: '🔐' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};