import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSlides() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);

  const { data: slides, isLoading } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: () => base44.entities.HeroSlide.list('order'),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.HeroSlide.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['heroSlides'] }); setEditing(null); toast.success('Slide criado!'); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HeroSlide.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['heroSlides'] }); setEditing(null); toast.success('Slide atualizado!'); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.HeroSlide.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['heroSlides'] }); toast.success('Slide removido!'); },
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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setEditing(prev => ({ ...prev, image_url: file_url }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-secondary">SLIDES / BANNER</h1>
        <Button onClick={() => setEditing({ title: '', subtitle: '', image_url: '', order: 0, active: true })} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Novo Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">Nenhum slide cadastrado. Serão exibidos slides padrão.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map(s => (
            <div key={s.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
              {s.image_url && <img src={s.image_url} alt="" className="w-24 h-14 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-secondary truncate">{s.title}</h3>
                <p className="text-muted-foreground text-sm truncate">{s.subtitle}</p>
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
          <DialogHeader><DialogTitle className="font-heading text-2xl">{editing?.id ? 'EDITAR' : 'NOVO'} SLIDE</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Título *</Label><Input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Subtítulo</Label><Input value={editing.subtitle} onChange={e => setEditing(p => ({ ...p, subtitle: e.target.value }))} /></div>
              <div>
                <Label>Imagem de fundo</Label>
                {editing.image_url && <img src={editing.image_url} alt="" className="w-full h-32 object-cover rounded-lg mt-2 mb-2" />}
                <Input type="file" accept="image/*" onChange={handleUpload} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ordem</Label><Input type="number" value={editing.order} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} /></div>
                <div className="flex items-center gap-2 pt-6"><Switch checked={editing.active} onCheckedChange={v => setEditing(p => ({ ...p, active: v }))} /><Label>Ativo</Label></div>
              </div>
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