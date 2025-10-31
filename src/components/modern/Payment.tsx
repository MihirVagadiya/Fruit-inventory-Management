import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building2, History, DollarSign, TrendingDown, AlertCircle, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePaymentSummaryPDF } from "@/utils/pdfGenerator";
import { generatePaymentSummaryExcel } from "@/utils/excelGenerator";

interface PaymentEntry {
  shop: string;
  amount: number;
  date: string;
}

interface PaymentProps {
  payment: { shop: string; amount: string };
  handlePaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  makePayment: () => void;
  shopTotals: Record<string, number>;
  paidHistory: PaymentEntry[];
}

export default function Payment({
  payment,
  handlePaymentChange,
  makePayment,
  shopTotals,
  paidHistory,
}: PaymentProps) {
  const [selectedShop, setSelectedShop] = useState("");
  const { toast } = useToast();

  const handleSelectChange = (value: string) => {
    setSelectedShop(value);
    const event = {
      target: { name: "shop", value },
    } as React.ChangeEvent<HTMLInputElement>;
    handlePaymentChange(event);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment.shop || !payment.amount) {
      toast({
        title: "Missing Information",
        description: "Please select a company and enter payment amount",
        variant: "destructive",
      });
      return;
    }

    const debits = paidHistory
      .filter((p) => p.shop === payment.shop)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const remaining = (shopTotals[payment.shop] || 0) - debits;

    if (Number(payment.amount) > remaining) {
      toast({
        title: "Payment Error",
        description: `Cannot pay more than remaining balance (${remaining.toFixed(2)})`,
        variant: "destructive",
      });
      return;
    }

    makePayment();
    setSelectedShop("");
    toast({
      title: "Payment Successful",
      description: `Payment of ${payment.amount} recorded for ${payment.shop}`,
      variant: "default",
    });
  };

  const getCompanyBalance = (shop: string) => {
    const total = shopTotals[shop] || 0;
    const paid = paidHistory
      .filter((p) => p.shop === shop)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { total, paid, remaining: total - paid };
  };

  const totalOwed = Object.keys(shopTotals).reduce((sum, shop) => {
    const balance = getCompanyBalance(shop);
    return sum + balance.remaining;
  }, 0);

  const totalPaid = paidHistory.reduce((sum, p) => sum + Number(p.amount), 0);

  const handleDownloadPaymentSummary = () => {
    generatePaymentSummaryPDF(shopTotals, paidHistory);
  };

  const handleDownloadPaymentExcel = () => {
    const success = generatePaymentSummaryExcel(shopTotals, paidHistory);
    if (success) {
      toast({
        title: "Excel Downloaded",
        description: "Payment summary has been exported to Excel successfully!",
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Failed to export payment data to Excel. Please try again.",
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
                Payment Management
              </h1>
              <p className="text-muted-foreground">
                Record payments and track company balances
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadPaymentSummary}
                  variant="accent"
                  className="flex items-center gap-2"
                  disabled={Object.keys(shopTotals).length === 0}
                >
                  <Download className="h-4 w-4" />
                  Download PDF Summary
                </Button>
                <Button
                  onClick={handleDownloadPaymentExcel}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={Object.keys(shopTotals).length === 0}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Download Excel Summary
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
                Total Outstanding
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{totalOwed.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Amount pending payment
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Paid
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalPaid.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total payments made
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payment Records
              </CardTitle>
              <History className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{paidHistory.length}</div>
              <p className="text-xs text-muted-foreground">
                Payment transactions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="card-modern animate-bounce-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg gradient-primary">
                  <CreditCard className="h-5 w-5 text-primary-foreground" />
                </div>
                Make Payment
              </CardTitle>
              <CardDescription>
                Record a payment to a company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4" />
                    Company
                  </Label>
                  <Select value={payment.shop} onValueChange={handleSelectChange}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(shopTotals).map((shop) => {
                        const balance = getCompanyBalance(shop);
                        return (
                          <SelectItem key={shop} value={shop}>
                            <div className="flex items-center justify-between w-full">
                              <span>{shop}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Payable: {balance.remaining.toFixed(2)}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {payment.shop && (
                  <div className="p-4 bg-gradient-card rounded-lg border border-border/50">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total Purchases</div>
                        <div className="font-semibold">{getCompanyBalance(payment.shop).total.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Paid Amount</div>
                        <div className="font-semibold text-success">{getCompanyBalance(payment.shop).paid.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Remaining</div>
                        <div className="font-semibold text-warning">{getCompanyBalance(payment.shop).remaining.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Payment Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter payment amount"
                    value={payment.amount}
                    onChange={handlePaymentChange}
                    className="input-modern"
                    min="0"
                    step="0.01"
                    max={payment.shop ? getCompanyBalance(payment.shop).remaining : undefined}
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={!payment.shop || !payment.amount || Number(payment.amount) <= 0}
                >
                  Record Payment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Company Balances */}
          <Card className="card-modern animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Balances
              </CardTitle>
              <CardDescription>
                Outstanding amounts per company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(shopTotals).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No company data available</p>
                    <p className="text-sm">Add some fruit entries first</p>
                  </div>
                ) : (
                  Object.keys(shopTotals).map((shop) => {
                    const balance = getCompanyBalance(shop);
                    return (
                      <div
                        key={shop}
                        className="p-4 bg-gradient-card rounded-lg border border-border/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{shop}</h4>
                          <Badge 
                            variant={balance.remaining > 0 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {balance.remaining > 0 ? "Outstanding" : "Paid"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground text-xs">Total</div>
                            <div className="font-medium">{balance.total.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Paid</div>
                            <div className="font-medium text-success">{balance.paid.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Remaining</div>
                            <div className={`font-medium ${balance.remaining > 0 ? 'text-warning' : 'text-success'}`}>
                              {balance.remaining.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        {paidHistory.length > 0 && (
          <Card className="card-modern mt-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Payment History
              </CardTitle>
              <CardDescription>
                Recent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidHistory.slice().reverse().map((payment, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {payment.shop}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-success">
                            -{Number(payment.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}