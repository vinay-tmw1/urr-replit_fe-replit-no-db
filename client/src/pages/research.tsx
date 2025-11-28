import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "../components/sidebar";
import TopNavbar from "../components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRdProjectSchema } from "@shared/schema";
import { z } from "zod";
import { 
  FlaskConical, 
  Microchip, 
  Slice, 
  Stethoscope, 
  Eye, 
  Zap, 
  Plane, 
  Atom, 
  Plus,
  Users,
  Calendar,
  DollarSign,
  TrendingUp
} from "lucide-react";

const formSchema = insertRdProjectSchema.extend({
  budget: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

const applicationIcons = {
  semiconductor: Microchip,
  cutting_tools: Slice,
  medical: Stethoscope,
  optical: Eye,
  military: Plane,
  space: Plane,
  quantum_computing: Atom,
};

export default function Research() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/rd-projects", { 
      limit: 20,
      category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined
    }],
    retry: false,
  });

  const { data: collaborations } = useQuery({
    queryKey: ["/api/collaborations"],
    retry: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'semiconductor',
      status: 'planning',
      budget: '',
      startDate: '',
      endDate: '',
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/rd-projects', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rd-projects'] });
      toast({
        title: "Success",
        description: "R&D project created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
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
        description: "Failed to create R&D project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createProjectMutation.mutate(data);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen" data-testid="research-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Research & Development" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {projectsData?.projects?.filter((p: any) => p.status === 'active').length || 0}
                    </p>
                  </div>
                  <FlaskConical className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-semibold text-foreground">
                      ${(projectsData?.projects?.reduce((sum: number, p: any) => sum + parseFloat(p.budget || 0), 0) / 1000000).toFixed(1)}M
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
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {projectsData?.projects?.length > 0 
                        ? Math.round(projectsData.projects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / projectsData.projects.length)
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Collaborations</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {collaborations?.length || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* R&D Projects */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>R&D Projects</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-40" data-testid="select-category-filter">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="semiconductor">Semiconductor</SelectItem>
                          <SelectItem value="cutting_tools">Cutting Tools</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="optical">Optical</SelectItem>
                          <SelectItem value="military">Military</SelectItem>
                          <SelectItem value="space">Space</SelectItem>
                          <SelectItem value="quantum_computing">Quantum Computing</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32" data-testid="select-status-filter">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button data-testid="button-add-project">
                            <Plus className="w-4 h-4 mr-2" />
                            New Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create New R&D Project</DialogTitle>
                          </DialogHeader>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Project Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Quantum Computing Substrates" {...field} data-testid="input-title" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Project description..." {...field} data-testid="textarea-description" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="category"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger data-testid="select-category">
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="semiconductor">Semiconductor</SelectItem>
                                          <SelectItem value="cutting_tools">Cutting Tools</SelectItem>
                                          <SelectItem value="medical">Medical</SelectItem>
                                          <SelectItem value="optical">Optical</SelectItem>
                                          <SelectItem value="military">Military</SelectItem>
                                          <SelectItem value="space">Space</SelectItem>
                                          <SelectItem value="quantum_computing">Quantum Computing</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="budget"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Budget (USD)</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="1000000" {...field} data-testid="input-budget" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="startDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Start Date</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} data-testid="input-start-date" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="endDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>End Date</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} data-testid="input-end-date" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="flex justify-end space-x-3">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={createProjectMutation.isPending} data-testid="button-submit">
                                  {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectsData?.projects?.map((project: any) => {
                      const IconComponent = applicationIcons[project.category] || FlaskConical;
                      return (
                        <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground" data-testid={`text-project-title-${project.id}`}>
                                  {project.title}
                                </h4>
                                <p className="text-sm text-muted-foreground capitalize" data-testid={`text-project-category-${project.id}`}>
                                  {project.category.replace('_', ' ')}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1" data-testid={`text-project-description-${project.id}`}>
                                  {project.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={project.status === 'active' ? 'default' : 
                                       project.status === 'completed' ? 'secondary' : 'outline'}
                                data-testid={`badge-project-status-${project.id}`}
                              >
                                {project.status.replace('_', ' ')}
                              </Badge>
                              {project.budget && (
                                <p className="text-sm text-muted-foreground mt-1" data-testid={`text-project-budget-${project.id}`}>
                                  ${(project.budget / 1000000).toFixed(1)}M budget
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not started'}
                              </div>
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
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span data-testid={`text-project-progress-${project.id}`}>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="w-32 h-2" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collaborations */}
            <Card data-testid="collaborations-card">
              <CardHeader>
                <CardTitle>University Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborations?.map((collab: any) => (
                    <div key={collab.id} className="border border-border rounded-lg p-3">
                      <h4 className="font-medium text-foreground" data-testid={`text-collab-institution-${collab.id}`}>
                        {collab.institutionName}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-collab-contact-${collab.id}`}>
                        {collab.contactPerson}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant={collab.status === 'active' ? 'default' : 'outline'}
                          data-testid={`badge-collab-status-${collab.id}`}
                        >
                          {collab.status}
                        </Badge>
                        {collab.startDate && (
                          <span className="text-xs text-muted-foreground" data-testid={`text-collab-date-${collab.id}`}>
                            Since {new Date(collab.startDate).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4" data-testid="button-add-collaboration">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collaboration
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
