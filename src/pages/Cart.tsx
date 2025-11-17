import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    const phoneNumber = '5511999999999'; // Substitua pelo número real
    
    let message = '*Novo Pedido!*\n\n';
    message += '*Produtos:*\n';
    
    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n*Total: ${formatPrice(total)}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <ShoppingBag className="mx-auto mb-4 h-24 w-24 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Seu carrinho está vazio
            </h2>
            <p className="mb-6 text-muted-foreground">
              Adicione produtos ao carrinho para continuar
            </p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Ver Produtos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Carrinho de Compras</h1>
          <Button variant="outline" onClick={clearCart}>
            Limpar Carrinho
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  Finalizar Pedido
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
