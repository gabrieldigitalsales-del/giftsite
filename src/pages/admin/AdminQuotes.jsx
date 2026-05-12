import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appClient } from '@/api/appClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusColors = {
  novo: 'bg-blue-100 text-blue-700',
  em_andamento: 'bg-yellow-100 text-yellow-700',
  respondido: 'bg-green-100 text-green-700',
  fechado: 'bg-muted text-muted-foreground',
};

const statusLabels = { novo: 'Novo', em_andamento: 'Em andamento', respondido: 'Respondido', fechado: 'Fechado' };

export default function AdminQuotes() {
  const queryClient = useQueryClient();

  const { data: quotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => appClient.entities.QuoteRequest.list('-created_date'),
    initialData: [],
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.QuoteRequest.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quotes'] }); toast.success('Status atualizado!'); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => appClient.entities.QuoteRequest.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quotes'] }); toast.success('Removido!'); },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl text-secondary mb-6">PEDIDOS DE ORÇAMENTO</h1>

      {quotes.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">Nenhum pedido de orçamento recebido</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map(q => (
            <div key={q.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-secondary text-lg">{q.name}</h3>
                  <p className="text-muted-foreground text-sm">{q.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={q.status || 'novo'} onValueChange={v => updateMut.mutate({ id: q.id, data: { status: v } })}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="text-destructive" onClick={() => { if (confirm('Remover?')) deleteMut.mutate(q.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <a href={`tel:${q.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" /> {q.phone}</a>
                <a href={`mailto:${q.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" /> {q.email}</a>
                {q.city_state && <span>{q.city_state}</span>}
                {q.created_date && <span>{format(new Date(q.created_date), 'dd/MM/yyyy HH:mm')}</span>}
              </div>
              {q.machine_interest && <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">{q.machine_interest}</Badge>}
              {q.message && <p className="text-sm text-foreground bg-muted p-3 rounded-lg mt-2">{q.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}