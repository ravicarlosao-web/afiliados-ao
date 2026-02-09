import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 container mx-auto">
      <div className="text-center mb-16 space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Perguntas Frequentes
        </span>
        <h2 className="text-4xl md:text-5xl font-normal font-['DM_Sans']">
          Alguma dúvida? Aqui está a resposta
        </h2>
        <p className="text-zinc-400">
          Ainda ficou com alguma dúvida? Mande uma mensagem para{" "}
          <a href="mailto:suporte@afiliados.ao" className="text-white hover:underline">suporte@afiliados.ao</a>
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 text-left">
              Como recebo minhas comissões?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              As comissões são pagas via transferência bancária ou IBAN assim que o site do cliente for entregue e o pagamento for confirmado. Você pode solicitar o saque diretamente pelo seu painel.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 text-left">
              Preciso pagar alguma taxa para ser afiliado?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              Não, o cadastro no Afiliados.ao é 100% gratuito. Você não paga nada para começar a vender e lucrar com as suas indicações.
            </AccordionContent>
          </AccordionItem>
          
           <AccordionItem value="item-3" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 text-left">
              Quais serviços posso vender?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              Atualmente, você pode vender nossos três pacotes principais de websites: Essencial, Profissional e Premium. Cada um possui um valor de comissão específico que você pode consultar na nossa tabela.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 text-left">
              Como acompanho minhas vendas?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              Você terá acesso a um painel exclusivo de afiliado onde poderá registrar suas vendas, acompanhar o status da produção dos sites e ver seu saldo de comissões em tempo real.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
