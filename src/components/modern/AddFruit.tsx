import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Building2, Apple, Package, Hash, DollarSign } from "lucide-react";

interface AddFruitProps {
  shops: string[];
  fruitNames: string[];
  form: {
    shop: string;
    fruit: string;
    package: string;
    quantity: string;
    price: string;
    date: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addFruit: () => void;
}

export default function AddFruit({
  shops,
  fruitNames,
  form,
  handleChange,
  addFruit,
}: AddFruitProps) {
  const handleSelectChange = (name: string, value: string) => {
    const event = {
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFruit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Add New Fruit Entry
            </h1>
            <p className="text-muted-foreground">
              Record a new fruit purchase or inventory addition
            </p>
          </div>

          {/* Form Card */}
          <Card className="card-modern animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg gradient-primary">
                  <Apple className="h-5 w-5 text-primary-foreground" />
                </div>
                Fruit Details
              </CardTitle>
              <CardDescription>
                Fill in all the required information for the fruit entry
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Selection */}
                <div className="space-y-2">
                  <Label htmlFor="shop" className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4" />
                    Company / Shop *
                  </Label>
                  <Select value={form.shop} onValueChange={(value) => handleSelectChange("shop", value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.map((shop, index) => (
                        <SelectItem key={index} value={shop}>
                          {shop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fruit Selection */}
                <div className="space-y-2">
                  <Label htmlFor="fruit" className="flex items-center gap-2 text-sm font-medium">
                    <Apple className="h-4 w-4" />
                    Fruit Type *
                  </Label>
                  <Select value={form.fruit} onValueChange={(value) => handleSelectChange("fruit", value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      {fruitNames.map((fruit, index) => (
                        <SelectItem key={index} value={fruit}>
                          {fruit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Package Type */}
                <div className="space-y-2">
                  <Label htmlFor="package" className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4" />
                    Package Type
                  </Label>
                  <Select value={form.package} onValueChange={(value) => handleSelectChange("package", value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Box">Box</SelectItem>
                      <SelectItem value="Bag">Bag</SelectItem>
                      <SelectItem value="Loose">Loose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity and Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium">
                      <Hash className="h-4 w-4" />
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      className="input-modern"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Price
                  </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter price"
                      value={form.price}
                      onChange={handleChange}
                      className="input-modern"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="input-modern"
                    required
                  />
                </div>

                {/* Unit Price Display */}
                {form.quantity && form.price && Number(form.quantity) > 0 && (
                  <div className="p-4 bg-gradient-card rounded-lg border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">Unit Price</div>
                  <div className="text-lg font-semibold text-accent">
                    {(Number(form.price) / Number(form.quantity)).toFixed(2)} per unit
                  </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Clear form
                      const clearEvent = {
                        target: { name: "clear", value: "" },
                      } as React.ChangeEvent<HTMLInputElement>;
                      ["shop", "fruit", "package", "quantity", "price", "date"].forEach((field) => {
                        handleSelectChange(field, "");
                      });
                    }}
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="min-w-32"
                    disabled={!form.shop || !form.fruit || !form.date}
                  >
                    Add Fruit Entry
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}