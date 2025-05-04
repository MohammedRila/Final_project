import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Usecases from "@/pages/usecases";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/usecases" component={Usecases} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Error boundary component to catch and gracefully handle unhandled rejections
function ErrorHandler() {
  const { toast } = useToast();
  
  useEffect(() => {
    // Global error handler for unhandled rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault(); // Prevent the default error behavior
      console.error("Unhandled promise rejection:", event.reason);
      
      // Show a toast notification for unhandled errors
      toast({
        title: "An error occurred",
        description: "Something went wrong in the background. The application will continue to work.",
        variant: "destructive",
      });
      
      return true;
    };
    
    // Add event listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Clean up
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);
  
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorHandler />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
