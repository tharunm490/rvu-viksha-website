import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

import Home from "@/pages/home";
import Events from "@/pages/events";
import Team from "@/pages/team";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import Blogs from "@/pages/blogs";
import About from "@/pages/about";
import IntroAnimation from "@/components/IntroAnimation";

/**
 * Force window scroll to top on route change
 */
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

/**
 * Main application router
 */
function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/events" component={Events} />
        <Route path="/team" component={Team} />
        <Route path="/blogs" component={Blogs} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

/**
 * Root Application component with intro animation logic
 */
function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [firstVisit, setFirstVisit] = useState(true);

  // Check session storage to skip intro on repeat visits
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("viksha-visited");
    if (hasVisited) {
      setFirstVisit(false);
      setShowLoading(false);
    }
  }, []);

  // Handle completion of the intro animation
  const handleLoadingComplete = () => {
    setShowLoading(false);
    sessionStorage.setItem("viksha-visited", "true");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {showLoading && firstVisit && (
          <IntroAnimation onComplete={handleLoadingComplete} />
        )}
        {(!showLoading || !firstVisit) && <Router />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
