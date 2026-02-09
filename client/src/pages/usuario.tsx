import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, User, Settings, Wallet, Bell, LogOut, ChevronRight, 
  BarChart3, TrendingUp, DollarSign, Users, Briefcase, Plus, Search,
  Target, Award, CreditCard, History, ShieldCheck, FileText, CheckCircle2,
  Clock, AlertCircle, XCircle
} from "lucide-react";
import { StarField } from "@/components/star-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "clients", label: "Meus Clientes", icon: Users },
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "commissions", label: "Minhas Comissões", icon: Wallet },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const [clients, setClients] = useState([
    { id: 1, name: "Tech Solutions", contact: "+244 923 000 000", type: "Profissional", status: "Pagamento feito", color: "bg-emerald-500" },
    { id: 2, name: "Restaurante Girassol", contact: "+244 912 000 000", type: "Essencial", status: "Em contacto", color: "bg-blue-500" },
    { id: 3, name: "Consultoria ABC", contact: "+244 931 000 000", type: "Premium", status: "Em análise", color: "bg-amber-500" },
  ]);

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                Olá, Afiliado!
              </h1>
              <p className="text-white/40">Aqui está o resumo dos seus ganhos e indicações de hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Vendas Hoje", value: "3", icon: Briefcase, color: "text-blue-400" },
                { title: "Comissão Hoje", value: "Kz 45.000", icon: DollarSign, color: "text-emerald-400" },
                { title: "Saldo Disponível", value: "Kz 145.000", icon: Wallet, color: "text-purple-400" },
                { title: "Status do Afiliado", value: "Ativo", icon: Award, color: "text-amber-400", sub: "Próximo nível: Top Afiliado" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white/60">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.sub && <p className="text-[10px] text-white/40 mt-1">{stat.sub}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    Meta Semanal
                  </CardTitle>
                  <span className="text-sm font-medium text-white/60">68% concluído</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={68} className="h-2 bg-white/5" />
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-white/40">Meta: Kz 50.000</span>
                  <span className="text-emerald-400">Falta: Kz 12.000</span>
                </div>
              </CardContent>
            </Card>

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
                    ].map((item) => (
                      <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.type}</div>
                          <div className="text-xs text-white/40">{item.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">Kz {item.value},00</div>
                          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-400/20 bg-emerald-400/5">Comissão</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Seu Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg break-all text-xs font-mono text-white/60">
                    afiliados.ao/ref/usuario_123
                  </div>
                  <Button className="w-full bg-white text-black hover:bg-white/90 font-bold">Copiar Link</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "clients":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Meus Clientes</h1>
                <p className="text-white/40">Gerencie suas indicações e acompanhe o status.</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2">
                    <Plus className="w-4 h-4" /> Adicionar Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#121212] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Novo Cliente</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome da Empresa / Pessoa</Label>
                      <Input placeholder="Ex: Tech Solutions" className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contacto (WhatsApp)</Label>
                      <Input placeholder="+244" className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Site</Label>
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121212] border-white/10 text-white">
                          <SelectItem value="essencial">Essencial</SelectItem>
                          <SelectItem value="profissional">Profissional</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-white text-black hover:bg-white/90">Salvar Cliente</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Em análise", count: 2, icon: Clock, color: "text-amber-400" },
                { label: "Em contacto", count: 5, icon: History, color: "text-blue-400" },
                { label: "Pagamento feito", count: 12, icon: CheckCircle2, color: "text-emerald-400" },
                { label: "Reprovado", count: 1, icon: XCircle, color: "text-red-400" },
              ].map((s, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40">{s.label}</p>
                      <p className="text-xl font-bold">{s.count}</p>
                    </div>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input placeholder="Buscar cliente..." className="pl-10 bg-white/5 border-white/10" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40">
                        <th className="pb-4 font-medium">Nome</th>
                        <th className="pb-4 font-medium">Plano</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Comissão Prevista</th>
                        <th className="pb-4 font-medium text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {clients.map((client) => (
                        <tr key={client.id} className="group hover:bg-white/[0.02]">
                          <td className="py-4">
                            <p className="font-medium text-white/90">{client.name}</p>
                            <p className="text-xs text-white/40">{client.contact}</p>
                          </td>
                          <td className="py-4">
                            <Badge variant="secondary" className="bg-white/5 border-white/10">{client.type}</Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${client.color}`} />
                              <span className="text-xs">{client.status}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-bold">Kz 25.000</span>
                          </td>
                          <td className="py-4 text-right">
                            <Button variant="ghost" size="sm" className="hover:bg-white/5">Ver Detalhes</Button>
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
      case "profile":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Meu Perfil</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
                  <CardContent className="relative pt-0">
                    <div className="absolute -top-12 left-6">
                      <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl border-4 border-[#080808] flex items-center justify-center">
                        <User className="w-12 h-12 text-white/40" />
                      </div>
                    </div>
                    <div className="mt-14 space-y-1">
                      <h2 className="text-xl font-bold">Afiliado Principal</h2>
                      <p className="text-sm text-white/40">Membro desde Fev 2026</p>
                      <Badge className="bg-amber-400 text-black hover:bg-amber-500 font-bold mt-2">Nível: Ativo</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm">Ganhos Totais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">Kz 1.450.000</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12% este mês</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      Dados de Pagamento
                    </CardTitle>
                    <CardDescription>Onde você receberá suas comissões.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>IBAN</Label>
                        <Input defaultValue="AO06 0000 0000 0000 0000 0" className="bg-white/5 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Multicaixa Express</Label>
                        <Input defaultValue="923 000 000" className="bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <Button className="bg-white text-black hover:bg-white/90">Atualizar Dados</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      Verificação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-white/40" />
                        <div>
                          <p className="text-sm font-medium">Documento de Identidade</p>
                          <p className="text-xs text-white/40">Aumente sua credibilidade</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">Enviar Doc</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-white/40 italic">Funcionalidade em desenvolvimento...</p>
          </div>
        );
    }
  };

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
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
