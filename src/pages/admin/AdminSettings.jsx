import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const settingsConfig = [
  { section: 'contato', label: 'Contato', fields: [
    { key: 'phone', label: 'Telefone / WhatsApp', placeholder: '+55 31 3772-6397' },
    { key: 'email', label: 'E-mail', placeholder: 'giftexcellence.03@gmail.com' },
    { key: 'instagram', label: 'Instagram URL', placeholder: 'https://www.instagram.com/giftexcellence_ofc/' },
    { key: 'address', label: 'Endereço', placeholder: 'Belo Horizonte, MG - Brasil' },
    { key: 'hours', label: 'Horário de Atendimento', placeholder: 'Segunda a Sexta: 08h às 18h' },
  ]},
  { section: 'sobre', label: 'Sobre', fields: [
    { key: 'about_text', label: 'Texto sobre a empresa', textarea: true },
    { key: 'mission', label: 'Missão', textarea: true },
    { key: 'vision', label: 'Visão', textarea: true },
  ]},
  { section: 'seo', label: 'SEO', fields: [
    { key: 'seo_title', label: 'Título da página', placeholder: 'Gift Excellence - Máquinas Industriais' },
    { key: 'seo_description', label: 'Descrição SEO', placeholder: 'Excelência em máquinas industriais...', textarea: true },
  ]},
];

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState({});

  const { data: settings = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) {
      const map = {};
      settings.forEach(s => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: async ({ key, value, section }) => {
      const existing = settings.find(s => s.key === key);
      if (existing) return base44.entities.SiteSettings.update(existing.id, { value });
      return base44.entities.SiteSettings.create({ key, value, section });
    },
  });

  const handleSave = async () => {
    const promises = [];
    for (const section of settingsConfig) {
      for (const field of section.fields) {
        const val = values[field.key];
        if (val !== undefined && val !== '') {
          promises.push(saveMut.mutateAsync({ key: field.key, value: val, section: section.section }));
        }
      }
    }
    await Promise.all(promises);
    queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    toast.success('Configurações salvas!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-secondary">CONFIGURAÇÕES DO SITE</h1>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" /> Salvar tudo
        </Button>
      </div>

      <div className="space-y-8">
        {settingsConfig.map(section => (
          <div key={section.section} className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-heading text-xl text-secondary mb-4 uppercase">{section.label}</h2>
            <div className="space-y-4">
              {section.fields.map(field => (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  {field.textarea ? (
                    <Textarea
                      value={values[field.key] || ''}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={values[field.key] || ''}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}