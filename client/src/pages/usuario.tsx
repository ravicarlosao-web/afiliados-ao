import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, User, Settings, Wallet, Bell, LogOut, ChevronRight, 
  BarChart3, TrendingUp, DollarSign, Users, Briefcase, Plus, Search,
  Target, Award, CreditCard, History, ShieldCheck, FileText, CheckCircle2,
  Clock, AlertCircle, XCircle, Sparkles, Image as ImageIcon, MessageSquare, 
  Trophy, Lightbulb, Globe, Lock, BellOff, Share2, Copy
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "wallet", label: "Carteira & Saque", icon: Wallet },
    { id: "clients", label: "Meus Clientes", icon: Users },
    { id: "materials", label: "Materiais de Venda", icon: ImageIcon },
    { id: "ai-tips", label: "Central de Dicas", icon: Sparkles },
    { id: "goals", label: "Minhas Metas", icon: Trophy },
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const [clients, setClients] = useState([
    { id: 1, name: "Tech Solutions", contact: "+244 923 000 000", type: "Profissional", status: "Pagamento feito", color: "bg-emerald-500" },
    { id: 2, name: "Restaurante Girassol", contact: "+244 912 000 000", type: "Essencial", status: "Em contacto", color: "bg-blue-500" },
    { id: 3, name: "Consultoria ABC", contact: "+244 931 000 000", type: "Premium", status: "Em análise", color: "bg-amber-500" },
  ]);

  const notifications = [
    { id: 1, title: "Comissão Liberada!", description: "Sua comissão de Kz 40.000 da Tech Solutions está disponível.", type: "success", icon: CheckCircle2, time: "Há 5 min" },
    { id: 2, title: "Cliente Reprovado", description: "O cliente Restaurante Girassol foi reprovado por contacto inválido.", type: "error", icon: XCircle, time: "Há 1 hora" },
    { id: 3, title: "Dica de Conversão", description: "Clientes que recebem follow-up em 24h convertem 30% mais.", type: "ai", icon: Lightbulb, time: "Há 3 horas" },
    { id: 4, title: "Nova Campanha", description: "Promoção de Verão: Sites Profissionais com 20% de desconto.", type: "info", icon: Sparkles, time: "Ontem" },
  ];

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("afiliados.ao/ref/usuario_123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                { title: "Saldo Disponível", value: "Kz 145.000", icon: Wallet, color: "text-purple-400", action: true },
                { title: "Status do Afiliado", value: "Ativo", icon: Award, color: "text-amber-400", sub: "Próximo nível: Top Afiliado" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white/60">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      {stat.action && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => setActiveItem("wallet")}
                        >
                          Sacar
                        </Button>
                      )}
                    </div>
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
                  <Button 
                    onClick={handleCopy}
                    className={`w-full font-bold transition-all duration-300 ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Copiado!</span>
                    ) : (
                      <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar Link</span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "wallet":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Minha Carteira</h1>
                <p className="text-white/40">Gerencie seus ganhos e solicite pagamentos.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">Saldo Disponível</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Kz 145.000,00</div>
                  <p className="text-[10px] text-emerald-400 mt-1">Pronto para saque</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">Aguardando Liberação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Kz 35.000,00</div>
                  <p className="text-[10px] text-white/20 mt-1">Libera em 7 dias</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">Total Sacado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Kz 890.000,00</div>
                  <p className="text-[10px] text-white/20 mt-1">Desde o início</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Solicitar Saque
                  </CardTitle>
                  <CardDescription>O valor será transferido para sua conta cadastrada.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Valor do Saque (Kz)</Label>
                    <Input type="number" placeholder="Mínimo Kz 5.000" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Recebimento</Label>
                    <Select defaultValue="iban">
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/10 text-white">
                        <SelectItem value="iban">Transferência IBAN</SelectItem>
                        <SelectItem value="unitel-money">Unitel Money</SelectItem>
                        <SelectItem value="afrimoney">Afrimoney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                    <p className="text-xs text-emerald-400 leading-relaxed">
                      Sua conta IBAN cadastrada termina em **...4590**. O prazo de processamento é de até 48h úteis.
                    </p>
                  </div>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 shadow-lg shadow-emerald-500/20">
                    Confirmar Solicitação de Saque
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Histórico de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { id: 1, date: "12 Fev, 2026", amount: "45.000", status: "Pago", type: "IBAN" },
                      { id: 2, date: "05 Fev, 2026", amount: "120.000", status: "Pago", type: "Unitel Money" },
                      { id: 3, date: "28 Jan, 2026", amount: "30.000", status: "Pago", type: "IBAN" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <History className="w-4 h-4 text-white/40" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.date}</div>
                            <div className="text-[10px] text-white/40">{item.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">Kz {item.amount}</div>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[10px] h-5 px-2">Sucesso</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
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
      case "materials":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Materiais de Venda</h1>
              <p className="text-white/40">Tudo o que você precisa para convencer seus clientes.</p>
            </div>

            <Tabs defaultValue="copy" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1">
                <TabsTrigger value="copy" className="data-[state=active]:bg-white/10">Textos Prontos</TabsTrigger>
                <TabsTrigger value="creative" className="data-[state=active]:bg-white/10">Criativos/Imagens</TabsTrigger>
                <TabsTrigger value="pitch" className="data-[state=active]:bg-white/10">Argumentos & Pitch</TabsTrigger>
              </TabsList>

              <TabsContent value="copy" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Abordagem WhatsApp", text: "Olá! Notei que sua empresa ainda não tem um site profissional. Posso te mostrar como isso está te fazendo perder vendas?" },
                    { title: "Follow-up", text: "Oi! Passando para lembrar da nossa conversa sobre o site. O desconto que te falei expira amanhã!" },
                  ].map((item, i) => (
                    <Card key={i} className="bg-white/5 border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs text-white/60 bg-black/40 p-3 rounded border border-white/5 italic">"{item.text}"</p>
                        <Button variant="outline" size="sm" className="w-full border-white/10 gap-2">
                          <Copy className="w-3 h-3" /> Copiar Texto
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="creative" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[9/16] rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="bg-white text-black font-bold">Baixar</Button>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pitch" className="mt-6 space-y-6">
                 <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      Pitch de 30 Segundos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-white/80 leading-relaxed">
                      "Eu ajudo empresas em Angola a terem presença profissional na internet com sites que realmente vendem. Em vez de apenas uma rede social, você terá uma vitrine 24h que passa confiança e automatiza seu atendimento."
                    </p>
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xs font-bold uppercase text-white/40 mb-3">Argumentos Matadores:</h4>
                      <ul className="space-y-2">
                        {["Sua empresa aberta 24h", "Mais confiança que o Instagram", "E-mails profissionais", "Apareça no Google"].map((arg, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {arg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
      case "ai-tips":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Central de Dicas IA</h1>
              <p className="text-white/40">Insights gerados para aumentar suas conversões.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Empresas sem site", description: "Empresas sem site fecham 40% menos vendas. Foque nisso!", icon: Target, color: "text-red-400" },
                { title: "Nicho em Alta", description: "Salões de beleza e clínicas convertem muito bem esta semana.", icon: TrendingUp, color: "text-emerald-400" },
                { title: "Status WhatsApp", description: "Use o WhatsApp Status para divulgar provas sociais e depoimentos.", icon: MessageSquare, color: "text-blue-400" },
                { title: "Follow-up", description: "Tente recontatar leads parados há 48h com uma nova oferta.", icon: History, color: "text-amber-400" },
                { title: "Confiança", description: "Envie seu link de afiliado junto com o portfólio da agência.", icon: ShieldCheck, color: "text-purple-400" },
                { title: "Público Alvo", description: "Foque em pequenos negócios que acabaram de abrir conta no Instagram.", icon: Search, color: "text-blue-400" },
              ].map((tip, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer group">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold">{tip.title}</CardTitle>
                    <tip.icon className={`w-4 h-4 ${tip.color} group-hover:scale-110 transition-transform`} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-white/60 leading-relaxed">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "goals":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Minhas Metas</h1>
              <p className="text-white/40">Alcance níveis de faturação e ganhe suas placas de reconhecimento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  target: "1.000.000", 
                  label: "Placa de Bronze", 
                  current: 1000000, 
                  progress: 100, 
                  color: "from-orange-400 to-orange-700",
                  icon: Award,
                  status: "Concluído",
                  date: "Alcançado em Jan 2026"
                },
                { 
                  target: "5.000.000", 
                  label: "Placa de Prata", 
                  current: 1450000, 
                  progress: 29, 
                  color: "from-slate-300 to-slate-500",
                  icon: Trophy,
                  status: "Em progresso",
                  needed: "Falta Kz 3.550.000"
                },
                { 
                  target: "10.000.000", 
                  label: "Placa de Ouro", 
                  current: 1450000, 
                  progress: 14.5, 
                  color: "from-amber-200 to-amber-500",
                  icon: Sparkles,
                  status: "Bloqueado",
                  needed: "Falta Kz 8.550.000"
                },
              ].map((goal, i) => (
                <Card key={i} className="bg-white/5 border-white/10 overflow-hidden group hover:bg-white/[0.08] transition-all duration-500">
                  <div className={`h-48 bg-gradient-to-br ${goal.color} relative flex items-center justify-center p-8 overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    
                    {/* Trophy/Badge Visual */}
                    <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl opacity-50" />
                      <div className="relative w-24 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm shadow-2xl flex flex-col items-center justify-center text-center p-2">
                         <goal.icon className="w-10 h-10 mb-2" />
                         <p className="text-[10px] font-bold uppercase tracking-tighter leading-none">{goal.label}</p>
                         <p className="text-[8px] mt-1 opacity-60">Kz {goal.target}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Meta de Faturação</p>
                        <h3 className="text-xl font-bold">Kz {goal.target}</h3>
                      </div>
                      <Badge variant={goal.progress === 100 ? "default" : "secondary"} className={goal.progress === 100 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-white/5"}>
                        {goal.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-medium">
                        <span className="text-white/40">{goal.progress}% concluído</span>
                        <span className={goal.progress === 100 ? "text-emerald-400" : "text-white/60"}>
                          {goal.progress === 100 ? "Meta Batida!" : goal.needed}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-1.5 bg-white/5" />
                    </div>

                    {goal.date && (
                      <p className="text-[10px] text-emerald-400/60 italic flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {goal.date}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Como funcionam as Placas?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/60 space-y-2">
                <p>Ao atingir cada marco de faturação total (comissões acumuladas), você recebe uma placa física e digital exclusiva de reconhecimento.</p>
                <p>• <strong>Placa de Bronze:</strong> Kz 1.000.000 em comissões.</p>
                <p>• <strong>Placa de Prata:</strong> Kz 5.000.000 em comissões.</p>
                <p>• <strong>Placa de Ouro:</strong> Kz 10.000.000 em comissões.</p>
              </CardContent>
            </Card>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Notificações</h1>
                <p className="text-white/40">Fique por dentro de tudo o que acontece.</p>
              </div>
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white">Marcar todas como lidas</Button>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-6 flex gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                        notif.type === 'error' ? 'bg-red-500/10 text-red-400' :
                        notif.type === 'ai' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        <notif.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold group-hover:text-white transition-colors">{notif.title}</h4>
                          <span className="text-[10px] text-white/40">{notif.time}</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">{notif.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Configurações</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" /> Preferências Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Idioma do Painel</Label>
                    <Select defaultValue="pt">
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/10 text-white">
                        <SelectItem value="pt">Português (Angola)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por Email</Label>
                      <p className="text-[10px] text-white/40">Receba resumos de vendas por e-mail.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações Push</Label>
                      <p className="text-[10px] text-white/40">Alertas em tempo real no navegador.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" /> Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Senha Atual</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input type="password" placeholder="Mínimo 8 caracteres" className="bg-white/5 border-white/10" />
                  </div>
                  <Button className="w-full bg-white text-black font-bold">Atualizar Senha</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Meu Perfil</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
                  <div className="h-32 bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-emerald-400/10 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  </div>
                  <CardContent className="relative pt-0 px-6 pb-6">
                    <div className="flex flex-col items-center -mt-16 gap-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                        <div className="relative w-32 h-32 rounded-2xl bg-black border-4 border-black overflow-hidden flex items-center justify-center">
                          <User className="w-16 h-16 text-white/20" />
                          <div className="absolute inset-0 bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Plus className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                          Afiliado Principal
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                          <Badge className="bg-amber-400/10 text-amber-400 border-amber-400/20 hover:bg-amber-400/20 font-bold px-3 py-1">
                            Nível: Ativo
                          </Badge>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">Membro desde Fev 2026</span>
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Vendas</p>
                          <p className="text-lg font-bold">48</p>
                        </div>
                        <div className="text-center border-l border-white/5">
                          <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Leads</p>
                          <p className="text-lg font-bold">124</p>
                        </div>
                      </div>
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
                        <Input defaultValue="AO06 0000 0000 0000 0000 0" className="bg-white/5 border-white/10 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label>Multicaixa Express</Label>
                        <Input defaultValue="923 000 000" className="bg-white/5 border-white/10 text-white" />
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
                <SidebarMenu className="gap-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveItem(item.id)}
                        isActive={activeItem === item.id}
                        className={`w-full flex items-center gap-4 px-5 py-5 rounded-xl transition-all duration-300 ${
                          activeItem === item.id 
                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                        data-testid={`button-nav-${item.id}`}
                      >
                        <item.icon className={`w-6 h-6 shrink-0 ${activeItem === item.id ? "text-white" : "text-white/40"}`} />
                        <span className="font-semibold text-base lg:text-lg truncate">{item.label}</span>
                        {activeItem === item.id && <ChevronRight className="ml-auto w-5 h-5 shrink-0 opacity-50" />}
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
          <div className="mt-auto p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-4 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all duration-300"
              data-testid="button-user-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Sair</span>
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
