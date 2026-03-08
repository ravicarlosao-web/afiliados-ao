import { Flame, Clock, Zap, Infinity } from "lucide-react";
import { motion } from "framer-motion";

export function ValueProposition() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white text-black rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24"
      >
        <div className="space-y-6 sm:space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold tracking-wider uppercase">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight leading-[1.05] font-['DM_Sans']">
            Ganhe mais comissões,
            sem complicação e sem criar sites
          </h2>
        </div>

        <div className="space-y-8 sm:space-y-12 flex flex-col justify-center">
          {[
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
          ].map((item, i) => (
            <div key={i} className="flex gap-4 sm:gap-6 group">
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black shrink-0 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div>
                <h3 className="text-lg sm:text-xl font-normal mb-1 sm:mb-2 font-['DM_Sans']">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
