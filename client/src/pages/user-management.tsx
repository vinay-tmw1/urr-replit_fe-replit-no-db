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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, 
  UserCog, 
  Shield, 
  FlaskConical, 
  Edit, 
  Settings,
  Plus,
  Crown,
  User
} from "lucide-react";

const roleUpdateSchema = z.object({
  role: z.enum(['super_admin', 'admin', 'user', 'rd_engineer', 'scientist']),
  location: z.enum(['mumbai', 'hong_kong', 'dubai', 'antwerp', 'new_york', 'odisha']).optional(),
});

const roleColors = {
  super_admin: 'destructive',
  admin: 'default',
  user: 'secondary',
  rd_engineer: 'outline',
  scientist: 'outline',
} as const;

const roleIcons = {
  super_admin: Crown,
  admin: Shield,
  user: User,
  rd_engineer: FlaskConical,
  scientist: FlaskConical,
};

export default function UserManagement() {
  const { toast } = useToast();
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
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

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users", { 
      limit: 50,
      role: roleFilter && roleFilter !== 'all' ? roleFilter : undefined,
      location: locationFilter && locationFilter !== 'all' ? locationFilter : undefined
    }],
    retry: false,
  });

  const form = useForm<z.infer<typeof roleUpdateSchema>>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: {
      role: 'user',
      location: 'mumbai',
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (data: { userId: string } & z.infer<typeof roleUpdateSchema>) => {
      const { userId, ...updateData } = data;
      const response = await apiRequest('PATCH', `/api/users/${userId}/role`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setIsDialogOpen(false);
      setSelectedUser(null);
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
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    form.setValue('role', user.role);
    form.setValue('location', user.location);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof roleUpdateSchema>) => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser.id, ...data });
    }
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  // Check if user has permission to manage users
  const canManageUsers = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  if (!canManageUsers) {
    return (
      <div className="flex h-screen" data-testid="user-management-page">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar title="User Management" />
          <main className="flex-1 flex items-center justify-center bg-muted/30">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
                <p className="text-muted-foreground">
                  You don't have permission to access user management. Contact your administrator.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" data-testid="user-management-page">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title="User Management" />
        
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {usersData?.total || 0}
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
                    <p className="text-sm text-muted-foreground">Super Admins</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {usersData?.users?.filter((u: any) => u.role === 'super_admin').length || 0}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {usersData?.users?.filter((u: any) => u.role === 'admin').length || 0}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">R&D Team</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {usersData?.users?.filter((u: any) => u.role === 'rd_engineer' || u.role === 'scientist').length || 0}
                    </p>
                  </div>
                  <FlaskConical className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Regular Users</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {usersData?.users?.filter((u: any) => u.role === 'user').length || 0}
                    </p>
                  </div>
                  <User className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Directory</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40" data-testid="select-role-filter">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="rd_engineer">R&D Engineer</SelectItem>
                      <SelectItem value="scientist">Scientist</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.users?.map((user: any) => {
                      const RoleIcon = roleIcons[user.role] || User;
                      return (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user.profileImageUrl} />
                                <AvatarFallback>
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground" data-testid={`text-user-name-${user.id}`}>
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell data-testid={`text-user-email-${user.id}`}>
                            {user.email || 'No email'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={roleColors[user.role]}
                              className="flex items-center w-fit"
                              data-testid={`badge-user-role-${user.id}`}
                            >
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`text-user-location-${user.id}`}>
                            {user.location?.replace('_', ' ') || 'Not set'}
                          </TableCell>
                          <TableCell data-testid={`text-user-joined-${user.id}`}>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                disabled={user.id === currentUser?.id}
                                data-testid={`button-edit-user-${user.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                data-testid={`button-settings-user-${user.id}`}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedUser.profileImageUrl} />
                  <AvatarFallback>
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-user-role">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currentUser?.role === 'super_admin' && (
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            )}
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="rd_engineer">R&D Engineer</SelectItem>
                            <SelectItem value="scientist">Scientist</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-user-location">
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

                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-role-update"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updateRoleMutation.isPending}
                      data-testid="button-update-role"
                    >
                      {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
