import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Usuario from "@/pages/usuario";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Termos from "@/pages/termos";
import Privacidade from "@/pages/privacidade";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/termos" component={Termos} />
      <Route path="/privacidade" component={Privacidade} />
      <Route path="/usuario" component={Usuario} />
      <Route path="/admin" component={Admin} />
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
