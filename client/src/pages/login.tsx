import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarField } from "@/components/star-field";
import { Phone, Lock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso. Bem-vindo de volta!",
      });
      setLocation("/usuario");
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Conta criada!",
        description: "Sua conta foi criada com sucesso. Faça login para continuar.",
      });
    }, 1500);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Pedido enviado",
        description: "Se o número estiver cadastrado, você receberá um código via SMS.",
      });
      setShowForgot(false);
    }, 1500);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
        <StarField />
        <div className="w-full max-w-[400px] relative z-10 animate-in fade-in zoom-in-95 duration-300">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-red-500" />
                Recuperar Acesso
              </CardTitle>
              <CardDescription>Insira seu número de telefone para recuperar sua palavra-passe.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRecover}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input placeholder="+244" className="bg-black/40 border-white/10" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11">
                  {loading ? "Processando..." : "Enviar Código de Recuperação"}
                </Button>
                <Button type="button" variant="ghost" className="w-full text-white/40 hover:text-white" onClick={() => setShowForgot(false)}>
                  Voltar para o Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />
      
      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-2 cursor-pointer" onClick={() => setLocation("/")}>
            AFILIADOS.AO
          </h1>
          <p className="text-white/40 text-sm">A maior plataforma de afiliados de Angola</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-white/10">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white/10">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-in fade-in zoom-in-95 duration-300">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Bem-vindo</CardTitle>
                <CardDescription>Use seu número de telefone para acessar sua conta.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (Unitel/Movicel)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input 
                        id="phone" 
                        placeholder="+244 9XX XXX XXX" 
                        className="pl-10 bg-black/40 border-white/10 focus:border-red-500/50 transition-colors" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Palavra-passe</Label>
                      <button type="button" className="text-[10px] text-red-400 hover:underline" onClick={() => setShowForgot(true)}>Esqueceu a senha?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 bg-black/40 border-white/10 focus:border-red-500/50 transition-colors" 
                        required 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 group">
                    {loading ? "Entrando..." : (
                      <span className="flex items-center gap-2">
                        Entrar no Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="animate-in fade-in zoom-in-95 duration-300">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Criar nova conta</CardTitle>
                <CardDescription>Comece a ganhar comissões hoje mesmo.</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Nome Completo</Label>
                    <Input id="reg-name" placeholder="Seu nome" className="bg-black/40 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Telefone</Label>
                    <Input id="reg-phone" placeholder="+244" className="bg-black/40 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-pass">Criar Palavra-passe</Label>
                    <Input id="reg-pass" type="password" placeholder="Mínimo 6 caracteres" className="bg-black/40 border-white/10" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={loading} className="w-full bg-white text-black hover:bg-white/90 font-bold h-11">
                    {loading ? "Criando conta..." : "Criar Minha Conta"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-center text-xs text-white/20">
          Ao entrar, você concorda com nossos <br />
          <Link href="/termos">
            <span className="text-white/40 underline cursor-pointer hover:text-red-400 transition-colors">Termos de Serviço</span>
          </Link> e <Link href="/privacidade">
            <span className="text-white/40 underline cursor-pointer hover:text-red-400 transition-colors">Política de Privacidade</span>
          </Link>.
        </p>
      </div>
    </div>
  );
}
