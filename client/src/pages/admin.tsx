import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  LineChart, 
  DollarSign,
  TrendingUp,
  History,
  CheckCircle2,
  Clock,
  Briefcase,
  FileText,
  Plus,
  Search,
  ArrowUpRight,
  UserCheck,
  Filter,
  MoreVertical,
  Download,
  Eye,
  Lock,
  Ban,
  Receipt,
  Target,
  Percent,
  Megaphone,
  Layout,
  Shield,
  Bell,
  MessageSquare,
  Image as ImageIcon,
  Zap,
  Globe,
  Mail,
  Smartphone,
  XCircle
} from "lucide-react";
import { StarField } from "@/components/star-field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: ShieldCheck },
    { id: "affiliates", label: "Afiliados", icon: Users },
    { id: "clients", label: "Clientes Globais", icon: UserCheck },
    { id: "payments", label: "Pagamentos", icon: DollarSign },
    { id: "commissions", label: "Comissões", icon: Percent },
    { id: "analytics", label: "Analíticos", icon: LineChart },
    { id: "notifications", label: "Notificações", icon: Megaphone },
    { id: "materials", label: "Materiais", icon: Layout },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                  Dashboard Executivo
                </h1>
                <p className="text-white/40">Visão estratégica da operação em tempo real.</p>
              </div>
              <Button variant="outline" className="bg-white/5 border-white/10 text-xs">
                <Download className="w-3 h-3 mr-2" /> Exportar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Afiliados Ativos", value: "1,284", growth: "+12%", icon: Users, color: "text-blue-400" },
                { title: "Volume Total", value: "Kz 12.4M", growth: "+24%", icon: Briefcase, color: "text-emerald-400" },
                { title: "Comissão Paga", value: "Kz 3.1M", growth: "+18%", icon: Receipt, color: "text-purple-400" },
                { title: "Comissão Pendente", value: "Kz 845k", growth: "-5%", icon: Clock, color: "text-amber-400" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs font-bold ${stat.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.growth}
                      </span>
                      <span className="text-[10px] text-white/20 ml-1">vs mês anterior</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Performance de Vendas</CardTitle>
                    <CardDescription className="text-xs text-white/40">Ticket Médio: Kz 45.000,00</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400">Conversão Global: 3.2%</Badge>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] flex items-end gap-2 px-2 pb-2 border-b border-white/5">
                    {[30, 45, 60, 40, 85, 70, 95, 65, 80, 50, 40, 90].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-red-500/10 to-red-400/50 rounded-t-sm transition-all duration-500" 
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-white/40 uppercase font-bold px-2">
                    <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      Top 5 Semana
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "João Silva", sales: "Kz 1.2M", rank: 1 },
                      { name: "Maria Santos", sales: "Kz 840k", rank: 2 },
                      { name: "Pedro Costa", sales: "Kz 620k", rank: 3 },
                      { name: "Ana Benguela", sales: "Kz 590k", rank: 4 },
                      { name: "Lucas Malanje", sales: "Kz 410k", rank: 5 },
                    ].map((af, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white/20 w-4">{af.rank}.</span>
                          <span className="text-xs font-medium text-white/80 group-hover:text-white">{af.name}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">{af.sales}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> Alerta Crítico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-white/60 leading-relaxed">
                      12 solicitações de saque ultrapassaram 48h.
                    </p>
                    <Button size="sm" className="w-full mt-3 bg-red-500 hover:bg-red-600 text-[10px] h-7">Resolver Agora</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case "affiliates":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Gestão de Afiliados</h1>
                <p className="text-white/40">Controle total da rede de parceiros.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/5 border-white/10"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
                <Button className="bg-red-500 hover:bg-red-600 font-bold"><Plus className="w-4 h-4 mr-2" /> Novo Afiliado</Button>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input placeholder="Buscar por nome, email ou ID..." className="pl-10 bg-white/5 border-white/10" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40 text-[10px] uppercase tracking-widest">
                        <th className="pb-4 font-bold">Afiliado</th>
                        <th className="pb-4 font-bold text-center">Nível</th>
                        <th className="pb-4 font-bold text-center">Vendas</th>
                        <th className="pb-4 font-bold text-center">Conv.</th>
                        <th className="pb-4 font-bold">Comissões (Total/Paga)</th>
                        <th className="pb-4 font-bold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { id: 1, name: "João Silva", level: "Elite", sales: 142, conv: "4.8%", total: "Kz 1.2M", paid: "Kz 1M", status: "Ativo" },
                        { id: 2, name: "Maria Santos", level: "Pro", sales: 84, conv: "3.2%", total: "Kz 840k", paid: "Kz 800k", status: "Ativo" },
                        { id: 3, name: "Pedro Costa", level: "Iniciante", sales: 12, conv: "1.5%", total: "Kz 45k", paid: "Kz 0", status: "Pendente" },
                      ].map((af) => (
                        <tr key={af.id} className="group hover:bg-white/[0.02]">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold border border-white/10">JS</div>
                              <div>
                                <p className="font-bold text-white/90 text-xs">{af.name}</p>
                                <p className="text-[10px] text-white/20">ID: #AFF-{af.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <Badge variant="outline" className={`text-[10px] h-5 px-2 ${af.level === 'Elite' ? 'border-amber-500/20 text-amber-400' : 'border-blue-500/20 text-blue-400'}`}>
                              {af.level}
                            </Badge>
                          </td>
                          <td className="py-4 text-center font-mono text-xs text-white/60">{af.sales}</td>
                          <td className="py-4 text-center font-mono text-xs text-white/60">{af.conv}</td>
                          <td className="py-4">
                            <p className="text-xs font-bold text-white/90">{af.total}</p>
                            <p className="text-[10px] text-emerald-400">Paga: {af.paid}</p>
                          </td>
                          <td className="py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                                <DropdownMenuItem className="gap-2 text-xs"><TrendingUp className="w-3.5 h-3.5" /> Editar Comissão %</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-xs"><Eye className="w-3.5 h-3.5" /> Ver Clientes</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-xs"><History className="w-3.5 h-3.5" /> Atividades</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-xs"><Lock className="w-3.5 h-3.5" /> Resetar Senha</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-xs text-red-400"><Ban className="w-3.5 h-3.5" /> Bloquear</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      case "commissions":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Regras de Comissões</h1>
              <p className="text-white/40">Defina as percentagens e bónus do sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Comissão Padrão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Percentagem Base (%)</Label>
                    <div className="flex gap-2">
                      <Input defaultValue="30" className="bg-white/5 border-white/10" />
                      <Button className="bg-white text-black font-bold">Salvar</Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Por Plano</h4>
                    <div className="space-y-3">
                      {["Essencial", "Profissional", "Premium"].map((plano) => (
                        <div key={plano} className="flex items-center justify-between">
                          <span className="text-xs text-white/60">{plano}</span>
                          <Input className="w-20 h-8 bg-white/5 border-white/10 text-center text-xs" defaultValue="30" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Incentivos Extras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Comissão Extra Temporária</p>
                        <p className="text-[10px] text-white/40">+5% em todos os planos este fim de semana</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Bónus por Volume</p>
                        <p className="text-[10px] text-white/40">Kz 50.000 bónus para cada 10 vendas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/10 text-xs gap-2">
                    <Plus className="w-3 h-3" /> Criar Campanha de Incentivo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Inteligência de Negócio</h1>
              <p className="text-white/40">Análise profunda de tendências e comportamentos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xs uppercase tracking-widest text-white/40 font-bold">Plano Mais Vendido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Profissional</div>
                  <p className="text-[10px] text-emerald-400">48% do total de vendas</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xs uppercase tracking-widest text-white/40 font-bold">Tempo Médio Fechamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">1.4 dias</div>
                  <p className="text-[10px] text-white/20">Desde o registo do lead</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xs uppercase tracking-widest text-white/40 font-bold">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Kz 84.200</div>
                  <p className="text-[10px] text-emerald-400">+12% este mês</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Canais que Mais Convertem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { channel: "WhatsApp Status", percentage: 45, color: "bg-emerald-500" },
                  { channel: "Instagram DM", percentage: 28, color: "bg-purple-500" },
                  { channel: "Indicação Direta", percentage: 15, color: "bg-blue-500" },
                  { channel: "Facebook Ads", percentage: 12, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.channel} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>{item.channel}</span>
                      <span className="font-bold">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Notificações Globais</h1>
                <p className="text-white/40">Comunique-se diretamente com todos os seus afiliados.</p>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Nova Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs">Título da Notificação</Label>
                  <Input placeholder="Ex: Comissão do Premium a 45%!" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Corpo da Mensagem</Label>
                  <textarea className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/50" placeholder="Escreva o aviso para os afiliados..." />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="push" />
                    <Label htmlFor="push" className="text-xs">Push App</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="wa" />
                    <Label htmlFor="wa" className="text-xs">WhatsApp</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="dash" defaultChecked />
                    <Label htmlFor="dash" className="text-xs">Painel</Label>
                  </div>
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-600 font-bold gap-2">
                  <Megaphone className="w-4 h-4" /> Disparar Notificação
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "materials":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Materiais & Campanhas</h1>
                <p className="text-white/40">Gestão de ativos para os afiliados venderem mais.</p>
              </div>
              <Button className="bg-white text-black font-bold gap-2"><Plus className="w-4 h-4" /> Adicionar Ativo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" /> Scripts & Textos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Abordagem Inicial WhatsApp", type: "Copy" },
                    { title: "Quebra de Objeção: Preço", type: "Script" },
                    { title: "Fechamento Matador", type: "Copy" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded bg-black/40 border border-white/5">
                      <div>
                        <p className="text-xs font-bold">{item.title}</p>
                        <p className="text-[10px] text-white/20">{item.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreVertical className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" /> Criativos Visuais
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded flex items-center justify-center relative group">
                      <ImageIcon className="w-4 h-4 text-white/10" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><XCircle className="w-3 h-3 text-red-400" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Segurança & Logs</h1>
              <p className="text-white/40">Monitoramento de integridade e auditoria do sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase text-white/40">Tentativas Bloqueadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">42</div>
                </CardContent>
              </Card>
              {/* More quick stats... */}
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Admin Login", user: "Admin #1", ip: "192.168.1.1", time: "Há 2 min", status: "success" },
                    { action: "Alteração de Comissão", user: "Admin #1", ip: "192.168.1.1", time: "Há 15 min", status: "warning" },
                    { action: "Tentativa de Login Falhou", user: "Desconhecido", ip: "45.12.89.1", time: "Há 45 min", status: "error" },
                    { action: "Aprovação de Saque", user: "Admin #2", ip: "192.168.1.12", time: "Há 1h", status: "success" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-xs font-bold">{log.action}</p>
                          <p className="text-[10px] text-white/20">{log.user} • {log.ip}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Configurações Gerais</h1>
              <p className="text-white/40">Parâmetros globais do ecossistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Smartphone className="w-4 h-4 text-emerald-400" /> Configurações de Planos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Plano Essencial</Label>
                      <Input defaultValue="Kz 65.000" className="bg-white/5 border-white/10 h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Plano Premium</Label>
                      <Input defaultValue="Kz 280.000" className="bg-white/5 border-white/10 h-9" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Tempo Mínimo para Saque (Dias)</Label>
                      <Input defaultValue="7" className="w-20 bg-white/5 border-white/10 h-8 text-center" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Limite Mínimo de Saque (Kz)</Label>
                      <Input defaultValue="10.000" className="w-32 bg-white/5 border-white/10 h-8 text-center" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Integrações & SMTP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold">API WhatsApp</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 h-5">Conectado</Badge>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold">SMTP Email</span>
                      </div>
                      <Badge variant="outline" className="text-white/20 h-5">Desconectado</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-white text-black font-bold h-9">Configurar Credenciais</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "clients":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Clientes Globais</h1>
                <p className="text-white/40">Monitoramento centralizado de todas as indicações.</p>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input placeholder="Buscar cliente ou afiliado..." className="pl-10 bg-white/5 border-white/10" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-xs h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white">
                    <SelectItem value="active">Pagamento Feito</SelectItem>
                    <SelectItem value="pending">Em Análise</SelectItem>
                    <SelectItem value="contact">Em Contacto</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40 text-[10px] uppercase tracking-widest">
                        <th className="pb-4 font-bold">Cliente</th>
                        <th className="pb-4 font-bold">Indicado por</th>
                        <th className="pb-4 font-bold">Plano / Valor</th>
                        <th className="pb-4 font-bold">Comissão</th>
                        <th className="pb-4 font-bold text-center">Status</th>
                        <th className="pb-4 font-bold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { id: 1, name: "Tech Solutions", aff: "João Silva", plan: "Profissional", price: "Kz 145.000", com: "Kz 43.500", status: "Pago" },
                        { id: 2, name: "Restaurante Girassol", aff: "Maria Santos", plan: "Essencial", price: "Kz 65.000", com: "Kz 19.500", status: "Análise" },
                        { id: 3, name: "Consultoria ABC", aff: "João Silva", plan: "Premium", price: "Kz 280.000", com: "Kz 84.000", status: "Contacto" },
                      ].map((cl) => (
                        <tr key={cl.id} className="group hover:bg-white/[0.02]">
                          <td className="py-4">
                            <p className="font-bold text-white/90 text-xs">{cl.name}</p>
                            <p className="text-[10px] text-white/20">Registado há 2 dias</p>
                          </td>
                          <td className="py-4 text-white/60 text-xs font-medium">{cl.aff}</td>
                          <td className="py-4">
                            <p className="text-xs font-bold">{cl.plan}</p>
                            <p className="text-[10px] text-white/40">{cl.price}</p>
                          </td>
                          <td className="py-4 font-bold text-emerald-400 text-xs">{cl.com}</td>
                          <td className="py-4 text-center">
                            <Badge className={`text-[9px] px-2 h-5 rounded-full ${cl.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : cl.status === 'Análise' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                              {cl.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-[10px] h-7">Histórico</Button>
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
      case "payments":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Fluxo de Pagamentos</h1>
              <p className="text-white/40">Gestão financeira de recebimentos e saques.</p>
            </div>

            <Tabs defaultValue="client-payments" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 h-11 p-1">
                <TabsTrigger value="client-payments" className="gap-2 data-[state=active]:bg-white/10 text-xs font-bold uppercase tracking-wider">
                  <Receipt className="w-4 h-4" /> Pagamentos Clientes
                </TabsTrigger>
                <TabsTrigger value="affiliate-payouts" className="gap-2 data-[state=active]:bg-white/10 text-xs font-bold uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" /> Pagamentos Comissão
                </TabsTrigger>
              </TabsList>

              <TabsContent value="client-payments" className="mt-6 space-y-4">
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Comprovativos Pendentes</h3>
                  </div>
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10">
                          <FileText className="w-5 h-5 text-white/20" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Empresa XYZ Ltda</p>
                          <p className="text-[10px] text-white/40">Transferência • Kz 145.000,00</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-[10px] h-8 border-white/10">Ver Prova</Button>
                        <Button size="sm" variant="ghost" className="text-[10px] h-8 text-red-400 hover:bg-red-400/10">Reprovar</Button>
                        <Button size="sm" className="text-[10px] h-8 bg-emerald-500 hover:bg-emerald-600">Aprovar</Button>
                      </div>
                    </div>
                  ))}
                </Card>
              </TabsContent>

              <TabsContent value="affiliate-payouts" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Solicitações Ativas", value: "12", sub: "Kz 450.000" },
                    { label: "Total Pago", value: "Kz 8.4M", sub: "Mês corrente" },
                    { label: "Saldo em Reserva", value: "Kz 2.1M", sub: "Comissões futuras" },
                  ].map((s, i) => (
                    <Card key={i} className="bg-white/5 border-white/10">
                      <CardContent className="pt-6">
                        <p className="text-[10px] font-bold text-white/40 uppercase mb-1">{s.label}</p>
                        <p className="text-xl font-bold">{s.value}</p>
                        <p className="text-[10px] text-emerald-400/60 font-bold">{s.sub}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-white/5 border-white/10 overflow-hidden">
                   <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Solicitações de Saque</h3>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-[10px] font-bold text-red-400 border border-red-500/20">A</div>
                        <div>
                          <p className="text-xs font-bold">Afiliado #{i}92</p>
                          <p className="text-[10px] text-white/40">IBAN: AO06 0040 0000 {i}234 5678 9</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <span className="text-sm font-bold text-emerald-400">Kz 25.000,00</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-[10px] h-7 hover:text-red-400">Recusar</Button>
                          <Button size="sm" className="text-[10px] h-7 bg-white text-black hover:bg-white/90">Aprovar Saque</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[60vh] text-white/20 flex-col gap-4">
            <Settings className="w-12 h-12 animate-spin-slow" />
            <p className="font-mono text-sm uppercase tracking-widest">Em desenvolvimento...</p>
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
              <SidebarGroupLabel className="text-red-500/40 px-4 py-8 text-xs font-bold uppercase tracking-[0.4em] flex items-center gap-2 justify-center">
                <ShieldCheck className="w-5 h-5" />
                ADMIN
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-2">
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id} className="mb-1">
                      <SidebarMenuButton 
                        onClick={() => setActiveItem(item.id)}
                        isActive={activeItem === item.id}
                        className={`w-full flex items-center gap-3 px-4 py-6 rounded-lg transition-all duration-300 ${
                          activeItem === item.id 
                            ? "bg-red-500/10 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-red-500/20" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                        data-testid={`button-admin-nav-${item.id}`}
                      >
                        <item.icon className={`w-5 h-5 ${activeItem === item.id ? "text-red-400" : "text-white/40"}`} />
                        <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                        {activeItem === item.id && <ArrowUpRight className="ml-auto w-3 h-3 opacity-50" />}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-4 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all duration-300"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Logout</span>
            </button>
          </div>
        </Sidebar>

        <main className="flex-1 relative z-10 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}


