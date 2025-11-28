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
  Microchip, 
  Slice, 
  Stethoscope, 
  Eye,
  Plane,
  Atom,
  DollarSign,
  TrendingUp,
  Package
} from "lucide-react";

const applicationIcons = {
  semiconductor: Microchip,
  cutting_tools: Slice,
  medical: Stethoscope,
  optical: Eye,
  military: Plane,
  space: Plane,
  quantum_computing: Atom,
};

export default function Industrial() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [applicationFilter, setApplicationFilter] = useState('all');

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

  const { data: allocationsData, isLoading: allocationsLoading } = useQuery({
    queryKey: ["/api/industrial-allocations", { 
      application: applicationFilter && applicationFilter !== 'all' ? applicationFilter : undefined
    }],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const allocations = allocationsData || [];
  const totalAllocations = allocations.length;
  const totalValue = allocations.reduce((sum: number, a: any) => sum + (a.value || 0), 0);

  return (
    <div className="flex h-screen" data-testid="industrial-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Industrial Applications" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Allocations</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {totalAllocations}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-semibold text-foreground">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Semiconductor</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {allocations.filter((a: any) => a.application === 'semiconductor').length}
                    </p>
                  </div>
                  <Microchip className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Medical Applications</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {allocations.filter((a: any) => a.application === 'medical').length}
                    </p>
                  </div>
                  <Stethoscope className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Industrial Diamond Allocations</CardTitle>
                <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                  <SelectTrigger className="w-40" data-testid="select-application-filter">
                    <SelectValue placeholder="All Applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="semiconductor">Semiconductor</SelectItem>
                    <SelectItem value="cutting_tools">Cutting Tools</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="optical">Optical</SelectItem>
                    <SelectItem value="military">Military</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                    <SelectItem value="quantum_computing">Quantum Computing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Allocation ID</TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No industrial allocations found. Create allocations to track diamond distributions.
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