import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  message: z.string().trim().min(1, 'Mensagem é obrigatória').max(1000),
});

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = contactSchema.parse(formData);
      const phoneNumber = '5511999999999';
      const message = encodeURIComponent(
        `*Nova Mensagem de Contato*\n\nNome: ${validated.name}\nEmail: ${validated.email}\nMensagem: ${validated.message}`
      );
      
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank');
      
      setFormData({ name: '', email: '', message: '' });
      toast({
        title: 'Mensagem enviada!',
        description: 'Você será redirecionado para o WhatsApp',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erro no formulário',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Entre em Contato
            </h1>
            <p className="text-lg text-muted-foreground">
              Estamos aqui para ajudar você
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Telefone</h3>
                    <p className="text-muted-foreground">(11) 99999-9999</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">contato@meucatalogo.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Endereço</h3>
                    <p className="text-muted-foreground">
                      Rua Exemplo, 123 - São Paulo, SP
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground">
                      Atendimento rápido pelo WhatsApp
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Seu email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Sua mensagem"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      maxLength={1000}
                      rows={6}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Enviar via WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
