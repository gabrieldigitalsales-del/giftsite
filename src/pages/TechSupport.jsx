import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { appClient } from '@/api/appClient';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function TechSupport() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', equipment: '', problem_description: '', city_state: '' });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => appClient.entities.TechSupportRequest.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Solicitação enviada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message || 'Não foi possível enviar a solicitação de assistência.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.equipment || !form.problem_description) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    mutation.mutate(form);
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div>
        <PageHeader title="ASSISTÊNCIA" highlight="TÉCNICA" />
        <div className="py-20 text-center max-w-lg mx-auto px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>
          <h2 className="font-heading text-3xl text-secondary mb-4">SOLICITAÇÃO ENVIADA!</h2>
          <p className="text-muted-foreground mb-8">Recebemos sua solicitação de assistência técnica. Nossa equipe entrará em contato em breve.</p>
          <Button onClick={() => { setSubmitted(false); setForm({ name: '', company: '', phone: '', email: '', equipment: '', problem_description: '', city_state: '' }); }}>
            Nova solicitação
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="ASSISTÊNCIA" highlight="TÉCNICA" subtitle="Solicite suporte técnico para seus equipamentos" />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-8 shadow-lg space-y-5"
          >
            <h3 className="font-heading text-2xl text-secondary mb-2">FORMULÁRIO DE ASSISTÊNCIA</h3>
            
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
                <Label htmlFor="equipment">Equipamento / Máquina *</Label>
                <Input id="equipment" value={form.equipment} onChange={(e) => handleChange('equipment', e.target.value)} placeholder="Modelo do equipamento" required />
              </div>
              <div>
                <Label htmlFor="city">Cidade / Estado</Label>
                <Input id="city" value={form.city_state} onChange={(e) => handleChange('city_state', e.target.value)} placeholder="Cidade / UF" />
              </div>
            </div>
            <div>
              <Label htmlFor="problem">Descrição do Problema *</Label>
              <Textarea id="problem" value={form.problem_description} onChange={(e) => handleChange('problem_description', e.target.value)} placeholder="Descreva o problema com o equipamento..." rows={5} required />
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={mutation.isPending}>
              {mutation.isPending ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</> : 'Enviar Solicitação'}
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}