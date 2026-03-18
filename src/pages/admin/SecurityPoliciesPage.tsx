import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save, Loader2, RefreshCw, Shield, Key, Clock, Lock,
  Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, Info
} from 'lucide-react';
import { systemApi, SecurityPolicies, UpdateSecurityPoliciesData } from '@/lib/api/system';
import { toast } from 'sonner';

const validationRules = {
  minLength: { min: 6, max: 32 },
  sessionTimeout: { min: 5, max: 480 }, // minutes
  maxLoginAttempts: { min: 1, max: 20 },
  expiryDays: { min: 0, max: 365 },
};

export function SecurityPoliciesPage() {
  const [policies, setPolicies] = useState<SecurityPolicies | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<SecurityPolicies>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expiryDays: 90,
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ssoEnabled: false,
  });

  useEffect(() => {
    fetchSecurityPolicies();
  }, []);

  useEffect(() => {
    if (policies) {
      const hasUnsavedChanges = JSON.stringify(policies) !== JSON.stringify(formData);
      setHasChanges(hasUnsavedChanges);
    }
  }, [formData, policies]);

  const fetchSecurityPolicies = async () => {
    try {
      setIsLoading(true);
      const data = await systemApi.security.get();
      setPolicies(data);
      setFormData(data);
      setValidationErrors({});
    } catch (error) {
      console.error('Failed to fetch security policies:', error);
      toast.error('Failed to load security policies');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate password min length
    if (formData.passwordPolicy.minLength < validationRules.minLength.min || 
        formData.passwordPolicy.minLength > validationRules.minLength.max) {
      errors.minLength = `Password length must be between ${validationRules.minLength.min} and ${validationRules.minLength.max} characters`;
    }

    // Validate session timeout
    if (formData.sessionTimeout < validationRules.sessionTimeout.min || 
        formData.sessionTimeout > validationRules.sessionTimeout.max) {
      errors.sessionTimeout = `Session timeout must be between ${validationRules.sessionTimeout.min} and ${validationRules.sessionTimeout.max} minutes`;
    }

    // Validate max login attempts
    if (formData.maxLoginAttempts < validationRules.maxLoginAttempts.min || 
        formData.maxLoginAttempts > validationRules.maxLoginAttempts.max) {
      errors.maxLoginAttempts = `Max login attempts must be between ${validationRules.maxLoginAttempts.min} and ${validationRules.maxLoginAttempts.max}`;
    }

    // Validate expiry days
    if (formData.passwordPolicy.expiryDays < validationRules.expiryDays.min || 
        formData.passwordPolicy.expiryDays > validationRules.expiryDays.max) {
      errors.expiryDays = `Password expiry days must be between ${validationRules.expiryDays.min} and ${validationRules.expiryDays.max}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare update data - only send changed fields
      const updateData: UpdateSecurityPoliciesData = {};
      
      if (JSON.stringify(policies?.passwordPolicy) !== JSON.stringify(formData.passwordPolicy)) {
        updateData.passwordPolicy = formData.passwordPolicy;
      }
      
      if (policies?.sessionTimeout !== formData.sessionTimeout) {
        updateData.sessionTimeout = formData.sessionTimeout;
      }
      
      if (policies?.maxLoginAttempts !== formData.maxLoginAttempts) {
        updateData.maxLoginAttempts = formData.maxLoginAttempts;
      }
      
      if (policies?.twoFactorAuth !== formData.twoFactorAuth) {
        updateData.twoFactorAuth = formData.twoFactorAuth;
      }
      
      if (policies?.ssoEnabled !== formData.ssoEnabled) {
        updateData.ssoEnabled = formData.ssoEnabled;
      }

      const updated = await systemApi.security.update(updateData);
      setPolicies(updated);
      setFormData(updated);
      toast.success('Security policies updated successfully');
      
    } catch (error: any) {
      console.error('Failed to update security policies:', error);
      toast.error(error.message || 'Failed to update security policies');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (policies) {
      setFormData(policies);
      setValidationErrors({});
      toast.info('Changes discarded');
    }
  };

  const updatePasswordPolicy = (field: keyof typeof formData.passwordPolicy, value: any) => {
    setFormData({
      ...formData,
      passwordPolicy: {
        ...formData.passwordPolicy,
        [field]: value,
      },
    });
  };

  const getPasswordStrength = (): { label: string; color: string; score: number } => {
    let score = 0;
    if (formData.passwordPolicy.minLength >= 8) score += 1;
    if (formData.passwordPolicy.minLength >= 12) score += 1;
    if (formData.passwordPolicy.requireUppercase) score += 1;
    if (formData.passwordPolicy.requireNumbers) score += 1;
    if (formData.passwordPolicy.requireSpecialChars) score += 1;
    if (formData.passwordPolicy.expiryDays <= 60) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', score };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', score };
    return { label: 'Strong', color: 'bg-green-500', score };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Policies"
        description="Configure security settings and authentication policies"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSecurityPolicies} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {hasChanges && (
              <>
                <Button variant="outline" onClick={handleReset} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || Object.keys(validationErrors).length > 0}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        }
      />

      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc ml-6 mt-2">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Password Policy Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password Policy
            </CardTitle>
            <CardDescription>
              Configure password complexity requirements and expiration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password Strength</span>
                <Badge variant="outline" className={strength.color.replace('bg-', 'text-')}>
                  {strength.label}
                </Badge>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Score: {strength.score}/6 - Higher is better
              </p>
            </div>

            <Separator />

            {/* Password Length */}
            <div className="space-y-2">
              <Label htmlFor="minLength">
                Minimum Length <span className="text-destructive">*</span>
              </Label>
              <Input
                id="minLength"
                type="number"
                min={validationRules.minLength.min}
                max={validationRules.minLength.max}
                value={formData.passwordPolicy.minLength}
                onChange={(e) => updatePasswordPolicy('minLength', parseInt(e.target.value))}
                className={validationErrors.minLength ? 'border-destructive' : ''}
              />
              {validationErrors.minLength && (
                <p className="text-xs text-destructive">{validationErrors.minLength}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="space-y-3">
              <Label>Password Requirements</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase" className="text-sm font-normal">
                    Require Uppercase Letters (A-Z)
                  </Label>
                  <Switch
                    id="requireUppercase"
                    checked={formData.passwordPolicy.requireUppercase}
                    onCheckedChange={(checked) => updatePasswordPolicy('requireUppercase', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers" className="text-sm font-normal">
                    Require Numbers (0-9)
                  </Label>
                  <Switch
                    id="requireNumbers"
                    checked={formData.passwordPolicy.requireNumbers}
                    onCheckedChange={(checked) => updatePasswordPolicy('requireNumbers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSpecialChars" className="text-sm font-normal">
                    Require Special Characters (!@#$%)
                  </Label>
                  <Switch
                    id="requireSpecialChars"
                    checked={formData.passwordPolicy.requireSpecialChars}
                    onCheckedChange={(checked) => updatePasswordPolicy('requireSpecialChars', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Password Expiry */}
            <div className="space-y-2">
              <Label htmlFor="expiryDays">
                Password Expiry (days) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expiryDays"
                type="number"
                min={0}
                max={365}
                value={formData.passwordPolicy.expiryDays}
                onChange={(e) => updatePasswordPolicy('expiryDays', parseInt(e.target.value))}
                className={validationErrors.expiryDays ? 'border-destructive' : ''}
              />
              {validationErrors.expiryDays && (
                <p className="text-xs text-destructive">{validationErrors.expiryDays}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Set to 0 for no expiration
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Session & Authentication Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Session & Authentication
            </CardTitle>
            <CardDescription>
              Configure session timeout and login security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Session Timeout */}
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">
                Session Timeout (minutes) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sessionTimeout"
                type="number"
                min={validationRules.sessionTimeout.min}
                max={validationRules.sessionTimeout.max}
                value={formData.sessionTimeout}
                onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
                className={validationErrors.sessionTimeout ? 'border-destructive' : ''}
              />
              {validationErrors.sessionTimeout && (
                <p className="text-xs text-destructive">{validationErrors.sessionTimeout}</p>
              )}
            </div>

            {/* Max Login Attempts */}
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">
                Max Login Attempts <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min={validationRules.maxLoginAttempts.min}
                max={validationRules.maxLoginAttempts.max}
                value={formData.maxLoginAttempts}
                onChange={(e) => setFormData({ ...formData, maxLoginAttempts: parseInt(e.target.value) })}
                className={validationErrors.maxLoginAttempts ? 'border-destructive' : ''}
              />
              {validationErrors.maxLoginAttempts && (
                <p className="text-xs text-destructive">{validationErrors.maxLoginAttempts}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Number of failed attempts before account lockout
              </p>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication (2FA)</p>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all users
                  </p>
                </div>
                <Switch
                  checked={formData.twoFactorAuth}
                  onCheckedChange={(checked) => setFormData({ ...formData, twoFactorAuth: checked })}
                />
              </div>

              {/* SSO */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Single Sign-On (SSO)</p>
                  <p className="text-sm text-muted-foreground">
                    Enable SSO authentication
                  </p>
                </div>
                <Switch
                  checked={formData.ssoEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, ssoEnabled: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Policies Summary */}
      {policies && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Current Policy Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Password Min Length</p>
                <p className="text-2xl font-bold">{policies.passwordPolicy.minLength}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Password Expiry</p>
                <p className="text-2xl font-bold">{policies.passwordPolicy.expiryDays} days</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Session Timeout</p>
                <p className="text-2xl font-bold">{policies.sessionTimeout} min</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Max Login Attempts</p>
                <p className="text-2xl font-bold">{policies.maxLoginAttempts}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <Badge variant={policies.twoFactorAuth ? 'default' : 'secondary'}>
                2FA: {policies.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </Badge>
              <Badge variant={policies.ssoEnabled ? 'default' : 'secondary'}>
                SSO: {policies.ssoEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Badge variant="outline">
                Uppercase: {policies.passwordPolicy.requireUppercase ? 'Yes' : 'No'}
              </Badge>
              <Badge variant="outline">
                Numbers: {policies.passwordPolicy.requireNumbers ? 'Yes' : 'No'}
              </Badge>
              <Badge variant="outline">
                Special: {policies.passwordPolicy.requireSpecialChars ? 'Yes' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}