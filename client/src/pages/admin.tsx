import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  ShieldCheck, Users, Settings, LogOut, DollarSign, TrendingUp, History,
  CheckCircle2, Clock, Briefcase, FileText, Plus, Search, ArrowUpRight,
  UserCheck, MoreVertical, Download, Eye, Lock, Ban, Receipt, Target, Percent,
  Megaphone, Layout, Shield, MessageSquare, Image as ImageIcon, Zap, Globe, Mail,
  Smartphone, XCircle, LineChart, Filter, Bell
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

const statusLabels: Record<string, string> = {
  em_analise: "Em análise",
  em_contacto: "Em contacto",
  pagamento_feito: "Pagamento feito",
  reprovado: "Reprovado",
  pendente: "Pendente",
  processando: "Processando",
  pago: "Pago",
  recusado: "Recusado",
};

const statusColors: Record<string, string> = {
  em_analise: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  em_contacto: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pagamento_feito: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  reprovado: "bg-red-500/10 text-red-400 border-red-500/20",
  pendente: "bg-amber-500/10 text-amber-400",
  processando: "bg-blue-500/10 text-blue-400",
  pago: "bg-emerald-500/10 text-emerald-400",
  recusado: "bg-red-500/10 text-red-400",
};

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { toast } = useToast();

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: ShieldCheck },
    { id: "affiliates", label: "Afiliados", icon: Users },
    { id: "clients", label: "Clientes Globais", icon: UserCheck },
    { id: "payments", label: "Pagamentos", icon: DollarSign },
    { id: "commissions", label: "Comissões", icon: Percent },
    { id: "analytics", label: "Analíticos", icon: LineChart },
    { id: "notifications", label: "Notificações", icon: Megaphone },
    { id: "prints", label: "Prints de Conversa", icon: ImageIcon },
    { id: "materials", label: "Materiais", icon: Layout },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.clear();
    window.location.href = "/login";
  };

  const { data: dashboardStats } = useQuery<any>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "dashboard",
  });

  const { data: affiliates = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/affiliates"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "affiliates" || activeItem === "dashboard",
  });

  const { data: allClients = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/clients"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "clients" || activeItem === "dashboard" || activeItem === "analytics",
  });

  const { data: allWithdrawals = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/withdrawals"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "payments",
  });

  const { data: withdrawalStats } = useQuery<any>({
    queryKey: ["/api/admin/withdrawals/stats"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "payments",
  });

  const { data: allMaterials = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/materials"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "materials",
  });

  const { data: securityLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/security-logs"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "security",
  });

  const { data: adminSettings = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: activeItem === "commissions" || activeItem === "settings",
  });

  const updateWithdrawalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/withdrawals/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-logs"] });
      toast({ title: "Saque atualizado" });
    },
  });

  const updateClientStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNote, notifyAffiliate }: { id: string; status: string; adminNote?: string; notifyAffiliate?: boolean }) => {
      await apiRequest("PATCH", `/api/admin/clients/${id}/status`, { status, adminNote, notifyAffiliate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({ title: "Status do cliente atualizado" });
    },
  });

  const updateSiteStartedMutation = useMutation({
    mutationFn: async ({ id, siteStarted }: { id: string; siteStarted: boolean }) => {
      await apiRequest("PATCH", `/api/admin/clients/${id}/site-started`, { siteStarted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Estado do site atualizado" });
    },
  });

  const saveNoteMutation = useMutation({
    mutationFn: async ({ id, adminNote, notifyAffiliate }: { id: string; adminNote: string; notifyAffiliate?: boolean }) => {
      await apiRequest("PATCH", `/api/admin/clients/${id}/note`, { adminNote, notifyAffiliate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Nota guardada" });
    },
  });

  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientDetailOpen, setClientDetailOpen] = useState(false);
  const [clientAdminNote, setClientAdminNote] = useState("");
  const [clientNotifyAffiliate, setClientNotifyAffiliate] = useState(false);

  const openClientDetail = async (cl: any) => {
    setSelectedClient(cl);
    setClientAdminNote(cl.adminNote || "");
    setClientNotifyAffiliate(false);
    setClientDetailOpen(true);
  };

  const handleSaveNote = () => {
    if (!selectedClient || !clientAdminNote.trim()) return;
    saveNoteMutation.mutate(
      { id: selectedClient.id, adminNote: clientAdminNote, notifyAffiliate: clientNotifyAffiliate },
      {
        onSuccess: () => {
          setSelectedClient((prev: any) => prev ? { ...prev, adminNote: clientAdminNote } : null);
          setClientNotifyAffiliate(false);
        },
      }
    );
  };

  const handleStatusChange = (status: string) => {
    if (!selectedClient) return;
    updateClientStatusMutation.mutate(
      { id: selectedClient.id, status, adminNote: clientAdminNote || undefined, notifyAffiliate: clientNotifyAffiliate },
      {
        onSuccess: () => {
          setSelectedClient((prev: any) => prev ? { ...prev, status, adminNote: clientAdminNote || prev.adminNote } : null);
          setClientAdminNote("");
          setClientNotifyAffiliate(false);
        },
      }
    );
  };

  const handleSiteStartedToggle = (checked: boolean) => {
    if (!selectedClient) return;
    updateSiteStartedMutation.mutate(
      { id: selectedClient.id, siteStarted: checked },
      {
        onSuccess: () => {
          setSelectedClient((prev: any) => prev ? { ...prev, siteStarted: checked } : null);
        },
      }
    );
  };

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      await apiRequest("PATCH", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-logs"] });
      toast({ title: "Configurações salvas" });
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/notifications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      toast({ title: "Notificação enviada" });
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: { title: string; type: string; content: string | null; image?: File | null }) => {
      if (data.type === "image" && data.image) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("type", data.type);
        if (data.content) formData.append("content", data.content);
        formData.append("image", data.image);
        await apiRequest("POST", "/api/admin/materials", formData);
      } else {
        await apiRequest("POST", "/api/admin/materials", { title: data.title, type: data.type, content: data.content });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/materials"] });
      toast({ title: "Material adicionado" });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/materials"] });
      toast({ title: "Material removido" });
    },
  });

  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("copy");
  const [matContent, setMatContent] = useState("");
  const [matImage, setMatImage] = useState<File | null>(null);

  const [ssMessage, setSsMessage] = useState("");
  const [ssImages, setSsImages] = useState<File[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const { data: screenshotRequests = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/screenshot-requests"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const uploadScreenshotsMutation = useMutation({
    mutationFn: async ({ affiliateId, clientId, message, images }: { affiliateId: string; clientId?: string; message?: string; images: File[] }) => {
      const formData = new FormData();
      formData.append("affiliateId", affiliateId);
      if (clientId) formData.append("clientId", clientId);
      if (message) formData.append("message", message);
      images.forEach(img => formData.append("images", img));
      await apiRequest("POST", "/api/admin/screenshots", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/screenshot-requests"] });
      toast({ title: "Prints enviados com sucesso" });
      setSsMessage("");
      setSsImages([]);
      setActiveRequestId(null);
    },
  });

  const [commBase, setCommBase] = useState("0");
  const [commEssencial, setCommEssencial] = useState("0");
  const [commProfissional, setCommProfissional] = useState("0");
  const [commPremium, setCommPremium] = useState("0");

  useEffect(() => {
    if (adminSettings) {
      setCommBase(adminSettings.commission_base || "0");
      setCommEssencial(adminSettings.commission_essencial || "0");
      setCommProfissional(adminSettings.commission_profissional || "0");
      setCommPremium(adminSettings.commission_premium || "0");
    }
  }, [adminSettings]);

  const paidClients = allClients.filter((c: any) => c.status === "pagamento_feito");
  const topAffiliates = affiliates
    .map((aff: any) => ({
      ...aff,
      totalSales: allClients.filter((c: any) => c.affiliateId === aff.id && c.status === "pagamento_feito")
        .reduce((sum: number, c: any) => sum + parseFloat(c.price || "0"), 0),
    }))
    .sort((a: any, b: any) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                  Dashboard Executivo
                </h1>
                <p className="text-white/40 text-sm">Visão estratégica da operação em tempo real.</p>
              </div>
              <Button variant="outline" className="bg-white/5 border-white/10 text-xs w-full sm:w-auto">
                <Download className="w-3 h-3 mr-2" /> Exportar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { title: "Afiliados Ativos", value: dashboardStats?.activeAffiliates?.toString() || "0", icon: Users, color: "text-blue-400" },
                { title: "Volume Total", value: formatKz(dashboardStats?.totalVolume || "0"), icon: Briefcase, color: "text-emerald-400" },
                { title: "Comissão Paga", value: formatKz(dashboardStats?.totalCommissionPaid || "0"), icon: Receipt, color: "text-purple-400" },
                { title: "Comissão Pendente", value: formatKz(dashboardStats?.pendingCommission || "0"), icon: Clock, color: "text-amber-400" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300 group" data-testid={`card-dashboard-stat-${i}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                    <CardTitle className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{stat.title}</CardTitle>
                    <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                    <div className="text-lg sm:text-2xl font-bold tracking-tight truncate">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Vendas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {paidClients.length === 0 ? (
                    <p className="text-xs text-white/40 text-center py-8">Nenhuma venda registrada ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {paidClients.slice(0, 5).map((client: any) => (
                        <div key={client.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-sm font-bold">{client.name}</p>
                            <p className="text-[10px] text-white/40">{client.plan} • {timeAgo(client.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-400">{formatKz(client.price)}</p>
                            <p className="text-[10px] text-white/40">Comissão: {formatKz(client.commission)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {topAffiliates.length === 0 ? (
                      <p className="text-xs text-white/40 text-center py-4">Ainda não há vendas registradas.</p>
                    ) : (
                      topAffiliates.map((af: any, i: number) => (
                        <div key={af.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white/20 w-4">{i + 1}.</span>
                            <span className="text-xs font-medium text-white/80 group-hover:text-white">{af.name}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">{formatKz(af.totalSales)}</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase text-white/60 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Status do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Todos os sistemas operacionais. {affiliates.length} afiliados registrados.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case "affiliates":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Gestão de Afiliados</h1>
                <p className="text-white/40 text-sm">Controle total da rede de parceiros.</p>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="p-3 sm:p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input placeholder="Buscar por nome ou telefone..." className="pl-10 bg-white/5 border-white/10" />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40 text-[10px] uppercase tracking-widest">
                        <th className="pb-4 font-bold">Afiliado</th>
                        <th className="pb-4 font-bold text-center">Telefone</th>
                        <th className="pb-4 font-bold text-center">Vendas</th>
                        <th className="pb-4 font-bold text-center">Status</th>
                        <th className="pb-4 font-bold text-right">Registado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {affiliates.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center text-xs text-white/40">Nenhum afiliado encontrado no sistema.</td></tr>
                      ) : affiliates.map((af: any) => {
                        const affSales = allClients.filter((c: any) => c.affiliateId === af.id && c.status === "pagamento_feito").length;
                        return (
                          <tr key={af.id} className="group hover:bg-white/[0.02]" data-testid={`row-affiliate-${af.id}`}>
                            <td className="py-4">
                              <p className="font-bold text-white/90 text-xs">{af.name}</p>
                              <p className="text-[10px] text-white/20">Ref: {af.referralCode}</p>
                            </td>
                            <td className="py-4 text-center text-xs text-white/60">{af.phone}</td>
                            <td className="py-4 text-center font-mono text-xs text-white/60">{affSales}</td>
                            <td className="py-4 text-center">
                              <Badge className={af.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}>
                                {af.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </td>
                            <td className="py-4 text-right text-xs text-white/40">{new Date(af.createdAt).toLocaleDateString("pt-AO")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "clients":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Clientes Globais</h1>
              <p className="text-white/40 text-sm">Monitoramento centralizado de todas as indicações.</p>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3 sm:p-6">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="text-left border-b border-white/10 text-white/40 text-[10px] uppercase tracking-widest">
                        <th className="pb-4 font-bold">Cliente</th>
                        <th className="pb-4 font-bold">Plano / Valor</th>
                        <th className="pb-4 font-bold">Comissão</th>
                        <th className="pb-4 font-bold text-center">Status</th>
                        <th className="pb-4 font-bold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allClients.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center text-xs text-white/40">Nenhum cliente registado no momento.</td></tr>
                      ) : allClients.map((cl: any) => (
                        <tr key={cl.id} className="group hover:bg-white/[0.02] cursor-pointer" onClick={() => openClientDetail(cl)} data-testid={`row-client-${cl.id}`}>
                          <td className="py-4">
                            <p className="font-bold text-white/90 text-xs">{cl.name}</p>
                            <p className="text-[10px] text-white/20">{cl.contact}</p>
                          </td>
                          <td className="py-4">
                            <p className="text-xs font-bold">{cl.plan}</p>
                            <p className="text-[10px] text-white/40">{formatKz(cl.price)}</p>
                          </td>
                          <td className="py-4 font-bold text-emerald-400 text-xs">{formatKz(cl.commission)}</td>
                          <td className="py-4 text-center">
                            <Badge className={`text-[9px] px-2 h-5 rounded-full ${statusColors[cl.status] || ""}`}>
                              {statusLabels[cl.status] || cl.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); openClientDetail(cl); }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Dialog open={clientDetailOpen} onOpenChange={setClientDetailOpen}>
              <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                {selectedClient && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                          {selectedClient.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <span>{selectedClient.name}</span>
                          <Badge className={`ml-3 text-[9px] px-2 h-5 rounded-full ${statusColors[selectedClient.status] || ""}`}>
                            {statusLabels[selectedClient.status] || selectedClient.status}
                          </Badge>
                        </div>
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Contacto</p>
                          <p className="text-sm text-white/80">{selectedClient.contact}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Plano</p>
                          <p className="text-sm text-white/80">{selectedClient.plan}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Valor</p>
                          <p className="text-sm text-emerald-400 font-bold">{formatKz(selectedClient.price)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Comissão</p>
                          <p className="text-sm text-emerald-400 font-bold">{formatKz(selectedClient.commission)}</p>
                        </div>
                        {selectedClient.companyName && (
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Empresa</p>
                            <p className="text-sm text-white/80">{selectedClient.companyName}</p>
                          </div>
                        )}
                        {selectedClient.contactPerson && (
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Pessoa de Contacto</p>
                            <p className="text-sm text-white/80">{selectedClient.contactPerson}</p>
                          </div>
                        )}
                        {selectedClient.socialMedia && (
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Rede Social</p>
                            <p className="text-sm text-white/80">{selectedClient.socialMedia}</p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Afiliado</p>
                          <p className="text-sm text-white/80">{selectedClient.affiliateName || "—"}</p>
                          <p className="text-[10px] text-white/30">{selectedClient.affiliatePhone || ""}</p>
                        </div>
                      </div>

                      {selectedClient.status === "em_contacto" || selectedClient.status === "pagamento_feito" ? (
                        <Card className="bg-white/5 border-white/10">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-white/80 flex items-center gap-2">
                                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                                  Site em Desenvolvimento
                                </p>
                                <p className="text-[10px] text-white/40">Marque quando o site do cliente começar a ser feito</p>
                              </div>
                              <Switch
                                checked={!!selectedClient.siteStarted}
                                onCheckedChange={handleSiteStartedToggle}
                                data-testid="switch-site-started"
                              />
                            </div>
                            {selectedClient.siteStarted && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300 flex items-start gap-2">
                                <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>O site está em desenvolvimento. O afiliado será notificado que o pagamento da comissão está pendente até a conclusão.</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ) : null}

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Nota / Motivo</p>
                        <Textarea
                          placeholder="Ex: WhatsApp não encontrado com o número fornecido, cliente não convertido correctamente..."
                          value={clientAdminNote}
                          onChange={(e) => setClientAdminNote(e.target.value)}
                          className="bg-white/5 border-white/10 text-white text-xs min-h-[80px] placeholder:text-white/20"
                          data-testid="input-admin-note"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={clientNotifyAffiliate}
                              onCheckedChange={setClientNotifyAffiliate}
                              data-testid="switch-notify-affiliate"
                            />
                            <Label className="text-xs text-white/60 cursor-pointer" onClick={() => setClientNotifyAffiliate(!clientNotifyAffiliate)}>
                              Enviar mensagem ao afiliado
                            </Label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs border-white/10 hover:bg-white/5"
                            onClick={handleSaveNote}
                            disabled={saveNoteMutation.isPending || !clientAdminNote.trim()}
                            data-testid="button-save-note"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Guardar Nota
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Alterar Status</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 ${selectedClient.status === "em_contacto" ? "bg-blue-500/20 ring-1 ring-blue-500/40" : ""}`}
                            onClick={() => handleStatusChange("em_contacto")}
                            disabled={updateClientStatusMutation.isPending}
                            data-testid="button-status-contacto"
                          >
                            <History className="w-3.5 h-3.5" />
                            Em Contacto
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 ${selectedClient.status === "pagamento_feito" ? "bg-emerald-500/20 ring-1 ring-emerald-500/40" : ""}`}
                            onClick={() => handleStatusChange("pagamento_feito")}
                            disabled={updateClientStatusMutation.isPending}
                            data-testid="button-status-aprovado"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aprovado / Fechado
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 ${selectedClient.status === "reprovado" ? "bg-red-500/20 ring-1 ring-red-500/40" : ""}`}
                            onClick={() => handleStatusChange("reprovado")}
                            disabled={updateClientStatusMutation.isPending}
                            data-testid="button-status-reprovado"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reprovado
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 ${selectedClient.status === "em_analise" ? "bg-amber-500/20 ring-1 ring-amber-500/40" : ""}`}
                            onClick={() => handleStatusChange("em_analise")}
                            disabled={updateClientStatusMutation.isPending}
                            data-testid="button-status-analise"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Em Análise
                          </Button>
                        </div>
                      </div>

                      {selectedClient.adminNote && (
                        <Card className="bg-red-500/5 border-red-500/20">
                          <CardContent className="p-3">
                            <p className="text-[10px] uppercase tracking-wider text-red-400/60 font-bold mb-1">Última Nota do Admin</p>
                            <p className="text-xs text-red-300/80">{selectedClient.adminNote}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );
      case "commissions":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Regras de Comissões</h1>
              <p className="text-white/40 text-sm">Defina as percentagens e bónus do sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Comissão Padrão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Percentagem Base (%)</Label>
                    <div className="flex gap-2">
                      <Input value={commBase} onChange={(e) => setCommBase(e.target.value)} className="bg-white/5 border-white/10" />
                      <Button onClick={() => saveSettingsMutation.mutate({
                        commission_base: commBase,
                        commission_essencial: commEssencial,
                        commission_profissional: commProfissional,
                        commission_premium: commPremium,
                      })} className="bg-white text-black font-bold">Salvar</Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Por Plano</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">Essencial</span>
                        <Input className="w-20 h-8 bg-white/5 border-white/10 text-center text-xs" value={commEssencial} onChange={(e) => setCommEssencial(e.target.value)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">Profissional</span>
                        <Input className="w-20 h-8 bg-white/5 border-white/10 text-center text-xs" value={commProfissional} onChange={(e) => setCommProfissional(e.target.value)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">Premium</span>
                        <Input className="w-20 h-8 bg-white/5 border-white/10 text-center text-xs" value={commPremium} onChange={(e) => setCommPremium(e.target.value)} />
                      </div>
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
                        <p className="text-[10px] text-white/40">Bónus para cada 10 vendas (Valor a definir)</p>
                      </div>
                      <Switch />
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
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Inteligência de Negócio</h1>
              <p className="text-white/40 text-sm">Análise profunda de tendências e comportamentos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader><CardTitle className="text-xs uppercase tracking-widest text-white/40 font-bold">Plano Mais Vendido</CardTitle></CardHeader>
                <CardContent>
                  {(() => {
                    const planCounts: Record<string, number> = {};
                    paidClients.forEach((c: any) => { planCounts[c.plan] = (planCounts[c.plan] || 0) + 1; });
                    const topPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];
                    return topPlan ? (
                      <>
                        <div className="text-xl font-bold">{topPlan[0]}</div>
                        <p className="text-[10px] text-emerald-400">{topPlan[1]} vendas</p>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold">N/D</div>
                        <p className="text-[10px] text-white/40">Sem dados de vendas</p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader><CardTitle className="text-xs uppercase tracking-widest text-white/40 font-bold">Total de Clientes</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{allClients.length}</div>
                  <p className="text-[10px] text-white/20">Todos os status</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader><CardTitle className="text-xs uppercase tracking-widest text-white/40 font-bold">Ticket Médio</CardTitle></CardHeader>
                <CardContent>
                  {(() => {
                    const total = paidClients.reduce((s: number, c: any) => s + parseFloat(c.price || "0"), 0);
                    const avg = paidClients.length > 0 ? total / paidClients.length : 0;
                    return (
                      <>
                        <div className="text-xl font-bold">{formatKz(avg)}</div>
                        <p className="text-[10px] text-white/40">{paidClients.length} vendas concluídas</p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Notificações Globais</h1>
              <p className="text-white/40 text-sm">Comunique-se diretamente com todos os seus afiliados.</p>
            </div>

            <Card className="bg-white/5 border-white/10 max-w-2xl">
              <CardHeader><CardTitle className="text-lg">Nova Mensagem</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs">Título da Notificação</Label>
                  <Input placeholder="Ex: Comissão do Premium a 45%!" className="bg-white/5 border-white/10" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} data-testid="input-notif-title" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Corpo da Mensagem</Label>
                  <textarea className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/50" placeholder="Escreva o aviso para os afiliados..." value={notifBody} onChange={(e) => setNotifBody(e.target.value)} data-testid="input-notif-body" />
                </div>
                <Button
                  onClick={() => {
                    if (!notifTitle || !notifBody) return;
                    sendNotificationMutation.mutate({ title: notifTitle, description: notifBody, type: "info", targetRole: "user" });
                    setNotifTitle("");
                    setNotifBody("");
                  }}
                  disabled={sendNotificationMutation.isPending}
                  className="w-full bg-red-500 hover:bg-red-600 font-bold gap-2"
                  data-testid="button-send-notification"
                >
                  <Megaphone className="w-4 h-4" /> {sendNotificationMutation.isPending ? "Enviando..." : "Disparar Notificação"}
                </Button>
              </CardContent>
            </Card>

          </div>
        );
      case "prints":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Prints de Conversa</h1>
              <p className="text-white/40 text-sm">Pedidos de prints dos afiliados. Cada pedido já identifica o afiliado e o cliente — basta anexar as imagens e enviar.</p>
            </div>

            {screenshotRequests.length === 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <ImageIcon className="w-10 h-10 mx-auto text-white/10 mb-3" />
                  <p className="text-white/30 text-sm">Nenhum pedido de print pendente.</p>
                  <p className="text-white/20 text-xs mt-1">Quando um afiliado solicitar prints de um cliente, o pedido aparecerá aqui.</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {screenshotRequests.map((req: any) => (
                <Card key={req.id} className={`border transition-all ${activeRequestId === req.id ? "bg-blue-500/5 border-blue-500/20" : "bg-white/5 border-white/10"}`} data-testid={`row-ss-request-${req.id}`}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Pendente</Badge>
                          <span className="text-[10px] text-white/30">{timeAgo(req.createdAt)}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider">Afiliado</p>
                            <p className="text-sm font-bold text-white/80">{req.affiliateName || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider">Cliente</p>
                            <p className="text-sm font-bold text-white/80">{req.clientName || "—"}</p>
                            {req.clientContact && <p className="text-[10px] text-white/40">{req.clientContact}</p>}
                          </div>
                        </div>
                      </div>
                      {activeRequestId !== req.id ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-[11px] border-blue-500/20 text-blue-400 hover:bg-blue-500/10 shrink-0"
                          onClick={() => { setActiveRequestId(req.id); setSsMessage(""); setSsImages([]); }}
                          data-testid={`button-reply-request-${req.id}`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          Enviar Prints
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] text-white/40 hover:text-white/60 shrink-0"
                          onClick={() => setActiveRequestId(null)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    {activeRequestId === req.id && (
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div className="space-y-2">
                          <Label className="text-xs">Mensagem (opcional)</Label>
                          <Textarea
                            placeholder="Ex: Aqui estão as últimas mensagens com o cliente..."
                            value={ssMessage}
                            onChange={(e) => setSsMessage(e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-xs min-h-[60px] placeholder:text-white/20"
                            data-testid="input-ss-message"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Imagens (máx. 3)</Label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []).slice(0, 3);
                              setSsImages(files);
                            }}
                            className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/70 file:text-xs file:cursor-pointer hover:file:bg-white/20"
                            data-testid="input-ss-images"
                          />
                          {ssImages.length > 0 && (
                            <p className="text-[10px] text-white/40">{ssImages.length} imagem(ns) selecionada(s)</p>
                          )}
                        </div>

                        <Button
                          onClick={() => {
                            if (!req.affiliateId || ssImages.length === 0) return;
                            uploadScreenshotsMutation.mutate({
                              affiliateId: req.affiliateId,
                              clientId: req.clientId || undefined,
                              message: ssMessage || undefined,
                              images: ssImages,
                            });
                          }}
                          disabled={uploadScreenshotsMutation.isPending || ssImages.length === 0}
                          className="w-full bg-blue-500 hover:bg-blue-600 font-bold gap-2"
                          data-testid="button-send-screenshots"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {uploadScreenshotsMutation.isPending ? "Enviando..." : "Enviar Prints"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "materials":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Materiais & Campanhas</h1>
                <p className="text-white/40 text-sm">Gestão de ativos para os afiliados venderem mais.</p>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 max-w-2xl">
              <CardHeader><CardTitle className="text-lg">Adicionar Material</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Título</Label>
                  <Input value={matTitle} onChange={(e) => setMatTitle(e.target.value)} placeholder="Ex: Abordagem WhatsApp" className="bg-white/5 border-white/10" data-testid="input-material-title" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Tipo</Label>
                  <Select value={matType} onValueChange={setMatType}>
                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10 text-white">
                      <SelectItem value="copy">Texto / Copy</SelectItem>
                      <SelectItem value="script">Script de Venda</SelectItem>
                      <SelectItem value="image">Imagem / Criativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {matType === "image" ? (
                  <div className="space-y-2">
                    <Label className="text-xs">Imagem</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMatImage(e.target.files?.[0] || null)}
                      className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                      data-testid="input-material-image"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs">Conteúdo</Label>
                    <textarea className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/50" value={matContent} onChange={(e) => setMatContent(e.target.value)} placeholder="Escreva o conteúdo aqui..." data-testid="input-material-content" />
                  </div>
                )}
                <Button
                  onClick={() => {
                    if (!matTitle) return;
                    createMaterialMutation.mutate({ title: matTitle, type: matType, content: matContent || null, image: matImage });
                    setMatTitle("");
                    setMatContent("");
                    setMatImage(null);
                  }}
                  disabled={createMaterialMutation.isPending}
                  className="w-full bg-white text-black font-bold"
                  data-testid="button-add-material"
                >
                  <Plus className="w-4 h-4 mr-2" /> {createMaterialMutation.isPending ? "Adicionando..." : "Adicionar Material"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> Materiais Cadastrados</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {allMaterials.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">Nenhum material cadastrado.</div>
                ) : allMaterials.map((mat: any) => (
                  <div key={mat.id} className="flex items-center justify-between p-3 rounded bg-black/40 border border-white/5" data-testid={`card-material-${mat.id}`}>
                    <div>
                      <p className="text-xs font-bold">{mat.title}</p>
                      <p className="text-[10px] text-white/20">{mat.type === "copy" ? "Texto" : mat.type === "script" ? "Script" : "Imagem"} • {timeAgo(mat.createdAt)}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10" onClick={() => deleteMaterialMutation.mutate(mat.id)}>
                      <XCircle className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Segurança & Logs</h1>
              <p className="text-white/40 text-sm">Monitoramento de integridade e auditoria do sistema.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase text-white/40">Tentativas Bloqueadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {securityLogs.filter((l: any) => l.status === "error").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-lg">Atividade Recente</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityLogs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-white/40">Nenhuma atividade recente registrada.</div>
                  ) : securityLogs.map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-xs font-bold">{log.action}</p>
                          <p className="text-[10px] text-white/20">{log.userLabel || "Desconhecido"} • {log.ip}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">{timeAgo(log.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "payments":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Fluxo de Pagamentos</h1>
              <p className="text-white/40 text-sm">Gestão financeira de recebimentos e saques.</p>
            </div>

            <Tabs defaultValue="affiliate-payouts" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 h-10 sm:h-11 p-1 w-full sm:w-auto">
                <TabsTrigger value="affiliate-payouts" className="gap-2 data-[state=active]:bg-white/10 text-xs font-bold uppercase tracking-wider w-full">
                  <DollarSign className="w-4 h-4" /> Saques de Afiliados
                </TabsTrigger>
              </TabsList>

              <TabsContent value="affiliate-payouts" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { label: "Solicitações Pendentes", value: withdrawalStats?.active?.toString() || "0", sub: "Aguardando aprovação" },
                    { label: "Total Pago", value: formatKz(withdrawalStats?.totalPaid || "0"), sub: "Desde o início" },
                    { label: "Em Processamento", value: formatKz(withdrawalStats?.reserved || "0"), sub: "Em trânsito" },
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
                  <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Solicitações de Saque</h3>
                  </div>
                  {allWithdrawals.length === 0 ? (
                    <div className="p-4 text-center"><p className="text-sm text-white/40">Nenhuma solicitação de saque no momento.</p></div>
                  ) : allWithdrawals.map((w: any) => (
                    <div key={w.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 last:border-0 hover:bg-white/[0.01]" data-testid={`row-withdrawal-${w.id}`}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-[10px] font-bold text-red-400 border border-red-500/20 shrink-0">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold">{w.method}</p>
                          <p className="text-[10px] text-white/40 truncate">{w.accountInfo || "N/D"} • {timeAgo(w.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-6 pl-11 sm:pl-0">
                        <span className="text-sm font-bold text-emerald-400">{formatKz(w.amount)}</span>
                        <Badge className={`text-[9px] ${statusColors[w.status] || ""}`}>{statusLabels[w.status] || w.status}</Badge>
                        {w.status === "pendente" && (
                          <div className="flex gap-2 ml-auto sm:ml-0">
                            <Button size="sm" variant="ghost" className="text-[10px] h-7 hover:text-red-400" onClick={() => updateWithdrawalMutation.mutate({ id: w.id, status: "recusado" })}>Recusar</Button>
                            <Button size="sm" className="text-[10px] h-7 bg-white text-black hover:bg-white/90" onClick={() => updateWithdrawalMutation.mutate({ id: w.id, status: "pago" })}>Aprovar</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">Configurações</h1>
              <p className="text-white/40 text-sm">Configurações gerais do sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Smartphone className="w-4 h-4 text-emerald-400" /> Configurações de Planos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Tempo Mínimo para Saque (Dias)</Label>
                      <Input defaultValue={adminSettings?.min_withdrawal_days || "7"} className="w-20 bg-white/5 border-white/10 h-8 text-center" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Limite Mínimo de Saque (Kz)</Label>
                      <Input defaultValue={adminSettings?.min_withdrawal_amount || "10000"} className="w-32 bg-white/5 border-white/10 h-8 text-center" />
                    </div>
                  </div>
                  <Button className="w-full bg-white text-black font-bold">Salvar Configurações</Button>
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
                      <Badge variant="outline" className="text-white/20 h-5">Não configurado</Badge>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold">SMTP Email</span>
                      </div>
                      <Badge variant="outline" className="text-white/20 h-5">Não configurado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                        {item.id === "prints" && screenshotRequests.length > 0 && (
                          <Badge className="ml-auto bg-amber-500 text-black text-[9px] px-1.5 py-0 min-w-[18px] flex items-center justify-center">{screenshotRequests.length}</Badge>
                        )}
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

        <main className="flex-1 relative z-10 overflow-y-auto">
          <div className="sticky top-0 z-30 md:hidden bg-black/90 backdrop-blur-lg border-b border-red-500/10 px-4 py-3 flex items-center justify-between">
            <SidebarTrigger className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10" data-testid="button-admin-mobile-menu" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              ADMIN
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
