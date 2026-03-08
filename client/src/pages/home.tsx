import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AiTipCard } from "@/components/ai-tip-card";
import { FeaturesGrid } from "@/components/features-grid";
import { ValueProposition } from "@/components/value-proposition";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { StarField } from "@/components/star-field";
import { SeoContent } from "@/components/seo-content";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Afiliados.ao — Ganhe Dinheiro na Internet em Angola | Marketing de Afiliados";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Afiliados.ao é a plataforma nº1 de marketing de afiliados em Angola. Ganhe dinheiro na internet indicando websites. Comissões de 20.000 a 70.000 Kz por venda. Cadastre-se grátis!");
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="name" content="Afiliados.ao - Ganhe Dinheiro na Internet em Angola" />
      <meta itemProp="description" content="Plataforma de marketing de afiliados em Angola. Ganhe comissões de até 70.000 Kz por venda indicando websites." />
      
      <StarField />
      <Navbar />
      <main className="relative z-10" role="main">
        <Hero />
        <AiTipCard />
        <FeaturesGrid />
        <ValueProposition />
        <FAQ />
      </main>
      <Footer />
      <SeoContent />
    </div>
  );
}
