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
  Sprout, 
  Thermometer, 
  Zap, 
  Clock,
  Activity,
  TrendingUp,
  MapPin
} from "lucide-react";

export default function Growing() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [locationFilter, setLocationFilter] = useState('all');

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

  const { data: equipmentData, isLoading: equipmentLoading } = useQuery({
    queryKey: ["/api/growing-equipment", { 
      location: locationFilter && locationFilter !== 'all' ? locationFilter : undefined
    }],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const equipment = equipmentData || [];
  const activeEquipment = equipment.filter((e: any) => e.status === 'active').length;
  const totalCapacity = equipment.reduce((sum: number, e: any) => sum + (e.capacity || 0), 0);

  return (
    <div className="flex h-screen" data-testid="growing-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Growing Operations" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Reactors</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {activeEquipment}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {totalCapacity.toFixed(1)} ct/month
                    </p>
                  </div>
                  <Sprout className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Temperature</p>
                    <p className="text-2xl font-semibold text-foreground">
                      2,100°C
                    </p>
                  </div>
                  <Thermometer className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Power Consumption</p>
                    <p className="text-2xl font-semibold text-foreground">
                      1,847 kW
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Growing Equipment Status</CardTitle>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-40" data-testid="select-location-filter">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="hong_kong">Hong Kong</SelectItem>
                    <SelectItem value="dubai">Dubai</SelectItem>
                    <SelectItem value="antwerp">Antwerp</SelectItem>
                    <SelectItem value="new_york">New York</SelectItem>
                    <SelectItem value="odisha">Odisha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Pressure</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No growing equipment found. Add equipment to start monitoring operations.
                      </TableCell>
                    </TableRow>
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