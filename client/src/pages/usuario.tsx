import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, User, Settings, Wallet, Bell, LogOut, ChevronRight,
  TrendingUp, DollarSign, Users, Briefcase, Plus, Search,
  Target, Award, CreditCard, History, ShieldCheck, FileText, CheckCircle2,
  Clock, XCircle, Sparkles, Image as ImageIcon, MessageSquare, 
  Trophy, Lightbulb, Globe, Lock, Copy
} from "lucide-react";
import { StarField } from "@/components/star-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function formatKz(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "Kz 0,00";
  return `Kz ${num.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Agora";
  if (mins < 60) return `Há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} dias`;
}

const planPrices: Record<string, { price: string; commission: string }> = {
  Essencial: { price: "130000", commission: "20000" },
  Profissional: { price: "250000", commission: "40000" },
  Premium: { price: "400000", commission: "70000" },
};

const statusColors: Record<string, string> = {
  em_analise: "bg-amber-500",
  em_contacto: "bg-blue-500",
  pagamento_feito: "bg-emerald-500",
  reprovado: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  em_analise: "Em análise",
  em_contacto: "Em contacto",
  pagamento_feito: "Pagamento feito",
  reprovado: "Reprovado",
};

const withdrawalStatusLabels: Record<string, string> = {
  pendente: "Pendente",
  processando: "Processando",
  pago: "Pago",
  recusado: "Recusado",
};

const withdrawalStatusColors: Record<string, string> = {
  pendente: "bg-amber-500/10 text-amber-400",
  processando: "bg-blue-500/10 text-blue-400",
  pago: "bg-emerald-500/10 text-emerald-400",
  recusado: "bg-red-500/10 text-red-400",
};

export default function UserDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { toast } = useToast();

  const { data: currentUser } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: myClients = [] } = useQuery<any[]>({
    queryKey: ["/api/user/clients"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: myWithdrawals = [] } = useQuery<any[]>({
    queryKey: ["/api/user/withdrawals"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: myNotifications = [] } = useQuery<any[]>({
    queryKey: ["/api/user/notifications"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: myMaterials = [] } = useQuery<any[]>({
    queryKey: ["/api/user/materials"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const paidClients = myClients.filter((c: any) => c.status === "pagamento_feito");
  const pendingClients = myClients.filter((c: any) => c.status === "em_analise" || c.status === "em_contacto");

  const totalEarned = paidClients.reduce((s: number, c: any) => s + parseFloat(c.commission || "0"), 0);
  const pendingCommission = pendingClients.reduce((s: number, c: any) => s + parseFloat(c.commission || "0"), 0);
  const totalWithdrawn = myWithdrawals
    .filter((w: any) => w.status === "pago")
    .reduce((s: number, w: any) => s + parseFloat(w.amount || "0"), 0);
  const pendingWithdrawals = myWithdrawals
    .filter((w: any) => w.status === "pendente" || w.status === "processando")
    .reduce((s: number, w: any) => s + parseFloat(w.amount || "0"), 0);
  const availableBalance = totalEarned - totalWithdrawn - pendingWithdrawals;

  const statusCounts = {
    em_analise: myClients.filter((c: any) => c.status === "em_analise").length,
    em_contacto: myClients.filter((c: any) => c.status === "em_contacto").length,
    pagamento_feito: paidClients.length,
    reprovado: myClients.filter((c: any) => c.status === "reprovado").length,
  };

  const goalBronze = 1000000;
  const goalSilver = 5000000;
  const goalGold = 10000000;

  const [newClientName, setNewClientName] = useState("");
  const [newClientContact, setNewClientContact] = useState("");
  const [newClientPlan, setNewClientPlan] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientContactPerson, setNewClientContactPerson] = useState("");
  const [newClientSocial, setNewClientSocial] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const createClientMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/user/clients", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/clients"] });
      toast({ title: "Cliente adicionado com sucesso!" });
      setNewClientName("");
      setNewClientContact("");
      setNewClientPlan("");
      setNewClientCompany("");
      setNewClientContactPerson("");
      setNewClientSocial("");
      setDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Erro ao adicionar cliente", variant: "destructive" });
    },
  });

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Transferência IBAN");
  const [withdrawAccount, setWithdrawAccount] = useState("");

  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/user/withdrawals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/withdrawals"] });
      toast({ title: "Solicitação de saque enviada!" });
      setWithdrawAmount("");
      setWithdrawAccount("");
    },
    onError: () => {
      toast({ title: "Erro ao solicitar saque", variant: "destructive" });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Perfil atualizado!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar perfil", variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/user/change-password", data);
    },
    onSuccess: () => {
      toast({ title: "Senha atualizada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: () => {
      toast({ title: "Erro ao alterar senha", variant: "destructive" });
    },
  });

  const [profileIban, setProfileIban] = useState("");
  const [profileMulticaixa, setProfileMulticaixa] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.clear();
    window.location.href = "/login";
  };

  const [copied, setCopied] = useState(false);
  const referralLink = currentUser?.referralCode ? `afiliados.ao/ref/${currentUser.referralCode}` : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "wallet", label: "Carteira & Saque", icon: Wallet },
    { id: "clients", label: "Meus Clientes", icon: Users },
    { id: "materials", label: "Materiais de Venda", icon: ImageIcon },
    { id: "goals", label: "Minhas Metas", icon: Trophy },
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                Olá, {currentUser?.name || "Afiliado"}!
              </h1>
              <p className="text-white/40 text-sm">Aqui está o resumo dos seus ganhos e indicações.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { title: "Total de Clientes", value: myClients.length.toString(), icon: Briefcase, color: "text-blue-400" },
                { title: "Comissões Ganhas", value: formatKz(totalEarned), icon: DollarSign, color: "text-emerald-400" },
                { title: "Saldo Disponível", value: formatKz(availableBalance), icon: Wallet, color: "text-purple-400", action: true },
                { title: "Status do Afiliado", value: currentUser?.isActive ? "Ativo" : "Inativo", icon: Award, color: "text-amber-400" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300" data-testid={`card-user-stat-${i}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                    <CardTitle className="text-[10px] sm:text-sm font-medium text-white/60">{stat.title}</CardTitle>
                    <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <div className="text-lg sm:text-2xl font-bold truncate">{stat.value}</div>
                      {stat.action && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => setActiveItem("wallet")}
                          data-testid="button-go-wallet"
                        >
                          Sacar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold">Indicações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {myClients.length === 0 ? (
                    <p className="text-xs text-white/40 text-center py-8">Nenhuma indicação registrada ainda. Adicione seu primeiro cliente!</p>
                  ) : (
                    <div className="space-y-6">
                      {myClients.slice(0, 5).map((client: any) => (
                        <div key={client.id} className="flex items-center gap-4 group" data-testid={`row-recent-client-${client.id}`}>
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white/80">{client.name}</div>
                            <div className="text-xs text-white/40">{client.plan} • {timeAgo(client.createdAt)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">{formatKz(client.commission)}</div>
                            <Badge className={`text-[10px] border-none h-5 px-2 ${
                              client.status === "pagamento_feito" ? "bg-emerald-500/10 text-emerald-400" :
                              client.status === "reprovado" ? "bg-red-500/10 text-red-400" :
                              "bg-amber-500/10 text-amber-400"
                            }`}>
                              {statusLabels[client.status] || client.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Seu Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg break-all text-xs font-mono text-white/60">
                    {referralLink || "Carregando..."}
                  </div>
                  <Button 
                    onClick={handleCopy}
                    className={`w-full font-bold transition-all duration-300 ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                    data-testid="button-copy-link"
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
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Minha Carteira</h1>
              <p className="text-white/40 text-sm">Gerencie seus ganhos e solicite pagamentos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-white/60">Saldo Disponível</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold" data-testid="text-available-balance">{formatKz(availableBalance)}</div>
                  <p className="text-[10px] text-emerald-400 mt-1">Pronto para saque</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-white/60">Aguardando Liberação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold" data-testid="text-pending-commission">{formatKz(pendingCommission)}</div>
                  <p className="text-[10px] text-white/20 mt-1">Clientes em análise/contacto</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-white/60">Total Sacado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold" data-testid="text-total-withdrawn">{formatKz(totalWithdrawn)}</div>
                  <p className="text-[10px] text-white/20 mt-1">Desde o início</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Solicitar Saque
                  </CardTitle>
                  <CardDescription>O valor será transferido para a conta informada.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Valor do Saque (Kz)</Label>
                    <Input
                      type="number"
                      placeholder="Mínimo Kz 5.000"
                      className="bg-white/5 border-white/10"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      data-testid="input-withdraw-amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Recebimento</Label>
                    <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                      <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-withdraw-method">
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/10 text-white">
                        <SelectItem value="Transferência IBAN">Transferência IBAN</SelectItem>
                        <SelectItem value="Unitel Money">Unitel Money</SelectItem>
                        <SelectItem value="Afrimoney">Afrimoney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Dados da Conta</Label>
                    <Input
                      placeholder="IBAN ou número de telefone"
                      className="bg-white/5 border-white/10"
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      data-testid="input-withdraw-account"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const amount = parseFloat(withdrawAmount);
                      if (!amount || amount < 5000) {
                        toast({ title: "O valor mínimo para saque é Kz 5.000", variant: "destructive" });
                        return;
                      }
                      if (amount > availableBalance) {
                        toast({ title: "Saldo insuficiente", variant: "destructive" });
                        return;
                      }
                      createWithdrawalMutation.mutate({
                        amount: withdrawAmount,
                        method: withdrawMethod,
                        accountInfo: withdrawAccount,
                      });
                    }}
                    disabled={createWithdrawalMutation.isPending}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 shadow-lg shadow-emerald-500/20"
                    data-testid="button-request-withdrawal"
                  >
                    {createWithdrawalMutation.isPending ? "Processando..." : "Confirmar Solicitação de Saque"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Histórico de Saques</CardTitle>
                </CardHeader>
                <CardContent>
                  {myWithdrawals.length === 0 ? (
                    <p className="text-xs text-white/40 text-center py-8">Nenhum saque realizado ainda.</p>
                  ) : (
                    <div className="space-y-6">
                      {myWithdrawals.map((w: any) => (
                        <div key={w.id} className="flex items-center justify-between group" data-testid={`row-withdrawal-${w.id}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                              <History className="w-4 h-4 text-white/40" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{new Date(w.createdAt).toLocaleDateString("pt-AO")}</div>
                              <div className="text-[10px] text-white/40">{w.method}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">{formatKz(w.amount)}</div>
                            <Badge className={`border-none text-[10px] h-5 px-2 ${withdrawalStatusColors[w.status] || ""}`}>
                              {withdrawalStatusLabels[w.status] || w.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "clients":
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Meus Clientes</h1>
                <p className="text-white/40 text-sm">Gerencie suas indicações e acompanhe o status.</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 w-full sm:w-auto" data-testid="button-add-client">
                    <Plus className="w-4 h-4" /> Adicionar Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#121212] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Cliente</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome da Empresa</Label>
                      <Input
                        placeholder="Ex: Tech Solutions"
                        className="bg-white/5 border-white/10"
                        value={newClientCompany}
                        onChange={(e) => setNewClientCompany(e.target.value)}
                        data-testid="input-client-company"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nome da Pessoa de Contacto</Label>
                      <Input
                        placeholder="Ex: João Silva"
                        className="bg-white/5 border-white/10"
                        value={newClientContactPerson}
                        onChange={(e) => setNewClientContactPerson(e.target.value)}
                        data-testid="input-client-contact-person"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contacto (WhatsApp)</Label>
                      <Input
                        placeholder="+244"
                        className="bg-white/5 border-white/10"
                        value={newClientContact}
                        onChange={(e) => setNewClientContact(e.target.value)}
                        data-testid="input-client-contact"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rede Social <span className="text-white/30 text-[10px]">(opcional)</span></Label>
                      <Input
                        placeholder="Ex: @empresa no Instagram ou link do Facebook"
                        className="bg-white/5 border-white/10"
                        value={newClientSocial}
                        onChange={(e) => setNewClientSocial(e.target.value)}
                        data-testid="input-client-social"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Site</Label>
                      <Select value={newClientPlan} onValueChange={setNewClientPlan}>
                        <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-client-plan">
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121212] border-white/10 text-white">
                          <SelectItem value="Essencial">Essencial — {formatKz(130000)}</SelectItem>
                          <SelectItem value="Profissional">Profissional — {formatKz(250000)}</SelectItem>
                          <SelectItem value="Premium">Premium — {formatKz(400000)}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-[10px] text-white/30 italic pt-2">Todas as informações ajudam o nosso time a fechar melhor cada cliente.</p>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        if (!newClientContact || !newClientPlan) {
                          toast({ title: "Preencha o contacto e selecione o plano", variant: "destructive" });
                          return;
                        }
                        if (!newClientCompany && !newClientContactPerson) {
                          toast({ title: "Preencha pelo menos o nome da empresa ou da pessoa", variant: "destructive" });
                          return;
                        }
                        const planInfo = planPrices[newClientPlan];
                        const clientName = newClientCompany || newClientContactPerson;
                        createClientMutation.mutate({
                          name: clientName,
                          contact: newClientContact,
                          plan: newClientPlan,
                          price: planInfo.price,
                          commission: planInfo.commission,
                          companyName: newClientCompany || undefined,
                          contactPerson: newClientContactPerson || undefined,
                          socialMedia: newClientSocial || undefined,
                        });
                      }}
                      disabled={createClientMutation.isPending}
                      className="bg-white text-black hover:bg-white/90"
                      data-testid="button-save-client"
                    >
                      {createClientMutation.isPending ? "Salvando..." : "Salvar Cliente"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Em análise", count: statusCounts.em_analise, icon: Clock, color: "text-amber-400" },
                { label: "Em contacto", count: statusCounts.em_contacto, icon: History, color: "text-blue-400" },
                { label: "Pagamento feito", count: statusCounts.pagamento_feito, icon: CheckCircle2, color: "text-emerald-400" },
                { label: "Reprovado", count: statusCounts.reprovado, icon: XCircle, color: "text-red-400" },
              ].map((s, i) => (
                <Card key={i} className="bg-white/5 border-white/10" data-testid={`card-client-status-${i}`}>
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
              <CardContent className="p-3 sm:p-6">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40">
                        <th className="pb-4 font-medium">Nome</th>
                        <th className="pb-4 font-medium">Plano</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Comissão</th>
                        <th className="pb-4 font-medium text-right">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {myClients.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center text-xs text-white/40">Nenhum cliente indicado ainda. Clique em "Adicionar Novo Cliente" para começar.</td></tr>
                      ) : myClients.map((client: any) => (
                        <tr key={client.id} className="group hover:bg-white/[0.02]" data-testid={`row-client-${client.id}`}>
                          <td className="py-4">
                            <p className="font-medium text-white/90">{client.name}</p>
                            <p className="text-xs text-white/40">{client.contact}</p>
                          </td>
                          <td className="py-4">
                            <Badge variant="secondary" className="bg-white/5 border-white/10">{client.plan}</Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusColors[client.status] || "bg-white/20"}`} />
                              <span className="text-xs">{statusLabels[client.status] || client.status}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-bold">{formatKz(client.commission)}</span>
                          </td>
                          <td className="py-4 text-right text-xs text-white/40">
                            {new Date(client.createdAt).toLocaleDateString("pt-AO")}
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
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Materiais de Venda</h1>
              <p className="text-white/40 text-sm">Tudo o que você precisa para convencer seus clientes.</p>
            </div>

            {myMaterials.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <p className="text-xs text-white/40 text-center py-8">Nenhum material disponível no momento. O administrador adicionará materiais em breve.</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white/10">Todos</TabsTrigger>
                  <TabsTrigger value="copy" className="data-[state=active]:bg-white/10">Textos</TabsTrigger>
                  <TabsTrigger value="script" className="data-[state=active]:bg-white/10">Scripts</TabsTrigger>
                  <TabsTrigger value="image" className="data-[state=active]:bg-white/10">Imagens</TabsTrigger>
                </TabsList>

                {["all", "copy", "script", "image"].map(tab => (
                  <TabsContent key={tab} value={tab} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myMaterials
                        .filter((m: any) => tab === "all" || m.type === tab)
                        .map((mat: any) => (
                          <Card key={mat.id} className="bg-white/5 border-white/10" data-testid={`card-material-${mat.id}`}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                {mat.type === "copy" ? <MessageSquare className="w-4 h-4 text-blue-400" /> :
                                 mat.type === "script" ? <FileText className="w-4 h-4 text-purple-400" /> :
                                 <ImageIcon className="w-4 h-4 text-amber-400" />}
                                {mat.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {mat.imageUrl && (
                                <img src={mat.imageUrl} alt={mat.title} className="w-full rounded border border-white/10" />
                              )}
                              {mat.content && (
                                <p className="text-xs text-white/60 bg-black/40 p-3 rounded border border-white/5 italic">"{mat.content}"</p>
                              )}
                              {mat.content ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-white/10 gap-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(mat.content);
                                    toast({ title: "Texto copiado!" });
                                  }}
                                >
                                  <Copy className="w-3 h-3" /> Copiar Conteúdo
                                </Button>
                              ) : mat.imageUrl ? (
                                <a href={mat.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                                  <Button variant="outline" size="sm" className="w-full border-white/10 gap-2">
                                    <ImageIcon className="w-3 h-3" /> Abrir Imagem
                                  </Button>
                                </a>
                              ) : null}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        );
      case "goals":
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Minhas Metas</h1>
              <p className="text-white/40 text-sm">Alcance níveis de faturação e ganhe suas placas de reconhecimento.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {[
                { 
                  targetValue: goalBronze,
                  target: "1.000.000", 
                  label: "Placa de Bronze", 
                  progress: Math.min(100, (totalEarned / goalBronze) * 100), 
                  color: "from-orange-400 to-orange-700",
                  icon: Award,
                },
                { 
                  targetValue: goalSilver,
                  target: "5.000.000", 
                  label: "Placa de Prata", 
                  progress: Math.min(100, (totalEarned / goalSilver) * 100), 
                  color: "from-slate-300 to-slate-500",
                  icon: Trophy,
                },
                { 
                  targetValue: goalGold,
                  target: "10.000.000", 
                  label: "Placa de Ouro", 
                  progress: Math.min(100, (totalEarned / goalGold) * 100), 
                  color: "from-amber-200 to-amber-500",
                  icon: Sparkles,
                },
              ].map((goal, i) => {
                const isComplete = goal.progress >= 100;
                const remaining = Math.max(0, goal.targetValue - totalEarned);
                return (
                  <Card key={i} className="bg-white/5 border-white/10 overflow-hidden group hover:bg-white/[0.08] transition-all duration-500" data-testid={`card-goal-${i}`}>
                    <div className={`h-48 bg-gradient-to-br ${goal.color} relative flex items-center justify-center p-8 overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
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
                        <Badge variant={isComplete ? "default" : "secondary"} className={isComplete ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-white/5"}>
                          {isComplete ? "Concluído" : "Em progresso"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-medium">
                          <span className="text-white/40">{Math.round(goal.progress)}% concluído</span>
                          <span className={isComplete ? "text-emerald-400" : "text-white/60"}>
                            {isComplete ? "Meta Batida!" : `Falta ${formatKz(remaining)}`}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-1.5 bg-white/5" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Notificações</h1>
              <p className="text-white/40 text-sm">Fique por dentro de tudo o que acontece.</p>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                {myNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-white/40">Nenhuma notificação no momento.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {myNotifications.map((notif: any) => (
                      <div key={notif.id} className="p-6 flex gap-4 hover:bg-white/[0.02] transition-colors" data-testid={`row-notification-${notif.id}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                          notif.type === 'error' ? 'bg-red-500/10 text-red-400' :
                          notif.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold">{notif.title}</h4>
                            <span className="text-[10px] text-white/40">{timeAgo(notif.createdAt)}</span>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{notif.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Configurações</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      data-testid="input-current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      className="bg-white/5 border-white/10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      data-testid="input-new-password"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (!currentPassword || !newPassword) {
                        toast({ title: "Preencha ambos os campos", variant: "destructive" });
                        return;
                      }
                      changePasswordMutation.mutate({ currentPassword, newPassword });
                    }}
                    disabled={changePasswordMutation.isPending}
                    className="w-full bg-white text-black font-bold"
                    data-testid="button-change-password"
                  >
                    {changePasswordMutation.isPending ? "Atualizando..." : "Atualizar Senha"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Meu Perfil</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
                  <div className="h-24 sm:h-32 bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-emerald-400/10 relative" />
                  <CardContent className="relative pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="flex flex-col items-center -mt-12 sm:-mt-16 gap-3 sm:gap-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-black border-4 border-black overflow-hidden flex items-center justify-center">
                          <User className="w-12 h-12 sm:w-16 sm:h-16 text-white/20" />
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent" data-testid="text-profile-name">
                          {currentUser?.name || "Carregando..."}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                          <Badge className={`${currentUser?.isActive ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-red-500/10 text-red-400 border-red-500/20"} font-bold px-3 py-1`}>
                            {currentUser?.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">
                            {currentUser?.createdAt ? `Membro desde ${new Date(currentUser.createdAt).toLocaleDateString("pt-AO", { month: "short", year: "numeric" })}` : ""}
                          </span>
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Vendas</p>
                          <p className="text-lg font-bold" data-testid="text-profile-sales">{paidClients.length}</p>
                        </div>
                        <div className="text-center border-l border-white/5">
                          <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Indicações</p>
                          <p className="text-lg font-bold" data-testid="text-profile-leads">{myClients.length}</p>
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
                    <div className="text-2xl sm:text-3xl font-bold" data-testid="text-profile-earnings">{formatKz(totalEarned)}</div>
                    <p className="text-xs text-white/40 mt-2">Desde o início da conta</p>
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
                        <Input
                          value={profileIban || currentUser?.iban || ""}
                          onChange={(e) => setProfileIban(e.target.value)}
                          placeholder="AO06 0000 0000 0000 0000 0"
                          className="bg-white/5 border-white/10 text-white"
                          data-testid="input-profile-iban"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Multicaixa Express</Label>
                        <Input
                          value={profileMulticaixa || currentUser?.multicaixaExpress || ""}
                          onChange={(e) => setProfileMulticaixa(e.target.value)}
                          placeholder="923 000 000"
                          className="bg-white/5 border-white/10 text-white"
                          data-testid="input-profile-multicaixa"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        updateProfileMutation.mutate({
                          iban: profileIban || currentUser?.iban || "",
                          multicaixaExpress: profileMulticaixa || currentUser?.multicaixaExpress || "",
                        });
                      }}
                      disabled={updateProfileMutation.isPending}
                      className="bg-white text-black hover:bg-white/90"
                      data-testid="button-update-profile"
                    >
                      {updateProfileMutation.isPending ? "Atualizando..." : "Atualizar Dados"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      Informações da Conta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <p className="text-xs text-white/40">{currentUser?.phone || "..."}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-medium">Código de Referência</p>
                        <p className="text-xs text-white/40 font-mono">{currentUser?.referralCode || "..."}</p>
                      </div>
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
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-white/40 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all duration-300"
              data-testid="button-user-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </Sidebar>

        <main className="flex-1 relative z-10 overflow-y-auto">
          <div className="sticky top-0 z-30 md:hidden bg-black/90 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <SidebarTrigger className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10" data-testid="button-mobile-menu" />
            <span className="text-sm font-bold tracking-tight text-white/80">
              afiliados<span className="text-white/40">.ao</span>
            </span>
            <div className="w-9" />
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
