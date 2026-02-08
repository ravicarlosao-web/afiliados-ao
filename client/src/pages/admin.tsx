import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Globe
} from "lucide-react";
import { StarField } from "@/components/star-field";

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: ShieldCheck },
    { id: "users", label: "Gerenciar Usuários", icon: Users },
    { id: "database", label: "Banco de Dados", icon: Database },
    { id: "analytics", label: "Analíticos", icon: LineChart },
    { id: "system", label: "Status do Sistema", icon: Server },
    { id: "security", label: "Segurança & Chaves", icon: Key },
    { id: "settings", label: "Configurações Globais", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white selection:bg-white/20 overflow-hidden">
        <StarField />
        
        {/* Admin Sidebar */}
        <Sidebar className="border-r border-red-500/10 bg-black/40 backdrop-blur-xl z-20">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-red-500/40 px-4 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Painel Administrativo
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
              <span className="font-medium">Sair do Admin</span>
            </button>
          </div>
        </Sidebar>

        {/* Admin Main Content */}
        <main className="flex-1 relative z-10 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Admin Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-red-400/50 bg-clip-text text-transparent">
                  Central de Comando
                </h1>
                <p className="text-white/40">Monitoramento global e controle de infraestrutura.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sistemas Online
                </div>
              </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Usuários Totais", value: "12,482", icon: Users, color: "text-blue-400" },
                { title: "Carga do Servidor", value: "24%", icon: Activity, color: "text-emerald-400" },
                { title: "Latência Global", value: "18ms", icon: Globe, color: "text-purple-400" },
                { title: "Alertas Ativos", value: "0", icon: AlertTriangle, color: "text-white/40" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:border-red-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/40">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono" data-testid={`text-admin-stat-${i}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Infrastructure Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Tráfego em Tempo Real
                  </CardTitle>
                  <span className="text-xs font-mono text-white/40">atualizado: agora</span>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end gap-1 px-2">
                    {[40, 70, 45, 90, 65, 80, 30, 95, 50, 75, 40, 60, 85, 45, 70, 55, 90, 40, 65, 80].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-red-500/20 to-red-400/60 rounded-t-sm transition-all duration-500 hover:to-red-300" 
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                    <div>
                      <div className="text-xs text-white/40 mb-1">Requisições/s</div>
                      <div className="text-lg font-mono font-bold text-white">1,240</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-1">Erros 5xx</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">0.00%</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-1">CPU Cluster</div>
                      <div className="text-lg font-mono font-bold text-white">32.4%</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-1">Memory Pool</div>
                      <div className="text-lg font-mono font-bold text-white">4.2GB</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Logs Críticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'INFO', msg: 'Backup diário concluído', time: '5m' },
                      { type: 'SEC', msg: 'Tentativa de login bloqueada', time: '12m' },
                      { type: 'SYS', msg: 'Escalonamento automático: +2 nodes', time: '45m' },
                      { type: 'INFO', msg: 'Cache global invalidado', time: '1h' },
                    ].map((log, i) => (
                      <div key={i} className="text-xs font-mono border-l-2 border-white/10 pl-3 py-1 space-y-1">
                        <div className="flex justify-between">
                          <span className={`font-bold ${log.type === 'SEC' ? 'text-red-400' : 'text-white/40'}`}>[{log.type}]</span>
                          <span className="text-white/20">{log.time}</span>
                        </div>
                        <div className="text-white/60 truncate">{log.msg}</div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2 px-4 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/5 transition-colors">
                    Ver Todos os Logs
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
