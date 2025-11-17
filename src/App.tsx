import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { PasswordRecovery } from "./pages/PasswordRecovery";
import { Admin } from "./pages/Admin";
import { Profile } from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/recuperar-senha" element={<PasswordRecovery />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Header />
                  <Products />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <ProtectedRoute>
                  <Header />
                  <ProductDetail />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Header />
                  <Cart />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              <Route path="/about" element={
                <ProtectedRoute>
                  <Header />
                  <About />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <Header />
                  <Contact />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <Header />
                  <Admin />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Header />
                  <Profile />
                  <WhatsAppButton />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
