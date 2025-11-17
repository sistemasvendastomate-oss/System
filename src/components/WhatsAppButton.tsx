import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WhatsAppButton = () => {
  const phoneNumber = '5511930041024'; // Substitua pelo número real

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.');
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={openWhatsApp}
      size="lg"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 p-0"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
