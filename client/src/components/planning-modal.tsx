import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, DollarSign } from "lucide-react";

interface PlanningModalProps {
  roughDiamondId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanningModal({ roughDiamondId, isOpen, onClose }: PlanningModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: roughDiamond } = useQuery({
    queryKey: ["/api/rough-diamonds", roughDiamondId],
    enabled: !!roughDiamondId,
    retry: false,
  });

  const { data: cuttingPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/rough-diamonds", roughDiamondId, "cutting-plans"],
    enabled: !!roughDiamondId,
    retry: false,
  });

  const selectPlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest('PATCH', `/api/cutting-plans/${planId}/select`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rough-diamonds'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cutting-plans'] });
      toast({
        title: "Success",
        description: "Cutting plan selected successfully",
      });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to select cutting plan",
        variant: "destructive",
      });
    },
  });

  if (!roughDiamondId || !roughDiamond) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" data-testid="planning-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Diamond Planning - {roughDiamond.roughId}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-modal">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Diamond Specifications */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Diamond Specifications</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rough Weight:</span>
                  <span className="text-foreground" data-testid="spec-rough-weight">
                    {roughDiamond.carat}ct
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color Grade:</span>
                  <span className="text-foreground" data-testid="spec-color">
                    {roughDiamond.color}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clarity:</span>
                  <span className="text-foreground" data-testid="spec-clarity">
                    {roughDiamond.clarity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certification:</span>
                  <span className="text-foreground" data-testid="spec-certification">
                    {roughDiamond.certification?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground" data-testid="spec-location">
                    {roughDiamond.location?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Market Analysis */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Market Analysis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Demand:</span>
                  <Badge variant="default" data-testid="market-demand">High</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Price/ct:</span>
                  <span className="text-foreground" data-testid="market-price">$8,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sellability Score:</span>
                  <span className="text-foreground" data-testid="sellability-score">92/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge 
                    variant={roughDiamond.priority === 'critical' ? 'destructive' : 
                           roughDiamond.priority === 'high' ? 'default' : 'secondary'}
                    data-testid="priority-badge"
                  >
                    {roughDiamond.priority}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cutting Plans */}
          <div>
            <h3 className="font-medium text-foreground mb-4">
              Cutting Plans ({cuttingPlans?.length || 0} Available)
            </h3>
            
            {plansLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : cuttingPlans?.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cuttingPlans.map((plan: any) => (
                  <div 
                    key={plan.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                      plan.isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    data-testid={`cutting-plan-${plan.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">#{plan.planNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground" data-testid={`plan-description-${plan.id}`}>
                          {plan.targetShape} - {plan.estimatedCarat}ct
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`plan-details-${plan.id}`}>
                          Yield: {plan.estimatedYield}% | Expected Grade: D/FL
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-foreground" data-testid={`plan-value-${plan.id}`}>
                            ${plan.estimatedValue ? parseFloat(plan.estimatedValue).toLocaleString() : 'N/A'}
                          </p>
                          <p className="text-xs text-accent flex items-center" data-testid={`plan-roi-${plan.id}`}>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            ROI: {plan.roi ? parseFloat(plan.roi).toFixed(0) : 'N/A'}%
                          </p>
                        </div>
                        {plan.isSelected ? (
                          <Badge variant="default" data-testid={`plan-selected-${plan.id}`}>
                            Selected
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => selectPlanMutation.mutate(plan.id)}
                            disabled={selectPlanMutation.isPending}
                            data-testid={`button-select-plan-${plan.id}`}
                          >
                            Select Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-foreground mb-2">No cutting plans available</h4>
                <p className="text-sm text-muted-foreground">
                  Generate cutting plans for this rough diamond to proceed with production.
                </p>
                <Button className="mt-4" data-testid="button-generate-plans">
                  Generate Plans
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
