import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appClient } from '@/api/appClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusLabels = { novo: 'Novo', em_andamento: 'Em andamento', resolvido: 'Resolvido', fechado: 'Fechado' };

export default function AdminTechSupport() {
  const queryClient = useQueryClient();

  const { data: requests } = useQuery({
    queryKey: ['techRequests'],
    queryFn: () => appClient.entities.TechSupportRequest.list('-created_date'),
    initialData: [],
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.TechSupportRequest.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['techRequests'] }); toast.success('Atualizado!'); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => appClient.entities.TechSupportRequest.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['techRequests'] }); toast.success('Removido!'); },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl text-secondary mb-6">ASSISTÊNCIA TÉCNICA</h1>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">Nenhuma solicitação de assistência</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-secondary text-lg">{r.name}</h3>
                  <p className="text-muted-foreground text-sm">{r.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={r.status || 'novo'} onValueChange={v => updateMut.mutate({ id: r.id, data: { status: v } })}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="text-destructive" onClick={() => { if (confirm('Remover?')) deleteMut.mutate(r.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" /> {r.phone}</a>
                <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" /> {r.email}</a>
                {r.city_state && <span>{r.city_state}</span>}
                {r.created_date && <span>{format(new Date(r.created_date), 'dd/MM/yyyy HH:mm')}</span>}
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">{r.equipment}</Badge>
              <p className="text-sm text-foreground bg-muted p-3 rounded-lg mt-2">{r.problem_description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}