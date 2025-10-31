import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, Check, X, Eye, TrendingUp, Building2, Download, FileDown, FileSpreadsheet } from "lucide-react";
import { generateCompanyWisePDF } from "@/utils/pdfGenerator";
import { generateAllDataExcel, generateCompanyWiseExcel } from "@/utils/excelGenerator";
import { useToast } from "@/hooks/use-toast";

interface Fruit {
  shop: string;
  fruit: string;
  package: string;
  quantity: string;
  price: string;
  date: string;
}

interface ViewFruitsProps {
  fruits: Fruit[];
  editIndex: number | null;
  editForm: { package: string; quantity: string };
  setEditForm: (form: { package: string; quantity: string }) => void;
  startUpdate: (index: number) => void;
  confirmUpdate: (index: number) => void;
  cancelUpdate: () => void;
  deleteFruit: (index: number) => void;
  total: number;
  shopTotals: Record<string, number>;
  paidHistory?: Array<{ shop: string; amount: number; date: string }>;
}

export default function ViewFruits({
  fruits,
  editIndex,
  editForm,
  setEditForm,
  startUpdate,
  confirmUpdate,
  cancelUpdate,
  deleteFruit,
  total,
  shopTotals,
  paidHistory = [],
}: ViewFruitsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShop, setFilterShop] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Filter and sort fruits
  const filteredFruits = fruits
    .filter((fruit) => {
      const matchesSearch = 
        fruit.fruit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fruit.shop.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesShop = filterShop === "all" || fruit.shop === filterShop;
      return matchesSearch && matchesShop;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price":
          return Number(b.price) - Number(a.price);
        case "quantity":
          return Number(b.quantity) - Number(a.quantity);
        default:
          return 0;
      }
    });

  const uniqueShops = Array.from(new Set(fruits.map(f => f.shop)));

  const { toast } = useToast();

  const handleDownloadAllCompanies = () => {
    generateCompanyWisePDF(fruits, shopTotals, paidHistory);
  };

  const handleDownloadSingleCompany = (company: string) => {
    generateCompanyWisePDF(fruits, shopTotals, paidHistory, company);
  };

  const handleDownloadAllExcel = () => {
    const success = generateAllDataExcel(fruits, shopTotals, paidHistory);
    if (success) {
      toast({
        title: "Excel Downloaded",
        description: "All data has been exported to Excel successfully!",
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Failed to export data to Excel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCompanyExcel = (company: string) => {
    const success = generateCompanyWiseExcel(fruits, shopTotals, paidHistory, company);
    if (success) {
      toast({
        title: "Excel Downloaded",
        description: `${company} data has been exported to Excel successfully!`,
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Failed to export company data to Excel. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fruit Inventory
              </h1>
              <p className="text-muted-foreground">
                View, edit, and manage your fruit entries
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadAllCompanies}
                  variant="gradient"
                  className="flex items-center gap-2"
                  disabled={fruits.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Download All PDF
                </Button>
                <Button
                  onClick={handleDownloadAllExcel}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={fruits.length === 0}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Download All Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Entries
              </CardTitle>
              <Eye className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{fruits.length}</div>
              <p className="text-xs text-muted-foreground">
                Fruit records in system
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Grand Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{total.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total inventory value
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Object.keys(shopTotals).length}</div>
              <p className="text-xs text-muted-foreground">
                Companies with entries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="card-modern mb-6 animate-bounce-in">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search fruits or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterShop} onValueChange={setFilterShop}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {uniqueShops.map((shop) => (
                      <SelectItem key={shop} value={shop}>
                        {shop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fruits Table */}
        <Card className="card-modern animate-fade-in">
          <CardHeader>
            <CardTitle>Fruit Entries</CardTitle>
            <CardDescription>
              {filteredFruits.length} of {fruits.length} entries shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFruits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No entries found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Fruit</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFruits.map((fruit, actualIndex) => {
                      const originalIndex = fruits.indexOf(fruit);
                      const unitPrice = fruit.quantity ? Number(fruit.price) / Number(fruit.quantity) : 0;
                      
                      return (
                        <TableRow key={originalIndex} className="hover:bg-muted/50">
                          <TableCell>
                            <Badge variant="outline" className="font-medium">
                              {fruit.shop}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{fruit.fruit}</TableCell>
                          <TableCell>
                            {editIndex === originalIndex ? (
                              <Select
                                value={editForm.package}
                                onValueChange={(value) =>
                                  setEditForm({ ...editForm, package: value })
                                }
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Box">Box</SelectItem>
                                  <SelectItem value="Bag">Bag</SelectItem>
                                  <SelectItem value="Loose">Loose</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              fruit.package
                            )}
                          </TableCell>
                          <TableCell>
                            {editIndex === originalIndex ? (
                              <Input
                                type="number"
                                value={editForm.quantity}
                                onChange={(e) => {
                                  const newQty = Number(e.target.value);
                                  setEditForm({
                                    ...editForm,
                                    quantity: e.target.value,
                                  });
                                }}
                                className="w-20"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              fruit.quantity
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{Number(fruit.price).toFixed(2)}</div>
                              {fruit.quantity && (
                                <div className="text-xs text-muted-foreground">
                                  {unitPrice.toFixed(2)}/unit
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{fruit.date}</TableCell>
                          <TableCell className="text-right">
                            {editIndex === originalIndex ? (
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => confirmUpdate(originalIndex)}
                                  className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={cancelUpdate}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startUpdate(originalIndex)}
                                  className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => deleteFruit(originalIndex)}
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Totals */}
        {Object.keys(shopTotals).length > 0 && (
          <Card className="card-modern mt-6 animate-slide-up">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Totals
                  </CardTitle>
                  <CardDescription>
                    Total amounts per company
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(shopTotals).map(([shop, totalAmount]) => {
                  const paidAmount = paidHistory
                    .filter(payment => payment.shop === shop)
                    .reduce((sum, payment) => sum + payment.amount, 0);
                  const remainingAmount = totalAmount - paidAmount;
                  const paymentPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
                  
                  return (
                    <div
                      key={shop}
                      className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{shop}</h3>
                            <p className="text-sm text-muted-foreground">Company Overview</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Payment Progress</span>
                          <span className="text-sm font-bold text-primary">{paymentPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(paymentPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Financial Details */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground font-medium mb-1">Total</div>
                          <div className="text-lg font-bold text-foreground">{totalAmount.toFixed(2)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground font-medium mb-1">Paid</div>
                          <div className="text-lg font-bold text-success">{paidAmount.toFixed(2)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground font-medium mb-1">Remaining</div>
                          <div className={`text-lg font-bold ${remainingAmount > 0 ? 'text-warning' : 'text-success'}`}>
                            {remainingAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge 
                          variant={remainingAmount > 0 ? "secondary" : "default"}
                          className={`px-3 py-1 text-xs font-medium ${
                            remainingAmount > 0 
                              ? 'bg-warning/10 text-warning border-warning/20' 
                              : 'bg-success/10 text-success border-success/20'
                          }`}
                        >
                          {remainingAmount > 0 ? 'Outstanding' : 'Paid in Full'}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadSingleCompany(shop)}
                          className="flex-1 flex items-center justify-center gap-2 h-9 text-xs font-medium border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          PDF Export
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleDownloadCompanyExcel(shop)}
                          className="flex-1 flex items-center justify-center gap-2 h-9 text-xs font-medium bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success/80 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          Excel Export
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}