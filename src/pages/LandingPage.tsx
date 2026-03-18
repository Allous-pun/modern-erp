import React from 'react'; // landing
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight, CheckCircle, DollarSign, Users, Target, Package,
  FolderKanban, Factory, ShoppingCart, ShoppingBag, BarChart3,
  Shield, Zap, Globe, ChevronRight
} from 'lucide-react';

const modules = [
  { icon: DollarSign, name: 'Finance & Accounting', desc: 'GL, AP/AR, budgeting, and financial reporting' },
  { icon: Users, name: 'HR & Payroll', desc: 'Employee management, payroll, and attendance' },
  { icon: Target, name: 'Sales & CRM', desc: 'Pipeline, quotations, and customer management' },
  { icon: ShoppingCart, name: 'Point of Sale', desc: 'Retail operations and register management' },
  { icon: ShoppingBag, name: 'Procurement', desc: 'Supplier management and purchase orders' },
  { icon: Package, name: 'Inventory', desc: 'Stock control and warehouse management' },
  { icon: Factory, name: 'Manufacturing', desc: 'Production planning and quality control' },
  { icon: FolderKanban, name: 'Projects', desc: 'Task management and resource allocation' },
];

const features = [
  { icon: Zap, title: 'Modular Architecture', desc: 'Install only the modules you need. Scale as your business grows.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Granular permissions for every role — admin, manager, or employee.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live dashboards and reports across every department.' },
  { icon: Globe, title: 'Multi-Language', desc: 'Support for multiple languages and regional formats.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold">EnterprisePro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#modules" className="hover:text-foreground transition-colors">Modules</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button size="sm">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--module-projects)/.05)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Modular ERP — install only what you need
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Run Your Entire Business<br />
            <span className="text-primary">From One Platform</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
            Finance, HR, Sales, Inventory, Manufacturing, and more — all connected.
            Choose the modules that fit your workflow and get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding">
              <Button size="lg" className="text-base px-8">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="outline" size="lg" className="text-base px-8">
                View Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required · 14-day free trial</p>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need, Nothing You Don't</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Pick and choose from 8+ modules. Each one integrates seamlessly with the rest.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.name} className="card-interactive group cursor-pointer border-border hover:border-primary/30">
                <CardContent className="pt-6 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Modern Teams</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Enterprise-grade features with the simplicity your team deserves.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { plan: 'Starter', price: 'Free', desc: 'For small teams getting started', features: ['Up to 5 users', '2 modules', 'Community support'] },
            { plan: 'Professional', price: '$49/mo', desc: 'For growing businesses', features: ['Up to 50 users', 'All modules', 'Priority support', 'Custom reports'], popular: true },
            { plan: 'Enterprise', price: 'Custom', desc: 'For large organizations', features: ['Unlimited users', 'All modules', 'Dedicated support', 'Custom integrations', 'SLA guarantee'] },
          ].map((tier) => (
            <Card key={tier.plan} className={`relative ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most Popular</span>
                </div>
              )}
              <CardContent className="pt-8 pb-6 text-center">
                <h3 className="text-lg font-semibold mb-1">{tier.plan}</h3>
                <p className="text-3xl font-bold mb-1">{tier.price}</p>
                <p className="text-sm text-muted-foreground mb-6">{tier.desc}</p>
                <ul className="space-y-2 text-sm text-left mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/onboarding">
                  <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                    Get Started <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="mx-auto max-w-lg">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="text" placeholder="Last Name" className="rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" placeholder="Subject" className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <textarea placeholder="Your Message" rows={5} className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <Button className="w-full" size="lg">Send Message <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">E</span>
            </div>
            <span className="font-semibold text-foreground">EnterprisePro</span>
          </div>
          <p>© 2024 EnterprisePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
