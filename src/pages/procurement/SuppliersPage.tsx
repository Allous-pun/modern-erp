import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Search, Filter, MoreHorizontal, Star, Mail, Phone, MapPin, 
  Building2, FileText, TrendingUp, Package, DollarSign, Clock
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const mockSuppliers = [
  { 
    id: 'SUP-001', 
    name: 'Acme Industrial Supplies', 
    category: 'Raw Materials', 
    email: 'orders@acme.com',
    phone: '+1 555-0101',
    address: '123 Industrial Way, Chicago, IL',
    rating: 4.5, 
    status: 'active',
    totalOrders: 156,
    totalSpend: 1250000,
    onTimeDelivery: 94,
    qualityScore: 98,
    paymentTerms: 'Net 30',
    lastOrder: '2024-01-15'
  },
  { 
    id: 'SUP-002', 
    name: 'TechParts Global', 
    category: 'Electronics', 
    email: 'sales@techparts.com',
    phone: '+1 555-0102',
    address: '456 Tech Blvd, San Jose, CA',
    rating: 4.8, 
    status: 'active',
    totalOrders: 89,
    totalSpend: 890000,
    onTimeDelivery: 97,
    qualityScore: 99,
    paymentTerms: 'Net 45',
    lastOrder: '2024-01-18'
  },
  { 
    id: 'SUP-003', 
    name: 'Office Essentials Co', 
    category: 'Office Supplies', 
    email: 'contact@officeessentials.com',
    phone: '+1 555-0103',
    address: '789 Commerce St, New York, NY',
    rating: 3.9, 
    status: 'active',
    totalOrders: 234,
    totalSpend: 125000,
    onTimeDelivery: 88,
    qualityScore: 92,
    paymentTerms: 'Net 15',
    lastOrder: '2024-01-20'
  },
  { 
    id: 'SUP-004', 
    name: 'GreenPack Solutions', 
    category: 'Packaging', 
    email: 'orders@greenpack.com',
    phone: '+1 555-0104',
    address: '321 Eco Drive, Portland, OR',
    rating: 4.2, 
    status: 'pending',
    totalOrders: 0,
    totalSpend: 0,
    onTimeDelivery: 0,
    qualityScore: 0,
    paymentTerms: 'Net 30',
    lastOrder: '-'
  },
  { 
    id: 'SUP-005', 
    name: 'Premium Metals Inc', 
    category: 'Raw Materials', 
    email: 'sales@premiummetals.com',
    phone: '+1 555-0105',
    address: '555 Steel Ave, Pittsburgh, PA',
    rating: 4.6, 
    status: 'inactive',
    totalOrders: 45,
    totalSpend: 2100000,
    onTimeDelivery: 91,
    qualityScore: 96,
    paymentTerms: 'Net 60',
    lastOrder: '2023-11-30'
  },
];

const categories = ['Raw Materials', 'Electronics', 'Office Supplies', 'Packaging', 'Services', 'Equipment'];

export function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<typeof mockSuppliers[0] | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'inactive': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier database and vendor relationships"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSuppliers.length}</p>
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSuppliers.filter(s => s.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Suppliers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">$4.4M</p>
                <p className="text-sm text-muted-foreground">Total Spend YTD</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.4</p>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Supplier List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Suppliers</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Supplier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Supplier</DialogTitle>
                      <DialogDescription>
                        Enter the supplier details to add them to your database.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Company Name</Label>
                          <Input id="name" placeholder="Enter company name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="orders@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" placeholder="+1 555-0000" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" placeholder="Enter full address" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="payment-terms">Payment Terms</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="net15">Net 15</SelectItem>
                              <SelectItem value="net30">Net 30</SelectItem>
                              <SelectItem value="net45">Net 45</SelectItem>
                              <SelectItem value="net60">Net 60</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending Approval</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Add Supplier</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow 
                      key={supplier.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-muted-foreground">{supplier.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.category}</Badge>
                      </TableCell>
                      <TableCell>{renderStars(supplier.rating)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(supplier.status)}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                            <DropdownMenuItem>Create PO</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Details */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSupplier ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{selectedSupplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSupplier.id}</p>
                  <Badge className={`mt-2 ${getStatusColor(selectedSupplier.status)}`}>
                    {selectedSupplier.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedSupplier.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedSupplier.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{selectedSupplier.address}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedSupplier.totalOrders}</p>
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${(selectedSupplier.totalSpend / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Total Spend</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedSupplier.onTimeDelivery}%</p>
                      <p className="text-xs text-muted-foreground">On-Time Delivery</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedSupplier.qualityScore}%</p>
                      <p className="text-xs text-muted-foreground">Quality Score</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Terms</span>
                    <span className="font-medium">{selectedSupplier.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Order</span>
                    <span className="font-medium">{selectedSupplier.lastOrder}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">Create PO</Button>
                  <Button variant="outline" className="flex-1" size="sm">Contact</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Select a supplier to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
