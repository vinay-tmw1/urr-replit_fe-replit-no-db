import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "../components/sidebar";
import TopNavbar from "../components/top-navbar";
import DiamondTable from "../components/diamond-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDiamondSchema } from "@shared/schema";
import { z } from "zod";
import { Plus, Filter, Download, Search } from "lucide-react";

const formSchema = insertDiamondSchema.extend({
  carat: z.string().transform((val) => parseFloat(val)),
  price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

export default function Inventory() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    location: 'all',
    status: 'all',
    search: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { data: diamondsData, isLoading: diamondsLoading } = useQuery({
    queryKey: ["/api/diamonds", { 
      limit: 10, 
      offset: page * 10,
      location: filters.location && filters.location !== 'all' ? filters.location : undefined,
      status: filters.status && filters.status !== 'all' ? filters.status : undefined,
      search: filters.search || undefined
    }],
    retry: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diamondId: '',
      carat: '',
      shape: 'round',
      color: 'D',
      clarity: 'FL',
      cut: 'excellent',
      certification: 'gia',
      certificateNumber: '',
      location: 'mumbai',
      status: 'available',
      price: '',
      isRough: false,
    },
  });

  const createDiamondMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/diamonds', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/diamonds'] });
      toast({
        title: "Success",
        description: "Diamond added successfully",
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
        description: "Failed to add diamond",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createDiamondMutation.mutate(data);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen" data-testid="inventory-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="Diamond Inventory" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Diamond Inventory</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search diamonds..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                        data-testid="input-search"
                      />
                    </div>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger className="w-40" data-testid="select-location">
                        <SelectValue placeholder="Location" />
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
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="w-40" data-testid="select-status">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="in_production">In Production</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="grading">Grading</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" data-testid="button-filter">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-export">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-diamond">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Diamond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Diamond</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="diamondId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Diamond ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="DM-789123" {...field} data-testid="input-diamond-id" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="carat"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Carat</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.001" placeholder="2.47" {...field} data-testid="input-carat" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="shape"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Shape</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-shape">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="round">Round</SelectItem>
                                      <SelectItem value="princess">Princess</SelectItem>
                                      <SelectItem value="oval">Oval</SelectItem>
                                      <SelectItem value="marquise">Marquise</SelectItem>
                                      <SelectItem value="emerald">Emerald</SelectItem>
                                      <SelectItem value="heart">Heart</SelectItem>
                                      <SelectItem value="pear">Pear</SelectItem>
                                      <SelectItem value="cushion">Cushion</SelectItem>
                                      <SelectItem value="radiant">Radiant</SelectItem>
                                      <SelectItem value="asscher">Asscher</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="color"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Color</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-color">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="D">D</SelectItem>
                                      <SelectItem value="E">E</SelectItem>
                                      <SelectItem value="F">F</SelectItem>
                                      <SelectItem value="G">G</SelectItem>
                                      <SelectItem value="H">H</SelectItem>
                                      <SelectItem value="I">I</SelectItem>
                                      <SelectItem value="J">J</SelectItem>
                                      <SelectItem value="K">K</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="clarity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Clarity</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-clarity">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="FL">FL</SelectItem>
                                      <SelectItem value="IF">IF</SelectItem>
                                      <SelectItem value="VVS1">VVS1</SelectItem>
                                      <SelectItem value="VVS2">VVS2</SelectItem>
                                      <SelectItem value="VS1">VS1</SelectItem>
                                      <SelectItem value="VS2">VS2</SelectItem>
                                      <SelectItem value="SI1">SI1</SelectItem>
                                      <SelectItem value="SI2">SI2</SelectItem>
                                      <SelectItem value="SI3">SI3</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="cut"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cut</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-cut">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="excellent">Excellent</SelectItem>
                                      <SelectItem value="very_good">Very Good</SelectItem>
                                      <SelectItem value="good">Good</SelectItem>
                                      <SelectItem value="fair">Fair</SelectItem>
                                      <SelectItem value="poor">Poor</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="certification"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Certification</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-certification">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="gia">GIA</SelectItem>
                                      <SelectItem value="igi">IGI</SelectItem>
                                      <SelectItem value="hrd">HRD</SelectItem>
                                      <SelectItem value="ggtl">GGTL</SelectItem>
                                      <SelectItem value="sgl">SGL</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="certificateNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Certificate Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Certificate number" {...field} data-testid="input-certificate" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-form-location">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="mumbai">Mumbai</SelectItem>
                                      <SelectItem value="hong_kong">Hong Kong</SelectItem>
                                      <SelectItem value="dubai">Dubai</SelectItem>
                                      <SelectItem value="antwerp">Antwerp</SelectItem>
                                      <SelectItem value="new_york">New York</SelectItem>
                                      <SelectItem value="odisha">Odisha</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (USD)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" placeholder="8450.00" {...field} data-testid="input-price" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-form-status">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="available">Available</SelectItem>
                                      <SelectItem value="reserved">Reserved</SelectItem>
                                      <SelectItem value="in_production">In Production</SelectItem>
                                      <SelectItem value="sold">Sold</SelectItem>
                                      <SelectItem value="grading">Grading</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-3">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                              Cancel
                            </Button>
                            <Button type="submit" disabled={createDiamondMutation.isPending} data-testid="button-submit">
                              {createDiamondMutation.isPending ? 'Adding...' : 'Add Diamond'}
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
              <DiamondTable 
                diamonds={diamondsData?.diamonds || []}
                total={diamondsData?.total || 0}
                page={page}
                onPageChange={setPage}
                isLoading={diamondsLoading}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
