import React, { useState } from 'react';
import { 
  Globe, Languages, Plus, Search, Edit, Trash2, Upload, Download, 
  Check, X, Eye, Copy, RefreshCw, FileText, AlertTriangle, CheckCircle,
  Settings, Flag, MoreHorizontal
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';

// Mock data for languages
const mockLanguages = [
  { 
    id: '1', 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇺🇸', 
    enabled: true, 
    isDefault: true, 
    rtl: false,
    completionRate: 100,
    lastUpdated: '2024-01-15',
    translator: 'System Default'
  },
  { 
    id: '2', 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸', 
    enabled: true, 
    isDefault: false, 
    rtl: false,
    completionRate: 92,
    lastUpdated: '2024-01-14',
    translator: 'Maria Garcia'
  },
  { 
    id: '3', 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷', 
    enabled: true, 
    isDefault: false, 
    rtl: false,
    completionRate: 85,
    lastUpdated: '2024-01-10',
    translator: 'Jean Dupont'
  },
  { 
    id: '4', 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch', 
    flag: '🇩🇪', 
    enabled: true, 
    isDefault: false, 
    rtl: false,
    completionRate: 78,
    lastUpdated: '2024-01-12',
    translator: 'Hans Mueller'
  },
  { 
    id: '5', 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦', 
    enabled: true, 
    isDefault: false, 
    rtl: true,
    completionRate: 65,
    lastUpdated: '2024-01-08',
    translator: 'Ahmed Hassan'
  },
  { 
    id: '6', 
    code: 'zh', 
    name: 'Chinese', 
    nativeName: '中文', 
    flag: '🇨🇳', 
    enabled: false, 
    isDefault: false, 
    rtl: false,
    completionRate: 45,
    lastUpdated: '2024-01-05',
    translator: 'Wei Chen'
  },
  { 
    id: '7', 
    code: 'ja', 
    name: 'Japanese', 
    nativeName: '日本語', 
    flag: '🇯🇵', 
    enabled: false, 
    isDefault: false, 
    rtl: false,
    completionRate: 30,
    lastUpdated: '2024-01-03',
    translator: 'Yuki Tanaka'
  },
  { 
    id: '8', 
    code: 'pt', 
    name: 'Portuguese', 
    nativeName: 'Português', 
    flag: '🇧🇷', 
    enabled: false, 
    isDefault: false, 
    rtl: false,
    completionRate: 55,
    lastUpdated: '2024-01-07',
    translator: 'Carlos Silva'
  },
];

// Translation categories/modules
const translationModules = [
  { id: 'common', name: 'Common', keyCount: 245, description: 'General UI labels and buttons' },
  { id: 'auth', name: 'Authentication', keyCount: 42, description: 'Login, signup, password forms' },
  { id: 'dashboard', name: 'Dashboard', keyCount: 68, description: 'Dashboard widgets and stats' },
  { id: 'finance', name: 'Finance', keyCount: 156, description: 'Finance module translations' },
  { id: 'hr', name: 'HR & Payroll', keyCount: 189, description: 'HR module translations' },
  { id: 'sales', name: 'Sales & CRM', keyCount: 134, description: 'Sales module translations' },
  { id: 'inventory', name: 'Inventory', keyCount: 98, description: 'Inventory module translations' },
  { id: 'procurement', name: 'Procurement', keyCount: 87, description: 'Procurement module translations' },
  { id: 'projects', name: 'Projects', keyCount: 112, description: 'Project management translations' },
  { id: 'reports', name: 'Reports', keyCount: 76, description: 'Reports module translations' },
  { id: 'admin', name: 'Administration', keyCount: 145, description: 'Admin settings translations' },
  { id: 'notifications', name: 'Notifications', keyCount: 54, description: 'Notification messages' },
  { id: 'errors', name: 'Errors', keyCount: 89, description: 'Error messages and validations' },
];

// Mock translation keys
const mockTranslationKeys = [
  { key: 'common.save', en: 'Save', es: 'Guardar', fr: 'Sauvegarder', de: 'Speichern', ar: 'حفظ' },
  { key: 'common.cancel', en: 'Cancel', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', ar: 'إلغاء' },
  { key: 'common.delete', en: 'Delete', es: 'Eliminar', fr: 'Supprimer', de: 'Löschen', ar: 'حذف' },
  { key: 'common.edit', en: 'Edit', es: 'Editar', fr: 'Modifier', de: 'Bearbeiten', ar: 'تعديل' },
  { key: 'common.search', en: 'Search', es: 'Buscar', fr: 'Rechercher', de: 'Suchen', ar: 'بحث' },
  { key: 'common.filter', en: 'Filter', es: 'Filtrar', fr: 'Filtrer', de: 'Filtern', ar: 'تصفية' },
  { key: 'common.export', en: 'Export', es: 'Exportar', fr: 'Exporter', de: 'Exportieren', ar: 'تصدير' },
  { key: 'common.import', en: 'Import', es: 'Importar', fr: 'Importer', de: 'Importieren', ar: 'استيراد' },
  { key: 'common.submit', en: 'Submit', es: 'Enviar', fr: 'Soumettre', de: 'Absenden', ar: 'إرسال' },
  { key: 'common.confirm', en: 'Confirm', es: 'Confirmar', fr: 'Confirmer', de: 'Bestätigen', ar: 'تأكيد' },
  { key: 'auth.login', en: 'Sign In', es: 'Iniciar Sesión', fr: 'Connexion', de: 'Anmelden', ar: 'تسجيل الدخول' },
  { key: 'auth.logout', en: 'Sign Out', es: 'Cerrar Sesión', fr: 'Déconnexion', de: 'Abmelden', ar: 'تسجيل الخروج' },
  { key: 'auth.password', en: 'Password', es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', ar: 'كلمة المرور' },
  { key: 'dashboard.welcome', en: 'Welcome', es: 'Bienvenido', fr: 'Bienvenue', de: 'Willkommen', ar: 'مرحبا' },
  { key: 'dashboard.overview', en: 'Overview', es: 'Resumen', fr: 'Aperçu', de: 'Übersicht', ar: 'نظرة عامة' },
];

// Available locales for adding new languages
const availableLocales = [
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
];

export function LanguagePage() {
  const [languages, setLanguages] = useState(mockLanguages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('common');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<typeof mockTranslationKeys[0] | null>(null);

  const totalKeys = translationModules.reduce((sum, m) => sum + m.keyCount, 0);
  const enabledLanguages = languages.filter(l => l.enabled).length;
  const avgCompletion = Math.round(languages.reduce((sum, l) => sum + l.completionRate, 0) / languages.length);

  const handleToggleLanguage = (id: string) => {
    setLanguages(prev => prev.map(lang => 
      lang.id === id ? { ...lang, enabled: !lang.enabled } : lang
    ));
    toast.success('Language status updated');
  };

  const handleSetDefault = (id: string) => {
    setLanguages(prev => prev.map(lang => ({
      ...lang,
      isDefault: lang.id === id
    })));
    toast.success('Default language updated');
  };

  const handleExportTranslations = (langCode: string) => {
    toast.success(`Exporting ${langCode.toUpperCase()} translations...`);
  };

  const handleImportTranslations = () => {
    toast.success('Importing translations...');
  };

  const filteredKeys = mockTranslationKeys.filter(key => 
    key.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Language & Translations"
        description="Manage application languages, translations, and localization settings"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Languages</p>
                <p className="text-2xl font-bold">{languages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-success-bg">
                <CheckCircle className="h-6 w-6 text-status-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Languages</p>
                <p className="text-2xl font-bold">{enabledLanguages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Translation Keys</p>
                <p className="text-2xl font-bold">{totalKeys.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-warning-bg">
                <Languages className="h-6 w-6 text-status-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">{avgCompletion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="languages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleImportTranslations}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Language</DialogTitle>
                    <DialogDescription>
                      Select a language to add to your application
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Select Language</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLocales.map((locale) => (
                            <SelectItem key={locale.code} value={locale.code}>
                              <span className="flex items-center gap-2">
                                <span>{locale.flag}</span>
                                <span>{locale.name}</span>
                                <span className="text-muted-foreground">({locale.nativeName})</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Auto-translate from English</Label>
                        <p className="text-sm text-muted-foreground">
                          Use AI to generate initial translations
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Enable immediately</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this language available to users
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                      toast.success('Language added successfully');
                      setIsAddDialogOpen(false);
                    }}>Add Language</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Translator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.filter(l => 
                  l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  l.code.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((language) => (
                  <TableRow key={language.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <p className="font-medium">{language.name}</p>
                          <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                        </div>
                        {language.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        {language.rtl && (
                          <Badge variant="outline">RTL</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm">{language.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={language.completionRate} className="w-20" />
                        <span className="text-sm text-muted-foreground">{language.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{language.lastUpdated}</TableCell>
                    <TableCell className="text-muted-foreground">{language.translator}</TableCell>
                    <TableCell>
                      <Switch
                        checked={language.enabled}
                        onCheckedChange={() => handleToggleLanguage(language.id)}
                        disabled={language.isDefault}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExportTranslations(language.code)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Translations
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Translations
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleSetDefault(language.id)}
                            disabled={language.isDefault}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            Set as Default
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            disabled={language.isDefault}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Translations Tab */}
        <TabsContent value="translations" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search translation keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {translationModules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.name} ({module.keyCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.filter(l => l.enabled && !l.isDefault).map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Auto-translate Missing
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Key</TableHead>
                  <TableHead>English (Source)</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((item) => {
                  const translation = item[selectedLanguage as keyof typeof item] as string;
                  const hasTranslation = !!translation;
                  return (
                    <TableRow key={item.key}>
                      <TableCell>
                        <code className="text-xs rounded bg-muted px-2 py-1">{item.key}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.en}</TableCell>
                      <TableCell>
                        {hasTranslation ? (
                          <span className={selectedLanguage === 'ar' ? 'text-right block' : ''}>{translation}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Not translated</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasTranslation ? (
                          <Badge className="bg-status-success-bg text-status-success border-0">
                            <Check className="mr-1 h-3 w-3" />
                            Translated
                          </Badge>
                        ) : (
                          <Badge className="bg-status-warning-bg text-status-warning border-0">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Missing
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingKey(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(item.key);
                              toast.success('Key copied to clipboard');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Edit Translation Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Translation</DialogTitle>
                <DialogDescription>
                  {editingKey?.key}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>English (Source)</Label>
                  <Input value={editingKey?.en || ''} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Translation ({languages.find(l => l.code === selectedLanguage)?.name})</Label>
                  <Textarea 
                    defaultValue={editingKey?.[selectedLanguage as keyof typeof editingKey] as string || ''}
                    placeholder="Enter translation..."
                    className={selectedLanguage === 'ar' ? 'text-right' : ''}
                    dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3 bg-muted/50">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Use {'{variable}'} syntax for dynamic content. Example: "Hello, {'{name}'}!"
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success('Translation updated');
                  setIsEditDialogOpen(false);
                }}>Save Translation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {translationModules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{module.name}</CardTitle>
                    <Badge variant="secondary">{module.keyCount} keys</Badge>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {languages.filter(l => l.enabled).slice(0, 4).map((lang) => {
                      const completion = Math.max(30, Math.min(100, lang.completionRate + Math.floor(Math.random() * 20) - 10));
                      return (
                        <div key={lang.code} className="flex items-center gap-2">
                          <span className="w-6">{lang.flag}</span>
                          <Progress value={completion} className="flex-1" />
                          <span className="text-xs text-muted-foreground w-10 text-right">{completion}%</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit Translations
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Language Detection</CardTitle>
                <CardDescription>Configure how the app detects user language preference</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Auto-detect browser language</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically use user's browser language
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Remember user preference</Label>
                    <p className="text-sm text-muted-foreground">
                      Store language choice in user profile
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Show language selector</Label>
                    <p className="text-sm text-muted-foreground">
                      Display language switcher in header
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fallback Settings</CardTitle>
                <CardDescription>Configure behavior for missing translations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fallback Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.filter(l => l.enabled).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used when translation is missing in selected language
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Show translation key on missing</Label>
                    <p className="text-sm text-muted-foreground">
                      Display the key instead of empty text
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Log missing translations</Label>
                    <p className="text-sm text-muted-foreground">
                      Track untranslated keys for review
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Formatting</CardTitle>
                <CardDescription>Configure number, date, and currency formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY (US)</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY (EU)</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD (ISO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number Format</Label>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">1,234.56 (US)</SelectItem>
                      <SelectItem value="eu">1.234,56 (EU)</SelectItem>
                      <SelectItem value="ch">1'234.56 (CH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                      <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound (£)</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen (¥)</SelectItem>
                      <SelectItem value="cny">CNY - Chinese Yuan (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import / Export</CardTitle>
                <CardDescription>Manage translation files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="json">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xliff">XLIFF</SelectItem>
                      <SelectItem value="po">PO (Gettext)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Import All
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
                <div className="rounded-lg border-2 border-dashed p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop translation files here
                  </p>
                  <Button variant="link" size="sm" className="mt-1">
                    or click to browse
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => toast.success('Settings saved successfully')}>
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
