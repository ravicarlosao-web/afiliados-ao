import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AiTipCard } from "@/components/ai-tip-card";
import { FeaturesGrid } from "@/components/features-grid";
import { ValueProposition } from "@/components/value-proposition";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { StarField } from "@/components/star-field";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <StarField />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <AiTipCard />
        <FeaturesGrid />
        <ValueProposition />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
