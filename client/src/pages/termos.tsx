import { StarField } from "@/components/star-field";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Termos() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <StarField />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-4">
              Termos de Serviço
            </h1>
            <p className="text-white/40">Última atualização: 24 de Fevereiro de 2026</p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-3">1. Aceitação dos Termos</h2>
                  <p className="text-white/70 leading-relaxed">
                    Ao aceder e utilizar a plataforma Afiliados.ao, você concorda em cumprir e estar vinculado aos seguintes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deverá utilizar os nossos serviços.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-3">2. Elegibilidade do Afiliado</h2>
                  <p className="text-white/70 leading-relaxed">
                    Para ser um afiliado, você deve ter pelo menos 18 anos de idade e possuir capacidade legal para celebrar contratos. A conta de afiliado é pessoal e intransferível.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-3">3. Comissões e Pagamentos</h2>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>As comissões são geradas apenas por vendas confirmadas através do seu link de afiliado.</li>
                    <li>O valor padrão da comissão é de Kz 20.000 por venda de site profissional, sujeito a alterações conforme campanhas vigentes.</li>
                    <li>Os pagamentos são processados via IBAN, Unitel Money ou Afrimoney num prazo de até 48h úteis após a solicitação.</li>
                    <li>O saldo mínimo para saque é de Kz 5.000.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-3">4. Conduta Proibida</h2>
                  <p className="text-white/70 leading-relaxed">
                    É estritamente proibido o uso de SPAM, publicidade enganosa, ou qualquer método que viole as leis angolanas de proteção de dados e comércio eletrónico. A violação destas regras resultará no banimento imediato da conta e perda de saldos acumulados.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-3">5. Limitação de Responsabilidade</h2>
                  <p className="text-white/70 leading-relaxed">
                    A Afiliados.ao não garante ganhos fixos. O sucesso do afiliado depende exclusivamente do seu esforço e estratégias de venda. Não nos responsabilizamos por perdas decorrentes de mau uso da plataforma.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
