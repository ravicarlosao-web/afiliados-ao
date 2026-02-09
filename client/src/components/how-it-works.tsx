import { UserPlus, Search, ClipboardCheck, CreditCard, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Cadastre-se gratuitamente",
      desc: "Crie sua conta no Afiliados.ao em poucos minutos e tenha acesso ao seu painel de afiliado, materiais de venda e acompanhamento em tempo real."
    },
    {
      icon: Search,
      title: "Encontre clientes e apresente a proposta",
      desc: "Você usa seus próprios contactos, redes sociais ou indicações para encontrar empresários interessados. O Afiliados.ao fornece a estrutura, as mensagens e os serviços prontos para você vender com segurança."
    },
    {
      icon: ClipboardCheck,
      title: "Registre cada venda no painel",
      desc: "Assim que o cliente aceitar, registre a venda no sistema. Todo o processo fica organizado, transparente e seguro para você e para a empresa."
    },
    {
      icon: CreditCard,
      title: "Pagamento seguro e produção do site",
      desc: "O cliente paga diretamente à empresa. Após o pagamento, o site entra em produção e você acompanha tudo pelo seu painel, sem se preocupar com entrega ou suporte."
    },
    {
      icon: Wallet,
      title: "Receba sua comissão automaticamente",
      desc: "Após a conclusão do projeto, sua comissão é liberada. Tudo fica registrado no sistema, com histórico, valores e total ganho."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 container mx-auto">
      <div className="text-center mb-16 space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Fluxo de Trabalho
        </span>
        <h2 className="text-4xl md:text-5xl font-normal max-w-3xl mx-auto leading-tight font-['DM_Sans'] tracking-tight">
          Como funciona o Afiliados.ao
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Um processo simples, transparente e feito para você ganhar sem complicação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`bg-card border border-white/10 rounded-3xl p-8 flex flex-col justify-between min-h-[320px] hover:bg-white/5 transition-all group ${
              i >= 3 ? 'lg:col-start-auto' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 group-hover:scale-110 transition-transform">
              <step.icon className="w-6 h-6 text-white opacity-80 group-hover:opacity-100" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-[10px] font-bold text-zinc-500 border border-white/5">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-normal font-['DM_Sans'] leading-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
