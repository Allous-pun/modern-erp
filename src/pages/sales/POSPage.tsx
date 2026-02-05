 import { useState } from "react";
 import { PageHeader } from "@/components/shared/PageHeader";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Separator } from "@/components/ui/separator";
 import { 
   Search, 
   Plus,
   Minus,
   Trash2,
   CreditCard,
   Banknote,
   QrCode,
   User,
   ShoppingCart,
   Barcode,
   X,
   Receipt,
   Gift
 } from "lucide-react";
 
 const categories = [
   { id: "all", name: "All Items" },
   { id: "electronics", name: "Electronics" },
   { id: "accessories", name: "Accessories" },
   { id: "software", name: "Software" },
   { id: "services", name: "Services" },
 ];
 
 const products = [
   { id: "1", name: "Laptop Pro 15\"", price: 1299, category: "electronics", sku: "LP-001", stock: 25 },
   { id: "2", name: "Wireless Mouse", price: 49.99, category: "accessories", sku: "WM-002", stock: 150 },
   { id: "3", name: "USB-C Hub", price: 79.99, category: "accessories", sku: "UC-003", stock: 80 },
   { id: "4", name: "Monitor 27\"", price: 449, category: "electronics", sku: "MN-004", stock: 30 },
   { id: "5", name: "Keyboard Mechanical", price: 129, category: "accessories", sku: "KM-005", stock: 65 },
   { id: "6", name: "Webcam HD", price: 89.99, category: "electronics", sku: "WC-006", stock: 45 },
   { id: "7", name: "Office Suite License", price: 199, category: "software", sku: "OS-007", stock: 999 },
   { id: "8", name: "Antivirus 1-Year", price: 59.99, category: "software", sku: "AV-008", stock: 999 },
   { id: "9", name: "Setup Service", price: 99, category: "services", sku: "SS-009", stock: 999 },
   { id: "10", name: "Support Plan", price: 299, category: "services", sku: "SP-010", stock: 999 },
   { id: "11", name: "Headphones Pro", price: 249, category: "accessories", sku: "HP-011", stock: 40 },
   { id: "12", name: "Tablet 10\"", price: 599, category: "electronics", sku: "TB-012", stock: 20 },
 ];
 
 interface CartItem {
   id: string;
   name: string;
   price: number;
   quantity: number;
 }
 
 export function POSPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");
   const [cart, setCart] = useState<CartItem[]>([]);
   const [customerName, setCustomerName] = useState("");
 
   const filteredProducts = products.filter(product => {
     const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.sku.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
     return matchesSearch && matchesCategory;
   });
 
   const addToCart = (product: typeof products[0]) => {
     setCart(prev => {
       const existing = prev.find(item => item.id === product.id);
       if (existing) {
         return prev.map(item =>
           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
         );
       }
       return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
     });
   };
 
   const updateQuantity = (id: string, delta: number) => {
     setCart(prev => {
       return prev.map(item => {
         if (item.id === id) {
           const newQty = item.quantity + delta;
           return newQty > 0 ? { ...item, quantity: newQty } : item;
         }
         return item;
       }).filter(item => item.quantity > 0);
     });
   };
 
   const removeFromCart = (id: string) => {
     setCart(prev => prev.filter(item => item.id !== id));
   };
 
   const clearCart = () => {
     setCart([]);
     setCustomerName("");
   };
 
   const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
   const tax = subtotal * 0.08;
   const total = subtotal + tax;
 
   return (
     <div className="space-y-4 h-[calc(100vh-8rem)]">
       <PageHeader
         title="Point of Sale"
         description="Process walk-in sales and transactions"
       />
 
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
         {/* Products Section */}
         <div className="lg:col-span-2 flex flex-col gap-4">
           {/* Search & Categories */}
           <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search products or scan barcode..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10"
               />
             </div>
             <Button variant="outline" size="icon">
               <Barcode className="h-4 w-4" />
             </Button>
           </div>
 
           {/* Category Tabs */}
           <div className="flex gap-2 overflow-x-auto pb-2">
             {categories.map((category) => (
               <Button
                 key={category.id}
                 variant={selectedCategory === category.id ? "default" : "outline"}
                 size="sm"
                 onClick={() => setSelectedCategory(category.id)}
                 className="whitespace-nowrap"
               >
                 {category.name}
               </Button>
             ))}
           </div>
 
           {/* Products Grid */}
           <ScrollArea className="flex-1">
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
               {filteredProducts.map((product) => (
                 <Card
                   key={product.id}
                   className="cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => addToCart(product)}
                 >
                   <CardContent className="p-4">
                     <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                       <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                     </div>
                     <div className="space-y-1">
                       <div className="font-medium text-sm line-clamp-2">{product.name}</div>
                       <div className="text-xs text-muted-foreground">{product.sku}</div>
                       <div className="flex items-center justify-between">
                         <span className="font-bold text-primary">${product.price}</span>
                         <Badge variant="secondary" className="text-xs">
                           {product.stock}
                         </Badge>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </ScrollArea>
         </div>
 
         {/* Cart Section */}
         <Card className="flex flex-col">
           <CardHeader className="pb-3">
             <div className="flex items-center justify-between">
               <CardTitle className="text-lg flex items-center gap-2">
                 <ShoppingCart className="h-5 w-5" />
                 Current Sale
               </CardTitle>
               {cart.length > 0 && (
                 <Button variant="ghost" size="sm" onClick={clearCart}>
                   <X className="h-4 w-4 mr-1" />
                   Clear
                 </Button>
               )}
             </div>
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Customer name (optional)"
                   value={customerName}
                   onChange={(e) => setCustomerName(e.target.value)}
                   className="pl-10"
                 />
               </div>
             </div>
           </CardHeader>
           <CardContent className="flex-1 flex flex-col p-0">
             <ScrollArea className="flex-1 px-4">
               {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                   <ShoppingCart className="h-12 w-12 mb-4" />
                   <p>Cart is empty</p>
                   <p className="text-sm">Click products to add</p>
                 </div>
               ) : (
                 <div className="space-y-3 py-2">
                   {cart.map((item) => (
                     <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                       <div className="flex-1 min-w-0">
                         <div className="font-medium text-sm truncate">{item.name}</div>
                         <div className="text-sm text-muted-foreground">${item.price}</div>
                       </div>
                       <div className="flex items-center gap-1">
                         <Button
                           variant="outline"
                           size="icon"
                           className="h-7 w-7"
                           onClick={() => updateQuantity(item.id, -1)}
                         >
                           <Minus className="h-3 w-3" />
                         </Button>
                         <span className="w-8 text-center font-medium">{item.quantity}</span>
                         <Button
                           variant="outline"
                           size="icon"
                           className="h-7 w-7"
                           onClick={() => updateQuantity(item.id, 1)}
                         >
                           <Plus className="h-3 w-3" />
                         </Button>
                       </div>
                       <div className="w-20 text-right font-semibold">
                         ${(item.price * item.quantity).toFixed(2)}
                       </div>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-7 w-7 text-destructive"
                         onClick={() => removeFromCart(item.id)}
                       >
                         <Trash2 className="h-3 w-3" />
                       </Button>
                     </div>
                   ))}
                 </div>
               )}
             </ScrollArea>
 
             {/* Totals & Payment */}
             <div className="p-4 border-t mt-auto">
               <div className="space-y-2 mb-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span>${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Tax (8%)</span>
                   <span>${tax.toFixed(2)}</span>
                 </div>
                 <Separator />
                 <div className="flex justify-between text-lg font-bold">
                   <span>Total</span>
                   <span className="text-primary">${total.toFixed(2)}</span>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <div className="grid grid-cols-3 gap-2">
                   <Button variant="outline" className="flex flex-col h-16" disabled={cart.length === 0}>
                     <Banknote className="h-5 w-5 mb-1" />
                     <span className="text-xs">Cash</span>
                   </Button>
                   <Button variant="outline" className="flex flex-col h-16" disabled={cart.length === 0}>
                     <CreditCard className="h-5 w-5 mb-1" />
                     <span className="text-xs">Card</span>
                   </Button>
                   <Button variant="outline" className="flex flex-col h-16" disabled={cart.length === 0}>
                     <QrCode className="h-5 w-5 mb-1" />
                     <span className="text-xs">QR Pay</span>
                   </Button>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" size="sm" disabled={cart.length === 0}>
                     <Gift className="h-4 w-4 mr-2" />
                     Gift Card
                   </Button>
                   <Button variant="outline" size="sm" disabled={cart.length === 0}>
                     <Receipt className="h-4 w-4 mr-2" />
                     Hold Sale
                   </Button>
                 </div>
                 <Button className="w-full h-12 text-lg" disabled={cart.length === 0}>
                   Complete Sale - ${total.toFixed(2)}
                 </Button>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }