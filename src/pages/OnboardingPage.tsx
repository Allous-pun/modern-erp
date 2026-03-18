import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { organizationsApi } from '@/lib/api/organizations';
import { modulesApi, Module } from '@/lib/api/modules';
import {
  Building2,
  Globe,
  Users,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Loader2,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  Settings,
  Shield,
  Sparkles,
  Package,
  ShoppingCart,
  Factory,
  FolderKanban,
  Target,
  CreditCard,
  BarChart,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { toast } from 'sonner';

// Industry options (from backend enum)
const industries = [
  'technology',
  'manufacturing',
  'retail',
  'healthcare',
  'education',
  'hospitality',
  'construction',
  'finance',
  'consulting',
  'nonprofit',
  'government',
  'other'
];

// Display names for industries
const industryLabels: Record<string, string> = {
  technology: 'Technology',
  manufacturing: 'Manufacturing',
  retail: 'Retail & E-Commerce',
  healthcare: 'Healthcare',
  education: 'Education',
  hospitality: 'Hospitality',
  construction: 'Construction',
  finance: 'Financial Services',
  consulting: 'Consulting',
  nonprofit: 'Nonprofit',
  government: 'Government',
  other: 'Other'
};

// Company size options (from backend enum)
const companySizes = [
  '1-10',
  '11-50', 
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
];

// Currency options
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw' },
];

// Timezone options (African focus)
const timezones = [
  { value: 'Africa/Nairobi', label: 'East Africa Time (EAT) - Nairobi' },
  { value: 'Africa/Johannesburg', label: 'South Africa Standard Time - Johannesburg' },
  { value: 'Africa/Lagos', label: 'West Africa Time - Lagos' },
  { value: 'Africa/Cairo', label: 'Eastern European Time - Cairo' },
  { value: 'Africa/Casablanca', label: 'Western European Time - Casablanca' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time - New York' },
  { value: 'Europe/London', label: 'Greenwich Mean Time - London' },
];

// Language options
const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'fr', name: 'French' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
];

// Country options
const countries = [
  { code: 'KE', name: 'Kenya' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
];

// Icon mapping for modules
const getModuleIcon = (slug: string) => {
  const iconMap: Record<string, any> = {
    'finance': DollarSign,
    'hr': Users,
    'sales': Target,
    'inventory': Package,
    'procurement': ShoppingCart,
    'manufacturing': Factory,
    'projects': FolderKanban,
    'crm': Users,
    'payroll': CreditCard,
    'analytics': BarChart,
  };
  return iconMap[slug] || Package;
};

// Group modules by category
const categorizeModules = (modules: Module[]) => {
  const categories = [
    { key: 'core', name: 'Core System', description: 'Essential system functionality' },
    { key: 'financial', name: 'Finance & Accounting', description: 'Manage your finances' },
    { key: 'hr', name: 'Human Resources', description: 'Employee and payroll management' },
    { key: 'sales', name: 'Sales & CRM', description: 'Customer relationship management' },
    { key: 'procurement', name: 'Procurement & Inventory', description: 'Supply chain management' },
    { key: 'manufacturing', name: 'Manufacturing', description: 'Production and quality control' },
    { key: 'projects', name: 'Projects & Operations', description: 'Project and task management' },
    { key: 'operations', name: 'Operations', description: 'Day-to-day operations' },
    { key: 'executive', name: 'Executive', description: 'Strategic dashboards' },
    { key: 'reporting', name: 'Reporting & Analytics', description: 'Data insights and reports' },
  ];
  
  const grouped: Record<string, Module[]> = {};
  
  modules.forEach(module => {
    const category = module.category || 'other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(module);
  });
  
  return categories
    .filter(cat => grouped[cat.key]?.length > 0)
    .map(cat => ({
      ...cat,
      modules: grouped[cat.key].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    }));
};

// Retry utility for handling "organization not active" errors
const fetchWithRetry = async (fn: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      if (error.message?.includes('not active')) {
        console.log(`Organization not active yet, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  
  // Module selection state (Step 4)
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [groupedModules, setGroupedModules] = useState<any[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [modulesPerPage] = useState(6); // Show 6 modules per page (2 rows of 3)
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Combined form state matching backend structure
  const [formData, setFormData] = useState({
    // ============================================
    // BUSINESS SECTION (Organization Info)
    // ============================================
    orgName: '',
    legalName: '',
    registrationNumber: '',
    taxNumber: '',
    industry: '',
    organizationSize: '',
    email: '',
    phone: '',
    website: '',
    
    // Address
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressCountry: 'KE',
    addressPostalCode: '',
    
    // ============================================
    // SETTINGS SECTION
    // ============================================
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    firstDayOfWeek: '1',
    fiscalYearStart: '01-01',
    fiscalYearEnd: '12-31',
    baseCurrency: 'KES',
    language: 'en',
    
    // Password Policy
    passwordMinLength: '8',
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: false,
    passwordExpiryDays: '90',
    
    // Session
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    
    // Features
    twoFactorAuth: false,
    apiAccess: false,
    
    // ============================================
    // ADMIN SECTION (First User)
    // ============================================
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    adminJobTitle: 'Founder & CEO',
    adminPhone: '',
  });

  const totalSteps = 4; // Business, Settings, Admin, Modules
  const progress = (currentStep / totalSteps) * 100;

  // Fetch modules with retry when reaching step 4
  useEffect(() => {
    if (currentStep === 4 && availableModules.length === 0) {
      fetchModulesWithRetry();
    }
  }, [currentStep]);

  // Reset pagination when modules change
  useEffect(() => {
    setCurrentPage(1);
    if (groupedModules.length > 0) {
      setActiveCategory(groupedModules[0].key);
    }
  }, [groupedModules]);

  const fetchModulesWithRetry = async () => {
    try {
      setIsLoadingModules(true);
      const modules = await fetchWithRetry(() => modulesApi.getAvailableModules());
      
      // Filter to show only installable modules
      const installableModules = modules.filter((m: Module) => !m.isCore || m.category === 'core');
      
      setAvailableModules(installableModules);
      const grouped = categorizeModules(installableModules);
      setGroupedModules(grouped);
      
      if (grouped.length > 0) {
        setActiveCategory(grouped[0].key);
      }
      
      // Auto-select recommended modules (core + financial + hr)
      const recommended = installableModules
        .filter((m: Module) => m.category === 'core' || m.category === 'financial' || m.category === 'hr')
        .map((m: Module) => m.slug);
      
      setSelectedModules(recommended);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      toast.error('Failed to load modules. Please refresh the page.');
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const toggleModule = (slug: string) => {
    setSelectedModules((prev) =>
      prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]
    );
  };

  const selectRecommended = () => {
    const recommended = availableModules
      .filter(m => m.category === 'core' || m.category === 'financial' || m.category === 'hr')
      .map(m => m.slug);
    setSelectedModules(recommended);
    toast.success(`Selected ${recommended.length} recommended modules`);
  };

  const selectAll = () => {
    setSelectedModules(availableModules.map(m => m.slug));
  };

  const clearAll = () => {
    setSelectedModules([]);
  };

  // Pagination functions
  const getCurrentCategoryModules = () => {
    const category = groupedModules.find(cat => cat.key === activeCategory);
    return category?.modules || [];
  };

  const getPaginatedModules = () => {
    const modules = getCurrentCategoryModules();
    const indexOfLastModule = currentPage * modulesPerPage;
    const indexOfFirstModule = indexOfLastModule - modulesPerPage;
    return modules.slice(indexOfFirstModule, indexOfLastModule);
  };

  const getTotalPages = () => {
    const modules = getCurrentCategoryModules();
    return Math.ceil(modules.length / modulesPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of modules section
    const modulesSection = document.getElementById('modules-section');
    if (modulesSection) {
      modulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryChange = (categoryKey: string) => {
    setActiveCategory(categoryKey);
    setCurrentPage(1);
  };

  // Step 1 validation (Business) - Updated to include email and phone
  const isStep1Valid = () => {
    return (
      formData.orgName.trim() && 
      formData.industry && 
      formData.organizationSize &&
      formData.email.trim() &&
      formData.phone.trim()
    );
  };

  // Step 2 validation (Settings) - all have defaults, so always true
  const isStep2Valid = () => true;

  // Step 3 validation (Admin)
  const isStep3Valid = () => {
    return (
      formData.adminFirstName.trim() &&
      formData.adminLastName.trim() &&
      formData.adminEmail.trim() &&
      formData.adminPassword.trim().length >= 6
    );
  };

  // Step 4 validation (Modules) - at least one module
  const isStep4Valid = () => {
    return selectedModules.length > 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      toast.error('Please fill in all required business fields (Organization Name, Industry, Company Size, Email, and Phone)');
      return;
    }
    if (currentStep === 2) {
      setActiveTab('admin');
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setActiveTab('business');
    }
    if (currentStep === 3) {
      setActiveTab('settings');
    }
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrg = async () => {
    if (!isStep3Valid()) {
      toast.error('Please fill in all required admin fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data matching your backend API exactly
      const registerData = {
        // Organization fields
        name: formData.orgName,
        legalName: formData.legalName || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        taxNumber: formData.taxNumber || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        address: {
          street: formData.addressStreet || undefined,
          city: formData.addressCity || undefined,
          state: formData.addressState || undefined,
          country: formData.addressCountry,
          postalCode: formData.addressPostalCode || undefined,
        },
        industry: formData.industry || 'other',
        organizationSize: formData.organizationSize || '1-10',
        
        // Admin fields
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        adminJobTitle: formData.adminJobTitle,
        adminPhone: formData.adminPhone || undefined,
        
        // Settings
        timezone: formData.timezone,
        baseCurrency: formData.baseCurrency,
        language: formData.language,
      };

      console.log('Submitting registration:', registerData);

      // Call the combined registration endpoint
      const response = await organizationsApi.register(registerData);
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Store organization info
      if (response.data?.organization?._id) {
        localStorage.setItem('organizationId', response.data.organization._id);
        localStorage.setItem('organizationName', response.data.organization.name);
      }
      
      // Store user in auth context
      if (response.data?.admin) {
        const userData = {
          id: response.data.admin._id,
          firstName: formData.adminFirstName,
          lastName: formData.adminLastName,
          email: response.data.admin.email,
          displayName: response.data.admin.name,
          jobTitle: response.data.admin.jobTitle,
          roles: response.data.admin.roles,
        };
        setUser(userData);
      }
      
      toast.success('Organization created successfully!');
      
      // Move to module selection (Step 4)
      setCurrentStep(4);
      
      // Fetch modules with retry
      await fetchModulesWithRetry();
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Failed to create organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstallModules = async () => {
    if (!isStep4Valid()) {
      toast.error('Please select at least one module');
      return;
    }

    setIsInstalling(true);

    try {
      const modulesToInstall = availableModules.filter(m => selectedModules.includes(m.slug));
      
      let successCount = 0;

      for (const module of modulesToInstall) {
        try {
          // Prepare settings based on module type
          const settings: Record<string, any> = {};
          
          if (module.slug === 'finance') {
            settings.defaultCurrency = formData.baseCurrency;
            settings.fiscalYearStart = new Date().getFullYear() + '-01-01';
          } else if (module.slug === 'hr') {
            settings.weekStart = 'monday';
            settings.timezone = formData.timezone;
          }
          
          await modulesApi.installModule(module.slug, { settings });
          successCount++;
          
          toast.success(`Installed ${module.name}`);
        } catch (error: any) {
          console.error(`Failed to install ${module.name}:`, error);
          toast.error(`Failed to install ${module.name}`);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully installed ${successCount} module${successCount !== 1 ? 's' : ''}`);
        
        // Set setup completed flag in localStorage
        localStorage.setItem('setupCompleted', 'true');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Installation error:', error);
      toast.error('Failed to complete setup');
    } finally {
      setIsInstalling(false);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">Business Information</h1>
              <p className="text-muted-foreground">
                Tell us about your company. Fields marked with * are required.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Core Business Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">
                        Organization Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="orgName"
                        placeholder="Tech Solutions Kenya"
                        value={formData.orgName}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="legalName">Legal Name</Label>
                      <Input
                        id="legalName"
                        placeholder="Tech Solutions Kenya Ltd"
                        value={formData.legalName}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        placeholder="PVT-2024-001234"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Tax Number / VAT</Label>
                      <Input
                        id="taxNumber"
                        placeholder="VAT-12345678"
                        value={formData.taxNumber}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">
                        Industry <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        value={formData.industry} 
                        onValueChange={(value) => handleSelectChange('industry', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {industryLabels[ind]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizationSize">
                        Company Size <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        value={formData.organizationSize} 
                        onValueChange={(value) => handleSelectChange('organizationSize', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size} employees
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contact Info - Updated with required fields */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Business Email <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="info@techsolutions.co.ke"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+254 722 334455"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          placeholder="https://techsolutions.co.ke"
                          value={formData.website}
                          onChange={handleChange}
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="addressStreet">Street Address</Label>
                    <Input
                      id="addressStreet"
                      placeholder="45 Tech Hub, Upper Hill"
                      value={formData.addressStreet}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressCity">City</Label>
                      <Input
                        id="addressCity"
                        placeholder="Nairobi"
                        value={formData.addressCity}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressState">State/Province</Label>
                      <Input
                        id="addressState"
                        placeholder="Nairobi"
                        value={formData.addressState}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressCountry">Country</Label>
                      <Select 
                        value={formData.addressCountry} 
                        onValueChange={(value) => handleSelectChange('addressCountry', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressPostalCode">Postal Code</Label>
                      <Input
                        id="addressPostalCode"
                        placeholder="00100"
                        value={formData.addressPostalCode}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">Workspace Settings</h1>
              <p className="text-muted-foreground">
                Configure your organization preferences.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="localization">Localization</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="localization" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={formData.timezone} 
                        onValueChange={(value) => handleSelectChange('timezone', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select 
                          value={formData.dateFormat} 
                          onValueChange={(value) => handleSelectChange('dateFormat', value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeFormat">Time Format</Label>
                        <Select 
                          value={formData.timeFormat} 
                          onValueChange={(value) => handleSelectChange('timeFormat', value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                            <SelectItem value="24h">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstDayOfWeek">First Day of Week</Label>
                      <Select 
                        value={formData.firstDayOfWeek} 
                        onValueChange={(value) => handleSelectChange('firstDayOfWeek', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sunday</SelectItem>
                          <SelectItem value="1">Monday</SelectItem>
                          <SelectItem value="6">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language</Label>
                      <Select 
                        value={formData.language} 
                        onValueChange={(value) => handleSelectChange('language', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseCurrency">Base Currency</Label>
                      <Select 
                        value={formData.baseCurrency} 
                        onValueChange={(value) => handleSelectChange('baseCurrency', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((cur) => (
                            <SelectItem key={cur.code} value={cur.code}>
                              {cur.code} - {cur.name} ({cur.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                        <Input
                          id="fiscalYearStart"
                          placeholder="01-01"
                          value={formData.fiscalYearStart}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
                        <Input
                          id="fiscalYearEnd"
                          placeholder="12-31"
                          value={formData.fiscalYearEnd}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-semibold">Password Policy</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="passwordMinLength">Minimum Length</Label>
                        <Input
                          id="passwordMinLength"
                          type="number"
                          value={formData.passwordMinLength}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiryDays">Expiry (days)</Label>
                        <Input
                          id="passwordExpiryDays"
                          type="number"
                          value={formData.passwordExpiryDays}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="passwordRequireUppercase"
                          checked={formData.passwordRequireUppercase}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="passwordRequireUppercase">Require uppercase letters</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="passwordRequireNumbers"
                          checked={formData.passwordRequireNumbers}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="passwordRequireNumbers">Require numbers</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="passwordRequireSpecialChars"
                          checked={formData.passwordRequireSpecialChars}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="passwordRequireSpecialChars">Require special characters</Label>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-4">Session Settings</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input
                            id="sessionTimeout"
                            type="number"
                            value={formData.sessionTimeout}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                          <Input
                            id="maxLoginAttempts"
                            type="number"
                            value={formData.maxLoginAttempts}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-4">Features</h3>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="twoFactorAuth"
                          checked={formData.twoFactorAuth}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="apiAccess"
                          checked={formData.apiAccess}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="apiAccess">Enable API Access</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">Create Administrator Account</h1>
              <p className="text-muted-foreground">
                This will be the primary administrator for {formData.orgName}.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminFirstName"
                        placeholder="Sarah"
                        value={formData.adminFirstName}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="adminLastName"
                      placeholder="Johnson"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="sarah.johnson@company.com"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPhone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminPhone"
                        placeholder="+254 712 345 678"
                        value={formData.adminPhone}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminJobTitle">Job Title</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminJobTitle"
                        placeholder="Founder & CEO"
                        value={formData.adminJobTitle}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  </div>
                </div>

                {/* Business Summary */}
                <div className="bg-muted/30 rounded-lg p-4 text-sm mt-4">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization Summary
                  </p>
                  <p><span className="text-muted-foreground">Name:</span> {formData.orgName}</p>
                  <p><span className="text-muted-foreground">Industry:</span> {industryLabels[formData.industry] || formData.industry}</p>
                  <p><span className="text-muted-foreground">Size:</span> {formData.organizationSize} employees</p>
                  <p><span className="text-muted-foreground">Currency:</span> {formData.baseCurrency}</p>
                  <p><span className="text-muted-foreground">Timezone:</span> {formData.timezone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        const currentCategoryModules = getCurrentCategoryModules();
        const paginatedModules = getPaginatedModules();
        const totalPages = getTotalPages();
        const currentCategory = groupedModules.find(cat => cat.key === activeCategory);

        return (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">Choose your modules</h1>
              <p className="text-muted-foreground">
                Select the modules you want to install for {formData.orgName}.
                You can always add or remove modules later.
              </p>
            </div>

            {isLoadingModules ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <p className="text-sm">
                      <span className="font-semibold">{selectedModules.length}</span> module{selectedModules.length !== 1 ? 's' : ''} selected
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Trial Plan
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={selectRecommended}>
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      Recommended
                    </Button>
                    <Button variant="ghost" size="sm" onClick={selectAll}>
                      Select All
                    </Button>
                    {selectedModules.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAll}>
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Category Tabs */}
                {groupedModules.length > 0 && (
                  <div className="border-b border-border">
                    <div className="flex flex-wrap gap-2 pb-2">
                      {groupedModules.map((category) => (
                        <Button
                          key={category.key}
                          variant={activeCategory === category.key ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleCategoryChange(category.key)}
                          className="relative"
                        >
                          {category.name}
                          <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                            {category.modules.length}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div id="modules-section" className="space-y-4">
                  {currentCategory && (
                    <div>
                      <h3 className="text-lg font-semibold">{currentCategory.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
                    </div>
                  )}
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedModules.map((mod: Module) => {
                      const Icon = getModuleIcon(mod.slug);
                      const isSelected = selectedModules.includes(mod.slug);
                      
                      return (
                        <Card
                          key={mod._id}
                          className={`cursor-pointer transition-all duration-150 ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-border hover:border-primary/30'
                          }`}
                          onClick={() => toggleModule(mod.slug)}
                        >
                          <CardContent className="pt-5 pb-4">
                            <div className="flex items-start gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                isSelected ? 'bg-primary/15' : 'bg-muted'
                              }`}>
                                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-sm">{mod.name}</h4>
                                  {mod.trialAvailable && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-200 bg-green-50 text-green-700">
                                      {mod.trialDays}-day trial
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {mod.description}
                                </p>
                              </div>
                              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-border'
                              }`}>
                                {isSelected && <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * modulesPerPage) + 1} - {Math.min(currentPage * modulesPerPage, currentCategoryModules.length)} of {currentCategoryModules.length} modules
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm px-3">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar text-sidebar-foreground flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-accent-foreground">EnterprisePro</h1>
              <p className="text-sm text-sidebar-foreground/60">ERP System</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-sidebar-accent-foreground leading-tight">
            Let's set up your<br />
            <span className="text-primary">organization</span>
          </h2>
          <p className="text-lg text-sidebar-foreground/80 max-w-md">
            Tell us about your company, configure your preferences, choose your modules, and create your admin account.
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: Building2, label: 'Business Information', step: 1 },
              { icon: Settings, label: 'Workspace Settings', step: 2 },
              { icon: User, label: 'Admin Account', step: 3 },
              { icon: Package, label: 'Module Selection', step: 4 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    item.step < currentStep
                      ? 'bg-green-500 text-white'
                      : item.step === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {item.step < currentStep ? <CheckCircle className="h-5 w-5" /> : item.step}
                </div>
                <span
                  className={
                    item.step === currentStep
                      ? 'font-medium text-sidebar-accent-foreground'
                      : item.step < currentStep
                      ? 'text-sidebar-foreground/80'
                      : 'text-sidebar-foreground/50'
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-sidebar-foreground/50">
          © 2024 EnterprisePro. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-3xl space-y-8 py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">EnterprisePro</h1>
              <p className="text-sm text-muted-foreground">ERP System</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? () => navigate('/') : handleBack}
              disabled={isSubmitting || isInstalling}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            {currentStep < 4 ? (
              currentStep === 3 ? (
                <Button onClick={handleSubmitOrg} disabled={isSubmitting} size="lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating organization...
                    </>
                  ) : (
                    <>
                      Create Organization <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isSubmitting} size="lg">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )
            ) : (
              <Button
                onClick={handleInstallModules}
                disabled={!isStep4Valid() || isInstalling}
                size="lg"
              >
                {isInstalling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Installing modules...
                  </>
                ) : (
                  <>
                    Complete Setup <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}