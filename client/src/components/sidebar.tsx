import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Gem, 
  ChartLine, 
  Package, 
  Factory, 
  Slice, 
  Sprout, 
  Medal, 
  FlaskConical, 
  Microchip, 
  University, 
  TrendingUp, 
  BellRing, 
  Users, 
  LogOut
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    items: [
      { name: "Overview", href: "/", icon: ChartLine },
      { name: "Inventory Management", href: "/inventory", icon: Package },
      { name: "Manufacturing", href: "/manufacturing", icon: Factory },
    ]
  },
  {
    name: "Operations", 
    items: [
      { name: "Planning & Cutting", href: "/planning", icon: Slice },
      { name: "Growing Operations", href: "/growing", icon: Sprout },
      { name: "Grading & Certification", href: "/grading", icon: Medal },
    ]
  },
  {
    name: "Research & Development",
    items: [
      { name: "R&D Projects", href: "/research", icon: FlaskConical },
      { name: "Industrial Applications", href: "/industrial", icon: Microchip },
      { name: "Collaborations", href: "/collaborations", icon: University },
    ]
  },
  {
    name: "Business",
    items: [
      { name: "Market Analysis", href: "/market", icon: TrendingUp },
      { name: "Jewelry Brands", href: "/brands", icon: BellRing },
      { name: "User Management", href: "/users", icon: Users },
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  const canAccessUserManagement = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Gem className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Diamond ERP</h1>
            <p className="text-xs text-muted-foreground">URR Manufacturing</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.name} className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {section.name}
            </h3>
            {section.items.map((item) => {
              // Hide user management if user doesn't have permission
              if (item.href === "/users" && !canAccessUserManagement) {
                return null;
              }

              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => window.location.href = '/api/logout'}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
