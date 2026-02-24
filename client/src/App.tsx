import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, ReactNode } from "react";
import Home from "@/pages/home";
import Usuario from "@/pages/usuario";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Termos from "@/pages/termos";
import Privacidade from "@/pages/privacidade";
import NotFound from "@/pages/not-found";

// Mock Auth Protection Component
function PrivateRoute({ children, role = "user" }: { children: ReactNode, role?: "user" | "admin" }) {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!isLogged) {
      setLocation("/login");
    } else if (role === "admin" && userRole !== "admin") {
      setLocation("/usuario");
    }
  }, [role, setLocation]);

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/termos" component={Termos} />
      <Route path="/privacidade" component={Privacidade} />
      
      {/* Protected Routes */}
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
