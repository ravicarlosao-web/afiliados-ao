import { StarField } from "@/components/star-field";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <StarField />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-4">
              Política de Privacidade
            </h1>
            <p className="text-white/40">Última atualização: 24 de Fevereiro de 2026</p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-blue-500 mb-3">1. Informações que Coletamos</h2>
                  <p className="text-white/70 leading-relaxed">
                    Coletamos informações básicas para o seu funcionamento como afiliado: Nome completo, número de telefone e dados bancários/carteira móvel para processamento de pagamentos.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-500 mb-3">2. Uso dos Dados</h2>
                  <p className="text-white/70 leading-relaxed">
                    Seus dados são utilizados exclusivamente para:
                  </p>
                  <ul className="list-disc list-inside text-white/70 mt-2 space-y-1">
                    <li>Identificação da sua conta de afiliado.</li>
                    <li>Comunicação sobre vendas e novidades da plataforma.</li>
                    <li>Processamento seguro dos seus saques.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-500 mb-3">3. Proteção de Dados</h2>
                  <p className="text-white/70 leading-relaxed">
                    Utilizamos criptografia de ponta a ponta e servidores seguros para garantir que suas informações não sejam acessadas por terceiros não autorizados. Seguimos as diretrizes da Lei de Proteção de Dados Pessoais de Angola.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-500 mb-3">4. Partilha com Terceiros</h2>
                  <p className="text-white/70 leading-relaxed">
                    Não vendemos nem alugamos seus dados para fins de marketing. Partilhamos apenas as informações estritamente necessárias com as instituições financeiras (Bancos, Unitel Money, Afrimoney) para efetivar seus pagamentos.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-500 mb-3">5. Seus Direitos</h2>
                  <p className="text-white/70 leading-relaxed">
                    Você pode solicitar a qualquer momento o acesso, correção ou exclusão definitiva dos seus dados através do nosso suporte oficial no WhatsApp ou nas configurações do seu perfil.
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
