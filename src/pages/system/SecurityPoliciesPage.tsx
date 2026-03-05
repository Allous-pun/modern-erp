import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Plus } from 'lucide-react';

const policies = [
  { id: '1', name: 'Password Policy', description: 'Minimum 8 chars, uppercase, number, symbol', status: 'active', enforcement: 'strict' },
  { id: '2', name: 'Session Timeout', description: 'Auto-logout after 30 minutes of inactivity', status: 'active', enforcement: 'strict' },
  { id: '3', name: 'IP Whitelisting', description: 'Restrict access to approved IP addresses', status: 'inactive', enforcement: 'moderate' },
  { id: '4', name: 'Two-Factor Authentication', description: 'Require 2FA for all admin accounts', status: 'active', enforcement: 'strict' },
  { id: '5', name: 'Data Encryption', description: 'Encrypt all data at rest and in transit', status: 'active', enforcement: 'strict' },
  { id: '6', name: 'Failed Login Lockout', description: 'Lock account after 5 failed attempts', status: 'active', enforcement: 'moderate' },
];

export function SecurityPoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security Policies" description="Manage security policies and enforcement rules">
        <Button><Plus className="h-4 w-4 mr-2" /> Add Policy</Button>
      </PageHeader>
      <div className="space-y-4">
        {policies.map(p => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={p.enforcement === 'strict' ? 'default' : 'secondary'}>{p.enforcement}</Badge>
                <Switch checked={p.status === 'active'} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
