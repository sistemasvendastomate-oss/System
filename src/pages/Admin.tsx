import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Trash2, Edit, Plus, Save, X, Settings } from 'lucide-react';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
  fullName?: string;
  cnpj?: string;
  email?: string;
}

export const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newUser, setNewUser] = useState({ 
    username: '', 
    password: '', 
    role: 'user' as const,
    fullName: '',
    cnpj: '',
    email: ''
  });
  const [newImages, setNewImages] = useState<string[]>(['', '', '', '', '']);
  const [editImages, setEditImages] = useState<string[]>(['', '', '', '', '']);
  const [newSpecs, setNewSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [editSpecs, setEditSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl);

  useEffect(() => {
    loadProducts();
    loadUsers();
  }, []);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      import('@/data/products').then(({ products: defaultProducts }) => {
        setProducts(defaultProducts);
        localStorage.setItem('products', JSON.stringify(defaultProducts));
      });
    }
  };

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('users');
    setUsers(savedUsers ? JSON.parse(savedUsers) : []);
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.sku || !newProduct.brand) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const filteredImages = newImages.filter(img => img.trim() !== '');
    const specifications = newSpecs.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description || '',
      image: filteredImages[0] || newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      images: filteredImages.length > 0 ? filteredImages : undefined,
      category: newProduct.category || 'Eletrônicos',
      brand: newProduct.brand,
      sku: newProduct.sku,
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
      quantityPerBox: newProduct.quantityPerBox || undefined,
      discount: newProduct.discount || undefined,
      isFeatured: newProduct.isFeatured || false,
      createdAt: new Date().toISOString(),
    };

    saveProducts([...products, product]);
    setNewProduct({});
    setNewImages(['', '', '', '', '']);
    setNewSpecs([{ key: '', value: '' }]);
    toast({ title: 'Produto adicionado com sucesso!' });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    const filteredImages = editImages.filter(img => img.trim() !== '');
    const specifications = editSpecs.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const updatedProduct = {
      ...editingProduct,
      images: filteredImages.length > 0 ? filteredImages : undefined,
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    };

    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveProducts(updatedProducts);
    setEditingProduct(null);
    setEditImages(['', '', '', '', '']);
    setEditSpecs([{ key: '', value: '' }]);
    toast({ title: 'Produto atualizado com sucesso!' });
  };

  const handleDeleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
    toast({ title: 'Produto removido com sucesso!' });
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.email) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios (Usuário, Senha e E-mail)',
        variant: 'destructive',
      });
      return;
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: 'Erro',
        description: 'E-mail inválido',
        variant: 'destructive',
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      createdAt: new Date().toISOString(),
      fullName: newUser.fullName || undefined,
      cnpj: newUser.cnpj || undefined,
      email: newUser.email,
    };

    saveUsers([...users, user]);
    setNewUser({ username: '', password: '', role: 'user', fullName: '', cnpj: '', email: '' });
    toast({ title: 'Usuário criado com sucesso!' });
  };

  const handleDeleteUser = (id: string) => {
    saveUsers(users.filter(u => u.id !== id));
    toast({ title: 'Usuário removido com sucesso!' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Painel Administrativo</h1>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add New Product */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Adicionar Novo Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome *</Label>
                    <Input
                      value={newProduct.name || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>SKU *</Label>
                    <Input
                      value={newProduct.sku || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="Ex: MDK-006"
                    />
                  </div>
                  <div>
                    <Label>Marca *</Label>
                    <Input
                      value={newProduct.brand || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Preço *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      value={newProduct.category || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Quantidade por Caixa</Label>
                    <Input
                      type="number"
                      value={newProduct.quantityPerBox || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, quantityPerBox: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Desconto (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newProduct.discount || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProduct.isFeatured || false}
                      onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Produto em Destaque</Label>
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Imagens do Produto (até 5)</Label>
                  <div className="space-y-2">
                    {newImages.map((img, index) => (
                      <Input
                        key={index}
                        placeholder={`URL Imagem ${index + 1}${index === 0 ? ' (Principal)' : ''}`}
                        value={img}
                        onChange={(e) => {
                          const updated = [...newImages];
                          updated[index] = e.target.value;
                          setNewImages(updated);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Especificações Técnicas</Label>
                  <div className="space-y-2">
                    {newSpecs.map((spec, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Nome da especificação"
                          value={spec.key}
                          onChange={(e) => {
                            const updated = [...newSpecs];
                            updated[index].key = e.target.value;
                            setNewSpecs(updated);
                          }}
                        />
                        <Input
                          placeholder="Valor"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...newSpecs];
                            updated[index].value = e.target.value;
                            setNewSpecs(updated);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewSpecs([...newSpecs, { key: '', value: '' }])}
                    >
                      + Adicionar Especificação
                    </Button>
                  </div>
                </div>
                <Button onClick={handleAddProduct} className="w-full bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </CardContent>
            </Card>

            {/* Products List */}
            <div className="grid grid-cols-1 gap-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>SKU</Label>
                            <Input
                              value={editingProduct.sku}
                              onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Marca</Label>
                            <Input
                              value={editingProduct.brand}
                              onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Preço</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Categoria</Label>
                            <Input
                              value={editingProduct.category}
                              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Quantidade por Caixa</Label>
                            <Input
                              type="number"
                              value={editingProduct.quantityPerBox || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, quantityPerBox: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Desconto (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={editingProduct.discount || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center space-x-2 col-span-2">
                            <input
                              type="checkbox"
                              id="edit-featured"
                              checked={editingProduct.isFeatured || false}
                              onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="edit-featured" className="cursor-pointer">Produto em Destaque</Label>
                          </div>
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Textarea
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Imagens (até 5)</Label>
                          <div className="space-y-2">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <Input
                                key={index}
                                placeholder={`URL Imagem ${index + 1}${index === 0 ? ' (Principal)' : ''}`}
                                value={editingProduct.images?.[index] || ''}
                                onChange={(e) => {
                                  const updated = [...(editingProduct.images || ['', '', '', '', ''])];
                                  updated[index] = e.target.value;
                                  setEditingProduct({ ...editingProduct, images: updated });
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Especificações Técnicas</Label>
                          <div className="space-y-2">
                            {Object.entries(editingProduct.specifications || {}).map(([key, value], index) => (
                              <div key={index} className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Nome da especificação"
                                  value={key}
                                  onChange={(e) => {
                                    const specs = { ...editingProduct.specifications };
                                    delete specs[key];
                                    specs[e.target.value] = value;
                                    setEditingProduct({ ...editingProduct, specifications: specs });
                                  }}
                                />
                                <Input
                                  placeholder="Valor"
                                  value={value}
                                  onChange={(e) => {
                                    const specs = { ...editingProduct.specifications };
                                    specs[key] = e.target.value;
                                    setEditingProduct({ ...editingProduct, specifications: specs });
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateProduct} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button onClick={() => setEditingProduct(null)} variant="outline" className="flex-1">
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku} | Marca: {product.brand} | R$ {product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Add New User */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Criar Nova Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome de Usuário *</Label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="Digite o nome de usuário"
                    />
                  </div>
                  <div>
                    <Label>Senha *</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Digite a senha"
                    />
                  </div>
                  <div>
                    <Label>Nome Completo ou Razão Social</Label>
                    <Input
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  <div>
                    <Label>CNPJ</Label>
                    <Input
                      value={newUser.cnpj}
                      onChange={(e) => setNewUser({ ...newUser, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>E-mail *</Label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
                <Button onClick={handleAddUser} className="w-full bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Usuário
                </Button>
              </CardContent>
            </Card>

            {/* Users List */}
            <div className="grid grid-cols-1 gap-4">
              {users.map(user => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.username}</h3>
                        {user.fullName && (
                          <p className="text-sm text-muted-foreground">{user.fullName}</p>
                        )}
                        {user.cnpj && (
                          <p className="text-sm text-muted-foreground">CNPJ: {user.cnpj}</p>
                        )}
                        {user.email && (
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {users.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Site
                </CardTitle>
                <CardDescription>
                  Personalize a logo e o favicon do seu catálogo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>URL da Logo</Label>
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Esta logo será exibida no cabeçalho e na página de login
                  </p>
                </div>
                <div>
                  <Label>URL do Favicon</Label>
                  <Input
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://exemplo.com/favicon.ico"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    O favicon aparece na aba do navegador
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    updateSettings({ logoUrl, faviconUrl });
                    toast({
                      title: 'Configurações salvas!',
                      description: 'As alterações foram aplicadas com sucesso.',
                    });
                  }}
                  className="w-full bg-gradient-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
