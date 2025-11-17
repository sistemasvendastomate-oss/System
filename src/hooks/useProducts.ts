import { useState, useEffect } from 'react';
import { Product } from '@/contexts/CartContext';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
    
    const handleStorageChange = () => {
      loadProducts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  return { products, reloadProducts: loadProducts };
};
