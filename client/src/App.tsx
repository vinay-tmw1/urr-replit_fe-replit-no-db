import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Manufacturing from "./pages/manufacturing";
import Planning from "./pages/planning";
import Research from "./pages/research";
import UserManagement from "./pages/user-management";
import Grading from "./pages/grading";
import Growing from "./pages/growing";
import Industrial from "./pages/industrial";
import Collaborations from "./pages/collaborations";
import Market from "./pages/market";
import Brands from "./pages/brands";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/manufacturing" component={Planning} />
          <Route path="/planning" component={Planning} />
          <Route path="/grading" component={Grading} />
          <Route path="/growing" component={Growing} />
          <Route path="/research" component={Research} />
          <Route path="/industrial" component={Industrial} />
          <Route path="/collaborations" component={Collaborations} />
          <Route path="/market" component={Market} />
          <Route path="/brands" component={Brands} />
          <Route path="/users" component={UserManagement} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
