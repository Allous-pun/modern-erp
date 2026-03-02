import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';

const tiers = [
  { plan: 'Starter', price: 'Free', desc: 'For small teams getting started', features: ['Up to 5 users', '2 modules', 'Community support', 'Basic reporting', 'Email notifications'] },
  { plan: 'Professional', price: '$49/mo', desc: 'For growing businesses', features: ['Up to 50 users', 'All modules', 'Priority support', 'Custom reports', 'API access', 'Advanced analytics', 'Workflow automation'], popular: true },
  { plan: 'Enterprise', price: 'Custom', desc: 'For large organizations', features: ['Unlimited users', 'All modules', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option', 'SSO & SAML', 'Audit logs'] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold">EnterprisePro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Choose the plan that fits your business. Upgrade or downgrade anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.plan} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-[1.02]' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most Popular</span>
                </div>
              )}
              <CardContent className="pt-8 pb-6 text-center">
                <h3 className="text-lg font-semibold mb-1">{tier.plan}</h3>
                <p className="text-4xl font-bold mb-1">{tier.price}</p>
                <p className="text-sm text-muted-foreground mb-6">{tier.desc}</p>
                <ul className="space-y-2.5 text-sm text-left mb-8">
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

      {/* Back link */}
      <div className="mx-auto max-w-7xl px-6 pb-16 text-center">
        <Link to="/landing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

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
