import { UserPlus, Search, PenSquare, CreditCard, Wallet, Mic, CheckCircle2, TrendingUp, PiggyBank, Tag } from "lucide-react";
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
  const steps = [
    {
      icon: UserPlus,
      title: "Cadastre-se gratuitamente",
      desc: "Crie sua conta no Afiliados.ao em poucos minutos e tenha acesso ao seu painel de afiliado, materiais de venda e acompanhamento em tempo real.",
      visual: (
        <div className="bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-4">
          <AudioWave />
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <UserPlus className="w-4 h-4 text-black" />
          </div>
          <AudioWave />
        </div>
      )
    },
    {
      icon: Search,
      title: "Encontre clientes e apresente a proposta",
      desc: "Você usa seus próprios contactos, redes sociais ou indicações para encontrar empresários interessados. O Afiliados.ao fornece a estrutura, as mensagens e os serviços prontos para você vender com segurança.",
      visual: (
        <div className="bg-black border border-white/10 rounded-xl p-6 shadow-2xl w-full">
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <span className="text-xs font-medium text-zinc-400">Mensagem de Venda</span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            "Olá! Notei que sua empresa ainda não tem uma presença digital forte. O Afiliados.ao pode ajudar..."
          </p>
        </div>
      )
    },
    {
      icon: PenSquare,
      title: "Registre cada venda no painel",
      desc: "Assim que o cliente aceitar, registre a venda no sistema. Todo o processo fica organizado, transparente e seguro para você e para a empresa.",
      visual: (
        <div className="bg-black border border-white/10 rounded-xl p-4 shadow-2xl w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
              <PenSquare className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-xs font-medium text-zinc-300">Nova Venda #882</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white w-2/3" />
          </div>
        </div>
      )
    },
    {
      icon: CreditCard,
      title: "Pagamento seguro e produção do site",
      desc: "O cliente paga diretamente à empresa. Após o pagamento, o site entra em produção e você acompanha tudo pelo seu painel, sem se preocupar com entrega ou suporte.",
      visual: (
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 w-full">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</div>
            <div className="text-sm text-zinc-200 font-medium">Pagamento Confirmado</div>
          </div>
        </div>
      )
    },
    {
      icon: Wallet,
      title: "Receba sua comissão automaticamente",
      desc: "Após a conclusão do projeto, sua comissão é liberada. Tudo fica registrado no sistema, com histórico, valores e total ganho.",
      visual: (
        <div className="bg-black border border-white/10 rounded-xl p-5 shadow-2xl w-full text-center">
          <div className="text-xs text-zinc-500 mb-1">Comissão Disponível</div>
          <div className="text-2xl font-['DM_Sans'] text-white">Kz 25.000,00</div>
          <div className="mt-3 py-1.5 px-3 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">
            Sacar Agora
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="applications" className="py-24 px-6 container mx-auto">
      <div className="text-center mb-16 space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          COMO FUNCIONA
        </span>
        <h2 className="text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans']">
          Como funciona o Afiliados.ao
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Um processo simples, transparente e feito para você ganhar sem complicação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        {steps.slice(0, 2).map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between h-[450px] relative overflow-hidden group hover:border-white/20 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-full bg-white/5 rounded-2xl h-40 flex items-center justify-center mb-8 border border-white/5 p-6">
               {step.visual}
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-normal mb-3 font-['DM_Sans']">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {steps.slice(2).map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-white/10 rounded-3xl p-8 flex flex-col justify-between h-[420px] hover:bg-white/5 transition-colors group relative overflow-hidden"
          >
            <div className="relative w-full bg-white/5 rounded-xl h-32 flex items-center justify-center mb-6 border border-white/5 p-4">
               {step.visual}
            </div>
            
            <div className="relative z-10">
              <step.icon className="w-6 h-6 text-white mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-normal mb-3 font-['DM_Sans']">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
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
