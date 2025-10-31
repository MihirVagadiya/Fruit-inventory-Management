import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Apple, Plus, Trash2 } from "lucide-react";

interface HomeProps {
  shops: string[];
  setShops: (shops: string[]) => void;
  newShop: string;
  setNewShop: (shop: string) => void;
  fruitNames: string[];
  setFruitNames: (fruits: string[]) => void;
  newFruitName: string;
  setNewFruitName: (fruit: string) => void;
}

export default function Home({
  shops,
  setShops,
  newShop,
  setNewShop,
  fruitNames,
  setFruitNames,
  newFruitName,
  setNewFruitName,
}: HomeProps) {
  const [activeTab, setActiveTab] = useState("companies");

  const handleAddCompany = () => {
    if (newShop.trim() && !shops.includes(newShop.trim())) {
      setShops([...shops, newShop.trim()]);
      setNewShop("");
    }
  };

  const handleAddFruit = () => {
    if (newFruitName.trim() && !fruitNames.includes(newFruitName.trim())) {
      setFruitNames([...fruitNames, newFruitName.trim()]);
      setNewFruitName("");
    }
  };

  const handleRemoveShop = (index: number) => {
    const updatedShops = shops.filter((_, i) => i !== index);
    setShops(updatedShops);
  };

  const handleRemoveFruit = (index: number) => {
    const updatedFruits = fruitNames.filter((_, i) => i !== index);
    setFruitNames(updatedFruits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome Back, Admin
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your fruit inventory with ease. Add companies, manage fruit types, and keep track of everything in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{shops.length}</div>
              <p className="text-xs text-muted-foreground">
                Active business partners
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fruit Types
              </CardTitle>
              <Apple className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{fruitNames.length}</div>
              <p className="text-xs text-muted-foreground">
                Available fruit varieties
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="card-modern animate-bounce-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              Inventory Management
            </CardTitle>
            <CardDescription>
              Add and manage your companies and fruit types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="companies" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Companies</span>
                </TabsTrigger>
                <TabsTrigger value="fruits" className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  <span className="hidden sm:inline">Fruits</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="companies" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter company name"
                    value={newShop}
                    onChange={(e) => setNewShop(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
                    className="input-modern flex-1"
                  />
                  <Button
                    onClick={handleAddCompany}
                    variant="gradient"
                    className="flex items-center gap-2"
                    disabled={!newShop.trim()}
                  >
                    <Plus className="h-4 w-4" />
                    Add Company
                  </Button>
                </div>

                <div className="space-y-3">
                  {shops.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No companies added yet</p>
                      <p className="text-sm">Add your first company to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shops.map((shop, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/50 hover:shadow-md transition-all duration-200"
                        >
                          <Badge variant="secondary" className="flex items-center gap-2">
                            <Building2 className="h-3 w-3" />
                            {shop}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveShop(index)}
                            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="fruits" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter fruit name"
                    value={newFruitName}
                    onChange={(e) => setNewFruitName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFruit()}
                    className="input-modern flex-1"
                  />
                  <Button
                    onClick={handleAddFruit}
                    variant="accent"
                    className="flex items-center gap-2"
                    disabled={!newFruitName.trim()}
                  >
                    <Plus className="h-4 w-4" />
                    Add Fruit
                  </Button>
                </div>

                <div className="space-y-3">
                  {fruitNames.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Apple className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No fruits added yet</p>
                      <p className="text-sm">Add your first fruit type to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {fruitNames.map((fruit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/50 hover:shadow-md transition-all duration-200"
                        >
                          <Badge variant="secondary" className="flex items-center gap-2">
                            <Apple className="h-3 w-3" />
                            {fruit}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFruit(index)}
                            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}