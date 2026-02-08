import { Flame, Clock, Zap, Infinity } from "lucide-react";
import { motion } from "framer-motion";

export function ValueProposition() {
  return (
    <section id="features" className="py-24 px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white text-black rounded-[2.5rem] p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
      >
        <div className="space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold tracking-wider uppercase">
            Funcionalidades
          </span>
          <h2 className="text-5xl md:text-7xl font-normal tracking-tight leading-[1.05] font-['DM_Sans']">
            Venda mais, com menos esforço e mais impacto
          </h2>
        </div>

        <div className="space-y-12 flex flex-col justify-center">
          {[
            {
              icon: Flame,
              title: "Confiança Imbatível",
              desc: "Nunca fique sem resposta, fale com segurança total."
            },
            {
              icon: Clock,
              title: "Produtividade Máxima",
              desc: "Economize horas automatizando follow-ups e respostas."
            },
            {
              icon: Zap,
              title: "Vantagem Competitiva",
              desc: "Supere concorrentes com apresentações impecáveis e baseadas em IA."
            },
            {
              icon: Infinity,
              title: "Aperfeiçoamento Contínuo",
              desc: "Analise seu desempenho e melhore a cada apresentação."
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 group">
              <item.icon className="w-6 h-6 text-black shrink-0 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div>
                <h3 className="text-xl font-normal mb-2 font-['DM_Sans']">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
