import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const settings = [
  { id: 'cookie-consent', label: 'Cookie Consent Banner', description: 'Show cookie consent banner to all visitors', enabled: true },
  { id: 'data-anonymization', label: 'Data Anonymization', description: 'Automatically anonymize personal data in reports', enabled: true },
  { id: 'right-to-erasure', label: 'Right to Erasure Automation', description: 'Automatically process data deletion requests', enabled: false },
  { id: 'consent-logging', label: 'Consent Logging', description: 'Log all user consent actions for audit trails', enabled: true },
  { id: 'data-portability', label: 'Data Portability', description: 'Allow users to export their data in standard formats', enabled: true },
];

export function PrivacySettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Privacy Settings" description="Configure data privacy and protection settings">
        <Button>Save Changes</Button>
      </PageHeader>
      <Card>
        <CardHeader><CardTitle>Privacy Controls</CardTitle><CardDescription>Enable or disable privacy features</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          {settings.map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{s.label}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <Switch checked={s.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Data Retention</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Default Retention Period</p><p className="text-sm text-muted-foreground">How long to keep personal data</p></div>
            <Select defaultValue="24"><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="6">6 months</SelectItem><SelectItem value="12">12 months</SelectItem><SelectItem value="24">24 months</SelectItem><SelectItem value="36">36 months</SelectItem></SelectContent></Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
