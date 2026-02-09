import { UserPlus, Search, PenSquare, CreditCard, Wallet, Calculator, CheckCircle2, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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

function CommissionCalculator() {
  const [sales, setSales] = useState(1);
  const plans = [
    { name: "Essencial", commission: 20000 },
    { name: "Profissional", commission: 40000 },
    { name: "Premium", commission: 70000 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl font-normal font-['DM_Sans']">Calculadora de Ganhos</h3>
          <p className="text-zinc-400">Simule quanto você pode ganhar mensalmente indicando nossos serviços.</p>
          
          <div className="space-y-4">
            <label className="text-sm text-zinc-500 uppercase tracking-wider">Número de vendas por mês</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={sales} 
                onChange={(e) => setSales(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span className="text-2xl font-medium w-12 text-center">{sales}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-300">Se vender {plan.name}:</span>
                <span className="text-xl font-medium text-white">
                  Kz {(plan.commission * sales).toLocaleString('pt-PT')},00
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black rounded-2xl p-8 border border-white/10 text-center">
            <Calculator className="w-12 h-12 text-white mx-auto mb-6 opacity-50" />
            <div className="text-zinc-500 text-sm mb-2 uppercase tracking-widest">Potencial de Ganho Máximo</div>
            <div className="text-5xl md:text-6xl font-['DM_Sans'] mb-4">
              Kz {(70000 * sales).toLocaleString('pt-PT')},00
            </div>
            <p className="text-zinc-400 text-sm italic">*Baseado no plano Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const plans = [
    {
      title: "Website Essencial",
      price: "130.000 Kz",
      commission: "20.000 Kz",
      icon: Zap,
      desc: "Ideal para pequenos negócios que precisam de uma presença digital rápida e eficiente."
    },
    {
      title: "Website Profissional",
      price: "250.000 Kz",
      commission: "40.000 Kz",
      icon: ShieldCheck,
      desc: "A solução completa para empresas em crescimento com funcionalidades avançadas."
    },
    {
      title: "Website Premium",
      price: "400.000 Kz",
      commission: "70.000 Kz",
      icon: Globe,
      desc: "Experiência digital exclusiva com design personalizado e performance máxima."
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

      <div className="text-center my-24 space-y-4">
         <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Tabelas de Comissão
        </span>
        <h2 className="text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans']">
          Quanto você ganha por cada indicação
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Oferecemos comissões generosas em todos os nossos planos de criação de websites.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-white/10 rounded-3xl p-8 flex flex-col h-full hover:border-white/20 transition-all group relative overflow-hidden"
          >
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <plan.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-normal mb-2 font-['DM_Sans']">{plan.title}</h3>
              <div className="text-zinc-500 text-sm mb-4">{plan.desc}</div>
              <div className="text-3xl font-bold text-white mb-6 tracking-tight">{plan.price}</div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Comissão do Afiliado</div>
              <div className="text-2xl font-['DM_Sans'] text-green-400 font-medium">
                {plan.commission} <span className="text-sm font-normal text-zinc-400">por venda</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <CommissionCalculator />
    </section>
  );
}
