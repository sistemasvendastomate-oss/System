import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const products: Product[] = JSON.parse(savedProducts);
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast({
          title: 'Produto não encontrado',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container px-4 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para produtos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Carousel */}
          <div>
            <Card className="overflow-hidden shadow-card">
              <CardContent className="p-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square overflow-hidden rounded-lg">
                          <img
                            src={image}
                            alt={`${product.name} - Imagem ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">
              {product.category} • {product.brand}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <div className="mb-2 text-sm text-muted-foreground">
              Código: {product.sku}
            </div>
            <div className="text-4xl font-bold text-primary mb-4">
              {formatPrice(product.price)}
            </div>
            
            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>

            {product.quantityPerBox && (
              <div className="flex items-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  Quantidade por caixa: <span className="text-primary">{product.quantityPerBox} unidades</span>
                </span>
              </div>
            )}

            <Button
              onClick={() => addToCart(product)}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity mb-6"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Especificações Técnicas
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="font-medium text-foreground">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
