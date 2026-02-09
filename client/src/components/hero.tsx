import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="pt-40 pb-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl md:text-6xl font-normal tracking-tight leading-[1.2] font-['DM_Sans']">
          Comece a ganhar 20.000 Kz por semana vendendo sites sem precisar criar nenhum site!
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-['Poppins']">
          Respostas instantâneas, gestão de objeções e integração perfeita em Zoom, Meet, Teams e Hangouts. <span className="text-white font-medium">Teste grátis!</span>
        </p>

        <div className="flex flex-col items-center gap-4 pt-4">
          <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 gap-3 text-base">
            <span className="font-semibold">Criar conta</span>
          </Button>
          
          <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
            Ver todos os downloads
          </a>
        </div>
      </motion.div>
    </section>
  );
}
