import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Activity, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  LineChart, 
  Server,
  Key,
  Globe,
  DollarSign,
  TrendingUp,
  CreditCard,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  FileText,
  Plus,
  Search,
  MessageSquare
} from "lucide-react";
import { StarField } from "@/components/star-field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: ShieldCheck },
    { id: "affiliates", label: "Afiliados", icon: Users },
    { id: "payouts", label: "Pagamentos", icon: DollarSign },
    { id: "commissions", label: "Comissões", icon: TrendingUp },
    { id: "analytics", label: "Analíticos", icon: LineChart },
    { id: "support", label: "Suporte", icon: MessageSquare },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-white/40">Visão geral do sistema de afiliados e performance global.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Afiliados Ativos", value: "1,284", icon: Users, color: "text-blue-400" },
                { title: "Volume de Vendas", value: "Kz 12.4M", icon: DollarSign, color: "text-emerald-400" },
                { title: "Comissões Pendentes", value: "Kz 845.000", icon: Clock, color: "text-amber-400" },
                { title: "Conversão Global", value: "3.2%", icon: TrendingUp, color: "text-purple-400" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white/60">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Fluxo de Vendas (7 dias)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end gap-2 px-2">
                    {[30, 45, 60, 40, 85, 70, 95].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-red-500/20 to-red-400/60 rounded-t-sm transition-all duration-500" 
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-white/40 uppercase font-bold tracking-widest px-2">
                    <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Alertas de Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { type: 'Pagamento', msg: '12 solicitações pendentes', status: 'warning', icon: Clock },
                    { type: 'Afiliados', msg: '5 novos cadastros hoje', status: 'success', icon: CheckCircle2 },
                    { type: 'Suporte', msg: '3 tickets não respondidos', status: 'error', icon: AlertTriangle },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                      <alert.icon className={`w-4 h-4 ${alert.status === 'success' ? 'text-emerald-400' : alert.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`} />
                      <div>
                        <p className="text-xs font-bold text-white/80">{alert.type}</p>
                        <p className="text-[10px] text-white/40">{alert.msg}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "affiliates":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Gestão de Afiliados</h1>
                <p className="text-white/40">Monitore o desempenho e aprove novos parceiros.</p>
              </div>
              <Button className="bg-red-500 hover:bg-red-600 text-white font-bold gap-2">
                <Plus className="w-4 h-4" /> Novo Afiliado
              </Button>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input placeholder="Buscar afiliado por nome ou ID..." className="pl-10 bg-white/5 border-white/10" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40">
                        <th className="pb-4 font-medium">Afiliado</th>
                        <th className="pb-4 font-medium">Nível</th>
                        <th className="pb-4 font-medium">Total Vendas</th>
                        <th className="pb-4 font-medium">Comissão Total</th>
                        <th className="pb-4 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { id: 1, name: "João Silva", level: "Top Afiliado", sales: "142", commission: "Kz 840.000", status: "Ativo" },
                        { id: 2, name: "Maria Santos", level: "Platina", sales: "89", commission: "Kz 450.000", status: "Ativo" },
                        { id: 3, name: "Pedro Costa", level: "Bronze", sales: "12", commission: "Kz 45.000", status: "Em análise" },
                      ].map((aff) => (
                        <tr key={aff.id} className="group hover:bg-white/[0.02]">
                          <td className="py-4">
                            <p className="font-medium text-white/90">{aff.name}</p>
                            <p className="text-xs text-white/40">ID: #00{aff.id}</p>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="border-red-500/20 text-red-400 bg-red-500/5">{aff.level}</Badge>
                          </td>
                          <td className="py-4 font-mono text-white/60">{aff.sales}</td>
                          <td className="py-4 font-bold text-emerald-400">{aff.commission}</td>
                          <td className="py-4 text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${aff.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {aff.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "payouts":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Solicitações de Saque</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Pendente", value: "Kz 1.250.000", count: "12", color: "text-amber-400" },
                { title: "Processando", value: "Kz 450.000", count: "5", color: "text-blue-400" },
                { title: "Pago (Este Mês)", value: "Kz 8.420.000", count: "84", color: "text-emerald-400" },
              ].map((p, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">{p.title}</p>
                    <p className="text-2xl font-bold mb-1">{p.value}</p>
                    <p className="text-[10px] text-white/20">{p.count} solicitações</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold">Aguardando Aprovação</h3>
                  <Button size="sm" variant="outline" className="text-xs border-white/10">Aprovar Todos</Button>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="w-5 h-5 text-white/40" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Afiliado #{i}29</p>
                        <p className="text-xs text-white/40">Solicitado há {i}h</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p className="text-sm font-bold text-emerald-400">Kz 45.000,00</p>
                        <p className="text-[10px] text-white/20">IBAN: AO06...</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-xs hover:bg-red-500/10 hover:text-red-400">Recusar</Button>
                        <Button size="sm" className="text-xs bg-white text-black hover:bg-white/90">Aprovar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[60vh] text-white/20 flex-col gap-4">
            <Settings className="w-12 h-12 animate-spin-slow" />
            <p className="font-mono text-sm uppercase tracking-widest">Seção em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white selection:bg-red-500/20 overflow-hidden">
        <StarField />
        
        <Sidebar className="border-r border-red-500/10 bg-black/40 backdrop-blur-xl z-20">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-red-500/40 px-4 py-6 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveItem(item.id)}
                        isActive={activeItem === item.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          activeItem === item.id 
                            ? "bg-red-500/10 text-white shadow-[0_0_20px_rgba(239,68,68,0.05)]" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                        data-testid={`button-admin-nav-${item.id}`}
                      >
                        <item.icon className={`w-5 h-5 ${activeItem === item.id ? "text-red-400" : "text-white/40"}`} />
                        <span className="font-medium">{item.label}</span>
                        {activeItem === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-white/10">
            <button 
              className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout Admin</span>
            </button>
          </div>
        </Sidebar>

        <main className="flex-1 relative z-10 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// Add User icon that was missing from direct import but used in the component
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

