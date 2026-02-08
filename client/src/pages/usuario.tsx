import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, User, Settings, CreditCard, Bell, LogOut, ChevronRight, BarChart3, Clock, Zap } from "lucide-react";
import { StarField } from "@/components/star-field";

export default function UserDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Perfil", icon: User },
    { id: "billing", label: "Assinatura", icon: CreditCard },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white selection:bg-white/20 overflow-hidden">
        <StarField />
        
        {/* Sidebar */}
        <Sidebar className="border-r border-white/10 bg-black/40 backdrop-blur-xl z-20">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/40 px-4 py-4 text-xs font-bold uppercase tracking-widest">
                Menu Usuário
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
                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                        data-testid={`button-nav-${item.id}`}
                      >
                        <item.icon className={`w-5 h-5 ${activeItem === item.id ? "text-white" : "text-white/40"}`} />
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
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 relative z-10 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                Bem-vindo de volta
              </h1>
              <p className="text-white/40">Aqui está o resumo da sua atividade hoje.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Uso de Créditos", value: "84%", icon: Zap, color: "text-blue-400" },
                { title: "Tempo Ativo", value: "12h 45m", icon: Clock, color: "text-purple-400" },
                { title: "Eficiência", value: "92.4%", icon: BarChart3, color: "text-emerald-400" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white/60">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid={`text-stat-${i}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-4 group cursor-pointer" data-testid={`row-activity-${item}`}>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <Zap className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Processamento concluído #{item * 1240}</div>
                          <div className="text-xs text-white/40">Há {item * 2} horas atrás</div>
                        </div>
                        <div className="text-xs font-medium text-emerald-400/80 bg-emerald-400/5 px-2.5 py-1 rounded-full border border-emerald-400/10">
                          Sucesso
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Plano Atual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-white">Pro</div>
                    <div className="text-sm text-white/40">Próxima renovação: 12 Mar</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-white/60">Uso mensal</span>
                      <span className="text-white">75%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <button 
                    className="w-full py-3 px-4 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-all duration-300"
                    data-testid="button-upgrade"
                  >
                    Fazer Upgrade
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
