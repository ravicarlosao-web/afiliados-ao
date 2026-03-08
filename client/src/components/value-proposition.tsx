import { Flame, Clock, Zap, Infinity } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const features = [
  {
    icon: Flame,
    title: "Confiança Total no Processo",
    desc: "Todas as vendas, pagamentos e comissões ficam registados no sistema, com total transparência e segurança."
  },
  {
    icon: Clock,
    title: "Venda com mais facilidade",
    desc: "Use mensagens prontas, serviços definidos e um painel simples para vender mais em menos tempo."
  },
  {
    icon: Zap,
    title: "Mais Profissionalismo nas Vendas",
    desc: "Apresente serviços claros, preços definidos e um processo profissional que gera mais confiança no cliente"
  },
  {
    icon: Infinity,
    title: "Acompanhe Seus Ganhos",
    desc: "Veja suas vendas, comissões e histórico em tempo real e saiba exatamente quanto está a ganhar."
  }
];

export function ValueProposition() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="bg-white text-black rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24"
      >
        <div className="space-y-6 sm:space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold tracking-wider uppercase"
          >
            Funcionalidades
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight leading-[1.05] font-['DM_Sans']"
          >
            Ganhe mais comissões,
            sem complicação e sem criar sites
          </motion.h2>
        </div>

        <div className="space-y-8 sm:space-y-12 flex flex-col justify-center">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease }}
              className="flex gap-4 sm:gap-6 group"
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black shrink-0 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div>
                <h3 className="text-lg sm:text-xl font-normal mb-1 sm:mb-2 font-['DM_Sans']">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
