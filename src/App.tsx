import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trackVisit } from "@/lib/trackVisit";

const queryClient = new QueryClient();

const App = () => {
  // The React build does not know about the router, so without this every
  // client-side navigation would be reported as the landing URL. App renders
  // inside the router, so useLocation is available here.
  const location = useLocation();

  // Record the landing server-side on every navigation. localStorage alone
  // cannot carry attribution to subscribe.whyzer.ai (a different origin), and
  // in practice it reaches checkout for fewer than 1 in 10 visitors, so the
  // visit is persisted here independently of what the browser retains.
  useEffect(() => {
    trackVisit();
  }, [location.pathname, location.search]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet />
        <Analytics route={location.pathname} path={location.pathname + location.search} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
