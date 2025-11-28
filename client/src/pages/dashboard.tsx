import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "../components/sidebar";
import TopNavbar from "../components/top-navbar";
import MetricCard from "../components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Gem, 
  Factory, 
  FlaskConical, 
  Sprout, 
  Clock, 
  Slice,
  Microchip,
  Stethoscope,
  ArrowRight,
  Plus,
  ExternalLink
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
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

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  const { data: rdProjects } = useQuery({
    queryKey: ["/api/rd-projects", { limit: 5, status: 'active' }],
    retry: false,
  });

  const { data: roughDiamonds } = useQuery({
    queryKey: ["/api/rough-diamonds", { limit: 5, status: 'planning' }],
    retry: false,
  });

  const { data: industrialAllocations } = useQuery({
    queryKey: ["/api/industrial-allocations"],
    retry: false,
  });

  const { data: growingEquipment } = useQuery({
    queryKey: ["/api/growing-equipment"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen" data-testid="dashboard-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Dashboard Overview" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Polished Inventory"
              value={(metrics as any)?.polishedInventory || 0}
              change="+2.4% from last month"
              icon={Gem}
              variant="primary"
              data-testid="metric-polished-inventory"
            />
            <MetricCard
              title="Monthly Yield"
              value={(metrics as any)?.monthlyYield || 0}
              change="+8.1% from target"
              icon={Factory}
              variant="accent"
              data-testid="metric-monthly-yield"
            />
            <MetricCard
              title="Active R&D Projects"
              value={(metrics as any)?.rdProjects || 0}
              change="Across 8 categories"
              icon={FlaskConical}
              variant="secondary"
              data-testid="metric-rd-projects"
            />
            <MetricCard
              title="Growing Inventory"
              value={(metrics as any)?.growingInventory || 0}
              change="-1.2% from target"
              icon={Sprout}
              variant="destructive"
              data-testid="metric-growing-inventory"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Production Planning Section */}
            <div className="xl:col-span-2">
              <Card data-testid="planning-queue-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Diamond Planning Queue</CardTitle>
                    <Button data-testid="button-new-planning">
                      <Plus className="w-4 h-4 mr-2" />
                      New Planning Request
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(roughDiamonds as any)?.roughDiamonds?.map((rough: any) => (
                      <div key={rough.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{rough.roughId}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{rough.carat}ct Rough Diamond</p>
                              <p className="text-sm text-muted-foreground">
                                Color: {rough.color} | Clarity: {rough.clarity} | {rough.certification} Certified
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={rough.status === 'planning' ? 'default' : 'secondary'}>
                              <Clock className="w-3 h-3 mr-1" />
                              {rough.status === 'planning' ? 'Planning Phase' : 'In Production'}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">24 active plans</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span>Location: {rough.location}</span>
                            <span>•</span>
                            <span>Priority: {rough.priority}</span>
                            <span>•</span>
                            <span>Est. Yield: {rough.estimatedYield}ct</span>
                          </div>
                          <Button variant="ghost" size="sm" data-testid={`button-view-plans-${rough.id}`}>
                            View Plans <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* R&D Projects Summary */}
            <Card data-testid="rd-projects-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active R&D Projects</CardTitle>
                  <Button variant="ghost" size="sm" data-testid="button-view-all-projects">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(rdProjects as any)?.projects?.map((project: any) => (
                    <div key={project.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">{project.category}</p>
                          <div className="flex items-center mt-2 space-x-2">
                            <div className="flex -space-x-1">
                              <Avatar className="w-6 h-6 border-2 border-background">
                                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <Avatar className="w-6 h-6 border-2 border-background">
                                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop&crop=face" />
                                <AvatarFallback>SM</AvatarFallback>
                              </Avatar>
                            </div>
                            <span className="text-xs text-muted-foreground">3 researchers</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4" data-testid="button-view-all-rd-projects">
                  View All Projects
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Industrial Applications & Growing Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Industrial Applications */}
            <Card data-testid="industrial-applications-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Industrial Applications</CardTitle>
                  <span className="text-sm text-muted-foreground">8 active sectors</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(industrialAllocations as any)?.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {app.application === 'semiconductor' && <Microchip className="w-5 h-5 text-primary" />}
                          {app.application === 'cutting_tools' && <Slice className="w-5 h-5 text-accent" />}
                          {app.application === 'medical' && <Stethoscope className="w-5 h-5 text-secondary" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">{app.application.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">{app.allocatedCarats} carats allocated</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">${(app.value / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-accent">+{app.growthRate}% growth</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4" data-testid="button-view-all-applications">
                  View All Applications
                </Button>
              </CardContent>
            </Card>

            {/* Growing Operations */}
            <Card data-testid="growing-operations-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Growing Operations</CardTitle>
                  <Badge variant="default">
                    <div className="w-2 h-2 bg-accent rounded-full mr-1"></div>
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(growingEquipment as any)?.filter((eq: any) => eq.status === 'running')?.slice(0, 2)?.map((equipment: any) => (
                    <div key={equipment.id} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">{equipment.name}</h4>
                        <Badge variant={equipment.status === 'running' ? 'default' : 'secondary'}>
                          {equipment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Temperature</p>
                          <p className="font-medium text-foreground">{equipment.temperature}°C</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pressure</p>
                          <p className="font-medium text-foreground">{equipment.pressure} Torr</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Run Time</p>
                          <p className="font-medium text-foreground">{equipment.runtime} hrs</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Yield</p>
                          <p className="font-medium text-foreground">{equipment.estimatedYield}ct</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Growth Progress</span>
                          <span>73%</span>
                        </div>
                        <Progress value={73} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4" data-testid="button-monitor-equipment">
                  Monitor All Equipment
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
