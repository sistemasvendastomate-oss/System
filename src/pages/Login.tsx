import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const [usernameOrCnpj, setUsernameOrCnpj] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(usernameOrCnpj, password)) {
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Erro ao fazer login',
        description: 'Usuário/CNPJ ou senha incorretos.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {settings.logoUrl && (
            <div className="flex justify-center mb-4">
              <img src={settings.logoUrl} alt={settings.siteName} className="h-16 w-auto object-contain" />
            </div>
          )}
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário ou CNPJ</Label>
              <Input
                id="username"
                type="text"
                value={usernameOrCnpj}
                onChange={(e) => setUsernameOrCnpj(e.target.value)}
                placeholder="Digite seu usuário ou CNPJ"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary">
              Entrar
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center">
            <Button
              variant="link"
              className="text-sm text-primary"
              onClick={() => navigate('/recuperar-senha')}
              type="button"
            >
              Esqueceu sua senha?
            </Button>
            <p className="text-sm text-muted-foreground">
              Usuário admin padrão: <strong>admin</strong> / Senha: <strong>admin123</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
