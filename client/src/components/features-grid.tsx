import { Mic, CheckCircle2, TrendingUp, PiggyBank, Tag } from "lucide-react";
import { motion } from "framer-motion";

const AudioWave = () => (
  <div className="flex items-center gap-1 h-12">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="w-1 bg-white/80 rounded-full animate-wave"
        style={{
          animationDelay: `${Math.random() * 1}s`,
          height: `${20 + Math.random() * 60}%`
        }}
      />
    ))}
    <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-card pointer-events-none" />
  </div>
);

export function FeaturesGrid() {
  return (
    <section id="applications" className="py-24 px-6 container mx-auto">
      <div className="text-center mb-16 space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Como Funciona
        </span>
        <h2 className="text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans']">
          Domine qualquer situação com apoio em tempo real
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Real-time Guide */}
        <div className="bg-card border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between h-[400px] relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-full bg-white/5 rounded-2xl h-32 flex items-center justify-center mb-8 border border-white/5">
             <div className="bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-4">
                <AudioWave />
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <Mic className="w-4 h-4 text-black" />
                </div>
                <AudioWave />
             </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-normal mb-3 font-['DM_Sans']">Guia em Tempo Real</h3>
            <p className="text-zinc-400 leading-relaxed">
              Enquanto você fala, Perssua ouve e sugere fatos, argumentos e respostas a perguntas difíceis.
            </p>
          </div>
        </div>

        {/* Objection Management */}
        <div className="bg-card border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between h-[400px] relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-full mb-8">
             <div className="bg-black border border-white/10 rounded-xl p-6 shadow-2xl">
                 <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                     <span className="text-xs font-medium text-zinc-400">Dicas da AI</span>
                     <div className="w-2 h-2 rounded-full bg-white/20" />
                 </div>
                 <p className="text-sm text-zinc-300 leading-relaxed">
                   "Entendo perfeitamente a importância do seu tempo. Vamos direto aos benefícios chave..."
                 </p>
             </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-normal mb-3 font-['DM_Sans']">Gestão de Objeções</h3>
            <p className="text-zinc-400 leading-relaxed">
              Obtenha réplicas persuasivas e contextualizadas para manter o controle da conversa e fechar com autoridade.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center my-20">
         <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase mb-8">
          Aplicações
        </span>
        <h2 className="text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans']">
          Para quem lidera, vende, entrevista ou apresenta
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          {
            icon: Tag,
            title: "Profissionais de Vendas",
            desc: "Feche mais negócios ao responder objeções com dados e confiança."
          },
          {
            icon: PiggyBank,
            title: "Empreendedores",
            desc: "Apresente sua visão de forma convincente e conquiste investidores e clientes."
          },
          {
            icon: TrendingUp,
            title: "Executivos & Diretores",
            desc: "Conduza reuniões estratégicas com dados instantâneos ao seu alcance."
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-white/10 rounded-3xl p-8 flex flex-col justify-end h-[320px] hover:bg-white/5 transition-colors group"
          >
            <item.icon className="w-8 h-8 text-white mb-auto opacity-80 group-hover:opacity-100 transition-opacity" />
            <div>
              <h3 className="text-xl font-normal mb-3 font-['DM_Sans']">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: CheckCircle2,
            title: "Entrevistadores",
            desc: "Formule perguntas de impacto e reaja a respostas imprevistas com sugestões de seguimento em tempo real."
          },
          {
            icon: Mic,
            title: "Qualquer Apresentador",
            desc: "De entrevistas a conferências, eleve sua performance."
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-white/10 rounded-3xl p-8 flex flex-col justify-end h-[280px] hover:bg-white/5 transition-colors group"
          >
            <item.icon className="w-8 h-8 text-white mb-auto opacity-80 group-hover:opacity-100 transition-opacity" />
            <div>
              <h3 className="text-xl font-normal mb-3 font-['DM_Sans']">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
