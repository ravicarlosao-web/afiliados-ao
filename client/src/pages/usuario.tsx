import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, User, Settings, Wallet, Bell, LogOut, ChevronRight, BarChart3, TrendingUp, DollarSign, Users, Briefcase } from "lucide-react";
import { StarField } from "@/components/star-field";

export default function UserDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "commissions", label: "Minhas Comissões", icon: Wallet },
    { id: "leads", label: "Indicações", icon: Users },
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
                Painel Afiliado
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
                Olá, Afiliado!
              </h1>
              <p className="text-white/40">Aqui está o resumo dos seus ganhos e indicações de hoje.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Saldo Disponível", value: "Kz 145.000,00", icon: Wallet, color: "text-emerald-400" },
                { title: "Vendas Concluídas", value: "12", icon: Briefcase, color: "text-blue-400" },
                { title: "Taxa de Conversão", value: "18.5%", icon: TrendingUp, color: "text-purple-400" },
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
                  <CardTitle className="text-lg font-semibold">Vendas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { id: 1, type: "Website Profissional", value: "40.000", time: "Há 2 horas" },
                      { id: 2, type: "Website Essencial", value: "20.000", time: "Há 5 horas" },
                      { id: 3, type: "Website Premium", value: "70.000", time: "Ontem" },
                      { id: 4, type: "Website Profissional", value: "40.000", time: "Há 2 dias" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center gap-4 group cursor-pointer" data-testid={`row-activity-${item.id}`}>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.type}</div>
                          <div className="text-xs text-white/40">{item.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">Kz {item.value},00</div>
                          <div className="text-[10px] text-emerald-400/80 bg-emerald-400/5 px-2 py-0.5 rounded-full border border-emerald-400/10 inline-block">
                            Comissão
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Seu Link de Afiliado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg break-all text-xs font-mono text-white/60">
                    afiliados.ao/ref/usuario_123
                  </div>
                  <button 
                    className="w-full py-3 px-4 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-all duration-300"
                    data-testid="button-copy-link"
                  >
                    Copiar Link
                  </button>
                  
                  <div className="pt-4 border-t border-white/5">
                    <div className="text-xs text-white/40 mb-3">Dica para vender mais:</div>
                    <p className="text-xs text-white/60 leading-relaxed italic">
                      "Foque em empresas que ainda não possuem site ou que têm sites antigos e não responsivos."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
