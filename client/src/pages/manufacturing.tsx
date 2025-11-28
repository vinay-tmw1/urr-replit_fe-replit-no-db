import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "../components/sidebar";
import TopNavbar from "../components/top-navbar";
import PlanningModal from "../components/planning-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Slice, Eye, Plus, ArrowRight } from "lucide-react";

export default function Manufacturing() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedRough, setSelectedRough] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const { data: roughDiamondsData, isLoading: roughLoading } = useQuery({
    queryKey: ["/api/rough-diamonds", { 
      limit: 20,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined
    }],
    retry: false,
  });

  const handleViewPlans = (roughId: string) => {
    setSelectedRough(roughId);
    setIsModalOpen(true);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen" data-testid="manufacturing-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Manufacturing & Planning" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Planning Queue</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {roughDiamondsData?.roughDiamonds?.filter((r: any) => r.status === 'planning').length || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Production</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {roughDiamondsData?.roughDiamonds?.filter((r: any) => r.status === 'in_production').length || 0}
                    </p>
                  </div>
                  <Slice className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {roughDiamondsData?.roughDiamonds?.filter((r: any) => r.status === 'completed').length || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-accent font-semibold">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Carats</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {roughDiamondsData?.roughDiamonds?.reduce((sum: number, r: any) => sum + parseFloat(r.carat || 0), 0).toFixed(1) || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-secondary font-semibold">ct</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rough Diamond Planning</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40" data-testid="select-status-filter">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in_production">In Production</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button data-testid="button-add-rough">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rough Diamond
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rough ID</TableHead>
                      <TableHead>Carat</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Clarity</TableHead>
                      <TableHead>Certification</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Est. Yield</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roughDiamondsData?.roughDiamonds?.map((rough: any) => (
                      <TableRow key={rough.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium" data-testid={`text-rough-id-${rough.id}`}>
                          {rough.roughId}
                        </TableCell>
                        <TableCell data-testid={`text-carat-${rough.id}`}>
                          {rough.carat}ct
                        </TableCell>
                        <TableCell data-testid={`text-color-${rough.id}`}>
                          {rough.color}
                        </TableCell>
                        <TableCell data-testid={`text-clarity-${rough.id}`}>
                          {rough.clarity}
                        </TableCell>
                        <TableCell data-testid={`text-certification-${rough.id}`}>
                          {rough.certification?.toUpperCase()}
                        </TableCell>
                        <TableCell data-testid={`text-location-${rough.id}`}>
                          {rough.location?.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={rough.priority === 'critical' ? 'destructive' : 
                                   rough.priority === 'high' ? 'default' : 'secondary'}
                            data-testid={`badge-priority-${rough.id}`}
                          >
                            {rough.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={rough.status === 'planning' ? 'default' : 
                                   rough.status === 'in_production' ? 'secondary' : 'outline'}
                            data-testid={`badge-status-${rough.id}`}
                          >
                            {rough.status === 'planning' && <Clock className="w-3 h-3 mr-1" />}
                            {rough.status === 'in_production' && <Slice className="w-3 h-3 mr-1" />}
                            {rough.status?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-yield-${rough.id}`}>
                          {rough.estimatedYield}ct
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPlans(rough.id)}
                              data-testid={`button-view-plans-${rough.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {rough.status === 'planning' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewPlans(rough.id)}
                                data-testid={`button-plan-${rough.id}`}
                              >
                                Plan <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            )}
                          </div>
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

      <PlanningModal
        roughDiamondId={selectedRough}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRough(null);
        }}
      />
    </div>
  );
}
