import React, { useMemo, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function Contact() {
  const { settings } = useSiteSettings();

  const contactInfo = useMemo(
    () => [
      { icon: Phone, label: 'WhatsApp / Telefone', value: settings.phone, href: settings.whatsappLink },
      { icon: Mail, label: 'E-mail', value: settings.email, href: `mailto:${settings.email}` },
      { icon: MapPin, label: 'Endereço', value: settings.address },
      { icon: Clock, label: 'Horário de Atendimento', value: settings.hours },
      { icon: Instagram, label: 'Instagram', value: settings.instagramHandle, href: settings.instagram },
    ],
    [settings]
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildWhatsAppMessage = () => {
    return [
      'Olá! Recebi um contato pelo site GIFT EXCELLENCE.',
      '',
      `Nome: ${form.name || '-'}`,
      `E-mail: ${form.email || '-'}`,
      `Telefone: ${form.phone || '-'}`,
      `Assunto: ${form.subject || '-'}`,
      'Mensagem:',
      form.message || '-',
    ].join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error('Preencha nome, e-mail e mensagem.');
      return;
    }

    const message = buildWhatsAppMessage();
    const whatsappUrl = settings?.getWhatsAppLink
      ? settings.getWhatsAppLink(message)
      : `https://wa.me/${String(settings?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    toast.success('Abrindo WhatsApp com a mensagem preenchida.');

    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div>
      <PageHeader title="FALE COM A" highlight="GIFT EXCELLENCE" subtitle="Estamos prontos para atender você com excelência" />

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Contato</span>
                <h2 className="font-heading text-4xl md:text-5xl text-secondary mt-2 leading-tight">
                  VAMOS <span className="text-primary">CONVERSAR</span>
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Entre em contato para tirar dúvidas, solicitar orçamento ou falar com nossa equipe técnica.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
                      >
                        <div className="w-11 h-11 rounded-full bg-primary/10 group-hover:bg-primary transition-all flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-secondary">{item.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-secondary">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <a href={settings.getWhatsAppLink('Olá! Gostaria de mais informações.')} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold w-full mt-4">
                  <MessageCircle className="mr-2 w-5 h-5" /> Falar no WhatsApp
                </Button>
              </a>
            </div>

            <div className="lg:col-span-3">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-8 shadow-lg space-y-5"
              >
                <h3 className="font-heading text-2xl text-secondary mb-2">ENVIE SUA MENSAGEM</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(31) 9 0000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Escreva sua mensagem..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  Enviar pelo WhatsApp
                </Button>
              </motion.form>
            </div>
          </div>

          <div className="mt-16 rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=-19.4721787,-44.2039502&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Gift Excellence"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
