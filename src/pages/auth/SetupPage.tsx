import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign, Users, Target, ShoppingCart, ShoppingBag, Package,
  Factory, FolderKanban, CheckCircle, ArrowRight, ArrowLeft, Sparkles
} from 'lucide-react';

interface SetupModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  recommended?: boolean;
}

const availableModules: SetupModule[] = [
  { id: 'finance', name: 'Finance & Accounting', description: 'General ledger, invoicing, payments, budgets, and financial reporting', icon: DollarSign, category: 'Core', recommended: true },
  { id: 'hr', name: 'HR & Payroll', description: 'Employee management, payroll, leave tracking, recruitment, and performance', icon: Users, category: 'Core', recommended: true },
  { id: 'sales', name: 'Sales & CRM', description: 'Leads, opportunities, quotations, orders, and customer management', icon: Target, category: 'Revenue' },
  { id: 'pos', name: 'Point of Sale', description: 'Retail register, sessions, and sales history', icon: ShoppingCart, category: 'Revenue' },
  { id: 'procurement', name: 'Procurement', description: 'Suppliers, purchase requisitions, purchase orders, and goods receiving', icon: ShoppingBag, category: 'Operations' },
  { id: 'inventory', name: 'Inventory', description: 'Items, stock levels, warehouses, movements, and reorder automation', icon: Package, category: 'Operations' },
  { id: 'manufacturing', name: 'Manufacturing', description: 'Work orders, BOM, production planning, and quality control', icon: Factory, category: 'Operations' },
  { id: 'projects', name: 'Projects', description: 'Project tracking, tasks, timesheets, resources, and milestones', icon: FolderKanban, category: 'Collaboration' },
];

const categories = ['Core', 'Revenue', 'Operations', 'Collaboration'];

export function SetupPage() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectRecommended = () => {
    setSelectedModules(availableModules.filter((m) => m.recommended).map((m) => m.id));
  };

  const handleFinish = () => {
    // In a real app, this would save the selected modules
    navigate('/dashboard');
  };

  const progress = step === 'select' ? 50 : 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold">EnterprisePro</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step === 'select' ? '1' : '2'} of 2
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-0">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mx-auto w-full max-w-4xl px-6 py-10">
        {step === 'select' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Welcome! Let's set up your workspace</h1>
              <p className="text-muted-foreground text-lg">
                Choose the modules you want to install. You can always add or remove modules later.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
              </p>
              <Button variant="ghost" size="sm" onClick={selectRecommended}>
                <Sparkles className="mr-1.5 h-4 w-4" />
                Select Recommended
              </Button>
            </div>

            {categories.map((category) => {
              const mods = availableModules.filter((m) => m.category === category);
              return (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {mods.map((mod) => {
                      const Icon = mod.icon;
                      const isSelected = selectedModules.includes(mod.id);
                      return (
                        <Card
                          key={mod.id}
                          className={`cursor-pointer transition-all duration-150 ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-border hover:border-primary/30'
                          }`}
                          onClick={() => toggleModule(mod.id)}
                        >
                          <CardContent className="pt-5 pb-4">
                            <div className="flex items-start gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                isSelected ? 'bg-primary/15' : 'bg-muted'
                              }`}>
                                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">{mod.name}</h4>
                                  {mod.recommended && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mod.description}</p>
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
              );
            })}

            <div className="flex justify-end pt-4">
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
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">You're all set!</h1>
              <p className="text-muted-foreground text-lg">
                Review your selected modules and launch your workspace.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Selected Modules ({selectedModules.length})</h3>
                <div className="space-y-3">
                  {availableModules
                    .filter((m) => selectedModules.includes(m.id))
                    .map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div key={mod.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{mod.name}</p>
                            <p className="text-xs text-muted-foreground">{mod.description}</p>
                          </div>
                          <CheckCircle className="ml-auto h-4 w-4 text-primary shrink-0" />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="lg" onClick={() => setStep('select')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button size="lg" onClick={handleFinish}>
                Launch Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
