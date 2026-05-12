import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appClient } from '@/api/appClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);

  const { data: images } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => appClient.entities.GalleryImage.list('order'),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (d) => appClient.entities.GalleryImage.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); setEditing(null); toast.success('Imagem adicionada!'); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => appClient.entities.GalleryImage.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Imagem removida!'); },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await appClient.integrations.Core.UploadFile({ file });
    setEditing(prev => ({ ...prev, image_url: file_url }));
  };

  const handleSave = () => {
    if (!editing.image_url) { toast.error('Envie uma imagem'); return; }
    createMut.mutate(editing);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-secondary">GALERIA</h1>
        <Button onClick={() => setEditing({ title: '', image_url: '', category: 'maquinas', order: 0, active: true })} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Nova Imagem
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">Nenhuma imagem na galeria</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
              <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <Button size="icon" variant="destructive" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { if (confirm('Remover?')) deleteMut.mutate(img.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {img.title && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">{img.title}</div>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading text-2xl">NOVA IMAGEM</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Título (opcional)</Label><Input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} /></div>
              <div>
                <Label>Imagem *</Label>
                {editing.image_url && <img src={editing.image_url} alt="" className="w-full h-40 object-cover rounded-lg mt-2 mb-2" />}
                <Input type="file" accept="image/*" onChange={handleUpload} />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={editing.category} onValueChange={v => setEditing(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maquinas">Máquinas</SelectItem>
                    <SelectItem value="aplicacoes">Aplicações</SelectItem>
                    <SelectItem value="estrutura">Estrutura</SelectItem>
                    <SelectItem value="projetos">Projetos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Adicionar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}