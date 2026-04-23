import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('order'),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.Service.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); setEditing(null); toast.success('Serviço criado!'); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Service.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); setEditing(null); toast.success('Atualizado!'); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Removido!'); },
  });

  const handleSave = () => {
    if (!editing.title) { toast.error('Título obrigatório'); return; }
    if (editing.id) {
      const { id, created_date, updated_date, created_by, ...data } = editing;
      updateMut.mutate({ id, data });
    } else {
      createMut.mutate(editing);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-secondary">SERVIÇOS</h1>
        <Button onClick={() => setEditing({ title: '', description: '', icon: '', image_url: '', order: 0, active: true })} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Novo Serviço
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-secondary">{s.title}</h3>
                <p className="text-muted-foreground text-sm truncate">{s.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="outline" onClick={() => setEditing({ ...s })}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="outline" className="text-destructive" onClick={() => { if (confirm('Remover?')) deleteMut.mutate(s.id); }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading text-2xl">{editing?.id ? 'EDITAR' : 'NOVO'} SERVIÇO</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Título *</Label><Input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Descrição</Label><Textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ícone (lucide)</Label><Input value={editing.icon} onChange={e => setEditing(p => ({ ...p, icon: e.target.value }))} placeholder="ex: Wrench" /></div>
                <div><Label>Ordem</Label><Input type="number" value={editing.order} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={editing.active} onCheckedChange={v => setEditing(p => ({ ...p, active: v }))} /><Label>Ativo</Label></div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">{editing.id ? 'Salvar' : 'Criar'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}