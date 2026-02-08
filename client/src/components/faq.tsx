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
          Perguntas
        </span>
        <h2 className="text-4xl md:text-5xl font-semibold">
          Alguma dúvida? Aqui está a resposta
        </h2>
        <p className="text-zinc-400">
          Ainda ficou com alguma dúvida? Mande um email para{" "}
          <a href="mailto:help@perssua.com" className="text-white hover:underline">help@perssua.com</a>
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6">
              O download é gratuito?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              Sim, você pode baixar e testar gratuitamente. Assinatura é oferecida dentro do aplicativo caso decida utilizar no seu dia a dia.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6">
              Qual idioma o aplicativo utiliza?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              O Perssua suporta múltiplos idiomas, incluindo Português, Inglês e Espanhol, adaptando-se automaticamente ao idioma detectado na sua reunião.
            </AccordionContent>
          </AccordionItem>
          
           <AccordionItem value="item-3" className="bg-card border border-white/10 rounded-2xl px-6">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6">
              Funciona em quais plataformas?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
              Atualmente temos integração nativa com Zoom, Google Meet, Microsoft Teams e Hangouts via aplicativo Windows.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
