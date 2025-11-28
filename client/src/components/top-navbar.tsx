import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, MapPin } from "lucide-react";

interface TopNavbarProps {
  title: string;
}

export default function TopNavbar({ title }: TopNavbarProps) {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(user?.location || 'mumbai');

  const locations = [
    { value: 'mumbai', label: 'Mumbai HQ' },
    { value: 'hong_kong', label: 'Hong Kong' },
    { value: 'dubai', label: 'Dubai' },
    { value: 'antwerp', label: 'Antwerp' },
    { value: 'new_york', label: 'New York' },
    { value: 'odisha', label: 'Odisha' },
  ];

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between" data-testid="top-navbar">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-foreground" data-testid="navbar-title">
          {title}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="border-none bg-transparent p-0 h-auto focus:ring-0" data-testid="select-location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="w-4 h-4" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-2 h-2 p-0 flex items-center justify-center"
          >
            <span className="sr-only">New notifications</span>
          </Badge>
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          data-testid="button-settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
