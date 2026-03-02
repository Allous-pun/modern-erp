import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';

const industries = [
  'Technology',
  'Manufacturing',
  'Retail & E-Commerce',
  'Healthcare',
  'Financial Services',
  'Education',
  'Construction',
  'Logistics & Transportation',
  'Food & Beverage',
  'Professional Services',
  'Other',
];

const companySizes = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '500+ employees',
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const isValid = orgName.trim() && industry && companySize;

  const handleContinue = () => {
    // Store org info in sessionStorage (no backend)
    sessionStorage.setItem(
      'onboarding_org',
      JSON.stringify({ orgName, industry, companySize, country, phone, website })
    );
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary/5 border-r border-border flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold">EnterprisePro</span>
          </div>

          <h2 className="text-3xl font-bold leading-tight mb-4">
            Let's set up your<br />
            <span className="text-primary">organization</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Tell us about your company so we can tailor your workspace. This only takes a minute.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { icon: Building2, label: 'Register your organization' },
            { icon: Users, label: 'Create your admin account' },
            { icon: Briefcase, label: 'Choose your modules' },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  i === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <span className={i === 0 ? 'font-medium' : 'text-muted-foreground'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          © 2024 EnterprisePro. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg">
          {/* Mobile header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">E</span>
              </div>
              <span className="text-xl font-bold">EnterprisePro</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Organization Details</h1>
            <p className="text-muted-foreground">
              Enter your company information to get started.
            </p>
          </div>

          <div className="space-y-5">
            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="orgName">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="orgName"
                  placeholder="Acme Corporation"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label>
                Industry <span className="text-destructive">*</span>
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label>
                Company Size <span className="text-destructive">*</span>
              </Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country / Region</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="country"
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone & Website row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/landing')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleContinue} disabled={!isValid} size="lg">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
