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
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Globe,
  Calendar,
  Target,
  Activity
} from "lucide-react";

export default function Market() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [regionFilter, setRegionFilter] = useState('all');

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

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/market-analysis", { 
      region: regionFilter && regionFilter !== 'all' ? regionFilter : undefined
    }],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const mockPrices = [
    { shape: 'Round', size: '1.0ct', color: 'D', clarity: 'FL', price: 8500, change: 5.2 },
    { shape: 'Princess', size: '1.0ct', color: 'D', clarity: 'VVS1', price: 7200, change: -2.1 },
    { shape: 'Oval', size: '1.5ct', color: 'E', clarity: 'VS1', price: 9800, change: 8.7 },
  ];

  return (
    <div className="flex h-screen" data-testid="market-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Market Analysis" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-2xl font-semibold text-foreground">
                      $24.7B
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Growth</p>
                    <p className="text-2xl font-semibold text-foreground">
                      +12.3%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Price/Carat</p>
                    <p className="text-2xl font-semibold text-foreground">
                      $4,890
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Share</p>
                    <p className="text-2xl font-semibold text-foreground">
                      8.4%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">North America</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$8.2B</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Europe</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$6.1B</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Asia Pacific</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$7.8B</span>
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Middle East</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$2.6B</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">1 Carat D/FL Round</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$8,500</span>
                      <Badge variant="secondary" className="text-xs">+5.2%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">1 Carat E/VVS1 Round</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$7,200</span>
                      <Badge variant="destructive" className="text-xs">-2.1%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">1.5 Carat F/VS1 Oval</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">$9,800</span>
                      <Badge variant="secondary" className="text-xs">+8.7%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Market Pricing</CardTitle>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-40" data-testid="select-region-filter">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north_america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                    <SelectItem value="middle_east">Middle East</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shape</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Clarity</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>30-Day Change</TableHead>
                      <TableHead>Market Demand</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPrices.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.shape}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.clarity}</TableCell>
                        <TableCell>${item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {item.change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={item.change > 0 ? "text-green-600" : "text-red-600"}>
                              {item.change > 0 ? '+' : ''}{item.change}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">High</Badge>
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