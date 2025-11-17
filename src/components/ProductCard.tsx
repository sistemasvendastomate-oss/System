import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price;

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden relative">
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
              -{product.discount}%
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
              Destaque
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <div className="mb-1 text-xs font-semibold text-foreground">
            {product.brand}
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {product.category}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <div className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </div>
            )}
            <div className={`text-2xl font-bold ${hasDiscount ? 'text-destructive' : 'text-primary'}`}>
              {formatPrice(discountedPrice)}
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};
