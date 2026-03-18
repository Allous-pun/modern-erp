import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { modulesApi, Module } from '@/lib/api/modules';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  DollarSign, Users, Target, ShoppingCart, ShoppingBag, Package,
  Factory, FolderKanban, CheckCircle, ArrowRight, ArrowLeft, Sparkles,
  Loader2, AlertCircle, Settings, BarChart, Globe, Shield, Truck,
  Building2, CreditCard, FileText, UserCog, Calendar, Clock
} from 'lucide-react';

// Icon mapping based on module slugs
const getModuleIcon = (slug: string, iconName?: string) => {
  const iconMap: Record<string, React.ElementType> = {
    'dollar-sign': DollarSign,
    'users': Users,
    'target': Target,
    'shopping-cart': ShoppingCart,
    'shopping-bag': ShoppingBag,
    'package': Package,
    'factory': Factory,
    'folder-kanban': FolderKanban,
    'settings': Settings,
    'bar-chart': BarChart,
    'globe': Globe,
    'shield': Shield,
    'truck': Truck,
    'building': Building2,
    'credit-card': CreditCard,
    'file-text': FileText,
    'user-cog': UserCog,
    'calendar': Calendar,
    'clock': Clock,
  };
  
  return iconMap[iconName || slug] || Package;
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
    { key: 'industry', name: 'Industry Specific', description: 'Industry-specific features' },
    { key: 'external', name: 'External Portals', description: 'Customer and vendor portals' },
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

export function SetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentOrganization, refreshOrganization } = useOrganization();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [groupedModules, setGroupedModules] = useState<any[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'confirm' | 'installing'>('select');
  const [isLoading, setIsLoading] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available modules on mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Check if setup is already complete
  useEffect(() => {
    const checkSetupStatus = async () => {
      if (currentOrganization?.stats?.modulesCount && currentOrganization.stats.modulesCount > 0) {
        // Modules are already installed, redirect to dashboard
        toast.info('Your organization is already set up.');
        navigate('/app/dashboard');
      }
    };
    
    if (currentOrganization) {
      checkSetupStatus();
    }
  }, [currentOrganization, navigate]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all available modules
      const availableModules = await modulesApi.getAvailableModules();
      
      // Filter to show only installable modules (not core/system)
      const installableModules = availableModules.filter(m => !m.isCore || m.category === 'core');
      
      setModules(installableModules);
      setGroupedModules(categorizeModules(installableModules));
      
      // Auto-select recommended modules
      const recommended = installableModules
        .filter(m => m.category === 'core' || m.category === 'financial' || m.category === 'hr')
        .map(m => m.slug);
      
      setSelectedModules(recommended);
    } catch (error: any) {
      console.error('Failed to fetch modules:', error);
      setError(error.message || 'Failed to load modules');
      toast.error('Failed to load modules. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (slug: string) => {
    setSelectedModules((prev) =>
      prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]
    );
  };

  const selectRecommended = () => {
    const recommended = modules
      .filter(m => m.category === 'core' || m.category === 'financial' || m.category === 'hr')
      .map(m => m.slug);
    setSelectedModules(recommended);
    toast.success(`Selected ${recommended.length} recommended modules`);
  };

  const selectAll = () => {
    setSelectedModules(modules.map(m => m.slug));
  };

  const clearAll = () => {
    setSelectedModules([]);
  };

  const handleInstall = async () => {
    if (selectedModules.length === 0) {
      toast.error('Please select at least one module');
      return;
    }

    setStep('installing');
    setIsInstalling(true);

    try {
      // Install selected modules one by one
      const modulesToInstall = modules.filter(m => selectedModules.includes(m.slug));
      
      let successCount = 0;
      let failCount = 0;

      for (const module of modulesToInstall) {
        try {
          // Prepare settings based on module type
          const settings: Record<string, any> = {};
          
          if (module.slug === 'finance') {
            settings.defaultCurrency = currentOrganization?.currency || 'USD';
            settings.fiscalYearStart = new Date().getFullYear() + '-01-01';
          } else if (module.slug === 'hr') {
            settings.weekStart = 'monday';
            settings.timezone = currentOrganization?.timezone || 'UTC';
          }
          
          await modulesApi.installModule(module.slug, { settings });
          successCount++;
          
          toast.success(`Installed ${module.name}`);
        } catch (error: any) {
          console.error(`Failed to install ${module.name}:`, error);
          failCount++;
          toast.error(`Failed to install ${module.name}: ${error.message}`);
        }
      }

      // Refresh organization data
      await refreshOrganization();

      if (successCount > 0) {
        toast.success(`Successfully installed ${successCount} module${successCount !== 1 ? 's' : ''}`);
        
        // Redirect to dashboard after successful installation
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      } else {
        setStep('select');
      }
    } catch (error: any) {
      console.error('Installation error:', error);
      toast.error('Failed to complete setup. Please try again.');
      setStep('select');
    } finally {
      setIsInstalling(false);
    }
  };

  const progress = step === 'select' ? 50 : step === 'confirm' ? 75 : 100;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Loading modules...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Modules</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchModules}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Installation progress
  if (step === 'installing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Setting up your workspace</h2>
            <p className="text-muted-foreground mb-4">
              Installing {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''}...
            </p>
            <Progress value={75} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold">EnterprisePro</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {step === 'select' ? 'Select Modules' : 'Confirm Selection'}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-0">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">
        {step === 'select' ? (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-3">Welcome, {user?.firstName}! 👋</h1>
              <p className="text-muted-foreground text-lg">
                Choose the modules you want to install for <span className="font-semibold text-foreground">{currentOrganization?.name}</span>.
                You can always add or remove modules later from the admin panel.
              </p>
            </div>

            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <p className="text-sm">
                  <span className="font-semibold">{selectedModules.length}</span> module{selectedModules.length !== 1 ? 's' : ''} selected
                </p>
                <Badge variant="outline" className="text-xs">
                  {currentOrganization?.subscription?.plan || 'Trial'} Plan
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

            {groupedModules.map((category) => (
              <div key={category.key} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.modules.map((mod: Module) => {
                    const Icon = getModuleIcon(mod.slug, mod.icon);
                    const isSelected = selectedModules.includes(mod.slug);
                    const isCore = mod.category === 'core';
                    
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
                                {isCore && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    Core
                                  </Badge>
                                )}
                                {mod.trialAvailable && !isCore && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-200 bg-green-50 text-green-700">
                                    {mod.trialDays}-day trial
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {mod.description}
                              </p>
                              {mod.dependencies && mod.dependencies.length > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  Requires: {mod.dependencies.join(', ')}
                                </p>
                              )}
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
              </div>
            ))}

            <div className="flex justify-end pt-6">
              <Button
                size="lg"
                onClick={() => setStep('confirm')}
                disabled={selectedModules.length === 0}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-3">Ready to launch! 🚀</h1>
              <p className="text-muted-foreground text-lg">
                Review your selected modules and click Install to set up your workspace.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Selected Modules ({selectedModules.length})</h3>
                  <Button variant="ghost" size="sm" onClick={() => setStep('select')}>
                    Change Selection
                  </Button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {modules
                    .filter((m) => selectedModules.includes(m.slug))
                    .map((mod) => {
                      const Icon = getModuleIcon(mod.slug, mod.icon);
                      return (
                        <div key={mod._id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{mod.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{mod.description}</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="lg" onClick={() => setStep('select')} disabled={isInstalling}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button size="lg" onClick={handleInstall} disabled={isInstalling}>
                {isInstalling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    Install Modules <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}