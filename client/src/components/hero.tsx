import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export function Hero() {
  return (
    <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 text-center overflow-hidden" aria-label="Ganhe dinheiro na internet em Angola com marketing de afiliados" itemScope itemType="https://schema.org/WPHeader">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] sm:leading-[1.2] font-['DM_Sans'] max-w-5xl mx-auto"

            itemProp="headline"
          >
            Comece a ganhar 70.000 Kz por semana vendendo sites sem precisar criar nenhum site!
          </motion.h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, x: 50, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-['Poppins']"
        >
          Você indica, o cliente paga, o site é entregue e você recebe — sem riscos e sem complicação. <span className="text-white font-medium">Teste grátis!</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.9, ease }}
          className="flex flex-col items-center gap-3 sm:gap-4 pt-2 sm:pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="rounded-full"
          >
            <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-white text-black hover:bg-zinc-200 gap-3 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none">
              <span className="font-semibold">Comece a Ganhar Agora</span>
            </Button>
          </motion.div>
          
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease }}
            whileHover={{ y: -2 }}
            className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors"
          >
            O tempo é agora, não perca esta oportunidade!
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
