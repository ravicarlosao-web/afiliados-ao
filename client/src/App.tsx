import { Switch, Route, useLocation } from "wouter";
import { queryClient, getQueryFn } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, ReactNode } from "react";
import Home from "@/pages/home";
import Usuario from "@/pages/usuario";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Termos from "@/pages/termos";
import Privacidade from "@/pages/privacidade";
import NotFound from "@/pages/not-found";

function PrivateRoute({ children, role = "user" }: { children: ReactNode, role?: "user" | "admin" }) {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setLocation("/login");
    } else if (role === "admin" && user.role !== "admin") {
      setLocation("/usuario");
    }
  }, [user, isLoading, role, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/termos" component={Termos} />
      <Route path="/privacidade" component={Privacidade} />
      
      <Route path="/usuario">
        <PrivateRoute role="user">
          <Usuario />
        </PrivateRoute>
      </Route>
      
      <Route path="/admin">
        <PrivateRoute role="admin">
          <Admin />
        </PrivateRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
