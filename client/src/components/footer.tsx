import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export function Footer() {
  return (
    <footer className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 container mx-auto relative z-20 border-t border-white/5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95, rotateX: 4 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease }}
        className="bg-card border border-white/10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 lg:p-24 text-center mb-12 sm:mb-16 md:mb-24 relative overflow-hidden"
        style={{ perspective: 1200 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-8">
          <motion.h2
            initial={{ opacity: 0, x: -50, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1] font-['DM_Sans']"
          >
            Pronto para começar a faturar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
            className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto"
          >
            Junte-se ao Afiliados.ao e transforme suas indicações em lucro real. <span className="text-white font-medium">Cadastre-se grátis agora mesmo:</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="flex flex-col items-center gap-4 pt-2 sm:pt-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="rounded-full"
            >
              <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-white text-black hover:bg-zinc-200 gap-3 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none">
                <span className="font-semibold">Criar conta agora</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 sm:gap-12 md:flex-row md:justify-between md:items-start text-sm text-zinc-500 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-xs space-y-4"
        >
          <div className="flex items-center gap-2 text-white">
            <img 
              src="/assets/logo.png" 
              alt="Afiliados.ao Logo" 
              className="w-6 h-6 object-contain brightness-0 invert" 
            />
            <span className="font-medium tracking-tight">afiliados.ao</span>
          </div>
          <p className="leading-relaxed text-sm">
            Sua plataforma para vender sites sem complicações. Você indica, nós entregamos e você recebe sua comissão com total transparência e segurança.
          </p>
          <p className="pt-2 sm:pt-4 text-xs sm:text-sm">&copy; 2026 KYSdigital Todos direitos reservados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-16 sm:gap-y-4"
        >
          <Link href="/termos" className="hover:text-white transition-colors cursor-pointer">Termos de uso</Link>
          <a href="#" className="hover:text-white transition-colors">Política de cancelamento</a>
          <Link href="/privacidade" className="hover:text-white transition-colors cursor-pointer">Política de privacidade</Link>
          <a href="#" className="hover:text-white transition-colors">Política de reembolso</a>
        </motion.div>
      </div>
    </footer>
  );
}
