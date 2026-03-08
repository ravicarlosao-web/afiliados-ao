import { UserPlus, Search, PenSquare, CreditCard, Wallet, Calculator, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const ease = [0.16, 1, 0.3, 1];

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 mt-8 sm:mt-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="space-y-5 sm:space-y-6"
        >
          <h3 className="text-2xl sm:text-3xl font-normal font-['DM_Sans']">Calculadora de Ganhos</h3>
          <p className="text-zinc-400 text-sm sm:text-base">Simule quanto você pode ganhar mensalmente indicando nossos serviços.</p>
          
          <div className="space-y-3 sm:space-y-4">
            <label className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider">Número de vendas por mês</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={sales} 
                onChange={(e) => setSales(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span className="text-xl sm:text-2xl font-medium w-12 text-center">{sales}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease }}
                className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <span className="text-zinc-300 text-sm sm:text-base">Se vender {plan.name}:</span>
                <span className="text-lg sm:text-xl font-medium text-white">
                  Kz {(plan.commission * sales).toLocaleString('pt-PT')},00
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -6 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative group"
          style={{ perspective: 1000 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
            <Calculator className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-4 sm:mb-6 opacity-50" />
            <div className="text-zinc-500 text-xs sm:text-sm mb-2 uppercase tracking-widest">Potencial de Ganho Máximo</div>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['DM_Sans'] mb-3 sm:mb-4">
              Kz {(70000 * sales).toLocaleString('pt-PT')},00
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm italic">*Baseado no plano Premium</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FeaturesGrid() {
  const steps = [
    {
      icon: UserPlus,
      title: "Cadastre-se gratuitamente",
      desc: "Crie sua conta no Afiliados.ao em poucos minutos e tenha acesso ao seu painel de afiliado, materiais de venda e acompanhamento em tempo real.",
      visual: (
        <div className="bg-black/40 px-4 sm:px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-3 sm:gap-4">
          <AudioWave />
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] shrink-0">
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
        <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-6 shadow-2xl w-full">
          <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-white/10 pb-3">
            <span className="text-xs font-medium text-zinc-400">Mensagem de Venda</span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
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
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
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
        <div className="flex items-center gap-3 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10 w-full">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-green-500" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</div>
            <div className="text-sm text-zinc-200 font-medium truncate">Pagamento Confirmado</div>
          </div>
        </div>
      )
    },
    {
      icon: Wallet,
      title: "Receba sua comissão automaticamente",
      desc: "Após a conclusão do projeto, sua comissão é liberada. Tudo fica registrado no sistema, com histórico, valores e total ganho.",
      visual: (
        <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl w-full text-center">
          <div className="text-xs text-zinc-500 mb-1">Comissão Disponível</div>
          <div className="text-xl sm:text-2xl font-['DM_Sans'] text-white">Kz 25.000,00</div>
          <div className="mt-2 sm:mt-3 py-1.5 px-3 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-tighter inline-block">
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
    <section id="applications" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 container mx-auto overflow-hidden" aria-label="Como funciona o programa de afiliados e tabelas de comissão" itemScope itemType="https://schema.org/ItemList">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase"
        >
          COMO FUNCIONA
        </motion.span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans']">
          Como funciona o Afiliados.ao
        </h2>
        <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto">
          Um processo simples, transparente e feito para você ganhar sem complicação.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-24">
        {steps.slice(0, 2).map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -60 : 60, rotateY: i === 0 ? 5 : -5 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.15, ease }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="bg-card border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 flex flex-col justify-between min-h-[320px] sm:min-h-[400px] md:min-h-[450px] relative overflow-hidden group hover:border-white/20 transition-colors"
            style={{ perspective: 1000 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-full bg-white/5 rounded-xl sm:rounded-2xl h-28 sm:h-32 md:h-40 flex items-center justify-center mb-5 sm:mb-8 border border-white/5 p-4 sm:p-6 overflow-hidden">
               {step.visual}
            </div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-normal mb-2 sm:mb-3 font-['DM_Sans']">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {steps.slice(2).map((step, i) => {
          const directions = [
            { x: -50, rotate: 2 },
            { y: 50, rotate: 0 },
            { x: 50, rotate: -2 },
          ];
          const dir = directions[i] || directions[0];
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: dir.x || 0, y: dir.y || 0, rotate: dir.rotate }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-card border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[380px] md:min-h-[420px] hover:bg-white/5 transition-colors group relative overflow-hidden"
            >
              <div className="relative w-full bg-white/5 rounded-xl h-24 sm:h-28 md:h-32 flex items-center justify-center mb-4 sm:mb-6 border border-white/5 p-3 sm:p-4">
                 {step.visual}
              </div>
              
              <div className="relative z-10">
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-3 sm:mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg sm:text-xl font-normal mb-2 sm:mb-3 font-['DM_Sans']">{step.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="text-center my-14 sm:my-20 md:my-24 space-y-3 sm:space-y-4"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase"
        >
          Tabelas de Comissão
        </motion.span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans']">
          Quanto você ganha por cada indicação
        </h2>
        <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto">
          Oferecemos comissões generosas em todos os nossos planos de criação de websites.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {plans.map((plan, i) => {
          const directions = [
            { x: -60, rotate: 2 },
            { y: 50, rotate: 0 },
            { x: 60, rotate: -2 },
          ];
          const dir = directions[i];
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: dir.x || 0, y: dir.y || 0, rotate: dir.rotate, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
              className="bg-card border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col h-full hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="mb-5 sm:mb-8">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6 border border-white/10"
                >
                  <plan.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-normal mb-2 font-['DM_Sans']">{plan.title}</h3>
                <div className="text-zinc-500 text-xs sm:text-sm mb-3 sm:mb-4">{plan.desc}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 tracking-tight">{plan.price}</div>
              </div>

              <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5">
                <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mb-1">Comissão do Afiliado</div>
                <div className="text-xl sm:text-2xl font-['DM_Sans'] text-green-400 font-medium">
                  {plan.commission} <span className="text-xs sm:text-sm font-normal text-zinc-400">por venda</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <CommissionCalculator />
    </section>
  );
}
