import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Factory, FlaskConical, Users, Globe, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mr-4">
              <Gem className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Diamond ERP</h1>
              <p className="text-lg text-muted-foreground">URR Manufacturing</p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive ERP system for lab-grown diamond manufacturing with advanced R&D capabilities
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Access Dashboard
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gem className="w-6 h-6 mr-3 text-primary" />
                Diamond Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage 100,000+ polished diamonds and 45,000 carats of growing inventory across global locations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Factory className="w-6 h-6 mr-3 text-primary" />
                Manufacturing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced planning with 20+ cutting plans per rough diamond and comprehensive production tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FlaskConical className="w-6 h-6 mr-3 text-primary" />
                R&D Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track research projects across industrial applications including semiconductor and quantum computing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" />
                Global Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor operations across Mumbai, Hong Kong, Dubai, Antwerp, New York, and Odisha locations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-primary" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Business intelligence for cutting plan selection and market demand analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                Role-Based Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive user management for 2000+ employees with role-based permissions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Enterprise Scale</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Polished Diamonds</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15K</div>
              <div className="text-muted-foreground">Monthly Yield</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-muted-foreground">Global Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2K+</div>
              <div className="text-muted-foreground">Team Members</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
