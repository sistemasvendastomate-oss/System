import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail } from 'lucide-react';

export const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'E-mail inválido',
        description: 'Por favor, insira um e-mail válido.',
        variant: 'destructive',
      });
      return;
    }

    // Verificar se o e-mail existe no sistema
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === email);

    if (!userExists) {
      toast({
        title: 'E-mail não encontrado',
        description: 'Não encontramos nenhuma conta com este e-mail.',
        variant: 'destructive',
      });
      return;
    }

    // Simular envio de e-mail
    setIsSubmitted(true);
    toast({
      title: 'E-mail enviado!',
      description: 'Instruções de recuperação foram enviadas para seu e-mail.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? 'Verifique sua caixa de entrada'
              : 'Digite seu e-mail para receber instruções de recuperação'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Instruções
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enviamos um e-mail com instruções para <strong>{email}</strong>.
                Verifique sua caixa de entrada e spam.
              </p>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>
          )}
          
          {!isSubmitted && (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
