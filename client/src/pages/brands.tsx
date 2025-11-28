import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BellRing, 
  Crown, 
  Star, 
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Award
} from "lucide-react";

export default function Brands() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["/api/jewelry-brands", { 
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined
    }],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const mockBrands = [
    { name: 'Tiffany & Co.', tier: 'Luxury', volume: 1250, value: 18500000, status: 'active' },
    { name: 'Cartier', tier: 'Luxury', volume: 980, value: 24200000, status: 'active' },
    { name: 'Harry Winston', tier: 'Ultra-Luxury', volume: 420, value: 15600000, status: 'active' },
    { name: 'Bulgari', tier: 'Luxury', volume: 850, value: 12800000, status: 'active' },
  ];

  const totalVolume = mockBrands.reduce((sum, b) => sum + b.volume, 0);
  const totalValue = mockBrands.reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="flex h-screen" data-testid="brands-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Jewelry Brands" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Partners</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {mockBrands.filter(b => b.status === 'active').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {totalVolume.toLocaleString()} ct
                    </p>
                  </div>
                  <BellRing className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-semibold text-foreground">
                      ${(totalValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Luxury Tier</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {mockBrands.filter(b => b.tier === 'Luxury').length}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Partners by Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBrands.slice(0, 4).map((brand, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                          {index === 1 && <Award className="w-4 h-4 text-gray-400" />}
                          {index === 2 && <Star className="w-4 h-4 text-amber-600" />}
                          {index > 2 && <BellRing className="w-4 h-4 text-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{brand.name}</p>
                          <p className="text-xs text-muted-foreground">{brand.tier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{brand.volume.toLocaleString()} ct</p>
                        <p className="text-xs text-muted-foreground">${(brand.value / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partner Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Ultra-Luxury</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">1 brand</span>
                      <Badge variant="outline" className="text-xs">$15.6M</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-muted-foreground">Luxury</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">3 brands</span>
                      <Badge variant="outline" className="text-xs">$55.5M</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Premium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">0 brands</span>
                      <Badge variant="outline" className="text-xs">$0M</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Brand Partnership Portfolio</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Volume (ct/year)</TableHead>
                      <TableHead>Contract Value</TableHead>
                      <TableHead>Contract Start</TableHead>
                      <TableHead>Contract End</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBrands.map((brand, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span>{brand.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            brand.tier === 'Ultra-Luxury' ? 'default' :
                            brand.tier === 'Luxury' ? 'secondary' : 'outline'
                          }>
                            {brand.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>{brand.volume.toLocaleString()}</TableCell>
                        <TableCell>${(brand.value / 1000000).toFixed(1)}M</TableCell>
                        <TableCell>Jan 2024</TableCell>
                        <TableCell>Dec 2026</TableCell>
                        <TableCell>
                          <Badge variant={brand.status === 'active' ? 'default' : 'outline'}>
                            {brand.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}