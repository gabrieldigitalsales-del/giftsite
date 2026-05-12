import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function WhatsAppButton() {
  const { settings } = useSiteSettings();

  return (
    <motion.a
      href={settings.getWhatsAppLink('Olá! Gostaria de mais informações sobre as máquinas da Gift Excellence.')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
