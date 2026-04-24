import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appClient } from '@/api/appClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const emptyMachine = { name: '', slug: '', images: [], short_description: '', description: '', sistematica: '', tecnica: '', medidas: '', rendimento: '', applications: '', benefits: '', category: 'industrial', featured: false, order: 0, active: true };

export default function AdminMachines() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [imageInput, setImageInput] = useState('');

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { data: machines, isLoading } = useQuery({
    queryKey: ['machines'],
    queryFn: () => appClient.entities.Machine.list('order'),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (data) => appClient.entities.Machine.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['machines'] }); setEditing(null); toast.success('Máquina criada!'); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.Machine.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['machines'] }); setEditing(null); toast.success('Máquina atualizada!'); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => appClient.entities.Machine.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['machines'] }); toast.success('Máquina removida!'); },
  });

  const slugify = (value = '') => value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const handleSave = () => {
    if (!editing?.name?.trim()) { toast.error('Nome é obrigatório'); return; }

    const prepared = {
      ...editing,
      slug: slugify(editing.slug || editing.name),
      images: Array.isArray(editing.images) ? editing.images.filter(Boolean) : [],
      order: Number(editing.order || 0),
      active: editing.active !== false,
      featured: Boolean(editing.featured),
    };

    if (editing.id) {
      const { id, created_date, updated_date, created_by, ...data } = prepared;
      updateMut.mutate({ id, data }, {
        onError: (error) => toast.error(error.message || 'Não foi possível atualizar a máquina.'),
      });
    } else {
      createMut.mutate(prepared, {
        onError: (error) => toast.error(error.message || 'Não foi possível criar a máquina.'),
      });
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      toast.info('Enviando imagem...');
      const { file_url } = await appClient.integrations.Core.UploadFile({ file, folder: 'machines' });
      setEditing(prev => prev ? ({ ...prev, images: [...(prev.images || []), file_url] }) : prev);
      toast.success('Imagem adicionada!');
    } catch (error) {
      toast.error(error.message || 'Falha ao enviar imagem. Verifique o bucket e as policies do Storage.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx) => {
    setEditing(prev => prev ? ({ ...prev, images: (prev.images || []).filter((_, i) => i !== idx) }) : prev);
  };

  const isSaving = createMut.isPending || updateMut.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-secondary">MÁQUINAS</h1>
        <Button onClick={() => setEditing({ ...emptyMachine })} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Nova Máquina
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : machines.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">Nenhuma máquina cadastrada</p>
          <Button className="mt-4" onClick={() => setEditing({ ...emptyMachine })}>Adicionar primeira máquina</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {machines.map(m => (
            <div key={m.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
              {m.images?.[0] && <img src={m.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-secondary truncate">{m.name}</h3>
                  {m.featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Destaque</span>}
                  {!m.active && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Inativa</span>}
                </div>
                <p className="text-muted-foreground text-sm truncate">{m.short_description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="outline" onClick={() => setEditing({ ...m })}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="outline" className="text-destructive" onClick={() => { if (confirm('Remover esta máquina?')) deleteMut.mutate(m.id); }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">{editing?.id ? 'EDITAR' : 'NOVA'} MÁQUINA</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Nome *</Label><Input value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Slug (URL)</Label><Input value={editing.slug} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} placeholder="ex: prensa-termica" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={editing.category} onValueChange={v => setEditing(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brindes">Brindes</SelectItem>
                      <SelectItem value="embalagens">Embalagens</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="personalizacao">Personalização</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Ordem</Label><Input type="number" value={editing.order} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} /></div>
              </div>

              {/* Images */}
              <div>
                <Label>Imagens</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {editing.images?.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  id="machine-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed"
                >
                  {uploading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Clique para enviar imagem</>
                  )}
                </Button>
              </div>

              <div><Label>Descrição curta</Label><Input value={editing.short_description} onChange={e => setEditing(p => ({ ...p, short_description: e.target.value }))} /></div>
              <div><Label>Descrição completa</Label><Textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Sistemática</Label><Textarea value={editing.sistematica} onChange={e => setEditing(p => ({ ...p, sistematica: e.target.value }))} rows={3} /></div>
                <div><Label>Técnica</Label><Textarea value={editing.tecnica} onChange={e => setEditing(p => ({ ...p, tecnica: e.target.value }))} rows={3} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Medidas</Label><Textarea value={editing.medidas} onChange={e => setEditing(p => ({ ...p, medidas: e.target.value }))} rows={3} /></div>
                <div><Label>Rendimento</Label><Textarea value={editing.rendimento} onChange={e => setEditing(p => ({ ...p, rendimento: e.target.value }))} rows={3} /></div>
              </div>
              <div><Label>Aplicações</Label><Textarea value={editing.applications} onChange={e => setEditing(p => ({ ...p, applications: e.target.value }))} rows={3} /></div>
              <div><Label>Benefícios</Label><Textarea value={editing.benefits} onChange={e => setEditing(p => ({ ...p, benefits: e.target.value }))} rows={3} /></div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={editing.featured} onCheckedChange={v => setEditing(p => ({ ...p, featured: v }))} />
                  <Label>Destaque na home</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.active} onCheckedChange={v => setEditing(p => ({ ...p, active: v }))} />
                  <Label>Ativa</Label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editing.id ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}