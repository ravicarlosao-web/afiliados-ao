import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export function Hero() {
  return (
    <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 text-center">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] sm:leading-[1.2] font-['DM_Sans'] max-w-5xl mx-auto"
        >
          Comece a ganhar 70.000 Kz por semana vendendo sites sem precisar criar nenhum site!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-['Poppins']"
        >
          Você indica, o cliente paga, o site é entregue e você recebe — sem riscos e sem complicação. <span className="text-white font-medium">Teste grátis!</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.8, ease }}
          className="flex flex-col items-center gap-3 sm:gap-4 pt-2 sm:pt-4"
        >
          <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-white text-black hover:bg-zinc-200 gap-3 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none">
            <span className="font-semibold">Comece a Ganhar Agora</span>
          </Button>
          
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1, ease }}
            className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors"
          >
            O tempo é agora, não perca esta oportunidade!
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
