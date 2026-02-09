import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Search, ChevronRight, ChevronDown, Layers, Package, DollarSign, Edit, Copy, Trash2 } from 'lucide-react';

interface BOMComponent {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  children?: BOMComponent[];
}

interface BOM {
  id: string;
  code: string;
  productName: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  totalCost: number;
  components: number;
  lastUpdated: string;
  componentTree: BOMComponent[];
}

const mockBOMs: BOM[] = [
  {
    id: '1',
    code: 'BOM-001',
    productName: 'Widget Assembly A',
    version: 'v2.1',
    status: 'active',
    totalCost: 145.50,
    components: 12,
    lastUpdated: '2024-02-05',
    componentTree: [
      {
        id: 'c1',
        itemCode: 'FRAME-001',
        name: 'Aluminum Frame',
        quantity: 1,
        unit: 'pcs',
        unitCost: 25.00,
        children: [
          { id: 'c1-1', itemCode: 'RAW-AL-01', name: 'Aluminum Sheet 2mm', quantity: 0.5, unit: 'kg', unitCost: 8.00 },
          { id: 'c1-2', itemCode: 'SCR-001', name: 'M3 Screws', quantity: 8, unit: 'pcs', unitCost: 0.10 },
        ]
      },
      { id: 'c2', itemCode: 'PCB-001', name: 'Main Circuit Board', quantity: 1, unit: 'pcs', unitCost: 45.00 },
      { id: 'c3', itemCode: 'MOTOR-001', name: 'DC Motor 12V', quantity: 2, unit: 'pcs', unitCost: 18.00 },
    ]
  },
  {
    id: '2',
    code: 'BOM-002',
    productName: 'Component X-42',
    version: 'v1.0',
    status: 'active',
    totalCost: 78.25,
    components: 8,
    lastUpdated: '2024-02-01',
    componentTree: []
  },
  {
    id: '3',
    code: 'BOM-003',
    productName: 'Module B-Series',
    version: 'v3.2',
    status: 'active',
    totalCost: 234.00,
    components: 18,
    lastUpdated: '2024-01-28',
    componentTree: []
  },
  {
    id: '4',
    code: 'BOM-004',
    productName: 'Assembly Kit Pro',
    version: 'v1.0',
    status: 'draft',
    totalCost: 312.75,
    components: 24,
    lastUpdated: '2024-02-06',
    componentTree: []
  },
];

function BOMTreeItem({ component, level = 0 }: { component: BOMComponent; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = component.children && component.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-lg"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-muted rounded">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-6" />
        )}
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm text-muted-foreground">{component.itemCode}</span>
        <span className="font-medium flex-1">{component.name}</span>
        <span className="text-sm text-muted-foreground">
          {component.quantity} {component.unit}
        </span>
        <span className="text-sm font-medium w-20 text-right">
          ${(component.quantity * component.unitCost).toFixed(2)}
        </span>
      </div>
      {hasChildren && isOpen && (
        <div>
          {component.children!.map((child) => (
            <BOMTreeItem key={child.id} component={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BOMPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(mockBOMs[0]);

  const filteredBOMs = mockBOMs.filter(
    (bom) =>
      bom.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      active: 'default',
      draft: 'secondary',
      archived: 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bill of Materials"
        description="Define product structures and component hierarchies"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New BOM
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* BOM List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search BOMs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredBOMs.map((bom) => (
                <button
                  key={bom.id}
                  onClick={() => setSelectedBOM(bom)}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                    selectedBOM?.id === bom.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-medium">{bom.code}</span>
                    {getStatusBadge(bom.status)}
                  </div>
                  <p className="font-medium truncate">{bom.productName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{bom.version}</span>
                    <span>{bom.components} components</span>
                    <span>${bom.totalCost.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BOM Details */}
        <Card className="lg:col-span-2">
          {selectedBOM ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      {selectedBOM.productName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedBOM.code} • {selectedBOM.version} • Updated {selectedBOM.lastUpdated}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" /> Clone
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Components</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedBOM.components}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Total Cost</span>
                    </div>
                    <p className="text-2xl font-bold">${selectedBOM.totalCost.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Layers className="h-4 w-4" />
                      <span className="text-sm">Levels</span>
                    </div>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>

                {/* Component Tree */}
                <div className="border rounded-lg">
                  <div className="p-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex-1">Component Hierarchy</span>
                      <span className="w-20 text-right">Qty</span>
                      <span className="w-20 text-right">Cost</span>
                    </div>
                  </div>
                  <div className="p-2">
                    {selectedBOM.componentTree.length > 0 ? (
                      selectedBOM.componentTree.map((component) => (
                        <BOMTreeItem key={component.id} component={component} />
                      ))
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No components defined. Click Edit to add components.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <p className="text-muted-foreground">Select a BOM to view details</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
