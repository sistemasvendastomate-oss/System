import { Store, Heart, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Sobre Nós
            </h1>
            <p className="text-lg text-muted-foreground">
              Conheça nossa história e nossos valores
            </p>
          </div>

          <div className="mb-12 rounded-2xl bg-card p-8 shadow-card">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Nossa História
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Fundada com o objetivo de oferecer os melhores produtos com a melhor experiência de compra,
              nossa loja se dedica a trazer qualidade e inovação para nossos clientes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Trabalhamos com marcas reconhecidas e garantimos a procedência de todos os nossos produtos.
              Nossa missão é proporcionar satisfação e confiança em cada compra.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Qualidade
                </h3>
                <p className="text-sm text-muted-foreground">
                  Produtos selecionados com os mais altos padrões de qualidade
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Atendimento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Suporte dedicado para garantir sua satisfação
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Agilidade
                </h3>
                <p className="text-sm text-muted-foreground">
                  Entrega rápida e eficiente para todo o Brasil
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
