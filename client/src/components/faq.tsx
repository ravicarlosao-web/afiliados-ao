import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export function FAQ() {
  const items = [
    {
      value: "item-1",
      question: "Como recebo minhas comissões?",
      answer: "As comissões são pagas via transferência bancária ou IBAN assim que o site do cliente for entregue e o pagamento for confirmado. Você pode solicitar o saque diretamente pelo seu painel."
    },
    {
      value: "item-2",
      question: "Preciso pagar alguma taxa para ser afiliado?",
      answer: "Não, o cadastro no Afiliados.ao é 100% gratuito. Você não paga nada para começar a vender e lucrar com as suas indicações."
    },
    {
      value: "item-3",
      question: "Quais serviços posso vender?",
      answer: "Atualmente, você pode vender nossos três pacotes principais de websites: Essencial, Profissional e Premium. Cada um possui um valor de comissão específico que você pode consultar na nossa tabela."
    },
    {
      value: "item-4",
      question: "Como acompanho minhas vendas?",
      answer: "Você terá acesso a um painel exclusivo de afiliado onde poderá registrar suas vendas, acompanhar o status da produção dos sites e ver seu saldo de comissões em tempo real."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-10 sm:mb-16 space-y-4 sm:space-y-6"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Perguntas Frequentes
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['DM_Sans']">
          Alguma dúvida? Aqui está a resposta
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base">
          Ainda ficou com alguma dúvida? Mande uma mensagem para{" "}
          <a href="mailto:suporte@afiliados.ao" className="text-white hover:underline">suporte@afiliados.ao</a>
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.value}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <AccordionItem value={item.value} className="bg-card border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6">
                <AccordionTrigger className="text-base sm:text-lg font-medium hover:no-underline py-4 sm:py-6 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400 text-sm sm:text-base pb-4 sm:pb-6 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
