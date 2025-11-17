import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const Products = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = useMemo(() => 
    ['Todos', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const brands = useMemo(() => 
    ['Todas', ...Array.from(new Set(products.map(p => p.brand)))],
    [products]
  );

  const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
        
        const normalizedQuery = normalizeString(searchQuery);
        const normalizedSku = normalizeString(product.sku);
        const normalizedName = normalizeString(product.name);
        
        const matchesSearch = !searchQuery || 
          normalizedSku.includes(normalizedQuery) || 
          normalizedName.includes(normalizedQuery);

        return matchesCategory && matchesBrand && matchesSearch;
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  const featuredProducts = useMemo(() => 
    filteredProducts.filter(p => p.isFeatured),
    [filteredProducts]
  );

  const regularProducts = useMemo(() => 
    filteredProducts.filter(p => !p.isFeatured),
    [filteredProducts]
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Nossos Produtos
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre os melhores produtos com os melhores preços
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por código SKU ou nome do produto (ex: MDK006, MDK-006, MDK)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-[250px_1fr] gap-6 mb-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Brand Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">Marcas</h3>
              <div className="space-y-1">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedBrand === brand
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors">
                <h3 className="text-sm font-semibold text-foreground">Categorias</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'transform rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Products Grid */}
          <div className="space-y-8">
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Produtos em Destaque</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Products */}
            {regularProducts.length > 0 && (
              <div>
                {featuredProducts.length > 0 && (
                  <h2 className="text-2xl font-bold text-foreground mb-4">Todos os Produtos</h2>
                )}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {regularProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
