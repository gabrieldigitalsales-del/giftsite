import React, { useMemo } from 'react';
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function QuickContact() {
  const { settings } = useSiteSettings();

  const contactItems = useMemo(() => [
    { icon: Phone, label: 'WhatsApp / Telefone', value: settings.phone, href: settings.whatsappLink },
    { icon: Mail, label: 'E-mail', value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: 'Endereço', value: settings.address },
    { icon: Clock, label: 'Horário', value: settings.hours },
    { icon: Instagram, label: 'Instagram', value: settings.instagramHandle, href: settings.instagram },
  ], [settings]);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Contato</span>
          <h2 className="font-heading text-4xl md:text-6xl text-secondary mt-2">
            FALE <span className="text-primary">CONOSCO</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {contactItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="block p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-sm text-secondary">{item.value}</p>
                </a>
              ) : (
                <div className="p-6 rounded-xl bg-card border border-border text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-sm text-secondary">{item.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
