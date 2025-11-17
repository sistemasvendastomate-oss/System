import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Verificar senha atual
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex === -1) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    const currentUser = users[userIndex];
    
    if (currentPassword && currentUser.password !== currentPassword) {
      toast({
        title: 'Senha incorreta',
        description: 'A senha atual está incorreta.',
        variant: 'destructive',
      });
      return;
    }

    // Validar nova senha
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast({
          title: 'Senhas não coincidem',
          description: 'A nova senha e a confirmação devem ser iguais.',
          variant: 'destructive',
        });
        return;
      }
      
      if (newPassword.length < 6) {
        toast({
          title: 'Senha muito curta',
          description: 'A senha deve ter no mínimo 6 caracteres.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Atualizar dados
    if (email) {
      currentUser.email = email;
    }
    if (newPassword) {
      currentUser.password = newPassword;
    }

    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Atualizar usuário logado
    const updatedUserData = {
      ...user,
      email: currentUser.email,
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUserData));

    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram atualizadas com sucesso.',
    });

    // Limpar campos de senha
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Meu Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome de Usuário</Label>
                  <Input value={user?.username || ''} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Nome Completo / Razão Social</Label>
                  <Input value={user?.fullName || ''} disabled />
                </div>

                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input value={user?.cnpj || ''} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Alterar Senha</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite a nova senha"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite novamente a nova senha"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
