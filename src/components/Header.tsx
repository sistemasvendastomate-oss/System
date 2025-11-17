import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, UserCog } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName} className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <span className="text-xl font-bold text-foreground">{settings.siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Produtos
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sobre Nós
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="hidden md:block">
              <Button variant="outline" size="sm" className="gap-2">
                <UserCog className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}

          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user && (
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 hidden md:flex">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col space-y-4 p-4">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nós
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCog className="h-4 w-4 inline mr-2" />
                Admin
              </Link>
            )}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="gap-2 justify-start"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
