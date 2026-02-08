import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 container mx-auto border-t border-white/5">
      <div className="bg-card border border-white/10 rounded-[2.5rem] p-12 md:p-24 text-center mb-24 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight leading-[1.1] font-['DM_Sans']">
            Pronto para dominar suas apresentações?
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Transforme cada reunião em um espetáculo de clareza e persuasão com Perssua. <span className="text-white font-medium">Teste grátis agora mesmo:</span>
          </p>
          
          <div className="flex flex-col items-center gap-4 pt-4">
             <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 gap-3 text-base">
                <span className="font-semibold">Criar conta</span>
              </Button>
               <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Ver todos os downloads
              </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-sm text-zinc-500">
        <div className="max-w-xs space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black font-bold text-sm">
              P
            </div>
            <span className="font-medium tracking-tight">perssua</span>
          </div>
          <p className="leading-relaxed">
            Sua ferramenta de apoio em tempo real que sugere respostas e argumentos durante reuniões on-line, ajudando você a lidar com objeções e se comunicar com mais confiança.
          </p>
          <p className="pt-4">© 2025 Perssua. Todos direitos reservados</p>
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
