import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Slice, 
  Plus, 
  Eye, 
  Clock, 
  Target, 
  DollarSign,
  TrendingUp,
  Gem,
  Calendar,
  User,
  Microscope,
  Zap,
  Star,
  Edit,
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Planning() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRoughDiamond, setSelectedRoughDiamond] = useState<any>(null);
  const [showXrayAnalysis, setShowXrayAnalysis] = useState(false);
  const [cuttingPlans, setCuttingPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);

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

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/cutting-plans"],
    retry: false,
  });

  const { data: roughDiamondsData } = useQuery({
    queryKey: ["/api/rough-diamonds", { limit: 50, status: 'planning' }],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const mockPlans = plansData?.plans || [];
  const totalPlans = mockPlans.length;
  const activePlans = mockPlans.filter((p: any) => p.status === 'active').length;
  const completedPlans = mockPlans.filter((p: any) => p.status === 'completed').length;
  const pendingPlans = mockPlans.filter((p: any) => p.status === 'pending').length;

  return (
    <div className="flex h-screen" data-testid="planning-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Manufacturing Planning & Galaxy X-Ray Analysis" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Plans</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {totalPlans}
                    </p>
                  </div>
                  <Slice className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Plans</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {activePlans}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {completedPlans}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {pendingPlans}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory">Rough Inventory</TabsTrigger>
              <TabsTrigger value="xray">Galaxy X-Ray Analysis</TabsTrigger>
              <TabsTrigger value="plans">Cutting Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rough Diamonds Awaiting Planning</CardTitle>
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
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Estimated Yield</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(roughDiamondsData?.roughDiamonds || []).map((diamond: any) => (
                          <TableRow key={diamond.id}>
                            <TableCell className="font-medium">{diamond.roughId}</TableCell>
                            <TableCell>{diamond.carat} ct</TableCell>
                            <TableCell>{diamond.color}</TableCell>
                            <TableCell>{diamond.clarity}</TableCell>
                            <TableCell className="capitalize">{diamond.location?.replace('_', ' ')}</TableCell>
                            <TableCell>
                              <Badge variant={
                                diamond.status === 'planning' ? 'secondary' :
                                diamond.status === 'in_production' ? 'default' : 'outline'
                              }>
                                {diamond.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{diamond.estimatedYield}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedRoughDiamond(diamond);
                                  setShowXrayAnalysis(true);
                                }}
                                data-testid={`button-analyze-${diamond.id}`}
                              >
                                <Microscope className="w-4 h-4 mr-2" />
                                Analyze
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="xray" className="space-y-4">
              {selectedRoughDiamond && showXrayAnalysis ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Galaxy Machine X-Ray Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-slate-900 rounded-lg p-4 text-white">
                          <div className="text-center">
                            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full relative">
                              {/* Simulated X-ray view with inclusions */}
                              <div className="absolute top-8 left-12 w-3 h-3 bg-red-400 rounded-full opacity-70"></div>
                              <div className="absolute top-16 right-10 w-2 h-2 bg-yellow-400 rounded-full opacity-70"></div>
                              <div className="absolute bottom-12 left-16 w-4 h-2 bg-orange-400 rounded opacity-60"></div>
                              <div className="absolute bottom-20 right-14 w-2 h-3 bg-red-300 rounded opacity-50"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                                {selectedRoughDiamond.roughId}
                              </div>
                            </div>
                            <p className="text-sm mt-4">X-Ray Scan Complete - {selectedRoughDiamond.carat} ct</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold">Inclusion Analysis</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                              <span className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <span>Carbon Spot</span>
                              </span>
                              <span>Severity: Medium</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                              <span className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span>Crystal Growth</span>
                              </span>
                              <span>Severity: Low</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                              <span className="flex items-center space-x-2">
                                <div className="w-4 h-2 bg-orange-400 rounded"></div>
                                <span>Feather</span>
                              </span>
                              <span>Severity: High</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cutting Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <div className="text-center">
                            <h4 className="font-semibold mb-2">Diamond Specifications</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                              <div className="text-left">
                                <span className="text-muted-foreground">Rough Weight:</span>
                                <span className="ml-2 font-medium">{selectedRoughDiamond.carat} ct</span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Market Demand:</span>
                                <span className="ml-2"><Badge variant="default">High</Badge></span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Color Grade:</span>
                                <span className="ml-2 font-medium">{selectedRoughDiamond.color}</span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Avg Price/ct:</span>
                                <span className="ml-2 font-medium">$8,450</span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Clarity:</span>
                                <span className="ml-2 font-medium">{selectedRoughDiamond.clarity}</span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Sellability Score:</span>
                                <span className="ml-2 font-medium">92/100</span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Certification:</span>
                                <span className="ml-2 font-medium">GIA</span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Priority:</span>
                                <span className="ml-2"><div className="w-3 h-3 bg-black rounded-full inline-block"></div></span>
                              </div>
                              <div className="text-left">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="ml-2 font-medium capitalize">{selectedRoughDiamond.location?.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3">Market Analysis</h4>
                          </div>
                          
                          {cuttingPlans.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8 text-gray-400" />
                              </div>
                              <h5 className="font-medium mb-2">Cutting Plans ({cuttingPlans.length} Available)</h5>
                              <p className="text-sm text-muted-foreground mb-4">No cutting plans available</p>
                              <p className="text-xs text-muted-foreground mb-6">Generate cutting plans for this rough diamond to proceed with production.</p>
                              <Button 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  const plans = [
                                    {
                                      id: 'plan-1',
                                      name: 'Conservative Round Cut',
                                      targetShape: 'round',
                                      targetCarat: 2.8,
                                      estimatedYield: 35,
                                      estimatedValue: 45000,
                                      riskLevel: 'low',
                                      strategy: 'Avoid all major inclusions, maximize clarity grade',
                                      expectedGrade: 'VS1',
                                      timeline: '14 days'
                                    },
                                    {
                                      id: 'plan-2',
                                      name: 'Aggressive Oval Cut',
                                      targetShape: 'oval',
                                      targetCarat: 3.2,
                                      estimatedYield: 42,
                                      estimatedValue: 52000,
                                      riskLevel: 'medium',
                                      strategy: 'Work around carbon spot, optimize weight retention',
                                      expectedGrade: 'SI1',
                                      timeline: '18 days'
                                    },
                                    {
                                      id: 'plan-3',
                                      name: 'Strategic Princess Cut',
                                      targetShape: 'princess',
                                      targetCarat: 2.6,
                                      estimatedYield: 32,
                                      estimatedValue: 38000,
                                      riskLevel: 'low',
                                      strategy: 'Corner placement hides feather inclusion',
                                      expectedGrade: 'VS2',
                                      timeline: '12 days'
                                    }
                                  ];
                                  setCuttingPlans(plans);
                                  toast({
                                    title: "Plans Generated",
                                    description: `${plans.length} cutting plans have been generated based on X-ray analysis`,
                                  });
                                }}
                                data-testid="button-generate-plans"
                              >
                                Generate Plans
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <h5 className="font-medium mb-2">Cutting Plans ({cuttingPlans.length} Available)</h5>
                              <p className="text-sm text-muted-foreground mb-4">AI-generated cutting plans based on X-ray analysis</p>
                            </div>
                          )}
                        </div>

                        {cuttingPlans.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Generated Plans ({cuttingPlans.length})</h4>
                            {cuttingPlans.map((plan) => (
                              <div key={plan.id} className="border rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium">{plan.name}</h5>
                                  <Badge variant={
                                    plan.riskLevel === 'low' ? 'secondary' :
                                    plan.riskLevel === 'medium' ? 'default' : 'destructive'
                                  }>
                                    {plan.riskLevel} risk
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                  <div>Target: {plan.targetCarat} ct {plan.targetShape}</div>
                                  <div>Value: ${plan.estimatedValue.toLocaleString()}</div>
                                  <div>Yield: {plan.estimatedYield}%</div>
                                  <div>Grade: {plan.expectedGrade}</div>
                                </div>
                                <p className="text-xs text-muted-foreground">{plan.strategy}</p>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingPlan(plan)}
                                    data-testid={`button-edit-${plan.id}`}
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => setSelectedPlan(plan)}
                                    data-testid={`button-select-${plan.id}`}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Select
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Microscope className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Galaxy X-Ray Analysis</h3>
                    <p className="text-muted-foreground">Select a rough diamond from the inventory to perform Galaxy machine X-ray analysis</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              {selectedPlan ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Selected Plan: {selectedPlan.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Plan Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Rough Diamond:</span>
                            <p className="font-medium">{selectedRoughDiamond?.roughId}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target Shape:</span>
                            <p className="font-medium capitalize">{selectedPlan.targetShape}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target Weight:</span>
                            <p className="font-medium">{selectedPlan.targetCarat} ct</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Grade:</span>
                            <p className="font-medium">{selectedPlan.expectedGrade}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Yield:</span>
                            <p className="font-medium">{selectedPlan.estimatedYield}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Value:</span>
                            <p className="font-medium">${selectedPlan.estimatedValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timeline:</span>
                            <p className="font-medium">{selectedPlan.timeline}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Risk Level:</span>
                            <p className="font-medium capitalize">{selectedPlan.riskLevel}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Strategy:</span>
                          <p className="mt-1">{selectedPlan.strategy}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Manufacturing Process</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span>1. Initial Planning & Setup</span>
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span>2. Rough Cutting & Shaping</span>
                            <Slice className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span>3. Faceting & Polishing</span>
                            <Gem className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span>4. Quality Control & Grading</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-6"
                          onClick={() => {
                            toast({
                              title: "Manufacturing Started",
                              description: `Production of ${selectedPlan.name} has been initiated. Estimated completion: ${selectedPlan.timeline}`,
                            });
                          }}
                          data-testid="button-start-manufacturing"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Manufacturing Process
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Plan Selected</h3>
                    <p className="text-muted-foreground">Complete X-ray analysis and select a cutting plan to proceed with manufacturing</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {editingPlan && (
            <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Cutting Plan: {editingPlan.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Target Carat</label>
                      <Input 
                        value={editingPlan.targetCarat} 
                        onChange={(e) => setEditingPlan({...editingPlan, targetCarat: parseFloat(e.target.value)})}
                        type="number" 
                        step="0.1"
                        data-testid="input-edit-carat"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expected Grade</label>
                      <Select 
                        value={editingPlan.expectedGrade} 
                        onValueChange={(value) => setEditingPlan({...editingPlan, expectedGrade: value})}
                      >
                        <SelectTrigger data-testid="select-edit-grade">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FL">FL</SelectItem>
                          <SelectItem value="IF">IF</SelectItem>
                          <SelectItem value="VVS1">VVS1</SelectItem>
                          <SelectItem value="VVS2">VVS2</SelectItem>
                          <SelectItem value="VS1">VS1</SelectItem>
                          <SelectItem value="VS2">VS2</SelectItem>
                          <SelectItem value="SI1">SI1</SelectItem>
                          <SelectItem value="SI2">SI2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Strategy</label>
                    <Textarea 
                      value={editingPlan.strategy}
                      onChange={(e) => setEditingPlan({...editingPlan, strategy: e.target.value})}
                      data-testid="textarea-edit-strategy"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingPlan(null)} data-testid="button-cancel-edit">
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => {
                        setCuttingPlans(plans => plans.map(p => p.id === editingPlan.id ? editingPlan : p));
                        setEditingPlan(null);
                        toast({
                          title: "Plan Updated",
                          description: "Cutting plan has been successfully updated",
                        });
                      }}
                      data-testid="button-save-edit"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}