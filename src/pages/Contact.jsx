import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { PHONE, EMAIL, INSTAGRAM, ADDRESS, HOURS, WHATSAPP_LINK, getWhatsAppLink } from '@/lib/constants';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const contactInfo = [
  { icon: Phone, label: "WhatsApp / Telefone", value: PHONE, href: WHATSAPP_LINK },
  { icon: Mail, label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: MapPin, label: "Endereço", value: ADDRESS },
  { icon: Clock, label: "Horário de Atendimento", value: HOURS },
  { icon: Instagram, label: "Instagram", value: "@giftexcellence_ofc", href: INSTAGRAM },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const mutation = useMutation({
    mutationFn: (payload) => base44.entities.ContactMessage.create(payload),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Mensagem enviada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message || 'Não foi possível enviar a mensagem.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    mutation.mutate(form);
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <PageHeader title="ENTRE EM" highlight="CONTATO" subtitle="Estamos prontos para atender você" />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-heading text-3xl text-secondary">INFORMAÇÕES DE <span className="text-primary">CONTATO</span></h2>
              <p className="text-muted-foreground">Entre em contato conosco por qualquer um dos canais abaixo. Estamos prontos para atender você!</p>
              
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all">
                          <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-secondary">{item.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-secondary">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <a href={getWhatsAppLink("Olá! Gostaria de mais informações.")} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold w-full mt-4">
                  <MessageCircle className="mr-2 w-5 h-5" /> Falar no WhatsApp
                </Button>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="font-heading text-2xl text-secondary mb-3">MENSAGEM ENVIADA!</h3>
                  <p className="text-muted-foreground mb-6">Obrigado pelo contato. Retornaremos em breve.</p>
                  <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                    Enviar nova mensagem
                  </Button>
                </div>
              ) : (
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
                      <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Seu nome" required />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="seu@email.com" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="(31) 9 0000-0000" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Assunto</Label>
                      <Input id="subject" value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} placeholder="Assunto da mensagem" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea id="message" value={form.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Escreva sua mensagem..." rows={5} required />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={mutation.isPending}>
                    {mutation.isPending ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</> : 'Enviar Mensagem'}
                  </Button>
                </motion.form>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="mt-16 rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240098.18021399858!2d-44.09453964999999!3d-19.9024025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa690cacacf2c33%3A0x5b35fdc997a7212d!2sBelo%20Horizonte%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
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