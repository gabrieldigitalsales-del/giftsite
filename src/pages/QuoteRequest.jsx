import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { appClient } from '@/api/appClient';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getWhatsAppLink } from '@/lib/constants';

export default function QuoteRequest() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', city_state: '', machine_interest: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: () => appClient.entities.Machine.list('order'),
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: (data) => appClient.entities.QuoteRequest.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Pedido de orçamento enviado com sucesso!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }
    mutation.mutate(form);
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // Get machine interest from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const machine = params.get('maquina');
    if (machine) setForm(prev => ({ ...prev, machine_interest: machine }));
  }, []);

  if (submitted) {
    return (
      <div>
        <PageHeader title="PEDIDO DE" highlight="ORÇAMENTO" />
        <div className="py-20 text-center max-w-lg mx-auto px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>
          <h2 className="font-heading text-3xl text-secondary mb-4">ORÇAMENTO SOLICITADO!</h2>
          <p className="text-muted-foreground mb-6">Recebemos seu pedido de orçamento. Nossa equipe comercial entrará em contato em breve.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => { setSubmitted(false); setForm({ name: '', company: '', phone: '', email: '', city_state: '', machine_interest: '', message: '' }); }}>
              Novo orçamento
            </Button>
            <a href={getWhatsAppLink("Olá! Acabei de solicitar um orçamento pelo site.")} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                <MessageCircle className="mr-2 w-4 h-4" /> Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="SOLICITAR" highlight="ORÇAMENTO" subtitle="Preencha o formulário abaixo e receba um orçamento personalizado" />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-8 shadow-lg space-y-5"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-2">
              <p className="text-sm text-primary font-medium">Preencha os dados abaixo e nossa equipe entrará em contato com o melhor orçamento para você.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Seu nome completo" required />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" value={form.company} onChange={(e) => handleChange('company', e.target.value)} placeholder="Nome da empresa" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                <Input id="phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="(31) 9 0000-0000" required />
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="seu@email.com" required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade / Estado</Label>
                <Input id="city" value={form.city_state} onChange={(e) => handleChange('city_state', e.target.value)} placeholder="Cidade / UF" />
              </div>
              <div>
                <Label htmlFor="machine">Máquina de Interesse</Label>
                <Select value={form.machine_interest} onValueChange={(v) => handleChange('machine_interest', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma máquina" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.filter(m => m.active !== false).map(m => (
                      <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                    ))}
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" value={form.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Descreva sua necessidade, quantidade desejada ou dúvidas..." rows={5} />
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold group" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</>
              ) : (
                <>Enviar Pedido de Orçamento <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}