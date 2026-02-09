import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export function AiTipCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto my-20 px-6"
    >
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Sparkles className="w-4 h-4 text-white" />
            Dicas da AI
          </div>
          <X className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="p-8 md:p-10">
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
            "Afiliados.ao lhe oferece a oportunidade de ganhar dinheiro todos os dias sem precisar criar websites.
            Com uma rede de afiliados organizada e pagamentos automáticos, você indica clientes, acompanha tudo pelo dashboard e recebe sua comissão de forma rápida, segura e sem complicação.
            É a forma mais simples de transformar contatos em vendas e renda real"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
