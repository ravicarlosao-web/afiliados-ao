import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 container mx-auto relative z-20 border-t border-white/5">
      <div className="bg-card border border-white/10 rounded-[2.5rem] p-12 md:p-24 text-center mb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight leading-[1.1] font-['DM_Sans']">
            Pronto para começar a faturar?
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Junte-se ao Afiliados.ao e transforme suas indicações em lucro real. <span className="text-white font-medium">Cadastre-se grátis agora mesmo:</span>
          </p>
          
          <div className="flex flex-col items-center gap-4 pt-4">
             <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 gap-3 text-base">
                <span className="font-semibold">Criar conta agora</span>
              </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-sm text-zinc-500 pb-12">
        <div className="max-w-xs space-y-4">
          <div className="flex items-center gap-2 text-white">
            <img 
              src="/assets/logo.png" 
              alt="Afiliados.ao Logo" 
              className="w-6 h-6 object-contain brightness-0 invert" 
            />
            <span className="font-medium tracking-tight">afiliados.ao</span>
          </div>
          <p className="leading-relaxed">
            Sua plataforma para vender sites sem complicações. Você indica, nós entregamos e você recebe sua comissão com total transparência e segurança.
          </p>
          <p className="pt-4">© 2025 Afiliados.ao. Todos direitos reservados</p>
        </div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          <a href="#" className="hover:text-white transition-colors">Termos de uso</a>
          <a href="#" className="hover:text-white transition-colors">Política de cancelamento</a>
          <a href="#" className="hover:text-white transition-colors">Políticas de privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Política de reembolso</a>
        </div>
      </div>
    </footer>
  );
}
