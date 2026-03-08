import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

export function AiTipCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease }}
      className="max-w-3xl mx-auto my-12 sm:my-16 md:my-20 px-4 sm:px-6"
    >
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="bg-white/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Sparkles className="w-4 h-4 text-white" />
            Dicas da AI
          </div>
          <X className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="p-5 sm:p-8 md:p-10"
        >
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
            "Afiliados.ao lhe oferece a oportunidade de ganhar dinheiro todos os dias sem precisar criar websites.
            Com uma rede de afiliados organizada e pagamentos automáticos, você indica clientes, acompanha tudo pelo dashboard e recebe sua comissão de forma rápida, segura e sem complicação.
            É a forma mais simples de transformar contatos em vendas e renda real"
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
