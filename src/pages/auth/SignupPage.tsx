import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail, User, Building2, Briefcase, 
  Phone, Calendar, MapPin, Globe, ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { invitesApi } from '@/lib/api/invites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Gender options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export function SignupPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');

  // Get pending organization from onboarding
  const pendingOrgId = sessionStorage.getItem('pending_org_id');
  const pendingOrgName = sessionStorage.getItem('pending_org_name');

  // Basic required fields
  const [formData, setFormData] = useState({
    // Required
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Optional contact
    phoneNumber: '',
    
    // Optional personal
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bio: '',
    
    // Optional address
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    
    // Organization (for non-invite flow)
    company: '',
    
    // Invite-specific
    jobTitle: '',
    department: '',
  });
  
  const [inviteData, setInviteData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'invite' | 'register' | 'organization'>(
    inviteToken ? 'invite' : 'organization'
  );

  // Verify invite token if present
  useEffect(() => {
    if (inviteToken) {
      verifyInviteToken();
    }
  }, [inviteToken]);

  const verifyInviteToken = async () => {
    try {
      setIsLoading(true);
      const data = await invitesApi.verifyInvite(inviteToken!);
      setInviteData(data);
      setFormData(prev => ({ 
        ...prev, 
        email: data.email,
        jobTitle: data.jobTitle || '',
        department: data.department || '',
      }));
      setStep('register');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired invitation');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Handle nested address fields
    if (id.startsWith('address.')) {
      const addressField = id.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
    
    // Clear field error when user types
    if (fieldErrors[id]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length > 50) {
      errors.firstName = 'First name must be less than 50 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 50) {
      errors.lastName = 'Last name must be less than 50 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Optional field validations
    if (formData.phoneNumber && formData.phoneNumber.length > 20) {
      errors.phoneNumber = 'Phone number must be less than 20 characters';
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    // Date validation if provided
    if (formData.dateOfBirth) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        errors.dateOfBirth = 'Date must be in YYYY-MM-DD format';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data
      const registrationData: any = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      // Add optional fields if provided
      if (formData.phoneNumber) {
        registrationData.phoneNumber = formData.phoneNumber;
      }

      if (formData.dateOfBirth) {
        registrationData.dateOfBirth = formData.dateOfBirth;
      }

      if (formData.gender) {
        registrationData.gender = formData.gender;
      }

      if (formData.bio) {
        registrationData.bio = formData.bio;
      }

      // Add address if any field is provided
      const hasAddress = Object.values(formData.address).some(val => val.trim());
      if (hasAddress) {
        registrationData.address = formData.address;
      }

      if (inviteToken && inviteData) {
        // Register with invite
        registrationData.inviteToken = inviteToken;
        await authApi.registerWithInvite(registrationData);
        toast.success('Registration successful! Complete your setup.');
        
        // Force a small delay to ensure localStorage is updated
        setTimeout(() => {
          navigate('/setup');
        }, 100);
      } else {
        // Register as organization admin
        if (!pendingOrgId) {
          toast.error('Please complete organization setup first');
          navigate('/onboarding');
          return;
        }
        
        // Add organization context
        registrationData.organizationId = pendingOrgId;
        
        // Add company name if provided
        if (formData.company) {
          registrationData.companyName = formData.company;
        }
        
        await authApi.register(registrationData);
        
        // Clear pending organization
        sessionStorage.removeItem('pending_org_id');
        sessionStorage.removeItem('pending_org_name');
        
        toast.success('Registration successful! Complete your setup.');
        
        // Force a small delay to ensure localStorage is updated
        setTimeout(() => {
          navigate('/setup');
        }, 100);
      }
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        err.response.data.errors.forEach((error: any) => {
          backendErrors[error.path] = error.msg;
        });
        setFieldErrors(backendErrors);
      } else if (err.response?.data?.message === 'Email already registered') {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state for invite verification
  if (step === 'invite' && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  // Error state for invalid invite
  if (step === 'invite' && error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Invalid Invitation</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/signup">Create New Account</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar text-sidebar-foreground flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-accent-foreground">EnterprisePro</h1>
              <p className="text-sm text-sidebar-foreground/60">ERP System</p>
            </div>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-sidebar-accent-foreground leading-tight">
            {inviteData ? 'Join Your Team' : 'Complete Your Profile'}<br />
            <span className="text-primary">
              {inviteData ? inviteData.organization.name : pendingOrgName || 'Get Started'}
            </span>
          </h2>
          <p className="text-lg text-sidebar-foreground/80 max-w-md">
            {inviteData 
              ? `You've been invited to join ${inviteData.organization.name}. Complete your registration to get started.`
              : 'Fill in your details to create your administrator account.'}
          </p>
          <div className="space-y-3 pt-4">
            {[
              'Create your account',
              'Set up your profile',
              'Start managing your business'
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm text-sidebar-foreground/70">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-sidebar-foreground/50">
          © 2024 EnterprisePro. All rights reserved.
        </p>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8 py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <span className="text-2xl font-bold text-primary-foreground">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">EnterprisePro</h1>
                <p className="text-sm text-muted-foreground">ERP System</p>
              </div>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold">
              {inviteData ? 'Complete Registration' : 'Create your account'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {inviteData 
                ? `You're joining ${inviteData.organization.name}`
                : pendingOrgName 
                  ? `Set up admin account for ${pendingOrgName}`
                  : 'Start your 14-day free trial'}
            </p>
          </div>

          {/* Organization Info */}
          {pendingOrgName && !inviteData && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization
              </h3>
              <p className="text-sm text-blue-600">
                <strong>Name:</strong> {pendingOrgName}
              </p>
            </div>
          )}

          {inviteData && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Invitation Details
              </h3>
              <p className="text-sm text-blue-600">
                <strong>Organization:</strong> {inviteData.organization.name}<br />
                {inviteData.jobTitle && (
                  <><strong>Job Title:</strong> {inviteData.jobTitle}<br /></>
                )}
                {inviteData.department && (
                  <><strong>Department:</strong> {inviteData.department}</>
                )}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Required Fields Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={cn("pl-10", fieldErrors.firstName && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="text-xs text-destructive">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={fieldErrors.lastName && "border-destructive"}
                    disabled={isLoading}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-xs text-destructive">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn("pl-10", fieldErrors.email && "border-destructive")}
                    required
                    disabled={isLoading || !!inviteData}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className={cn("pl-10 pr-10", fieldErrors.password && "border-destructive")}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-destructive">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={cn("pl-10 pr-10", fieldErrors.confirmPassword && "border-destructive")}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {!inviteData && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name (Optional)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Enter your company name"
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Optional Fields Section */}
            <Collapsible
              open={showOptionalFields}
              onOpenChange={setShowOptionalFields}
              className="space-y-4"
            >
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-between"
                >
                  <span>Additional Information (Optional)</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    showOptionalFields && "transform rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4">
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      placeholder="+254 712 345 678"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={cn("pl-10", fieldErrors.phoneNumber && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="text-xs text-destructive">{fieldErrors.phoneNumber}</p>
                  )}
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={cn("pl-10", fieldErrors.dateOfBirth && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                    {fieldErrors.dateOfBirth && (
                      <p className="text-xs text-destructive">{fieldErrors.dateOfBirth}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell us a little about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      fieldErrors.bio && "border-destructive"
                    )}
                    disabled={isLoading}
                  />
                  {fieldErrors.bio && (
                    <p className="text-xs text-destructive">{fieldErrors.bio}</p>
                  )}
                </div>

                {/* Address Section */}
                <div className="space-y-3">
                  <h4 className="font-medium">Address</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address.street">Street Address</Label>
                    <Input
                      id="address.street"
                      placeholder="123 Kenyatta Ave"
                      value={formData.address.street}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.city">City</Label>
                      <Input
                        id="address.city"
                        placeholder="Nairobi"
                        value={formData.address.city}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.state">State/Province</Label>
                      <Input
                        id="address.state"
                        placeholder="Nairobi"
                        value={formData.address.state}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.country">Country</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address.country"
                          placeholder="Kenya"
                          value={formData.address.country}
                          onChange={handleChange}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.zipCode">Postal Code</Label>
                      <Input
                        id="address.zipCode"
                        placeholder="00100"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {inviteData ? 'Completing registration...' : 'Creating account...'}
                </div>
              ) : (
                inviteData ? 'Complete Registration' : 'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {inviteData ? (
              <>
                Want to create your own organization?{' '}
                <Link to="/onboarding" className="text-primary hover:underline font-medium">
                  Start here
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}