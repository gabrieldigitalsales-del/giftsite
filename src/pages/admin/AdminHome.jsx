import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Package, FileText, MessageSquare, Image } from 'lucide-react';

export default function AdminHome() {
  const { data: machines } = useQuery({ queryKey: ['machines'], queryFn: () => base44.entities.Machine.list(), initialData: [] });
  const { data: quotes } = useQuery({ queryKey: ['quotes'], queryFn: () => base44.entities.QuoteRequest.list(), initialData: [] });
  const { data: techRequests } = useQuery({ queryKey: ['techRequests'], queryFn: () => base44.entities.TechSupportRequest.list(), initialData: [] });
  const { data: gallery } = useQuery({ queryKey: ['gallery'], queryFn: () => base44.entities.GalleryImage.list(), initialData: [] });

  const stats = [
    { label: 'Máquinas', count: machines.length, icon: Package, path: '/admin/maquinas', color: 'bg-blue-500' },
    { label: 'Orçamentos', count: quotes.length, icon: FileText, path: '/admin/orcamentos', color: 'bg-primary' },
    { label: 'Assistência', count: techRequests.length, icon: MessageSquare, path: '/admin/assistencia', color: 'bg-green-500' },
    { label: 'Galeria', count: gallery.length, icon: Image, path: '/admin/galeria', color: 'bg-purple-500' },
  ];

  const newQuotes = quotes.filter(q => q.status === 'novo');
  const newTech = techRequests.filter(t => t.status === 'novo');

  return (
    <div>
      <h1 className="font-heading text-3xl text-secondary mb-2">BEM-VINDO AO <span className="text-primary">PAINEL</span></h1>
      <p className="text-muted-foreground mb-8">Gerencie todo o conteúdo do seu site.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.path} to={s.path} className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} bg-opacity-10 flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color.replace('bg-', 'text-')}`} />
              </div>
              <span className="text-3xl font-bold text-secondary">{s.count}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      {(newQuotes.length > 0 || newTech.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {newQuotes.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-secondary mb-3">Orçamentos Recentes</h3>
              <div className="space-y-2">
                {newQuotes.slice(0, 5).map(q => (
                  <div key={q.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-lg">
                    <span className="font-medium">{q.name}</span>
                    <span className="text-muted-foreground text-xs">{q.machine_interest || 'Geral'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {newTech.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-secondary mb-3">Assistência Recente</h3>
              <div className="space-y-2">
                {newTech.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-lg">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground text-xs">{t.equipment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}