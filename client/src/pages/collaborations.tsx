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
  University, 
  Building, 
  Users, 
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Globe
} from "lucide-react";

export default function Collaborations() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [typeFilter, setTypeFilter] = useState('all');

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

  const { data: collaborationsData, isLoading: collaborationsLoading } = useQuery({
    queryKey: ["/api/collaborations", { 
      type: typeFilter && typeFilter !== 'all' ? typeFilter : undefined
    }],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const collaborations = collaborationsData || [];
  const activeCollaborations = collaborations.filter((c: any) => c.status === 'active').length;
  const totalValue = collaborations.reduce((sum: number, c: any) => sum + (c.value || 0), 0);

  return (
    <div className="flex h-screen" data-testid="collaborations-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Collaborations" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Partnerships</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {activeCollaborations}
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
                    <p className="text-sm text-muted-foreground">Universities</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {collaborations.filter((c: any) => c.type === 'university').length}
                    </p>
                  </div>
                  <University className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Corporate Partners</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {collaborations.filter((c: any) => c.type === 'corporate').length}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-blue-500" />
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
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Partnership Portfolio</CardTitle>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40" data-testid="select-type-filter">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="research">Research Institute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Focus Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No collaborations found. Establish partnerships to expand research capabilities.
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